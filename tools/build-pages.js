#!/usr/bin/env node
/*
 * build-pages.js  generate a static GitHub Pages build into ./docs
 *
 * Why: this repo is a Node/Express app that uses clean URLs (/products, /contact, ...)
 * and root-absolute asset paths (/css, /js, /images). GitHub Pages can't run Express,
 * and for the project repo "store" the site is served from a SUBPATH:
 *     https://elmansouri-port.github.io/store/
 * so every "/..." path must be prefixed with "/store" and each clean URL needs its own
 * index.html. This script produces that transformed copy in ./docs WITHOUT modifying any
 * app source file, so `npm start` (Express) keeps working unchanged.
 *
 * Re-run after editing pages:  node tools/build-pages.js
 * If you ever rename the repo, change BASE below (use '' for a <user>.github.io root site).
 */
const fs = require('fs');
const path = require('path');

const BASE = '/store';                 // URL subpath GitHub Pages serves the project from
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'docs');

// clean route  ->  source HTML file
const ROUTES = {
  '': 'index.html',
  'products': 'pages/products.html',
  'products/collaboration': 'pages/collaboration.html',
  'products/webinar': 'pages/webinar.html',
  'products/webinar/pricing': 'pages/tarif-webinar.html',
  'products/collaboration/pricing': 'pages/tarif-collaboration.html',
  'tarifs': 'pages/tarifs.html',
  'blog': 'pages/blog.html',
  'blog/the-power-of-rainbow': 'pages/blog/the-power-of-rainbow.html',
  'faq': 'pages/faq.html',
  'partenaires': 'pages/partenaires.html',
  'a-propos-de-rainbow': 'pages/a-propos-de-rainbow.html',
  'rainbow-donnees-hebergees-en-france': 'pages/rainbow-donnees-hebergees-en-france.html',
  'centre-aide-rainbow': 'pages/centre-aide-rainbow.html',
  'telecharger-application-rainbow': 'pages/telecharger-application-rainbow.html',
  'trouver-un-partenaire': 'pages/trouver-un-partenaire.html',
  'form-al': 'pages/form-ale.html',
  'modifier-rendez-vous': 'pages/modifier-rendez-vous.html'
};

const ASSET_DIRS = ['css', 'js', 'images', 'img', 'i18n', 'assets'];

// Prefix root-absolute paths ("/x" but not "//x" or "/store/...") with BASE.
function prefixHtml(html) {
  return html
    // src/href/action/poster="/..."
    .replace(/(\s(?:src|href|action|poster|data-src)=")\/(?!\/)/g, `$1${BASE}/`)
    // srcset entries beginning with /
    .replace(/(\ssrcset=")([^"]*)"/g, (m, p, val) =>
      p + val.replace(/(^|,\s*)\/(?!\/)/g, `$1${BASE}/`) + '"')
    // inline style url(/...) and CSS url(/...)
    .replace(/url\(\s*(['"]?)\/(?!\/)/g, `url($1${BASE}/`);
}
function prefixCss(css) {
  return css.replace(/url\(\s*(['"]?)\/(?!\/)/g, `url($1${BASE}/`);
}
// JS that builds markup / fetches by absolute path.
function prefixJs(file, js) {
  // literal href="/..." / src="/..." inside markup strings
  let out = js.replace(/((?:src|href)=\\?["'])\/(?!\/)/g, `$1${BASE}/`);
  if (path.basename(file) === 'mega-menu.js') {
    // nav links are passed as the first arg: makeItem('/products/webinar', ...)
    out = out.replace(/(make(?:Mobile)?Item\(\s*['"])\/(?!\/)/g, `$1${BASE}/`);
  }
  if (path.basename(file) === 'i18n.js') {
    // i18n fetches `window.location.origin + '/i18n/...'`; add the subpath.
    out = out.replace(/window\.location\.origin/g, `window.location.origin + '${BASE}'`);
  }
  return out;
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

// 3. route HTML pages
let pageCount = 0;
for (const [route, srcRel] of Object.entries(ROUTES)) {
  const srcAbs = path.join(ROOT, srcRel);
  if (!fs.existsSync(srcAbs)) { console.warn('  skip (missing): ' + srcRel); continue; }
  const destDir = route === '' ? OUT : path.join(OUT, route);
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(path.join(destDir, 'index.html'), prefixHtml(fs.readFileSync(srcAbs, 'utf8')));
  pageCount++;
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
    `<meta http-equiv="refresh" content="3;url=${BASE}/">` +
    '<style>body{font-family:Inter,system-ui,sans-serif;background:#f9f8fe;color:#1f2937;' +
    'display:flex;min-height:100vh;align-items:center;justify-content:center;margin:0;text-align:center}' +
    'a{color:#5e2d91;font-weight:600}</style></head><body><div>' +
    '<h1 style="font-size:2rem;margin:0 0 .5rem">Page introuvable</h1>' +
    `<p>Redirection vers l'accueil… <a href="${BASE}/">Cliquez ici</a> si rien ne se passe.</p>` +
    '</div></body></html>\n');
}

console.log(`Built ${pageCount} pages into docs/ with base "${BASE}/". Assets: ${ASSET_DIRS.join(', ')}.`);
