#!/usr/bin/env node
/*
 * i18n-diff.js — locate where a page's language variants diverge structurally.
 * Used when i18n-extract reports MISALIGNED: prints the first slots that fail
 * to line up, so the offending markup can be reconciled by hand.
 *
 * Run:  node tools/i18n-diff.js <pageId>
 */
'use strict';

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const extract = fs.readFileSync(path.join(__dirname, 'i18n-extract.js'), 'utf8');

// Reuse the extractor's own collector so the comparison matches exactly.
const mod = { exports: {} };
const L = require('./i18n-lib.js');
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr']);

function collect(html) {
    const spans = L.scan(html);
    const out = [];
    const stack = [];
    let inHead = false;
    for (const span of spans) {
        if (span.kind === 'tag') {
            const nm = span.name;
            if (!span.closing) {
                if (nm === 'head') inHead = true;
                const attrs = L.parseAttrs(span, html);
                for (const a of attrs) {
                    if (!L.isTranslatableAttr(nm, a.name, attrs)) continue;
                    if (!L.isTranslatableText(a.value)) continue;
                    out.push({ kind: 'attr:' + a.name, value: a.value.trim() });
                }
                if (!(/\/>$/.test(span.raw) || VOID.has(nm))) stack.push(nm);
            } else {
                if (nm === 'head') inHead = false;
                for (let k = stack.length - 1; k >= 0; k--) if (stack[k] === nm) { stack.length = k; break; }
            }
            continue;
        }
        if (span.kind !== 'text') continue;
        if (!L.isTranslatableText(span.raw)) continue;
        out.push({ kind: 'text', value: span.raw.trim() });
    }
    return out;
}

const PAGE_REL = {
    'webinar': 'pages/webinar.html',
    'a-propos-de-rainbow': 'pages/a-propos-de-rainbow.html',
    'rainbow-donnees-hebergees-en-france': 'pages/rainbow-donnees-hebergees-en-france.html',
    'telecharger-application-rainbow': 'pages/telecharger-application-rainbow.html',
    'index': 'index.html',
};

const pageId = process.argv[2];
const rel = PAGE_REL[pageId];
if (!rel) { console.error('unknown page: ' + pageId + '\nknown: ' + Object.keys(PAGE_REL).join(', ')); process.exit(1); }

function srcFor(lang, r) {
    if (lang === 'fr') return path.join(ROOT, r);
    if (r === 'index.html') return path.join(ROOT, 'pages', lang, 'index.html');
    return path.join(ROOT, r.replace(/^pages\//, `pages/${lang}/`));
}

const S = {};
for (const lang of ['fr', 'en', 'de']) S[lang] = collect(fs.readFileSync(srcFor(lang, rel), 'utf8'));

console.log(`\n${pageId}:  fr=${S.fr.length}  en=${S.en.length}  de=${S.de.length}\n`);

// Walk in lockstep; report the first index where the streams stop corresponding.
const max = Math.max(S.fr.length, S.en.length, S.de.length);
let shown = 0;
for (let i = 0; i < max && shown < 6; i++) {
    const f = S.fr[i], e = S.en[i], d = S.de[i];
    const kinds = [f && f.kind, e && e.kind, d && d.kind];
    if (new Set(kinds.filter(Boolean)).size !== 1 || kinds.some(k => !k)) {
        console.log(`  >>> divergence at slot ${i}`);
        console.log(`      fr[${i}] ${f ? f.kind + ' ' + JSON.stringify(f.value.slice(0, 70)) : '(none)'}`);
        console.log(`      en[${i}] ${e ? e.kind + ' ' + JSON.stringify(e.value.slice(0, 70)) : '(none)'}`);
        console.log(`      de[${i}] ${d ? d.kind + ' ' + JSON.stringify(d.value.slice(0, 70)) : '(none)'}`);
        console.log(`      context fr[${i - 1}] = ${S.fr[i - 1] ? JSON.stringify(S.fr[i - 1].value.slice(0, 60)) : '-'}`);
        console.log('');
        shown++;
        break;
    }
}

// Kind-stream comparison finds insertions even when kinds happen to match.
for (const lang of ['en', 'de']) {
    if (S[lang].length === S.fr.length) continue;
    const a = S.fr, b = S[lang];
    let i = 0;
    while (i < a.length && i < b.length && a[i].kind === b[i].kind) i++;
    console.log(`  ${lang} vs fr — streams track together until slot ${i}, then:`);
    for (let k = Math.max(0, i - 1); k < Math.min(i + 3, Math.max(a.length, b.length)); k++) {
        console.log(`    [${k}] fr: ${a[k] ? a[k].kind + ' ' + JSON.stringify(a[k].value.slice(0, 55)) : '(end)'}`);
        console.log(`    [${k}] ${lang}: ${b[k] ? b[k].kind + ' ' + JSON.stringify(b[k].value.slice(0, 55)) : '(end)'}`);
    }
    console.log('');
}
