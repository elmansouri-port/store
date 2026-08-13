#!/usr/bin/env node
/*
 * build-pages.js  generate a static GitHub Pages build into ./docs
 *
 * Why: this repo is a Node/Express app that uses clean, per-language URLs
 * (/fr/products, /en/products, /de/products, ...) and root-absolute asset
 * paths (/css, /js, /images). GitHub Pages can't run Express, and for the
 * project repo "store" the site is served from a SUBPATH:
 *     https://elmansouri-port.github.io/store/
 * so every "/..." path must be prefixed with "/store" and each clean URL needs
 * its own index.html. This script produces that transformed copy in ./docs
 * WITHOUT modifying any app source file, so `npm start` (Express) keeps
 * working unchanged.
 *
 * Re-run after editing pages:  node tools/build-pages.js
 * If you ever rename the repo, change BASE below (use '' for a <user>.github.io root site).
 */
const fs = require('fs');
const path = require('path');
const { render } = require('./i18n-render.js');

const BASE = '/store';                 // URL subpath GitHub Pages serves the project from
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs');

const LANGS = ['fr', 'en', 'de'];
const DEFAULT_LANG = 'fr';

// clean route  ->  source file, relative to project root for 'fr' / to pages/<lang>/ for en, de
const ROUTE_FILES = {
  '': 'index.html',
  'products': 'products.html',
  'products/collaboration': 'collaboration.html',
  'products/webinar': 'webinar.html',
  'products/webinar/pricing': 'tarif-webinar.html',
  'products/collaboration/pricing': 'tarif-collaboration.html',
  'tarifs': 'tarifs.html',
  'blog': 'blog.html',
  'blog/the-power-of-rainbow': 'blog/the-power-of-rainbow.html',
  'faq': 'faq.html',
  'partenaires': 'partenaires.html',
  'a-propos-de-rainbow': 'a-propos-de-rainbow.html',
  'rainbow-donnees-hebergees-en-france': 'rainbow-donnees-hebergees-en-france.html',
  'centre-aide-rainbow': 'centre-aide-rainbow.html',
  'telecharger-application-rainbow': 'telecharger-application-rainbow.html',
  'trouver-un-partenaire': 'trouver-un-partenaire.html',
};

// Pages that are one shared file across all 3 languages.
const SHARED_PAGES = {
  'form-al': 'pages/form-ale.html',
  'confirmer-rendez-vous': 'pages/confirmer-rendez-vous.html',
  'modifier-rendez-vous': 'pages/modifier-rendez-vous.html',
};

// Every language is rendered from the same template; the copy comes from
// i18n/<lang>.json. There is no longer a per-language source file.
function templateFor(name) {
  return name === 'index.html' ? 'index.html' : `pages/${name}`;
}

const CATALOGUES = Object.fromEntries(LANGS.map(l => [
  l, JSON.parse(fs.readFileSync(path.join(ROOT, 'i18n', l + '.json'), 'utf8')),
]));

const ASSET_DIRS = ['css', 'js', 'images', 'img', 'i18n', 'assets'];

// Prefix root-absolute paths ("/x" but not "//x" or "/store/...") with BASE.
function prefixHtml(html) {
  return html
    // src/href/action/poster="/..." — `image` is <whitepaper-download-form>'s
    // cover-art attribute, which JS copies straight into img.src, so it needs
    // the base prefix just like a real src would.
    .replace(/(\s(?:src|href|action|poster|data-src|image)=")\/(?!\/)/g, `$1${BASE}/`)
    // srcset entries beginning with /
    .replace(/(\ssrcset=")([^"]*)"/g, (m, p, val) =>
      p + val.replace(/(^|,\s*)\/(?!\/)/g, `$1${BASE}/`) + '"')
    // inline style url(/...) and CSS url(/...)
    .replace(/url\(\s*(['"]?)\/(?!\/)/g, `url($1${BASE}/`);
}
/*
 * Relative asset paths are invisible locally and fatal in production.
 * Pages are served from /<lang>/<route>/, so "js/x.js" resolves against the
 * language segment (/store/fr/js/x.js) and 404s — but only once the host adds
 * the trailing slash, which the dev server does not. prefixHtml only rewrites
 * root-absolute paths, so anything relative slips through untouched and the
 * page silently loses its scripts. Catch it at build time instead.
 */
const RELATIVE_ASSET = /\s(?:src|href|action|poster|data-src)="(?!https?:|\/\/|\/|#|mailto:|tel:|data:|javascript:|\{\{)([^"]+)"/g;
function findRelativeAssets(html) {
  const out = [];
  let m;
  while ((m = RELATIVE_ASSET.exec(html)) !== null) {
    // Ignore values built by JS at runtime (string concatenation in a script).
    if (/[' +]/.test(m[1])) continue;
    out.push(m[1]);
  }
  return out;
}

function prefixCss(css) {
  return css.replace(/url\(\s*(['"]?)\/(?!\/)/g, `url($1${BASE}/`);
}
// JS that builds markup / fetches by absolute path.
function prefixJs(file, js) {
  // literal href="/..." / src="/..." inside markup strings
  return js.replace(/((?:src|href)=\\?["'])\/(?!\/)/g, `$1${BASE}/`);
}

function copyDir(src, dst, transform) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) { copyDir(s, d, transform); continue; }
    if (transform) {
      const ext = path.extname(entry.name).toLowerCase();
      if (ext === '.css') { fs.writeFileSync(d, prefixCss(fs.readFileSync(s, 'utf8'))); continue; }
      if (ext === '.js')  { fs.writeFileSync(d, prefixJs(s, fs.readFileSync(s, 'utf8'))); continue; }
    }
    fs.copyFileSync(s, d);
  }
}

// A tiny static redirect: honors a previously-set `lang` cookie or the
// browser's language, falling back to fr — mirrors server.js's
// detectPreferredLang() since GitHub Pages can't do this server-side.
function redirectPageHtml(targetRoutePrefixed) {
  const targets = Object.fromEntries(LANGS.map(l => [l, `${BASE}/${l}${targetRoutePrefixed}`]));
  return `<!doctype html><html lang="${DEFAULT_LANG}"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width,initial-scale=1">` +
    `<title>Redirecting…</title>` +
    `<meta http-equiv="refresh" content="0;url=${targets[DEFAULT_LANG]}">` +
    `<script>(function(){` +
    `var targets=${JSON.stringify(targets)};` +
    `var m=(document.cookie||'').match(/(?:^|;\\s*)lang=(fr|en|de)\\b/);` +
    `var lang=m?m[1]:((navigator.language||'').slice(0,2).toLowerCase());` +
    `location.replace(targets[lang]||targets['${DEFAULT_LANG}']);` +
    `})();</script>` +
    `</head><body></body></html>\n`;
}

// 1. fresh docs/
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

// 2. assets (css/js transformed, images/img/i18n copied as-is)
for (const dir of ASSET_DIRS) {
  const src = path.join(ROOT, dir);
  if (!fs.existsSync(src)) continue;
  const transform = (dir === 'css' || dir === 'js');
  copyDir(src, path.join(OUT, dir), transform);
}

// 3. lang-prefixed page routes
let pageCount = 0;
const missingKeys = new Map();   // lang -> Set(key)
const relativeAssets = [];       // routePath -> offending relative path

/**
 * Write one route. `lang` set => the source is a template and gets rendered
 * through the catalogue first; otherwise the file is emitted as authored
 * (the shared pages localise themselves client-side).
 */
function writeRoute(routePath, srcRel, lang) {
  const srcAbs = path.join(ROOT, srcRel);
  if (!fs.existsSync(srcAbs)) { console.warn('  skip (missing): ' + srcRel); return; }
  let html = fs.readFileSync(srcAbs, 'utf8');
  if (lang) {
    html = render(html, CATALOGUES[lang], lang, {
      onMissing(key) {
        if (!missingKeys.has(lang)) missingKeys.set(lang, new Set());
        missingKeys.get(lang).add(key);
      },
    });
  }
  const rel = findRelativeAssets(html);
  if (rel.length) {
    for (const r of rel) relativeAssets.push(`${routePath}/  ->  ${r}`);
  }
  const destDir = path.join(OUT, routePath);
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(path.join(destDir, 'index.html'), prefixHtml(html));
  pageCount++;
}

for (const [route, name] of Object.entries(ROUTE_FILES)) {
  for (const lang of LANGS) {
    const routePath = route === '' ? lang : `${lang}/${route}`;
    writeRoute(routePath, templateFor(name), lang);
  }
  // legacy unprefixed route -> client-side redirect
  const legacyRoutePath = route; // '' for home
  const destDir = path.join(OUT, legacyRoutePath);
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(path.join(destDir, 'index.html'), redirectPageHtml(route === '' ? '' : `/${route}`));
}

for (const [route, file] of Object.entries(SHARED_PAGES)) {
  for (const lang of LANGS) {
    writeRoute(`${lang}/${route}`, file);
  }
  const destDir = path.join(OUT, route);
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(path.join(destDir, 'index.html'), redirectPageHtml(`/${route}`));
}

// 4. Pages housekeeping
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');

// 404: GitHub Pages serves /404.html for any unknown path under the base.
// Use the site's real 404 page (root 404.html) with paths prefixed; fall back
// to a minimal redirect page if it's ever missing.
const notFoundSrc = path.join(ROOT, '404.html');
if (fs.existsSync(notFoundSrc)) {
  fs.writeFileSync(path.join(OUT, '404.html'), prefixHtml(fs.readFileSync(notFoundSrc, 'utf8')));
} else {
  fs.writeFileSync(path.join(OUT, '404.html'),
    '<!doctype html><html lang="fr"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>Page introuvable  Rainbow</title>' +
    `<meta http-equiv="refresh" content="3;url=${BASE}/${DEFAULT_LANG}">` +
    `<style>body{font-family:'Google Sans',system-ui,sans-serif;background:#f9f8fe;color:#1f2937;` +
    'display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;text-align:center}' +
    'a{color:#5e2d91;font-weight:600}</style></head><body><div>' +
    '<h1 style="font-size:2rem;margin:0 0 .5rem">Page introuvable</h1>' +
    `<p>Redirection vers l'accueil… <a href="${BASE}/${DEFAULT_LANG}">Cliquez ici</a> si rien ne se passe.</p>` +
    '</div></body></html>\n');
}

console.log(`Built ${pageCount} pages into docs/ with base "${BASE}/". Assets: ${ASSET_DIRS.join(', ')}.`);

// A marker whose key is absent from the catalogue leaves the FR copy in place,
// which is easy to miss on a page you don't read. Say so loudly.
// These 404 in production but not on the dev server, so they never show up in
// local testing — fail loudly at build time instead.
if (relativeAssets.length) {
  console.error(`  ERROR ${relativeAssets.length} relative asset path(s) — these 404 under /<lang>/:`);
  relativeAssets.forEach(r => console.error('    ' + r));
  console.error('  Make them root-absolute ("/js/x.js"); the build adds the base prefix.');
  process.exitCode = 1;
}

if (missingKeys.size) {
  for (const [lang, keys] of missingKeys) {
    console.warn(`  WARNING ${lang}: ${keys.size} key(s) missing from i18n/${lang}.json — source copy kept:`);
    [...keys].slice(0, 10).forEach(k => console.warn('    ' + k));
    if (keys.size > 10) console.warn(`    ... and ${keys.size - 10} more`);
  }
}
