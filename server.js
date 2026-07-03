require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// ── I18N ──────────────────────────────────────────────────────────────────────

const SUPPORTED_LANGS = ['en', 'fr', 'es', 'it', 'de'];
const I18N_DIR = path.join(__dirname, 'i18n');
const i18nCache = {};
const pageCache = {};
const PAGE_CACHE_MAX = 50;

function loadI18n(lang) {
    if (i18nCache[lang]) return i18nCache[lang];
    try {
        i18nCache[lang] = JSON.parse(fs.readFileSync(path.join(I18N_DIR, lang + '.json'), 'utf8'));
        return i18nCache[lang];
    } catch (e) { return null; }
}

function getKey(obj, key) {
    return key.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

function translateHTML(html, lang) {
    const tr = loadI18n(lang);
    const en = loadI18n('en');
    if (!tr) return html;
    const lookup = k => { const v = getKey(tr, k); return v !== undefined ? v : (en ? getKey(en, k) ?? null : null); };
    html = html.replace(/(data-i18n="([^"]+)"[^>]*>)([^<]*?)(<\/)/g, (m, b, k, _, a) => { const v = lookup(k); return v !== null ? b + v + a : m; });
    html = html.replace(/(data-i18n-html="([^"]+)"[^>]*>)([\s\S]*?)(<\/)/g, (m, b, k, _, a) => { const v = lookup(k); return v !== null ? b + v + a : m; });
    html = html.replace(/(data-i18n-placeholder="([^"]+)"[^>]*?)(placeholder=")([^"]*?)(")/g, (m, b, k, p, _, e) => { const v = lookup(k); return v !== null ? b + p + v + e : m; });
    html = html.replace(/<html\s+lang="[^"]*"/, '<html lang="' + lang + '"');
    return html;
}

function getLang(req) {
    const cookies = req.headers.cookie || '';
    const match = cookies.match(/(?:^|;\s*)lang=([a-z]{2})/);
    const lang = match ? match[1] : 'en';
    return SUPPORTED_LANGS.includes(lang) ? lang : 'en';
}

function sendPage(req, res, filePath) {
    const lang = getLang(req);
    if (lang === 'en') return res.sendFile(filePath);
    const key = filePath + ':' + lang;
    if (pageCache[key]) return res.set('Content-Type', 'text/html; charset=utf-8').send(pageCache[key]);
    try {
        const translated = translateHTML(fs.readFileSync(filePath, 'utf8'), lang);
        const keys = Object.keys(pageCache);
        if (keys.length >= PAGE_CACHE_MAX) delete pageCache[keys[0]];
        pageCache[key] = translated;
        res.set('Content-Type', 'text/html; charset=utf-8').send(translated);
    } catch (e) {
        res.sendFile(filePath);
    }
}

// ── MIDDLEWARE ─────────────────────────────────────────────────────────────────

app.use(cors());
app.use(express.json());
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdn.tailwindcss.com"],
            scriptSrcAttr: ["'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "blob:", "https://flagcdn.com", "https://images.unsplash.com"],
            frameSrc: ["'self'", "https://www.youtube.com"],
            connectSrc: ["'self'", "https://rainbow-market.zendesk.com", "https://s138097979.t.eloqua.com"],
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
app.use('/i18n', express.static(I18N_DIR));

// ── PAGE ROUTES ────────────────────────────────────────────────────────────────

const P = f => path.join(__dirname, f);

app.get('/',                              (req, res) => sendPage(req, res, P('index.html')));
app.get('/products',                      (req, res) => sendPage(req, res, P('pages/products.html')));
app.get('/products/collaboration',        (req, res) => sendPage(req, res, P('pages/collaboration.html')));
app.get('/products/webinar',              (req, res) => sendPage(req, res, P('pages/webinar.html')));
app.get('/products/webinar/pricing',      (req, res) => sendPage(req, res, P('pages/tarif-webinar.html')));
app.get('/products/collaboration/pricing',(req, res) => sendPage(req, res, P('pages/tarif-collaboration.html')));
app.get('/tarifs',                        (req, res) => sendPage(req, res, P('pages/tarifs.html')));
app.get('/tarif1',                        (req, res) => sendPage(req, res, P('pages/tarif1.html')));
app.get('/blog',                           (req, res) => sendPage(req, res, P('pages/blog.html')));
app.get('/contact',                       (req, res) => sendPage(req, res, P('pages/contact.html')));
app.get('/partenaires',                   (req, res) => sendPage(req, res, P('pages/partenaires.html')));

// ── API ────────────────────────────────────────────────────────────────────────

// Contact form stub — wire up to a real backend when needed
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ error: 'Name, email and message required' });
    res.json({ success: true });
});

// ── HEALTH ─────────────────────────────────────────────────────────────────────

app.get('/healthz', (req, res) => res.json({ status: 'ok' }));

// ── 404 ────────────────────────────────────────────────────────────────────────

app.use((req, res) => {
    res.status(404).set('Content-Type', 'text/html; charset=utf-8').send(`
<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>404 – Page non trouvée</title>
<script src="https://cdn.tailwindcss.com"></script>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap" rel="stylesheet">
<style>body{font-family:'Inter',system-ui,sans-serif}</style>
</head><body class="flex items-center justify-center min-h-screen bg-[#f5f3ff]">
<div class="text-center px-6">
<h1 class="text-8xl font-extrabold" style="color:#1e1b4b">404</h1>
<p class="mt-4 text-xl text-gray-600">Page non trouvée</p>
<a href="/" class="mt-8 inline-block px-6 py-3 rounded-xl text-white font-semibold text-sm shadow-lg" style="background:#1e1b4b">Retour à l'accueil</a>
</div></body></html>`);
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
