# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Prospective business and organizational visitors across many verticals (enterprise, public sector, healthcare, education, hospitality, municipalities) who land on the site to learn what Rainbow does and decide whether to act. Their job: get informed enough to trust the platform, then convert — click through to test/trial the solution, and ultimately buy. The site is not built around one narrow persona; segment pages (teachers/trainers, managers/consultants, marketers/commerciaux, public sector/NGOs) all feed the same inform-then-convert funnel rather than running separate journeys.

## Product Purpose

Rainbow by Alcatel-Lucent Enterprise (ALE) is a cloud communication and collaboration platform (messaging, HD video conferencing, enterprise telephony, webinars). This site is its marketing/informational portal: its job is to explain the platform, establish trust, and drive visitors from awareness to trial signup to purchase. Success is measured in conversion along that funnel, not just informational completeness.

## Positioning

European sovereignty and regulatory compliance is the core mechanism a competitor like Teams, Zoom, or Slack cannot truthfully copy — evidenced by certification badges for ANSSI-CSPN (France), C5 (Germany), ENS (Spain), ISO 27001, RGPD/GDPR, and HIPAA (`images/certs/`). This is paired with unified platform breadth: messaging, video, telephony, and webinars in one product rather than several point solutions. Trust/compliance proof should be foregrounded before asking for conversion action, especially for security- and regulation-sensitive buyers (public sector, healthcare).

## Operating Context

- Multi-language site: `en`, `fr`, `es`, `it`, `de`, switched via a `lang` cookie and server-side string substitution (`data-i18n` attributes resolved against `i18n/*.json`) — not full templated SSR per locale.
- Distinct product lines with their own hero/features/pricing: Rainbow Collaboration and Rainbow Webinar, plus a combined "Tarifs" pricing page and a Products overview page.
- Supporting pages: blog, FAQ, contact (form posts to Eloqua per CSP `formAction`), partner directory (`trouver-un-partenaire`, backed by `assets/partners.json` — a real global partner network spanning many countries), and an `admin.html` CMS-style editor UI.
- `reco.md` and `CMS_PAGE_SECTIONS.md` describe a target architecture (DB-backed dynamic/hybrid pages, section-level A/B testing, JSON-LD automation, ISR revalidation) that is largely a reference spec for where this should go — the current `server.js` only serves static HTML with i18n string substitution and a stub `/api/contact` endpoint, no database or real CMS yet. Treat that gap as known and intentional, not a bug to silently "fix."
- `design_pattern.html` ("Rainbow — Brand & Design Guidelines") is the existing brand/design authority for this project.

## Capabilities and Constraints

- Real ALE product facts apply here — this is a real internal deliverable, not a disposable mockup. Do not invent or casually alter pricing, certifications, client names, or product claims.
- Currently coded pricing (Essential free, Business €9.99, Enterprise €19.99, from `index.html`'s JSON-LD) has not been confirmed as current/approved pricing — verify against the real, live-approved figures before treating it as fact or copying it elsewhere.
- Contact form (`/api/contact`) is a stub that validates required fields but does not persist or forward submissions to a real backend/CRM, despite Eloqua being reachable per CSP.
- Only one real blog post exists (`pages/blog/the-power-of-rainbow.html`); the blog is not yet a populated content library.
- Helmet CSP whitelists a fixed set of external hosts (Tailwind CDN, unpkg, Google Fonts, flagcdn, Unsplash, CARTO basemaps, YouTube, Zendesk, Eloqua) — any new external dependency needs a CSP update, which is a deliberate consent point, not a routine edit.

## Brand Commitments

Product name: **Rainbow by Alcatel-Lucent Enterprise (ALE)**. Logo assets exist (`images/rainbow-logo.png`, `images/ale-logo.png`, `images/ale_white.png`, `images/Rainbow-AL-logo-banner.webp`). A dedicated brand/design guidelines document already exists at `design_pattern.html` and is the authority for visual identity — future visual work should treat it as incumbent, not something to reinvent from scratch.

## Evidence on Hand

- Real client logos spanning public sector (municipalities in Spain/France, regional governments), healthcare (hospitals in France and Mayotte, UK hospitals), education (universities), hospitality (hotel groups), and enterprise (`images/clients/`).
- Real certification badges: ANSSI-CSPN, C5, ENS, ISO 27001, RGPD/GDPR, HIPAA (`images/certs/`).
- Real global partner directory with company name, country, HQ flag, coordinates, phone, and website (`assets/partners.json`) — used for `trouver-un-partenaire`.
- No confirmed customer testimonials, quantified case-study results, or third-party press exist yet in this repo — do not fabricate quotes, metrics, or press mentions; flag the gap instead.

## Product Principles

1. Every page serves one funnel — inform, build trust, convert to trial/click, then purchase — segment-specific content supports that funnel rather than splintering into separate journeys per audience.
2. Compliance and sovereignty evidence (certifications, EU data handling) is trust infrastructure, not decoration — it should be surfaced before or alongside conversion asks, especially for regulation-sensitive buyers.
3. One consistent platform identity spans distinct product lines (Collaboration, Webinar) and five locales without fragmenting the brand or the funnel.
4. This is a real, live-facing deliverable — factual claims (pricing, certifications, client names) must stay accurate to the actual ALE product, not just internally consistent.
5. The gap between the current static/i18n-substitution implementation and the CMS/A-B-testing architecture described in `reco.md`/`CMS_PAGE_SECTIONS.md` is known and intentional — work toward it deliberately rather than treating today's simpler implementation as broken.
