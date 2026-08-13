#!/usr/bin/env node
/*
 * i18n-verify.js — round-trip proof for the extraction.
 *
 * Renders each template into en/de from the harvested catalogue and compares the
 * result against the ORIGINAL hand-translated pages. If every visible string and
 * every translatable attribute matches, the extraction preserved the existing
 * human translations exactly and the templating is safe to adopt.
 *
 * Run:  node tools/i18n-verify.js [pathToOriginals]
 *       (defaults to the backup taken before the templates were written)
 */
'use strict';

const fs = require('fs');
const path = require('path');
const L = require('./i18n-lib.js');
const { render } = require('./i18n-render.js');
const { PAGES } = require('./i18n-extract.js');

const ROOT = path.join(__dirname, '..');
const ORIG = process.argv[2];
if (!ORIG) { console.error('usage: node tools/i18n-verify.js <originalsDir>'); process.exit(2); }

const LANGS = ['en', 'de'];
const catalogues = {};
for (const l of ['fr', 'en', 'de']) {
    catalogues[l] = JSON.parse(fs.readFileSync(path.join(ROOT, 'i18n', l + '.json'), 'utf8'));
}

/** Visible text + translatable attribute values, in document order. */
function visible(html) {
    const spans = L.scan(html);
    const out = [];
    for (const s of spans) {
        if (s.kind === 'tag') {
            const attrs = L.parseAttrs(s, html);
            for (const a of attrs) {
                if (!L.isTranslatableAttr(s.name, a.name, attrs)) continue;
                if (!L.isTranslatableText(a.value)) continue;
                out.push('@' + a.name + '=' + norm(a.value));
            }
            continue;
        }
        if (s.kind !== 'text') continue;
        if (!L.isTranslatableText(s.raw)) continue;
        out.push(norm(s.raw));
    }
    return out;
}

// Entity/whitespace normalisation: the languages were authored by different
// hands, so &eacute; vs é and &nbsp; vs a space are not real differences.
function norm(s) {
    return String(s)
        .replace(/&nbsp;|&#160;/g, ' ')
        .replace(/&amp;/g, '&').replace(/&eacute;/g, 'é').replace(/&egrave;/g, 'è')
        .replace(/&ecirc;/g, 'ê').replace(/&agrave;/g, 'à').replace(/&ccedil;/g, 'ç')
        .replace(/&ocirc;/g, 'ô').replace(/&ugrave;/g, 'ù').replace(/&uuml;/g, 'ü')
        .replace(/&auml;/g, 'ä').replace(/&ouml;/g, 'ö').replace(/&szlig;/g, 'ß')
        .replace(/&Eacute;/g, 'É').replace(/&Uuml;/g, 'Ü').replace(/&Auml;/g, 'Ä')
        .replace(/&Ouml;/g, 'Ö').replace(/&ndash;/g, '–').replace(/&mdash;/g, '—')
        .replace(/&rsquo;|&#39;|&apos;/g, "'").replace(/&quot;/g, '"')
        .replace(/&laquo;/g, '«').replace(/&raquo;/g, '»').replace(/&hellip;/g, '…')
        .replace(/&deg;/g, '°').replace(/&euro;/g, '€').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/\s+/g, ' ')
        .trim();
}

function origPath(lang, rel) {
    if (rel === 'index.html') return path.join(ORIG, 'pages', lang, 'index.html');
    return path.join(ORIG, rel.replace(/^pages\//, `pages/${lang}/`));
}

let pagesChecked = 0, mismatches = 0, missingKeys = 0;
const details = [];

for (const [pageId, rel] of Object.entries(PAGES)) {
    const tplPath = path.join(ROOT, rel);
    if (!fs.existsSync(tplPath)) continue;
    const template = fs.readFileSync(tplPath, 'utf8');

    for (const lang of LANGS) {
        const op = origPath(lang, rel);
        if (!fs.existsSync(op)) continue;

        const missing = [];
        const rendered = render(template, catalogues[lang], lang, {
            onMissing: (k) => missing.push(k),
        });
        missingKeys += missing.length;

        const a = visible(rendered);
        const b = visible(fs.readFileSync(op, 'utf8'));
        pagesChecked++;

        if (a.length !== b.length) {
            mismatches++;
            details.push(`  ${pageId} [${lang}]  string COUNT differs: rendered ${a.length} vs original ${b.length}`);
            continue;
        }
        let bad = 0;
        for (let i = 0; i < a.length; i++) {
            if (a[i] !== b[i]) {
                if (bad < 3) {
                    details.push(`  ${pageId} [${lang}] #${i}`);
                    details.push(`      rendered: ${JSON.stringify(a[i].slice(0, 100))}`);
                    details.push(`      original: ${JSON.stringify(b[i].slice(0, 100))}`);
                }
                bad++;
            }
        }
        if (bad) { mismatches++; details.push(`  ${pageId} [${lang}] -> ${bad} differing string(s)`); }
    }
}

console.log(`\n  round-trip: ${pagesChecked} page renders compared against the original translations`);
console.log(`  pages with differences: ${mismatches}`);
console.log(`  keys missing from catalogue: ${missingKeys}`);
if (details.length) {
    console.log('\n  details:');
    details.slice(0, 60).forEach(d => console.log(d));
    if (details.length > 60) console.log(`  ... and ${details.length - 60} more lines`);
}
console.log('');
process.exit(mismatches || missingKeys ? 1 : 0);
