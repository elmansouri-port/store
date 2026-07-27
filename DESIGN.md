---
name: Rainbow by ALE
description: The Frosted Signal — enterprise trust rendered through glass, one calm purple signal, and a disciplined spectrum reserved for proof
colors:
  brand-50: "#f5f3ff"
  brand-100: "#ede9fe"
  brand-200: "#ddd6fe"
  brand-300: "#c4b5fd"
  brand-400: "#a78bfa"
  brand-500: "#5e2d91"
  brand-600: "#4a2373"
  brand-700: "#3c1c5e"
  brand-vibrant: "#7c3aed"
  brand-purpleLight: "#7c3aad"
  navy-900: "#1e1b4b"
  navy-800: "#312e81"
  navy-700: "#3730a3"
  dark-deepest: "#0f0b2e"
  dark-cta-text: "#170926"
  laurenn-orange: "#FF4500"
  laurenn-pink: "#CF0072"
  laurenn-blue: "#0085CA"
  laurenn-green: "#34B233"
  gray-900: "#111827"
  gray-700: "#374151"
  gray-600: "#4b5563"
  gray-500: "#6b7280"
  gray-400: "#9ca3af"
  gray-300: "#d1d5db"
  gray-200: "#e5e7eb"
  gray-100: "#f3f4f6"
  success: "#10b981"
  error: "#ef4444"
  warning: "#f59e0b"
  info: "#3b82f6"
typography:
  display:
    fontFamily: "Google Sans, system-ui, sans-serif"
    fontSize: "3.25rem"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Google Sans, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Google Sans, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Google Sans, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Google Sans, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.5
    letterSpacing: "0.12em"
rounded:
  sm: "4px"
  md: "8px"
  btn: "10px"
  lg: "12px"
  xl: "16px"
  2xl: "20px"
  3xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  section-sm: "80px"
  section-lg: "112px"
components:
  button-primary:
    backgroundColor: "{colors.brand-500}"
    textColor: "#ffffff"
    rounded: "{rounded.btn}"
    padding: "10px 20px"
  button-primary-hover:
    backgroundColor: "{colors.brand-600}"
    textColor: "#ffffff"
    rounded: "{rounded.btn}"
    padding: "10px 20px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.gray-900}"
    rounded: "{rounded.btn}"
    padding: "10px 20px"
  badge-chip:
    backgroundColor: "{colors.brand-50}"
    textColor: "{colors.brand-500}"
    rounded: "{rounded.full}"
    padding: "6px 16px"
---

# Design System: Rainbow by ALE

## Overview

**Creative North Star: "The Frosted Signal"**

Rainbow's site renders enterprise trust through glass. Every primary surface — navigation, feature cards, testimonials, form inputs — sits behind frosted, blurred glassmorphism: white at 70-75% opacity, backdrop-blur, and a hairline border tinted with the brand purple rather than plain black. Behind that glass, soft radial blobs of purple and indigo drift in the negative space; they are ambient signal, not noise. One steady identity color (`brand-500`, `#5e2d91`) carries every moment that says "this is Rainbow" — logo, primary buttons, section badges, the hero word-shuffler. A second, more vibrant purple (`brand-vibrant`, `#7c3aed`) never competes with it; it is reserved for glass borders, glow shadows, and interactive accent states. A four-color "laurenn" spectrum (orange, pink, blue, green) is rationed even further: it shows up only as deliberate proof — certification badges, status pills, category tags — never as decoration. This restraint is the point: the product's real differentiator is compliance and sovereignty, and a system that spent its color budget freely would undercut that seriousness. Motion follows one signature spring curve everywhere it appears, so the whole surface feels like a single calm, confident signal rather than a collection of components.

Two inconsistencies exist in the live codebase and are already resolved by this system, not left open: `#5e2d91` is the only brand identity purple (`#7c3aed` is accent-only, never logo/primary-button/link color), and `.faq-card` is the canonical FAQ component (`.faq-item` is legacy and should not be extended). Radius values currently mix Tailwind utilities with raw pixel CSS; treat the scale in **Shapes** below as the target to converge on, not two coexisting systems.

**Key Characteristics:**
- Frosted glass surfaces (blur + low-opacity white + purple-tinted hairline border) over ambient radial-gradient blobs
- One identity purple (`#5e2d91`); a second vibrant purple for glow/border accents only; a 4-color spectrum rationed to proof moments
- Tight letter-spacing (`-0.03em` to `-0.02em`) on every display/headline/title size
- One spring easing curve (`cubic-bezier(.16,1,.3,1)`) governs all interactive motion; `linear` is reserved for ambient/infinite loops
- Purple-tinted shadows (`rgba(124,58,237,…)`), never pure black, on any elevated surface

## Colors

The palette reads as calm and singular at the identity layer, then opens up briefly and deliberately for proof.

### Primary
- **Signal Purple** (`#5e2d91` / brand.500): the one true brand color. Logo, primary buttons, section badges, hero word animation, active nav/lang-switcher states, focus-ring core.

### Secondary
- **Vibrant Accent** (`#7c3aed` / brand.vibrant): glass-card borders, glow/box-shadow accents, gradient-text end stops, hover glows. Never used for logo, primary buttons, or body links — that boundary is deliberate, not a gap.
- **Navy Ink** (`#1e1b4b` / navy.900): the dark alternate to Signal Purple on pricing-card CTAs, footer gradient base, and dark-surface headings where full-saturation purple would be too loud.

### Tertiary — Laurenn Spectrum (proof only)
- **Signal Orange** (`#FF4500`), **Signal Pink** (`#CF0072`), **Signal Blue** (`#0085CA`), **Signal Green** (`#34B233`): reserved for certification badges, status pills ("Beta", "Active", "Complet"), and category tags. **The Proof-Only Rule.** The spectrum appears exactly where the product is making a factual claim (certified, active, this category) — never as generic decoration or a section accent.

### Neutral
- **Ink** (`#111827` / gray.900) — primary body headings on light surfaces.
- **Slate** (`#374151`–`#4b5563` / gray.700–600) — body copy, secondary labels.
- **Mist** (`#6b7280`–`#9ca3af` / gray.500–400) — supporting copy, captions, placeholder text.
- **Paper** (`#e5e7eb`–`#f3f4f6` / gray.200–100) — borders, dividers, resting surfaces.
- **Deep Field** (`#0f0b2e` → `#1e1b4b` / dark.deepest → navy.900): the dark gradient behind stats bands and the mega-footer.

### Named Rules
**The One Purple Rule.** `#5e2d91` is the only color allowed to say "this is Rainbow." `#7c3aed` is expressive, not identifying — it can glow and outline, but it may never appear on a logo, a primary CTA fill, or a text link.

## Typography

**Display/Body Font:** Google Sans (system-ui, sans-serif fallback) — the sole typeface across the entire system; weights 400/500/700/800 are loaded.

**Character:** Confident and tight. Every display/headline/title size carries negative letter-spacing (`-0.03em` down to `-0.02em`), which is what makes headings read as premium rather than default-Tailwind. Body copy relaxes to normal tracking and a generous 1.65 line-height so density never fights legibility.

### Hierarchy
- **Display** (800, 3.25rem, lh 1.15, ls -0.03em): hero headlines, "Start for free today"-class statements.
- **Headline** (800, 2.75rem–2rem, lh 1.15–1.2, ls -0.03em): page-level H1/H2 — product names, section titles like "Simple, transparent pricing."
- **Title** (700, 1.5rem, lh 1.3, ls -0.02em): card/plan titles ("Professional Plan").
- **Body Large** (400, 1.0625rem, lh 1.65): lead paragraphs under a hero or section headline.
- **Body** (400, 0.9375rem, lh 1.65, color gray.600): default paragraph copy, max ~480px measure in cards.
- **Small** (400, 0.875rem, lh 1.6, color gray.500): card helper text, form hints.
- **Caption** (500, 0.8125rem, lh 1.5, color gray.400): nav items, dropdown labels.
- **Label** (700, 0.6875rem, ls +0.12em, uppercase, color gray.400): section eyebrows, category tags.

### Named Rules
**The Tight Tracking Rule.** Every size at Title and above uses negative letter-spacing. A heading set at default tracking reads as an unfinished draft in this system, not a neutral choice.

## Layout

Tailwind's 4px base grid. Container widths step from `max-w-lg` (512px, auth pages) through `max-w-4xl` (896px, narrow content) to the default `max-w-6xl` (1152px, nav and most sections) up to `max-w-7xl` (1280px, wide comparison/expand layouts). Default horizontal page padding is `px-6` (24px).

Section vertical rhythm is consistently generous: `py-20` (80px) to `py-28` (112px) between major sections — this spacing *is* the brand's sense of calm; compressing it reads as cramped rather than efficient. Responsive steps mostly jump mobile → `md:`/`lg:`, with `sm:` (640px) breakpoints used sparingly — new grids should add an explicit `sm:` step rather than following that gap.

Pricing and comparison layouts use a fixed 3-column grid with the center (recommended) option visually promoted via a subtle background wash and inset shadow rather than a change in column width.

## Elevation & Depth

This is a layered-glass system, not a flat one and not a hard-shadow one. Depth comes from three techniques used together: `backdrop-filter: blur()` on translucent white surfaces, purple-tinted (never black) box-shadows, and soft radial-gradient blobs sitting behind content. Depth signals *proximity to the glass*, not stacking order in the z-axis sense.

### Shadow Vocabulary
- **shadow-xs** (`0 1px 6px rgba(0,0,0,.05)`): resting form inputs — the one place a neutral (non-purple) shadow is correct, since inputs sit on plain white.
- **shadow-sm** (`0 4px 16px rgba(124,58,237,.04)`): FAQ hover, lang dropdown.
- **glass-card** (`0 8px 32px rgba(0,0,0,.03), inset 0 1px 0 rgba(255,255,255,.6)`): the default glassmorphism card shadow — outer diffusion plus an inset highlight that reads as a light catching the top edge of glass.
- **shadow-md** (`0 20px 40px rgba(124,58,237,.08)`): `hover-lift` raised state.
- **shadow-lg** (`0 32px 64px rgba(124,58,237,.08)`): product-card hover, the deepest lift in the system.
- **shadow-glow** (`0 4px 20px rgba(124,58,237,.25)`, pulsing to `0 8px 36px`): primary CTA button ambient glow (`glowPulse`, 3s).

### Named Rules
**The Purple Shadow Rule.** Every elevated surface tints its shadow with `rgba(124,58,237,…)`. Pure black shadows on this palette's purple/indigo surfaces read as muddy — the tint is what keeps a shadow feeling like *this system's* shadow rather than a generic default.

## Shapes

Radius scales from a tight 4px (fine details) up to a soft 24px (banners), plus `rounded-full` for pills. Converge new work on this scale: `sm` 4px, `md` 8px (card-inner content), `btn` 10px (all buttons), `xl`/12px is being retired in favor of the button scale above but stays valid for legacy CTA-adjacent boxes, `2xl`/16px (product cards), `20px` (stat cards, compliance flip-cards), `24px` (CTA banners, the `sp-preview` wrapper), and `9999px`/full (badges, pills, lang switcher, scrollbar thumbs, toggle switches).

Borders are hairline (1px) and low-contrast: `rgba(124,58,237,.06)` on glass surfaces, `#e5e7eb` on plain white cards, dashed `#e5e7eb` as internal dividers inside pricing-card columns. Corners are soft everywhere; there is no sharp-cornered surface anywhere in the system — a hard 0px radius would read as off-brand.

## Components

### Buttons
Two systems exist in the live codebase; the **Tailwind inline pattern is canonical** — it is what every navbar, hero, and footer CTA actually ships with. The legacy `.btn-cta-primary`/`.btn-cta-secondary` classes are used on a single page and are sunsetting; do not extend them in new work.
- **Shape:** `rounded-btn` (10px) for standard buttons; 14px for large hero/footer-band CTAs.
- **Primary:** `bg-brand-500` (`#5e2d91`), white text, `font-semibold`, `shadow-md` resting → `shadow-lg` hover.
- **Secondary:** `border-2 border-gray-200`, `text-gray-900`, `hover:bg-gray-50` — no fill.
- **Disabled:** primary fill at 40% opacity, `cursor: not-allowed`.
- **Pricing-card CTAs:** a distinct sub-pattern — filled navy (`#1e1b4b`) for the highlighted/Pro plan, outlined navy for the entry plan, plain bordered gray for the "contact sales" tier.

### Badges & Pills
- **Section header badges** (e.g. "Enterprise Security", "Clients & Success Stories"): pill-shaped, brand-tinted background, inline icon + label.
- **Inline chips:** `background: brand-50, text: brand-500, border: brand-200` for the neutral case; swap to the matching laurenn-spectrum color (pink/blue/green) only when the chip states a real status (Beta, Active, Complet).

### Cards
Five distinct types, each with its own surface treatment — don't collapse them into one generic `.card`:
- **Glass Card:** `rgba(255,255,255,.7)` + blur(16px) + `rgba(124,58,237,.06)` border. Trust signals, feature highlights, testimonials.
- **Stat Card:** dark-surface variant — `rgba(255,255,255,.06)` + blur(12px) + `rgba(255,255,255,.08)` border, 20px radius. Used only inside the dark stats band.
- **Product Range Card:** image top (flat brand-50 fill + emoji/icon), tag row, title, subtitle below.
- **FAQ Card** (`.faq-card`, canonical): bordered box, active state gets a `brand-500` border, chevron rotates 180° on open, answer height-animates. Do not build new FAQs on the legacy `.faq-item`.
- **Pricing Card:** 3-column grid, dashed internal dividers, the center/recommended column gets a `brand-50→white` gradient wash plus an inset top highlight and a "Populaire"-style ribbon.

### Inputs / Fields
- **Style:** 1px `#e5e7eb` border, white background, 10px radius (`glass-input`).
- **Focus:** border shifts to `#7c3aed`, plus a `0 0 0 3px rgba(124,58,237,.12)` focus ring — a glow, not a hard outline.

### Navigation
Frosted glass navbar, fixed top, 64px height (`glass-nav`): `rgba(255,255,255,.75)` + `blur(20px) saturate(180%)` + a hairline purple-tinted bottom border. Adds a scroll-triggered shadow (`.scrolled`) once the page moves. Desktop uses a mega-menu on hover; mobile collapses to an accordion. Dropdown chevrons rotate 180° on open using the signature spring easing.

### Toggle Switch (billing period)
An iOS-style checkbox switch — visually and semantically distinct from Pill Tabs (below); don't substitute one for the other. `w-14 h-7` track, `bg-gray-200` resting → `bg-brand-500` checked, white thumb slides via `peer-checked:after:translate-x-full`.

### Pill Tabs (use-case switcher)
A sliding pill background over a track, for switching between product use-cases (e.g. Messagerie/Visio) — not for binary on/off state, which is the Toggle Switch's job. Slider transitions `left`/`width` on the signature spring curve.

### Signature Component — Trust Marquee
Infinite horizontal logo scroll with a soft edge-fade mask (`mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent)`), 30s `linear` loop (the one sanctioned use of linear easing, since it's ambient, not interactive).

## Do's and Don'ts

### Do:
- **Do** use the signature spring, `cubic-bezier(.16, 1, .3, 1)`, for every hover, expand, and slide transition.
- **Do** tint every elevated surface's shadow with `rgba(124,58,237,…)` rather than black.
- **Do** apply `-0.03em` to `-0.02em` letter-spacing on every Title-and-above heading.
- **Do** use `#5e2d91` for anything that identifies the brand: logo, primary buttons, active states, section badges.
- **Do** reserve the laurenn spectrum (orange/pink/blue/green) for moments that state a real fact — a certification, a status, a category — never as a section accent chosen for variety.
- **Do** build new FAQ UI on `.faq-card`, and new buttons on the Tailwind `rounded-btn bg-brand-500` inline pattern.

### Don't:
- **Don't** use `#7c3aed` (brand.vibrant) as a brand-identifying color — logo, primary button fill, or body link. It's for glass borders, glows, and accent states only.
- **Don't** mix `ease-in-out`/default easing into interactive transitions — reserve `linear` strictly for ambient/infinite loops (marquee, glow pulse, float).
- **Don't** add a blob, gradient wash, or shine effect that isn't doing compositional work; if removing a decorative element makes the section read more clearly, remove it.
- **Don't** extend `.faq-item` or `.btn-cta-primary`/`.btn-cta-secondary` in new work — both are legacy, kept only for the one page that still uses them.
- **Don't** introduce a hard 0px corner anywhere; every surface in this system is soft-cornered, down to 4px at minimum.
