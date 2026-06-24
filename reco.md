# SaaS Frontend Architecture & Requirements

**Version:** 2.0  
**Frontend:** Angular (SSR) · **Backend:** Next.js · **Database:** MongoDB  
**Status:** Ready for implementation

---

## 1. Project Overview

A multi-language, SEO-first SaaS marketing website built on a **hybrid page model** that cleanly separates static editorial pages from database-driven content, with a third hybrid category that combines both.

Core capabilities:

- Three distinct page types: Static, Dynamic, and Hybrid — each with a clear content ownership model
- Server-Side Rendering (SSR) throughout for full search-engine readability
- Section-level A/B testing with cookie-persisted variant assignment
- Multi-language support (`/en`, `/fr`, `/de`) with correct canonical and hreflang handling
- Automatic JSON-LD generation per page type with manual override capability
- Matomo for analytics + Hotjar for UX and session recording
- Editor-friendly admin interface for managing dynamic content

---

## 2. System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                     FRONTEND                             │
│   Angular (SSR)                                          │
│   ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│   │   Static    │  │   Dynamic    │  │    Hybrid     │  │
│   │   Pages     │  │   Pages      │  │    Pages      │  │
│   │  Homepage   │  │  Blog posts  │  │  About, etc.  │  │
│   │  Products   │  │  Blog index  │  │ (static shell │  │
│   │  Pricing    │  │  Docs, etc.  │  │  + DB slots)  │  │
│   └─────────────┘  └──────┬───────┘  └──────┬────────┘  │
└──────────────────────────┬─┴─────────────────┘           │
                           │ REST API calls (server-side)
┌──────────────────────────▼───────────────────────────────┐
│                   CONTENT API                            │
│   Next.js (App Router)                                   │
│   GET  /api/blog                    (list + filters)     │
│   GET  /api/blog/:locale/:slug      (single post)        │
│   GET  /api/blog/slugs              (all slugs)          │
│   POST /api/revalidate              (ISR webhook)        │
│   POST/PUT/DELETE                   (admin-only, gated)  │
└──────────────────────────┬───────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────┐
│                    DATABASE                              │
│   MongoDB                                                │
│   Posts, translations, section blocks, SEO fields       │
└──────────────────────────┬───────────────────────────────┘
                           │
┌──────────────────────────▼───────────────────────────────┐
│                   ADMIN PANEL                            │
│   Payload CMS (self-hosted, editor UI only)              │
│   Writes to MongoDB · fires ISR webhook on publish       │
└──────────────────────────────────────────────────────────┘
```

---

## 3. Page Type Model

All pages belong to one of three types. The type determines where the content comes from, how it is updated, and whether A/B testing applies.

### 3.1 Static Pages

Content and structure are **hardcoded in the frontend codebase**. No database involvement at render time. Changes require a code deployment.

- Section composition is defined in Angular component templates
- A/B testing can be applied at the section level (see §5)
- Ad-variant entry points (`?version=`) are configured here
- Right choice for pages whose structure is owned by the dev/design team and changes infrequently
- **Examples:** Homepage, Products, Pricing, Campaign landing pages

### 3.2 Dynamic Pages

Structure is fixed (a single Angular template component). **Content is fully loaded from MongoDB** at render time. Editors control everything through the CMS.

- The page template never changes per post — only the content does
- Content is an ordered array of typed section blocks stored in the database
- New posts go live without any code change or deployment
- On-demand ISR revalidation purges the CDN cache on publish
- A special `customSection` block type allows a developer to embed a named Angular component inside an otherwise editor-managed page, without modifying the template or the schema
- **Examples:** Blog posts, Documentation articles, Changelog entries

### 3.3 Hybrid Pages

Pages with a **predictable structural skeleton** that rarely changes, but containing sections whose content should be editable without a deployment.

- **Static slots:** coded directly in the Angular template — layout, headers, CTAs owned by the dev team
- **Dynamic slots:** one or more areas that load their content from MongoDB — testimonials, feature lists, partner logos, pricing tiers
- A/B testing applies to both static and dynamic slots independently
- The split is explicit in the template — no ambiguity at runtime
- **Examples:** About page (static hero + dynamic team members from DB), Features page (static layout + dynamic feature cards)

### 3.4 Summary

| Page Type | Content Source | Update Path | A/B Eligible | Examples |
|---|---|---|---|---|
| Static | Codebase | Code deploy | Yes — section level | Homepage, Products, Pricing |
| Dynamic | MongoDB (full) | CMS publish | N/A | Blog posts, Docs |
| Hybrid | Code + MongoDB mix | Mixed | Yes — both slots | About, Features |

---

## 4. Frontend Directory Structure

```
/
├── src/app/
│   ├── [locale]/
│   │   ├── layout/                    # Root layout: locale, fonts, analytics init
│   │   ├── page/                      # Homepage — STATIC
│   │   ├── products/
│   │   │   └── page/                  # Products — STATIC
│   │   ├── pricing/
│   │   │   └── page/                  # Pricing — STATIC
│   │   ├── about/
│   │   │   └── page/                  # About — HYBRID (static shell + dynamic slots)
│   │   └── blog/
│   │       ├── page/                  # Blog index — DYNAMIC (DB-driven list)
│   │       └── [slug]/
│   │           └── page/              # Blog post — DYNAMIC (DB-driven content)
│   │
│   ├── sections/
│   │   ├── _registry.ts               # componentKey → Angular component map
│   │   ├── hero/                      # HeroA, HeroB (A/B variants)
│   │   ├── feature-grid/
│   │   ├── testimonials/
│   │   ├── pricing-table/
│   │   ├── blog-rich-text/
│   │   ├── blog-callout/
│   │   ├── blog-image-block/
│   │   └── section-renderer/          # Block _type → component dispatch
│   │
│   ├── layout/
│   │   ├── navbar/
│   │   ├── footer/
│   │   └── locale-switcher/
│   │
│   └── seo/
│       ├── json-ld/
│       └── alternate-links/
│
├── lib/
│   ├── api/                           # Typed HTTP client for the Content API
│   ├── ab/                            # Variant cookie read/write helpers
│   ├── analytics/                     # Matomo + Hotjar push helpers
│   └── seo/                           # JSON-LD generators, metadata factory
│
├── messages/
│   ├── en.json
│   ├── fr.json
│   └── de.json
│
└── middleware.ts                      # Locale detection + A/B cookie assignment
```

---

## 5. A/B Testing

A/B testing is kept lightweight. Two mechanisms are available; the developer picks whichever fits the experiment.

### 5.1 Cookie-Based Variant Assignment

A variant is assigned once per visitor at **middleware level**, before the page renders server-side. The same variant is served on every subsequent visit until the cookie expires — no visible layout shift, no hydration mismatch.

- Assignment runs in server middleware, not in client JavaScript
- Cookie TTL: 14 days, `SameSite=Lax`
- The rendered HTML always matches the assigned variant
- Implementation details (weighting, cookie naming) are left to the developer

### 5.2 URL Parameter Variants (Ad Campaigns)

A named variant is activated by a URL parameter on entry (e.g. from a paid campaign). These pages are **never indexed**.

- Variant is determined by the URL parameter value, not a cookie
- Page must emit `noindex, nofollow` when the parameter is present
- Must be excluded from sitemap and disallowed in `robots.txt`
- Session-scoped — not persisted

### 5.3 Scope

A/B testing applies at the **section level** on Static and Hybrid pages. The developer defines which sections participate in an experiment and builds the variant components. Dynamic pages do not participate — their content is fully editor-managed.

### 5.4 Analytics Reporting

Each assigned variant is pushed to Matomo as a custom dimension and to Hotjar via `identify()`. This enables filtering session recordings and conversion funnels by variant without additional tooling.

---

## 6. Content API — Next.js Backend

The Content API is a Next.js application that exposes REST endpoints. The Angular SSR frontend calls these server-side at render time. Payload CMS calls the write endpoints with authentication.

### 6.1 Public Endpoints (server-side, read-only)

```
GET  /api/blog?locale={locale}&page={n}&limit={n}&status=published
     → { posts: BlogPostSummary[], total: number, page: number }

GET  /api/blog/:locale/:slug
     → BlogPost (full content + all locale slugs for hreflang)

GET  /api/blog/slugs?locale={locale}
     → { slugs: string[] }

GET  /api/blog/:id/translations
     → { en: { slug, title }, fr: { slug, title }, de: { slug, title } }
```

### 6.2 Write Endpoints (Payload CMS only, auth-gated)

```
POST    /api/blog
PUT     /api/blog/:id
DELETE  /api/blog/:id
```

### 6.3 ISR Revalidation Endpoint

```
POST  /api/revalidate
      Header: x-revalidate-secret: {REVALIDATE_SECRET}
      Body:   { locale, slug }
```

On receive: purge the ISR cache for the post route and the blog index route. Reject requests missing the correct secret.

### 6.4 TypeScript Types

```typescript
export type Locale = 'en' | 'fr' | 'de';

export interface BlogPostSummary {
  id: string;
  slug: string;
  locale: Locale;
  title: string;
  excerpt: string;
  publishedAt: string;
  ogImageUrl?: string;
}

export interface BlogPost extends BlogPostSummary {
  content: ContentBlock[];
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;
  noIndex: boolean;
  jsonLdOverride?: object;
  replaceAutoLd: boolean;
  translations: Partial<Record<Locale, { slug: string; title: string }>>;
}

export type ContentBlock =
  | { _type: 'richTextBlock'; _key: string; html: string }
  | { _type: 'calloutBlock';  _key: string; variant: 'tip' | 'warning' | 'info'; text: string }
  | { _type: 'imageBlock';    _key: string; url: string; alt: string; caption?: string }
  | { _type: 'customSection'; _key: string; componentKey: string; props: Record<string, unknown>; label?: string };
```

---

## 7. MongoDB Data Model

### 7.1 Blog Post Document

```json
{
  "_id": "ObjectId",
  "status": "draft | published",
  "createdAt": "Date",
  "updatedAt": "Date",
  "translations": {
    "en": {
      "slug": "my-post",
      "title": "My Post",
      "excerpt": "...",
      "content": [ ...blocks ],
      "seo": {
        "seoTitle": "...",
        "seoDescription": "...",
        "ogImageUrl": "...",
        "canonicalUrl": null,
        "noIndex": false,
        "jsonLdOverride": null,
        "replaceAutoLd": false
      }
    },
    "fr": { ... },
    "de": { ... }
  }
}
```

Locales that have not yet been translated are absent from `translations` — the hreflang builder skips missing locales automatically.

### 7.2 Section Block Types

Content is an ordered array of typed blocks. Each block carries a `_type` discriminator.

| `_type` | Purpose | Required Fields |
|---|---|---|
| `richTextBlock` | Body copy, headings, links | `html` |
| `calloutBlock` | Tip / warning / info box | `variant`, `text` |
| `imageBlock` | Image with optional caption | `url`, `alt` |
| `customSection` | One-off named Angular component | `componentKey`, `props` |

Adding a new block type: (1) define the shape, (2) add a renderer case in `section-renderer`, (3) add editor support in Payload. No schema migration needed.

---

## 8. Section System

### 8.1 Principles

- Every section is a self-contained Angular component — no global state, no side effects
- Sections receive a `locale` input and handle their own string lookups
- Sections are unaware of whether they appear on a static, dynamic, or hybrid page
- A/B variant selection happens above the section — components are pure

### 8.2 Section Registry

A central registry maps string keys to Angular components. This is what allows dynamic pages to reference components by a name stored in the database.

```typescript
// sections/_registry.ts
export const sectionRegistry: Record<string, Type<any>> = {
  BlogRichText,
  BlogCallout,
  BlogImageBlock,
  InteractiveDémoQ42024,   // example custom one-off section
};
```

**Adding a custom section to a blog post:**
1. Build the Angular component under `sections/your-component/`
2. Register it in `_registry.ts` with a key string
3. In Payload, add a `customSection` block to the post and set `componentKey` to that key
4. Done — no API change, no DB migration

### 8.3 Section Renderer

The `SectionRenderer` component dispatches incoming block objects to the correct component. For unknown `componentKey` values it logs a warning and renders nothing — the page never crashes.

---

## 9. Multi-Language Architecture

### 9.1 URL Structure

```
/en/                    → Homepage EN
/fr/                    → Homepage FR
/de/blog/               → Blog index DE
/fr/blog/mon-article    → Blog post FR
```

- Locale prefix is **always present** — no ambiguous locale-less routes
- Root `/` redirects to browser-detected locale, fallback to `en`

### 9.2 Canonical & hreflang Rules

- `canonical` = the current locale's URL, never cross-locale
- `x-default` = always the EN version
- If a translation does not exist for a locale, **omit that locale's hreflang entry** — never point to another locale as a fallback
- hreflang is built server-side from the `translations` object returned by the API — one API call, no extra requests

### 9.3 Adding a New Locale

1. Add locale code to the locales config
2. Create `messages/{locale}.json` with all translation keys
3. Add the locale as an option in the Payload `locale` field
4. Update the metadata factory and hreflang helper to include the new locale
5. Update `sitemap.ts` static pages
6. In Payload, create translated versions of existing posts with the new locale slug

---

## 10. SEO Architecture

### 10.1 Metadata

Every page exports a metadata-generation function. Required fields: `title`, `description`, `canonical URL`, `alternate language links`. Pages served with the `?version=` parameter must emit `noindex, nofollow`.

### 10.2 JSON-LD — Auto Generation

| Page | Auto JSON-LD Types |
|---|---|
| Homepage | `Organization` + `WebSite` + `SiteLinksSearchBox` |
| Products | `SoftwareApplication` |
| Blog index | `Blog` |
| Blog post | `Article` + `BreadcrumbList` |

### 10.3 JSON-LD — Manual Override

Each blog post has two fields in the `seo` object:

- `jsonLdOverride` — edited via Payload's code editor. When populated, injected alongside the auto-generated JSON-LD.
- `replaceAutoLd` — boolean. When `true`, the manual JSON-LD replaces the auto-generated one entirely.

JSON-LD is always **server-rendered** — never injected via client-side JavaScript.

### 10.4 Sitemap

Covers all locales × all page types. Generated server-side. Must never include `?version=` URLs.

### 10.5 Robots

```
Disallow: /api/
Disallow: /admin/
Disallow: /*?version=*
```

---

## 11. Admin Panel — Payload CMS

Payload CMS is used **purely as an editor UI**. It does not serve any frontend pages. It connects directly to the same MongoDB instance as the Content API.

**What Payload does:**
- Provides a clean interface for editors to create and publish content
- Manages the section block array per locale
- Handles auth, roles, and media management
- Fires a webhook on publish to trigger ISR revalidation

**What Payload does NOT do:**
- Does not serve public-facing pages
- Does not replace or wrap the Content API
- Is not the API the Angular frontend calls

**Webhook on publish:**
- Trigger: `afterChange` hook on `blog-posts`, when `status` becomes `published`
- Target: `POST /api/revalidate` on the Next.js backend
- Payload: `{ locale, slug }`
- Auth: `x-revalidate-secret` header

---

## 12. Rendering Strategy

| Page | Strategy | Reason |
|---|---|---|
| Static pages (Homepage, Products…) | Full SSR | A/B cookies and `?version=` are per-request |
| Blog index | ISR — periodic revalidation | Stable list; CDN cache appropriate |
| Blog post | ISR + on-demand webhook revalidation | Stable; purges on Payload publish |
| Hybrid pages | Full SSR or ISR per slot | Developer decides per page based on content volatility |

Hard rules:
- No `useEffect` for above-the-fold or SEO-critical content
- A/B variants resolved entirely server-side — never client-injected
- All images have explicit dimensions to prevent CLS
- Third-party scripts (Matomo, Hotjar) loaded after interactive — never blocking

---

## 13. Astro CMS-Driven SSR — Implementation Notes

You are working on a CMS-driven SSR Astro codebase. Apply the following changes:

---

### 13.1 Navbar ordering

The navbar items are stored in the CMS with a user-defined order (via drag-and-drop). Currently the frontend does not respect this order. Fix the data fetch so navbar items are sorted by their saved `order` or `position` field before being passed to the Astro component. The drag-and-drop handler in the CMS must also persist the new order to the database on save.

---

### 13.2 Megamenu layout with optional zones

Each navbar item can have a megamenu. The megamenu has three zones:
- `main` — left side, always required
- `features` — right side, optional
- `footer` — bottom, optional

Rules:
- If `features` is empty/null, do not render its container. The `main` zone must expand to fill the full width.
- If `footer` is empty/null, do not render its container. No residual spacing, border, or margin should remain.
- Use flexbox so zones fill available space based on what is present.
- Corners and edges must remain visually clean in all four combinations: main only / main + features / main + footer / main + features + footer.

---

### 13.3 Global code snippet injector

Add three fields in the CMS global settings:
- `global_head_snippet`
- `global_body_snippet`
- `global_footer_snippet`

Each is a textarea accepting arbitrary HTML. In the Astro layout file (e.g. `BaseLayout.astro` or equivalent), fetch these fields from the CMS and inject them using `<Fragment set:html={...} />`:

```astro
---
const { global_head_snippet, global_body_snippet, global_footer_snippet } = await fetchGlobalSettings();
---
<html>
  <head>
    <Fragment set:html={global_head_snippet} />
  </head>
  <body>
    <Fragment set:html={global_body_snippet} />
    <slot />
    <Fragment set:html={global_footer_snippet} />
  </body>
</html>
```

`set:html` is the correct Astro way to inject raw HTML — do not use `innerHTML`, do not escape the content. The fields must accept any valid HTML including `<script>`, `<link>`, `<meta>`, `<noscript>` tags.

---

### 13.4 Per-page code snippet injector

Add three fields on each individual page entry in the CMS:
- `page_head_snippet`
- `page_body_snippet`
- `page_footer_snippet`

Fetch them in each page's `.astro` file and pass them to the layout. Inject them using `<Fragment set:html={...} />` in the same zones as global snippets, after the global ones:

```astro
---
// page file
const { page_head_snippet, page_body_snippet, page_footer_snippet } = page;
---
<BaseLayout
  pageHeadSnippet={page_head_snippet}
  pageBodySnippet={page_body_snippet}
  pageFooterSnippet={page_footer_snippet}
>
  ...
</BaseLayout>
```

```astro
---
// BaseLayout.astro
const { global_head_snippet, global_body_snippet, global_footer_snippet } = await fetchGlobalSettings();
const { pageHeadSnippet, pageBodySnippet, pageFooterSnippet } = Astro.props;
---
<head>
  <Fragment set:html={global_head_snippet} />
  <Fragment set:html={pageHeadSnippet} />
</head>
<body>
  <Fragment set:html={global_body_snippet} />
  <Fragment set:html={pageBodySnippet} />
  <slot />
  <Fragment set:html={global_footer_snippet} />
  <Fragment set:html={pageFooterSnippet} />
</body>
```

These fields will be used for: canonical tags, page-specific meta tags, and JSON-LD structured data (FAQ, Pricing, BreadcrumbList, etc.). Do not build individual CMS fields per meta tag type — the textarea approach is intentional.

---

### 13.5 OpenGraph per-page fields

Add the following optional fields to each page entry in the CMS:
- `og_title`
- `og_description`
- `og_image` (media upload)

Inject them in the `<head>` of the page as standard OG meta tags:

```astro
<meta property="og:title" content={og_title} />
<meta property="og:description" content={og_description} />
<meta property="og:image" content={og_image?.url} />
```

Rules:
- Only render a tag if the field has a value — do not output empty `content=""` attributes.
- `og_image` must expose the absolute URL of the uploaded asset.
- If any field is empty, fall back to the global default OG values defined in the CMS global settings (add `default_og_title`, `default_og_description`, `default_og_image` there as well).

---

### 13.6 Video thumbnail (optional field)

Add an optional `thumbnail` image field to every video component/block in the CMS.

Rules:
- If a thumbnail is provided, display it as a placeholder over the video until the video is fully loaded.
- If no thumbnail is provided, fall back to the current default behavior.
- This applies to all video blocks across the CMS (inline videos, hero videos, etc.).

---

### Critical requirement

All snippet fields must be injected as functional HTML using `set:html`. Never render snippet content as text. Validate by checking the SSR HTML output — tags must appear verbatim in the correct position.

---