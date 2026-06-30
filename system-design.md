# Rainbow Design System — Specification
**Version:** 1.0 · **Date:** 2026-06-19 · **Platform:** Rainbow by ALE (Static HTML / Tailwind CSS)

---

## Table of Contents

1. [Overview](#overview)
2. [Design Tokens](#design-tokens)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Motion & Animation](#motion--animation)
6. [Component Library](#component-library)
7. [Page Patterns](#page-patterns)
8. [Inconsistencies & Roadmap](#inconsistencies--roadmap)
9. [Implementation Guide](#implementation-guide)

---

## Overview

Rainbow is a B2B SaaS communication platform (webinar + collaboration) by Alcatel-Lucent Enterprise. The design system serves a marketing site targeting enterprise buyers. The visual language is **premium glassmorphism** — frosted surfaces, spring-eased motion, purple-to-indigo gradients — balanced by the legibility demands of a B2B sales funnel.

### Design Principles

| # | Principle | Practical Rule |
|---|-----------|----------------|
| 1 | Clarity over decoration | Every visual element earns its place. Gradients create depth, not noise. |
| 2 | Motion with purpose | Animate to guide attention and confirm state. Never animate for entertainment. |
| 3 | Trust through consistency | Enterprise buyers decide on perceived reliability. Inconsistency erodes confidence. |
| 4 | Accessible by default | AA contrast ratios, visible focus rings, keyboard navigation — always. |

---

## Design Tokens

### Recommended CSS Custom Properties

Add this block to the top of `/css/style.css` and reference via `var()` everywhere. This resolves the current per-page Tailwind config fragmentation.

```css
:root {
  /* Brand — primary (canonical ALE purple) */
  --color-brand-50:  #f5f3ff;
  --color-brand-100: #ede9fe;
  --color-brand-200: #ddd6fe;
  --color-brand-300: #c4b5fd;
  --color-brand-400: #a78bfa;
  --color-brand-500: #5e2d91;   /* ★ Primary — use for CTAs, logos, badges */
  --color-brand-600: #4a2373;
  --color-brand-700: #3c1c5e;

  /* Brand — vibrant variant (interactive, glass borders, glows) */
  --color-brand-vibrant: #7c3aed;
  --color-brand-vibrant-alpha-06: rgba(124,58,237,.06);
  --color-brand-vibrant-alpha-10: rgba(124,58,237,.10);
  --color-brand-vibrant-alpha-12: rgba(124,58,237,.12);
  --color-brand-vibrant-alpha-25: rgba(124,58,237,.25);

  /* Navy / dark backgrounds */
  --color-dark-deepest: #0f0b2e;
  --color-dark-mid:     #151936;
  --color-dark-heading: #170926;
  --color-navy-900:     #1e1b4b;
  --color-navy-800:     #312e81;
  --color-navy-700:     #3730a3;

  /* Accents (Laurenn palette) */
  --color-accent-orange: #FF4500;
  --color-accent-pink:   #CF0072;
  --color-accent-blue:   #0085CA;
  --color-accent-green:  #34B233;

  /* Neutrals */
  --color-gray-900: #111827;
  --color-gray-700: #374151;
  --color-gray-600: #4b5563;
  --color-gray-500: #6b7280;
  --color-gray-400: #9ca3af;
  --color-gray-300: #d1d5db;
  --color-gray-200: #e5e7eb;
  --color-gray-100: #f3f4f6;

  /* Semantic */
  --color-success: #10b981;
  --color-error:   #ef4444;
  --color-warning: #f59e0b;
  --color-info:    #3b82f6;

  /* Typography */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --tracking-tight:   -0.03em;
  --tracking-heading: -0.02em;
  --leading-tight:     1.15;
  --leading-heading:   1.2;
  --leading-body:      1.65;

  /* Border radius */
  --radius-sm:    4px;
  --radius-md:    8px;
  --radius-btn:   10px;
  --radius-card:  12px;
  --radius-lg:    16px;
  --radius-xl:    20px;
  --radius-2xl:   24px;
  --radius-full:  9999px;

  /* Easing */
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-out:    cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-linear: linear;

  /* Duration */
  --dur-fast:     0.15s;
  --dur-base:     0.2s;
  --dur-moderate: 0.3s;
  --dur-slow:     0.4s;
  --dur-xslow:    0.6s;

  /* Shadows */
  --shadow-xs:     0 1px 6px rgba(0,0,0,.05);
  --shadow-sm:     0 4px 16px rgba(124,58,237,.04);
  --shadow-glass:  0 8px 32px rgba(0,0,0,.03), inset 0 1px 0 rgba(255,255,255,.6);
  --shadow-md:     0 20px 40px rgba(124,58,237,.08);
  --shadow-lg:     0 32px 64px rgba(124,58,237,.08);
  --shadow-glow:   0 4px 20px rgba(124,58,237,.25);
  --shadow-focus:  0 0 0 3px rgba(124,58,237,.12);
}
```

### Color Usage Map

| Token | Use |
|-------|-----|
| `--color-brand-500` | Primary CTAs, logo, section badges, focus ring base |
| `--color-brand-vibrant` | Glass surface borders, glow shadows, interactive accent |
| `--color-dark-heading` (`#170926`) | H1/H2 on white backgrounds — richest dark |
| `--color-navy-900` (`#1e1b4b`) | Pricing card buttons, footer tint |
| `--color-accent-pink` | Hero badge gradient endpoint, "Complet" badge |
| `--color-accent-blue` | Stats, compliance section accent |
| `--color-accent-green` | Annual billing discount badge, success state |
| `--color-accent-orange` | Testimonial attribution mark |

---

## Typography

**Typeface:** Inter (Google Fonts) — weights 300, 400, 500, 600, 700, 800.

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

### Type Scale

| Role | Size | Weight | Letter-spacing | Line-height |
|------|------|--------|---------------|-------------|
| Display | 52px (3.25rem) | 800 | -0.03em | 1.15 |
| H1 | 44px (2.75rem) | 800 | -0.03em | 1.15 |
| H2 | 32px (2rem) | 800 | -0.03em | 1.2 |
| H3 | 24px (1.5rem) | 700 | -0.02em | 1.3 |
| H4 | 18px (1.125rem) | 700 | -0.01em | 1.4 |
| Body Large | 17px (1.0625rem) | 400 | 0 | 1.65 |
| Body | 15px (0.9375rem) | 400 | 0 | 1.65 |
| Small | 14px (0.875rem) | 400 | 0 | 1.6 |
| Caption | 13px (0.8125rem) | 500 | 0 | 1.5 |
| Label | 11px (0.6875rem) | 700 | +0.12em (uppercase) | — |

### Gradient Text

Two gradient-text utilities exist across pages:

```css
/* Purple → indigo (product features, hero accents) */
.gradient-text {
  background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Brand purple → pink (hero badge, CTA heading) */
.hero-badge-gradient {
  background: linear-gradient(135deg, #5e2d91, #CF0072);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## Spacing & Layout

### Grid

All pages use a centered container pattern with horizontal padding:

```css
.container { max-width: 1152px; margin: 0 auto; padding: 0 24px; }
/* Auth pages (login, register) */
.container-auth { max-width: 512px; margin: 0 auto; padding: 0 24px; }
```

### Section Vertical Rhythm

| Class | Value | Usage |
|-------|-------|-------|
| `py-20` | 80px | Standard section padding |
| `py-24` | 96px | Feature-dense sections |
| `py-28` | 112px | Hero sections |
| `py-32` | 128px | CTA banner |

### Spacing Base

4px grid. All spacing values are multiples of 4. Key gaps: `gap-4` (16px) within cards, `gap-6` (24px) between card columns, `gap-12`–`gap-20` (48–80px) between sections.

---

## Motion & Animation

### Easing

All interactive hover/transition animations use one single easing curve:

```css
transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);  /* spring */
```

`linear` is reserved for ambient/ambient loops (marquee, glow pulse). Never use it for interactive state changes.

### Duration Scale

```css
.duration-fast     { transition-duration: 0.15s; }  /* button hover shadow */
.duration-base     { transition-duration: 0.2s;  }  /* color changes, chevron rotate */
.duration-moderate { transition-duration: 0.3s;  }  /* glass-nav scroll, hover-lift */
.duration-slow     { transition-duration: 0.4s;  }  /* FAQ reveal, pill-tab slider */
.duration-xslow    { transition-duration: 0.6s;  }  /* scroll reveal entry */
```

### Keyframe Animations

```css
@keyframes glowPulse {
  0%, 100% { box-shadow: 0 4px 20px rgba(124,58,237,.25); }
  50%      { box-shadow: 0 4px 35px rgba(124,58,237,.45); }
}
/* Usage: animation: glowPulse 3s ease-in-out infinite — hero primary CTA only */

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to   { opacity: 1; transform: translateY(0); }
}
/* Usage: .animate-on-scroll.visible — IntersectionObserver trigger */

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%      { transform: translateY(-12px); }
}
/* Usage: animation: float 6s ease-in-out infinite — hero product screenshot */

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
/* Usage: animation: marquee 30s linear infinite — trust logo strip */

@keyframes hero_slide {
  /* Word shuffler — cycles through 4 product descriptors */
}
/* Usage: animation: hero_slide 9s ease-in-out infinite */
```

### Scroll Reveal Pattern

```javascript
// Standard IntersectionObserver setup (used on index.html, tarifs.html)
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
```

---

## Component Library

All components below are defined in `/css/style.css`. Use the class names as listed — do not re-implement with inline Tailwind.

### Buttons

#### `.btn-cta-primary`
**Use for:** Hero CTA, section CTAs, form submit buttons.

```css
.btn-cta-primary {
  display: inline-block;
  padding: 14px 28px;
  border-radius: 12px;
  background: linear-gradient(135deg, #5e2d91 0%, #7c3aed 100%);
  color: #fff;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  transition: transform var(--dur-fast) var(--ease-spring),
              box-shadow var(--dur-fast) var(--ease-spring);
  box-shadow: var(--shadow-glow);
}
.btn-cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(124,58,237,.35);
}
```

Add `.glow-pulse` class only on the single hero CTA to enable ambient glow animation.

#### `.btn-cta-secondary`
**Use for:** Secondary CTAs, "Watch Démo" links.

```css
.btn-cta-secondary {
  display: inline-block;
  padding: 14px 28px;
  border-radius: 12px;
  background: rgba(255,255,255,.9);
  border: 1.5px solid rgba(124,58,237,.15);
  color: #4a2373;
  font-weight: 700;
  font-size: 15px;
  text-decoration: none;
  transition: all var(--dur-fast) var(--ease-spring);
}
.btn-cta-secondary:hover {
  background: #fff;
  border-color: rgba(124,58,237,.3);
  box-shadow: 0 4px 16px rgba(124,58,237,.12);
}
```

#### Nav Buttons (Tailwind inline — acceptable)
```html
<!-- Login (outline) -->
<a class="px-5 py-2.5 rounded-btn border-2 border-gray-200 text-gray-900 hover:bg-gray-50 text-sm font-semibold transition-colors">Se connecter</a>

<!-- Signup (filled) -->
<a class="px-5 py-2.5 rounded-btn bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all">Essai gratuit</a>
```

### Glass Surface

The core visual primitive. All glass-style cards inherit from this formula:

```css
.glass-card {
  background: rgba(255,255,255,.7);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(124,58,237,.06);
  box-shadow: var(--shadow-glass);
}
```

**Variants:**
- `.stat-card` — dark glass (rgba white, 6%), used on dark stats background
- `.glass-nav` — 75% white, 20px blur, `saturate(180%)`, 64px height
- `.glass-input:focus-within` — border-color + box-shadow focus ring

### Form Inputs

```css
.glass-input {
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: var(--radius-btn);
  transition: border-color var(--dur-base), box-shadow var(--dur-base);
}
.glass-input:focus-within {
  border-color: var(--color-brand-vibrant);
  box-shadow: var(--shadow-focus);
}
```

Input `<input>` / `<select>` elements inside `.glass-input` must have `background: transparent; outline: none;`.

### Solution Selection Cards

Used in registration Step 1. Three-option radio-style card group.

```css
.solution-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: border-color var(--dur-base), background var(--dur-base), box-shadow var(--dur-base);
}
.solution-card:hover {
  border-color: #c4b5fd;
  background: #faf9ff;
}
.solution-card.selected {
  border-color: var(--color-brand-vibrant);
  background: #f5f3ff;
  box-shadow: 0 0 0 3px rgba(124,58,237,.10);
}
```

JavaScript contract:
- `selectSolution(value)` — updates `.selected` class, enables Continue button
- `regData.product` — stores `'webinar' | 'collaboration' | 'both'`
- `SOLUTION_LABELS` — maps value to display label for reminder banner in Step 2

### Step Indicator

```css
.step-dot { width: 10px; height: 10px; border-radius: 50%; background: #d1d5db; transition: all .3s var(--ease-spring); }
.step-dot.active { background: var(--color-brand-500); width: 28px; border-radius: 5px; }
.step-dot.done   { background: var(--color-brand-500); }
```

### Pill Tabs

```css
.pill-tab-container {
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border: 1px solid rgba(229,231,235,.6);
  border-radius: 12px;
  padding: 6px;
  gap: 2px;
}
.pill-slider {
  position: absolute;
  height: calc(100% - 12px);
  background: #f3f4f6;
  border-radius: 8px;
  transition: left .4s var(--ease-spring), width .4s var(--ease-spring);
}
.pill-tab-btn {
  position: relative;
  z-index: 1;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  cursor: pointer;
  background: transparent;
  border: none;
  transition: color var(--dur-base);
}
.pill-tab-btn.text-active   { color: #111827; font-weight: 600; }
.pill-tab-btn.text-inactive { color: #9ca3af; }
```

### FAQ Cards

**Use `.faq-card` — not `.faq-item` (deprecated).**

```html
<div class="faq-card">
  <button class="faq-card-button" onclick="toggleFaq(this)">
    <span class="faq-card-question">Question text</span>
    <svg class="faq-card-chevron">...</svg>
  </button>
  <div class="faq-card-answer-wrapper">
    <div class="faq-card-answer-inner">
      <div class="faq-card-answer-border">
        <p class="faq-card-answer">Answer text</p>
      </div>
    </div>
  </div>
</div>
```

Open state adds class `open` to `.faq-card`, sets `max-height` on `.faq-card-answer-wrapper`, and `rotate(180deg)` on `.faq-card-chevron`.

### Navigation

```html
<nav class="glass-nav" id="main-nav">
  <div class="nav-container">
    <!-- Logo | Products ▾ | Tarifs | Resources | Lang ▾ | Login | CTA -->
  </div>
</nav>
```

Scroll behavior: at `scrollY > 20`, add class `scrolled` → `box-shadow: 0 1px 12px rgba(30,27,75,.06)`.

Mega menu: `.nav-dropdown` with `opacity: 0; pointer-events: none` → `.nav-dropdown.show` via JS toggle on `mouseenter/mouseleave`.

---

## Page Patterns

### Customer Journey Flow

```
index.html → /tarifs → /register (3 steps) → /verify-email → /login → /portal
```

URL parameter context passed through:
- Pricing buttons: `/register?plan=pro&product=webinar`
- Registration pre-selects card if `?product=` param present
- `regData = { product, plan, email, password }` submitted to API

### Hero Section

**Anatomy (top → bottom):**
1. Eyebrow badge (pill, uppercase, 11px, brand.500)
2. H1 with gradient span (word shuffler animation)
3. Subtitle (body-large, gray-500, max-w prose)
4. Dual CTA row (primary + secondary)
5. Scroll indicator (animated chevron or "Voir plus")
6. Decorative blobs (absolute, pointer-events: none, z-0)

**Background:**
```css
.hero-gradient {
  background: linear-gradient(180deg, #fafafe 0%, #f5f3ff 40%, #ede9fe 70%, #fafafe 100%);
}
```

### Stats Section

Dark gradient background with radial glow overlays. Stat numbers use accent colors:
- `--color-stat-1: #d5bcf8` (purple)
- `--color-stat-2: #fdb0cc` (pink)
- `--color-stat-3: #a6c6f9` (blue)

### Pricing Cards

3-column grid. Center card (Pro/Recommended) uses:
- Background: `linear-gradient(180deg, rgba(245,243,255,.4), #fff)`
- Inset shadow: `inset 0 1px 0 0 rgba(124,58,237,.08)`
- "Populaire" badge top-center
- Filled button (navy bg)

Free: outline button. Enterprise: subtle 1px outline button.

Billing toggle (monthly/yearly) uses the `.pill-tab-container` pattern. Annual prices should update via JS on toggle — do not use separate pricing pages.

### CTA Banner

```css
.sp-cta-banner {
  border-radius: 24px;
  background-image:
    radial-gradient(ellipse 100% 100% at 0% 0%, rgba(190,150,240,.35) 0%, transparent 70%),
    radial-gradient(ellipse 100% 100% at 100% 100%, rgba(210,110,200,.32) 0%, transparent 70%);
  padding: 64px 40px;
}
```

Content center-aligned. Always include: heading → sub → dual CTA → "no credit card" footnote.

### Trust Marquee

```css
.marquee-container {
  overflow: hidden;
  mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
}
.animate-marquee { animation: marquee 30s linear infinite; }
```

**Implementation:** Duplicate the logo list twice inside the container div to create a seamless infinite loop.

### Footer

5-column grid on desktop (2 + 1 + 1 + 1 + 1), collapsing to stacked on mobile. Same dark gradient as stats. Link columns have uppercase label + 1.8 line-height list.

Legal row: border-top `rgba(255,255,255,.08)`, split flex row with copyright left and links right.

---

## Inconsistencies & Roadmap

### P0 — Critical (fix immediately)

**1. Dual brand purple**

Two purples compete for brand.500:
- `#5e2d91` — defined in `index.html` Tailwind config, used in `btn-cta-primary` gradient, nav CTA, and `style.css` component CSS
- `#7c3aed` — used in `tarifs.html`/`signup.html` Tailwind config, glass borders, glow shadows

**Fix:** Standardize all Tailwind configs to:
```js
brand: {
  500: '#5e2d91',   // canonical
  vibrant: '#7c3aed'  // interactive accent only
}
```
Update all pages to import the same config (or extract to a shared `tailwind.config.js` and reference via CDN `?config=`).

**2. Dual FAQ implementation**

`.faq-item` (older) and `.faq-card` (current Laurenn style) both exist in `style.css`. Pages inconsistently use one or the other.

**Fix:** Audit all FAQ instances across pages. Migrate to `.faq-card` everywhere. Remove `.faq-item` from `style.css`.

### P1 — High (fix in next sprint)

**3. Two button systems**

`.btn-cta-primary` (12px radius, gradient) vs Tailwind inline buttons (`rounded-btn` = 10px, flat or bg-brand-500). Both appear within 200px of each other on some pages.

**Fix:** Use `.btn-cta-primary` / `.btn-cta-secondary` everywhere except the topnav (where Tailwind inline is acceptable for compactness).

**4. Border radius fragmentation**

Raw CSS uses 20px and 24px with no token reference. Tailwind rounded-* used inconsistently. This produces different radius jumps depending on which file owns the component.

**Fix:** Map to `--radius-*` token set. Replace all `border-radius: 20px` with `var(--radius-xl)`, `24px` with `var(--radius-2xl)`.

**5. No CSS custom properties**

All design tokens live scattered in per-page Tailwind config inline scripts. No single source of truth. Changing the brand purple requires editing every `<script>tailwind.config = {...}</script>` block.

**Fix:** Extract tokens to `:root {}` in `style.css`. Update all pages to consume via CSS variables. This also makes dark mode feasible.

### P2 — Medium (next quarter)

**6. SVG icon system**

All icons are hardcoded inline. No consistent size or stroke-width standard.
- Recommend: SVG sprite at `/assets/icons.svg` or a small JS icon registry
- Standardize: `width="20" height="20" stroke-width="1.75"` as defaults

**7. Missing sm: breakpoints**

Most grids jump directly from mobile (stacked) to md:/lg: (grid). The 640–768px tablet range is unstyled, causing jarring layout breaks.

**Fix:** Add `sm:grid-cols-2` on all 3-4 column grids that currently use `grid-cols-1 lg:grid-cols-3`.

**8. Docs/ sync is manual**

The `docs/` folder (GitHub Pages output) is manually synced via cp commands. Any edit to `pages/` requires a corresponding edit to `docs/`.

**Fix:** Add a simple build script (Node.js or shell) that copies all `pages/*.html` → `docs/*/index.html` and `index.html` → `docs/index.html`.

---

## Implementation Guide

### Adding a New Page

1. Copy `pages/signup.html` as your base (it has the most up-to-date Tailwind config and glass patterns)
2. Update the Tailwind config block — use `#5e2d91` for `brand.500`
3. Link `/css/style.css` as the first stylesheet
4. Add the page to the routing table in `docs/` with a matching `index.html` inside a named folder
5. Apply `animate-on-scroll` class to major section containers and initialize the `IntersectionObserver`

### Adding a New Component

1. Define the component in `/css/style.css` using CSS custom properties from `:root`
2. Document it in `design.html` with a live rendered example
3. Add the class name and usage notes to this document
4. Mirror the component to `docs/` if it needs interactive JS

### Routing Convention

GitHub Pages static routing via `docs/` folder:

| URL | File |
|-----|------|
| `/` | `docs/index.html` |
| `/tarifs` | `docs/tarifs/index.html` |
| `/register` | `docs/register/index.html` |
| `/login` | `docs/login/index.html` |
| `/verify-email` | `docs/verify-email/index.html` |
| `/contact` | `docs/contact/index.html` |

### Accessibility Checklist

- [ ] All interactive elements reachable via keyboard (`Tab` / `Shift+Tab`)
- [ ] Focus ring visible: `outline: 2px solid #5e2d91; outline-offset: 2px` on `:focus-visible`
- [ ] Minimum contrast 4.5:1 for body text — check gray-500 (#6b7280) on white (**marginal, may need gray-600**)
- [ ] `aria-expanded` on FAQ toggles and mega-menu buttons
- [ ] `aria-current="page"` on active nav link
- [ ] Images have meaningful `alt` attributes (decorative images use `alt=""`)
- [ ] Form inputs have associated `<label>` elements or `aria-label`
- [ ] Animated elements respect `prefers-reduced-motion`

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}
```
