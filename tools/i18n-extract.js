#!/usr/bin/env node
/*
 * i18n-extract.js — one-shot migration from triplicated static pages to
 * template + JSON catalogue.
 *
 * WHY THIS SHAPE
 * The three page sets (pages/, pages/en/, pages/de/) share a byte-identical tag
 * skeleton — only the copy differs. Every translatable unit is therefore
 * anchored to its position in the TAG stream rather than to its ordinal among
 * translatable strings: a few pages have drifted (a sentence present in one
 * language but not another) and ordinal pairing would silently mis-assign every
 * string after the drift point. Anchoring pairs only what corresponds and
 * reports the rest.
 *
 * Units are ELEMENTS, not text nodes, because word order moves around inline
 * markup: "Téléchargez l'application <span>Rainbow</span>" becomes
 * "Download the <span>Rainbow</span> app". A per-text-node scheme cannot express
 * that; an element-level rich unit can.
 *
 * The marker is always an ATTRIBUTE added to an existing tag, never a change to
 * the copy itself, so pages/*.html stays a valid, directly viewable FR page.
 *
 *   data-i18n="key"                    innerHTML is one plain string
 *   data-i18n-rich="key"               innerHTML mixes text and inline markup;
 *                                      the value uses <0>..</0> placeholders
 *                                      bound to the element's inline children
 *   data-i18n-attr="alt:key|title:k2"  translatable attribute values
 *
 * The existing human translations become the catalogue — nothing is
 * machine-translated and no wording is invented.
 *
 * Run:  node tools/i18n-extract.js [--write]
 */
'use strict';

const fs = require('fs');
const path = require('path');
const L = require('./i18n-lib.js');

const ROOT = path.join(__dirname, '..');
const LANGS = ['fr', 'en', 'de'];
const SRC_LANG = 'fr';
const WRITE = process.argv.includes('--write');

const PAGES = {
    'index': 'index.html',
    'products': 'pages/products.html',
    'collaboration': 'pages/collaboration.html',
    'webinar': 'pages/webinar.html',
    'tarifs': 'pages/tarifs.html',
    'blog': 'pages/blog.html',
    'blog-the-power-of-rainbow': 'pages/blog/the-power-of-rainbow.html',
    'faq': 'pages/faq.html',
    'partenaires': 'pages/partenaires.html',
    'trouver-un-partenaire': 'pages/trouver-un-partenaire.html',
    'a-propos-de-rainbow': 'pages/a-propos-de-rainbow.html',
    'rainbow-donnees-hebergees-en-france': 'pages/rainbow-donnees-hebergees-en-france.html',
    'centre-aide-rainbow': 'pages/centre-aide-rainbow.html',
    'telecharger-application-rainbow': 'pages/telecharger-application-rainbow.html',
};

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr']);

// Treated as part of a sentence rather than as page structure.
const INLINE = new Set(['span', 'strong', 'em', 'b', 'i', 'a', 'br', 'small', 'sup',
    'sub', 'u', 'code', 'mark', 'abbr', 'svg', 'img', 'picture', 'wbr',
    // text-level semantics: these sit inside a sentence, so a parent holding one
    // is still a single translatable unit ("Published on <time>1 July</time>")
    'time', 'cite', 'q', 's', 'del', 'ins', 'kbd', 'samp', 'var', 'data',
    'bdi', 'bdo', 'dfn', 'ruby', 'output']);

function srcFor(lang, rel) {
    if (lang === SRC_LANG) return path.join(ROOT, rel);
    if (rel === 'index.html') return path.join(ROOT, 'pages', lang, 'index.html');
    return path.join(ROOT, rel.replace(/^pages\//, `pages/${lang}/`));
}

/**
 * Drop markers left by the previous, partial i18n attempt (nav.product, ...).
 * Their keys belong to the archived catalogue; leaving them in place would put
 * two data-i18n attributes on one tag and the stale one would win at render.
 */
function stripLegacyMarkers(html) {
    return html.replace(/\s+data-i18n(?:-rich|-attr)?\s*=\s*(?:"[^"]*"|'[^']*')/g, '');
}

/**
 * Encode innerHTML as translatable text, replacing each inline child with an
 * indexed placeholder so markup stays in the template and only words are
 * translated. Offsets are absolute into `html`.
 */
function encodeRich(html, innerStart, innerEnd, children) {
    let out = '';
    let cursor = innerStart;
    children.forEach((c, i) => {
        if (c.start < cursor) return;                 // nested deeper; already covered
        out += html.slice(cursor, c.start);
        const childInner = c.isVoid ? '' : html.slice(c.innerStart, c.innerEnd).trim();
        out += childInner ? `<${i}>${childInner}</${i}>` : `<${i}/>`;
        cursor = c.end;
    });
    out += html.slice(cursor, innerEnd);
    return out.trim();
}

function zoneOf(stack) {
    for (let i = stack.length - 1; i >= 0; i--) {
        const n = stack[i].name;
        if (n === 'nav') return 'nav';
        if (n === 'footer') return 'footer';
    }
    for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].sectionId) return L.slugify(stack[i].sectionId);
    }
    return 'body';
}

/**
 * Walk a document, producing translation units keyed by tag-stream anchor.
 * unit = {anchor, type:'text'|'rich'|'attr', value, tagStart, tagEnd, zone, hint}
 */
function collectUnits(html) {
    const spans = L.scan(html);
    const units = new Map();
    const order = [];
    const stack = [];
    let tagIndex = 0;
    let inHead = false;
    let ldTagStart = 0, ldTagEnd = 0;

    const push = (u) => { units.set(u.anchor, u); order.push(u); };

    let pendingLdJson = null;

    for (const span of spans) {
        if (span.kind === 'raw') {
            // JSON-LD carries the page's schema.org name/description/FAQ text,
            // which search engines read per language. Treat the whole block as
            // one unit rather than trying to translate inside a JS string.
            if (pendingLdJson !== null) {
                push({
                    anchor: 'r' + pendingLdJson, type: 'raw', value: span.raw.trim(),
                    innerStart: span.start, innerEnd: span.end,
                    tagStart: ldTagStart, tagEnd: ldTagEnd,
                    zone: 'meta', hint: 'schema', tag: 'script',
                });
                pendingLdJson = null;
            }
            continue;
        }
        if (span.kind === 'text') {
            if (L.isTranslatableText(span.raw) && stack.length) {
                stack[stack.length - 1].textCount++;
            }
            continue;
        }
        if (span.kind !== 'tag') continue;

        const nm = span.name;
        const myIndex = tagIndex++;

        // ── closing tag: the element is complete, classify it ──
        if (span.closing) {
            if (nm === 'head') inHead = false;
            for (let k = stack.length - 1; k >= 0; k--) {
                if (stack[k].name !== nm) continue;
                const el = stack[k];
                const innerStart = el.openEnd;
                const innerEnd = span.start;
                const zone = el.name === 'title' ? 'meta' : zoneOf(stack.slice(0, k));

                if (el.textCount && !el.blockCount) {
                    const anchor = 'e' + el.index;
                    const common = {
                        anchor, tagStart: el.openStart, tagEnd: el.openEnd, zone,
                        hint: el.name === 'title' ? 'title' : null, tag: el.name,
                        innerStart, innerEnd, children: el.inlineChildren,
                    };
                    if (el.inlineChildren.length) {
                        // The parent owns the whole sentence, so an inline child
                        // that was marked in its own right must give up its unit —
                        // otherwise the two ranges nest and the edits collide.
                        for (const c of el.inlineChildren) {
                            const childAnchor = 'e' + c.index;
                            if (units.has(childAnchor)) {
                                units.delete(childAnchor);
                                const at = order.findIndex(x => x.anchor === childAnchor);
                                if (at !== -1) order.splice(at, 1);
                            }
                        }
                        push(Object.assign({
                            type: 'rich',
                            value: encodeRich(html, innerStart, innerEnd, el.inlineChildren),
                        }, common));
                    } else {
                        push(Object.assign({
                            type: 'text',
                            value: html.slice(innerStart, innerEnd).trim(),
                        }, common));
                    }
                }

                stack.length = k;
                if (stack.length) {
                    const p = stack[stack.length - 1];
                    if (INLINE.has(el.name)) {
                        p.inlineChildren.push({
                            start: el.openStart, end: span.end, index: el.index,
                            innerStart, innerEnd, name: el.name, isVoid: false,
                        });
                    } else {
                        p.blockCount++;
                    }
                }
                break;
            }
            continue;
        }

        // ── opening tag ──
        if (nm === 'head') inHead = true;
        const attrs = L.parseAttrs(span, html);

        if (nm === 'script') {
            const type = (attrs.find(a => a.name === 'type') || {}).value || '';
            if (type.toLowerCase() === 'application/ld+json') {
                pendingLdJson = myIndex;
                ldTagStart = span.start;
                ldTagEnd = span.end;
            }
        }

        for (const a of attrs) {
            if (!L.isTranslatableAttr(nm, a.name, attrs)) continue;
            if (!L.isTranslatableText(a.value)) continue;
            let hint = a.name;
            if (nm === 'meta') {
                const k = (attrs.find(x => x.name === 'name' || x.name === 'property') || {}).value || 'meta';
                hint = k.replace(/^og:|^twitter:/, '');
            }
            push({
                anchor: `a${myIndex}:${a.name}`, type: 'attr', value: a.value.trim(),
                tagStart: span.start, tagEnd: span.end,
                zone: inHead ? 'meta' : zoneOf(stack), hint, attrName: a.name, tag: nm,
            });
        }

        const selfClosing = /\/>$/.test(span.raw) || VOID.has(nm);
        if (!selfClosing) {
            let sectionId = null;
            if (nm === 'section') {
                const idAttr = attrs.find(x => x.name === 'id');
                if (idAttr) sectionId = idAttr.value;
            }
            stack.push({
                name: nm, index: myIndex, openStart: span.start, openEnd: span.end,
                sectionId, textCount: 0, blockCount: 0, inlineChildren: [],
            });
        } else if (stack.length) {
            const p = stack[stack.length - 1];
            if (INLINE.has(nm)) {
                p.inlineChildren.push({
                    start: span.start, end: span.end, index: myIndex,
                    innerStart: span.end, innerEnd: span.end, name: nm, isVoid: true,
                });
            } else {
                p.blockCount++;
            }
        }
    }
    return { units, order };
}

// ── run ────────────────────────────────────────────────────────────────────────

if (require.main === module) main();

function main() {
    const catalogue = {};
    LANGS.forEach(l => (catalogue[l] = {}));
    const commonIndex = new Map();
    const report = [];
    const templates = {};
    const drift = [];
    let totalKeys = 0, reused = 0, fellBack = 0;

    for (const [pageId, rel] of Object.entries(PAGES)) {
        const files = {};
        let missing = null;
        for (const lang of LANGS) {
            const p = srcFor(lang, rel);
            if (!fs.existsSync(p)) { missing = p; break; }
            files[lang] = stripLegacyMarkers(fs.readFileSync(p, 'utf8'));
        }
        if (missing) {
            report.push({ pageId, status: 'SKIP', note: 'missing ' + path.relative(ROOT, missing) });
            continue;
        }

        const parsed = {};
        for (const lang of LANGS) parsed[lang] = collectUnits(files[lang]);

        const usedSlug = new Map();
        const edits = [];
        const attrGroups = new Map();      // tagStart -> [{attrName, key}]
        let pageKeys = 0, pageFallback = 0;

        for (const u of parsed[SRC_LANG].order) {
            const values = { [SRC_LANG]: u.value };
            for (const lang of LANGS) {
                if (lang === SRC_LANG) continue;
                const peer = parsed[lang].units.get(u.anchor);
                if (peer && peer.type === u.type) {
                    values[lang] = peer.value;
                } else {
                    values[lang] = u.value;
                    pageFallback++; fellBack++;
                    drift.push({ pageId, lang, dir: 'missing', anchor: u.anchor, text: u.value });
                }
            }

            const shared = (u.zone === 'nav' || u.zone === 'footer');
            let key;
            if (u.zone === 'meta' && u.hint) {
                const base = `${pageId}.meta.${L.slugify(u.hint)}`;
                key = base;
                let n = 2;
                while (key in catalogue[SRC_LANG] && catalogue[SRC_LANG][key] !== u.value) key = `${base}_${n++}`;
            } else {
                const slugBase = L.slugify(stripPlaceholders(u.value))
                    + (u.type === 'attr' ? '_' + L.slugify(u.hint) : '');
                const ns = shared ? `common.${u.zone}` : `${pageId}.${u.zone}`;
                const bucketKey = ns + '.' + slugBase;
                const sig = JSON.stringify(values);
                const bucket = shared ? commonIndex : usedSlug;
                const existing = bucket.get(bucketKey);
                if (existing && existing.sig === sig) {
                    reused++;
                    recordEdit(u, existing.key, edits, attrGroups);
                    continue;
                }
                key = bucketKey;
                let n = 2;
                while (key in catalogue[SRC_LANG]) key = `${bucketKey}_${n++}`;
                bucket.set(bucketKey, { key, sig });
            }

            for (const lang of LANGS) catalogue[lang][key] = values[lang];
            recordEdit(u, key, edits, attrGroups);
            pageKeys++; totalKeys++;
        }

        // Collapse per-tag attribute translations into one data-i18n-attr value.
        for (const [tagStart, list] of attrGroups) {
            const spec = list.map(x => `${x.attrName}:${x.key}`).join('|');
            edits.push({ start: list[0].insertAt, end: list[0].insertAt, text: ` data-i18n-attr="${spec}"` });
        }

        // Copy that exists only in a translated page would be lost by templating.
        for (const lang of LANGS) {
            if (lang === SRC_LANG) continue;
            for (const u of parsed[lang].order) {
                if (!parsed[SRC_LANG].units.has(u.anchor)) {
                    drift.push({ pageId, lang, dir: 'extra', anchor: u.anchor, text: u.value });
                }
            }
        }

        templates[rel] = L.applyEdits(files[SRC_LANG], dedupeEdits(edits));
        const flag = pageFallback ? `  (${pageFallback} fallback)` : '';
        report.push({ pageId, status: 'OK', note: `${parsed[SRC_LANG].order.length} units, ${pageKeys} keys${flag}` });
    }

    // ── report ────────────────────────────────────────────────────────────────
    console.log('\n  page                                    status   detail');
    console.log('  ' + '-'.repeat(78));
    for (const r of report) console.log('  ' + r.pageId.padEnd(40) + r.status.padEnd(9) + r.note);

    console.log('\n  unique keys: ' + totalKeys + '   repeat strings folded: ' + reused);
    console.log('  shared nav/footer keys: ' + Object.keys(catalogue[SRC_LANG]).filter(k => k.startsWith('common.')).length);

    if (drift.length) {
        console.log('\n  CONTENT DRIFT between language variants (' + drift.length + '):');
        for (const d of drift) {
            console.log(`    ${d.pageId} [${d.anchor}] ` + (d.dir === 'missing'
                ? `${d.lang} has no counterpart -> falls back to fr`
                : `only in ${d.lang} -> absent from fr template, would be dropped`));
            console.log(`      "${String(d.text).slice(0, 90)}"`);
        }
    }

    for (const lang of LANGS.filter(l => l !== SRC_LANG)) {
        const same = Object.keys(catalogue[SRC_LANG]).filter(k => catalogue[lang][k] === catalogue[SRC_LANG][k]);
        console.log(`  ${lang}: ${same.length} value(s) identical to fr (brand names, or untranslated)`);
    }

    if (!WRITE) {
        console.log('\n  dry run — re-run with --write to emit i18n/*.json and templates.\n');
        return;
    }

    const archiveDir = path.join(ROOT, 'i18n', 'archive');
    fs.mkdirSync(archiveDir, { recursive: true });
    for (const lang of LANGS) {
        const target = path.join(ROOT, 'i18n', lang + '.json');
        if (fs.existsSync(target)) fs.copyFileSync(target, path.join(archiveDir, lang + '.legacy.json'));
        const nested = {};
        for (const [k, v] of Object.entries(catalogue[lang])) L.setKey(nested, k, v);
        fs.writeFileSync(target, JSON.stringify(L.sortDeep(nested), null, 2) + '\n', 'utf8');
    }
    for (const [rel, src] of Object.entries(templates)) {
        fs.writeFileSync(path.join(ROOT, rel), src, 'utf8');
    }

    console.log('\n  wrote i18n/{' + LANGS.join(',') + '}.json  (' + totalKeys + ' keys each)');
    console.log('  wrote ' + Object.keys(templates).length + ' templates');
    console.log('  archived previous catalogues to i18n/archive/\n');
}

/** Marker insertion point: just before the '>' (or '/>') of an opening tag. */
function insertPoint(tagEnd, raw) { return tagEnd - 1; }

function recordEdit(u, key, edits, attrGroups) {
    if (u.type === 'attr') {
        const at = u.tagEnd - 1;
        if (!attrGroups.has(u.tagStart)) attrGroups.set(u.tagStart, []);
        attrGroups.get(u.tagStart).push({ attrName: u.attrName, key, insertAt: at });
        return;
    }
    const attr = u.type === 'rich' ? 'data-i18n-rich'
        : u.type === 'raw' ? 'data-i18n-raw'
        : 'data-i18n';
    edits.push({ start: u.tagEnd - 1, end: u.tagEnd - 1, text: ` ${attr}="${key}"` });
}

/** Multiple zero-width inserts can land on the same offset; keep them ordered. */
function dedupeEdits(edits) {
    const byPos = new Map();
    for (const e of edits) {
        const k = e.start + ':' + e.end;
        if (!byPos.has(k)) byPos.set(k, { start: e.start, end: e.end, text: '' });
        byPos.get(k).text += e.text;
    }
    return [...byPos.values()];
}

function stripPlaceholders(s) {
    return String(s).replace(/<\/?\d+\/?>/g, ' ');
}

module.exports = { collectUnits, PAGES, srcFor, LANGS, SRC_LANG, encodeRich };
