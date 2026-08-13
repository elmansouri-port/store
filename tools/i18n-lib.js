/*
 * i18n-lib.js — shared tokenizer + key utilities for the build-time i18n pipeline.
 *
 * The whole pipeline rests on one invariant: we NEVER re-serialize HTML. A real
 * parser (parse5/jsdom) would normalize attribute quoting, boolean attrs and
 * whitespace, silently reformatting all 12 pages. Instead we scan the source
 * into spans and only ever splice over the exact byte ranges that hold
 * translatable text, leaving every tag, script and blank line untouched.
 */
'use strict';

// Elements whose contents are raw text, not markup — never translate inside them.
const RAW_TEXT = new Set(['script', 'style']);

// Attributes holding user-visible copy.
const ATTR_WHITELIST = new Set(['alt', 'placeholder', 'aria-label', 'title']);

// <meta> content="" is only copy for these; everything else is machine metadata
// (charset, viewport, image URLs, theme-color, ...).
const META_TRANSLATABLE = new Set([
    'description', 'keywords',
    'og:title', 'og:description',
    'twitter:title', 'twitter:description',
]);

/**
 * Scan HTML into an ordered list of spans.
 * Quote-aware: `>` inside an attribute value (common in inline JS like `x => y`)
 * does not terminate a tag, which a naive /<[^>]+>/ split gets wrong.
 * Returns [{kind:'text'|'tag'|'comment'|'raw', start, end, raw, name?, attrs?}]
 */
function scan(html) {
    const spans = [];
    let i = 0;
    const n = html.length;

    while (i < n) {
        const lt = html.indexOf('<', i);
        if (lt === -1) {
            if (i < n) spans.push({ kind: 'text', start: i, end: n, raw: html.slice(i) });
            break;
        }
        if (lt > i) spans.push({ kind: 'text', start: i, end: lt, raw: html.slice(i, lt) });

        // Comment / doctype / CDATA
        if (html.startsWith('<!--', lt)) {
            const close = html.indexOf('-->', lt + 4);
            const end = close === -1 ? n : close + 3;
            spans.push({ kind: 'comment', start: lt, end, raw: html.slice(lt, end) });
            i = end;
            continue;
        }
        if (html[lt + 1] === '!') {
            const close = html.indexOf('>', lt);
            const end = close === -1 ? n : close + 1;
            spans.push({ kind: 'comment', start: lt, end, raw: html.slice(lt, end) });
            i = end;
            continue;
        }

        // Tag — walk to the matching '>' while tracking quote state.
        let j = lt + 1;
        let quote = null;
        while (j < n) {
            const c = html[j];
            if (quote) {
                if (c === quote) quote = null;
            } else if (c === '"' || c === "'") {
                quote = c;
            } else if (c === '>') {
                break;
            }
            j++;
        }
        const end = j < n ? j + 1 : n;
        const raw = html.slice(lt, end);
        const nameMatch = /^<\/?\s*([a-zA-Z][a-zA-Z0-9-]*)/.exec(raw);
        const name = nameMatch ? nameMatch[1].toLowerCase() : '';
        const closing = raw[1] === '/';
        spans.push({ kind: 'tag', start: lt, end, raw, name, closing });
        i = end;

        // Raw-text element: consume to its close tag as one opaque span.
        if (!closing && RAW_TEXT.has(name) && !/\/>$/.test(raw)) {
            const closeRe = new RegExp('</\\s*' + name + '\\s*>', 'i');
            const rest = html.slice(i);
            const m = closeRe.exec(rest);
            const bodyEnd = m ? i + m.index : n;
            if (bodyEnd > i) {
                spans.push({ kind: 'raw', start: i, end: bodyEnd, raw: html.slice(i, bodyEnd) });
            }
            i = bodyEnd;
        }
    }
    return spans;
}

/** Parse an opening tag's attributes into [{name, value, valueStart, valueEnd}]. */
function parseAttrs(span, html) {
    const out = [];
    const inner = span.raw;
    const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)')/g;
    let m;
    while ((m = re.exec(inner)) !== null) {
        const quoted = m[2];
        const value = m[3] !== undefined ? m[3] : m[4];
        // Offset of the value text within the whole document.
        const valueStart = span.start + m.index + m[0].length - quoted.length + 1;
        out.push({
            name: m[1].toLowerCase(),
            value,
            valueStart,
            valueEnd: valueStart + value.length,
        });
    }
    return out;
}

/** True when a text run is real copy rather than whitespace/markup noise. */
function isTranslatableText(s) {
    const t = s.trim();
    if (t.length < 2) return false;
    if (!/[A-Za-zÀ-ÖØ-öø-ÿ]/.test(t)) return false;   // needs at least one letter
    if (/^&[a-z]+;$/i.test(t)) return false;           // lone entity like &nbsp;
    return true;
}

/** Decide whether a given attribute on a given tag carries translatable copy. */
function isTranslatableAttr(tagName, attrName, attrs) {
    if (ATTR_WHITELIST.has(attrName)) return true;
    if (tagName === 'meta' && attrName === 'content') {
        const key = (attrs.find(a => a.name === 'name' || a.name === 'property') || {}).value;
        return !!key && META_TRANSLATABLE.has(key.toLowerCase());
    }
    return false;
}

const SLUG_MAX = 34;

/** Human-readable, stable-ish key fragment derived from the source copy. */
function slugify(text) {
    const s = String(text)
        .replace(/&[a-z]+;/gi, ' ')
        .replace(/&#\d+;/g, ' ')
        .normalize('NFD').replace(/[̀-ͯ]/g, '')  // strip accents
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    if (!s) return 'txt';
    const words = s.split('-').filter(Boolean);
    let out = '';
    for (const w of words) {
        if (out && (out.length + 1 + w.length) > SLUG_MAX) break;
        out = out ? out + '-' + w : w;
    }
    return out || 'txt';
}

/** Splice replacements into source. edits = [{start, end, text}] — non-overlapping. */
function applyEdits(src, edits) {
    const sorted = edits.slice().sort((a, b) => a.start - b.start);
    let out = '';
    let cursor = 0;
    for (const e of sorted) {
        if (e.start < cursor) throw new Error('overlapping edit at ' + e.start);
        out += src.slice(cursor, e.start) + e.text;
        cursor = e.end;
    }
    return out + src.slice(cursor);
}

function getKey(obj, key) {
    return key.split('.').reduce((a, k) => (a == null ? a : a[k]), obj);
}

function setKey(obj, key, value) {
    const parts = key.split('.');
    let cur = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        if (typeof cur[parts[i]] !== 'object' || cur[parts[i]] === null) cur[parts[i]] = {};
        cur = cur[parts[i]];
    }
    cur[parts[parts.length - 1]] = value;
}

/** Sort object keys recursively so generated JSON diffs stay readable. */
function sortDeep(obj) {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return obj;
    const out = {};
    for (const k of Object.keys(obj).sort()) out[k] = sortDeep(obj[k]);
    return out;
}

module.exports = {
    scan, parseAttrs, isTranslatableText, isTranslatableAttr,
    slugify, applyEdits, getKey, setKey, sortDeep,
    RAW_TEXT, ATTR_WHITELIST, META_TRANSLATABLE,
};
