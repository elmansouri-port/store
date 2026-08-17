require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const cors = require('cors');
const { render } = require('./tools/i18n-render.js');

const app = express();
const PORT = process.env.PORT || 3000;

// ── I18N ──────────────────────────────────────────────────────────────────────
// The URL's /fr, /en, /de segment IS the language. Each route has ONE template
// (pages/*.html, authored in French) carrying data-i18n markers; the copy lives
// in i18n/<lang>.json and is applied at render time. `npm run build:pages`
// performs the same render ahead of time for the static GitHub Pages build, so
// what ships is fully-rendered HTML per language — no client-side text swapping,
// no flash of untranslated content, and each language keeps its own URL.

const LANGS = ['fr', 'en', 'de'];
const DEFAULT_LANG = 'fr';

const P = f => path.join(__dirname, f);

function detectPreferredLang(req) {
    const cookies = req.headers.cookie || '';
    const cookieMatch = cookies.match(/(?:^|;\s*)lang=(fr|en|de)\b/);
    if (cookieMatch) return cookieMatch[1];
    const accept = (req.headers['accept-language'] || '').split(',')[0] || '';
    const primary = accept.trim().slice(0, 2).toLowerCase();
    return LANGS.includes(primary) ? primary : DEFAULT_LANG;
}

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
    'trouver-un-partenaire': 'trouver-un-partenaire.html',
    'a-propos-de-rainbow': 'a-propos-de-rainbow.html',
    'rainbow-donnees-hebergees-en-france': 'rainbow-donnees-hebergees-en-france.html',
    'centre-aide-rainbow': 'centre-aide-rainbow.html',
    'telecharger-application-rainbow': 'telecharger-application-rainbow.html',
};

// Pages that are one shared file across all 3 languages (they detect/seed
// their own language client-side from the URL and switch in place).
const SHARED_PAGES = {
    'form-al': 'pages/form-ale.html',
    'confirmer-rendez-vous': 'pages/confirmer-rendez-vous.html',
    'modifier-rendez-vous': 'pages/modifier-rendez-vous.html',
    'desinscription': 'pages/desinscription.html',
};

// One template per route; the copy comes from i18n/<lang>.json at render time.
function templateFor(name) {
    return name === 'index.html' ? P('index.html') : P(`pages/${name}`);
}

// Catalogues are re-read per request in development so editing i18n/*.json or a
// template shows up on refresh without restarting or running a build.
const CATALOGUE_CACHE = {};
function catalogueFor(lang) {
    const file = P(`i18n/${lang}.json`);
    const mtime = fs.statSync(file).mtimeMs;
    const hit = CATALOGUE_CACHE[lang];
    if (hit && hit.mtime === mtime) return hit.data;
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    CATALOGUE_CACHE[lang] = { mtime, data };
    return data;
}

function renderPage(lang, name) {
    const template = fs.readFileSync(templateFor(name), 'utf8');
    return render(template, catalogueFor(lang), lang);
}

// ── MIDDLEWARE ─────────────────────────────────────────────────────────────────

app.use(cors());
app.use(express.json());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.tailwindcss.com", "https://unpkg.com"],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://unpkg.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "blob:", "https://flagcdn.com", "https://images.unsplash.com", "https://*.basemaps.cartocdn.com", "https://unpkg.com"],
            frameSrc: ["'self'", "https://www.youtube.com"],
            connectSrc: ["'self'", "https://rainbow-market.zendesk.com", "https://s138097979.t.eloqua.com", "https://n8n.openrainbow.org", "https://ipapi.co"],
            formAction: ["'self'", "https://s138097979.t.eloqua.com"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

// ── STATIC FILES ───────────────────────────────────────────────────────────────

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/i18n', express.static(path.join(__dirname, 'i18n')));

// ── LANG-PREFIXED PAGE ROUTES ───────────────────────────────────────────────────

for (const [route, name] of Object.entries(ROUTE_FILES)) {
    for (const lang of LANGS) {
        const urlPath = route === '' ? `/${lang}` : `/${lang}/${route}`;
        app.get(urlPath, (req, res, next) => {
            if (!fs.existsSync(templateFor(name))) return next();
            try {
                res.type('html').send(renderPage(lang, name));
            } catch (err) {
                next(err);
            }
        });
    }
}

for (const [route, file] of Object.entries(SHARED_PAGES)) {
    for (const lang of LANGS) {
        app.get(`/${lang}/${route}`, (req, res) => res.sendFile(P(file)));
    }
}

// ── LEGACY UNPREFIXED ROUTES → REDIRECT ─────────────────────────────────────────
// Bookmarks/links from before per-language URLs existed land on the visitor's
// preferred language (cookie set by the switcher, else Accept-Language, else fr).

for (const route of Object.keys(ROUTE_FILES)) {
    const legacyPath = route === '' ? '/' : `/${route}`;
    app.get(legacyPath, (req, res) => {
        const lang = detectPreferredLang(req);
        res.redirect(302, route === '' ? `/${lang}` : `/${lang}/${route}`);
    });
}

for (const route of Object.keys(SHARED_PAGES)) {
    app.get(`/${route}`, (req, res) => {
        const lang = detectPreferredLang(req);
        res.redirect(302, `/${lang}/${route}`);
    });
}

// ── HEALTH ─────────────────────────────────────────────────────────────────────

app.get('/healthz', (req, res) => res.json({ status: 'ok' }));

// ── 404 ────────────────────────────────────────────────────────────────────────

app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// ── ERROR ──────────────────────────────────────────────────────────────────────

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

// ── START ──────────────────────────────────────────────────────────────────────

const server = app.listen(PORT, () => console.log(`Design site → http://localhost:${PORT}`));
server.timeout = 30000;

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
