# Nexovia Homepage — Claude Code Implementation Brief

## What you're getting

**`nexovia-homepage-design.html`** — a single-file HTML/CSS/JS prototype exported from Claude Design. It's a working visual reference, not production code. Render it in a browser to see the motion. Then rebuild it properly.

**`nexovia-design-README.md`** — the original handoff README from Claude Design.

This brief is the source of truth for what to keep, what to fix, and how to structure the production build.

---

## Tech stack target

- **Next.js 14+ (App Router)** with TypeScript
- **Tailwind CSS** for styling (with the Nexovia palette as theme tokens)
- **Framer Motion** for component-level animations and shared layouts
- **GSAP + ScrollTrigger** for pinned scroll scenes (orbit, SA carousel, protocol wipes)
- **Component-per-section** structure — do NOT replicate the 2200-line single file

---

## Locked design tokens (use these exactly — extend `tailwind.config.ts`)

```ts
colors: {
  burgundy: '#732C3F',
  'burgundy-deep': '#5A1F2E',
  'burgundy-rich': '#8A3349',
  'dusty-rose': '#C57C8A',
  'pale-pink': '#F7E8EC',
  gold: '#EDC967',
  'near-black': '#1A0B12',
}
fontFamily: {
  serif: ['"GFS Didot"', 'Georgia', 'serif'],
  sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
}
```

GFS Didot is loaded via Google Fonts. The wordmark is always **"Nexovia"** — initial cap, GFS Didot, upright roman, never italic, never all-caps.

---

## Page structure (recreate exactly)

| # | Component | What it does |
|---|---|---|
| 1 | `<Nav />` | Fixed top nav, blurred backdrop on burgundy, gold wordmark, 4 links + CTA |
| 2 | `<ScrollProgress />` | Fixed left side, vertical gold progress fill |
| 3 | `<OrbitSection />` | **Pinned** stage, 4 panels (Hero, Problem, Synergy, ABA.4), bottle stays centered while text orbits in from different directions, 3D rotation on bottle per panel |
| 4 | `<SupportingArchitectureSection />` | **Pinned** floating pale-pink panel, 8 ingredient slides revealed by **vertical scroll** (slide UP from below, exit UP) |
| 5 | `<ProtocolSection />` | **Pinned** stage with 4 phase panels using `clip-path` horizontal wipes between burgundy / dusty rose / burgundy-deep / near-black backgrounds, bottom chip strip syncs to active phase |
| 6 | `<WhyNexovia />` | Standard scroll section, 3 glass feature cards + 4-stat strip on burgundy |
| 7 | `<FAQ />` | Accordion section, gradient burgundy → near-black background |
| 8 | `<Footer />` | Near-black, wordmark, links, copyright |

---

## Critical motion specs (these were fought for in the design iteration — preserve them)

### OrbitSection — the most important

- Pinned scroll over `600vh`, divided into 4 equal scroll segments.
- **The bottle is a centered absolute element. It does not scroll.** It rotates in 3D between panels.
- Bottle scene uses `perspective: 900px` on the wrapper. The image inside gets `rotateY` and `rotateX` per panel.
- Per-panel transforms (these were dialed in carefully):
  - Panel 0 (Hero): `rotateY: 8, rotateX: 2, scale: 1.00`
  - Panel 1 (Problem): `rotateY: -12, rotateX: 3, scale: 1.03`
  - Panel 2 (Synergy): `rotateY: 15, rotateX: -4, scale: 0.97, y: 10`
  - Panel 3 (ABA.4): `rotateY: -8, rotateX: -6, scale: 1.04, y: -10`
- **Bottle horizontal position shifts per panel** so it's always opposite the text:
  - Panel 0: `left: 62%` (bottle right, text left)
  - Panel 1: `left: 38%` (bottle left, text right)
  - Panel 2: `left: 62%`
  - Panel 3: `left: 62%`
- **Text panels fly in from different directions** simulating camera orbit:
  - Panel 0: text from left
  - Panel 1: text from right
  - Panel 2: text from below (background shifts to dusty rose)
  - Panel 3: text from above
- **All transitions run at `0.65s` `power2.inOut`** — bottle rotation, text fly-in, bottle horizontal shift, and stage background color must all complete in the same window so they feel like one move.
- Stage background color also crossfades per panel: `#732C3F` → `#5a1f2e` → `#C57C8A` → `#4a1525`.
- Dusty rose bloom (blurred radial) repositions per panel.
- Counter dots on right edge track active panel.
- **No grid lines on the orbit stage.** This was explicitly removed.
- **Text never overlaps the bottle.** Text block is capped at `max-width: 38%`.

### SupportingArchitectureSection — vertical scroll, NOT lateral

- Pinned over `1000vh`. 8 slides = ~125vh per slide.
- Each scroll moves to next ingredient. Outgoing slide fades and slides UP (`y: -40`). Incoming slide fades in from BELOW (`y: 60` → `y: 0`). When scrolling back, directions reverse.
- Floating panel sits centered on a pale pink ambient background that shifts gradient per ingredient.
- Header ("Formula Components / Supporting Architecture") fades out after first slide.
- Right side of each slide has its own gradient background — 8 different warm rose/pink tones already defined per `:nth-child(n)` in the CSS.
- Progress dots on right side of panel indicate active slide.

### ProtocolSection — clip-path wipes

- Pinned over `600vh`. 4 phase panels.
- Panels are absolutely positioned and stacked. Active panel has `clip-path: inset(0 0% 0 0)`. Outgoing slides off via `clip-path: inset(0 0% 0 100%)`. Incoming enters from `clip-path: inset(0 100% 0 0)`.
- Background colors: Panel 1 burgundy, Panel 2 dusty rose, Panel 3 burgundy-deep, Panel 4 near-black.
- **Panel 4 has NO background word.** Panels 1–3 have huge serif background words ("RECOVERY", "PROTOCOL", "NEXOVIA") at 5% opacity.
- Layout: `grid-template-columns: 180px 1fr 300px` — phase number left, product center, accordion right.
- **Bottom chip strip syncs to active panel.** When phase 2 is active, the chip with `data-phase="2"` and `.active` highlights gold. This was a specific bug fix — make sure the chip highlight follows scroll position, not just clicks.
- On dusty rose panel (panel 2), all text inverts: burgundy text on rose background. Use a `[data-panel="2"]` scope or similar to invert.
- Accordion: clicking expands one item via `max-height` transition.

### Other sections

- **Why Nexovia**: cards stagger in on scroll with `IntersectionObserver`. Cards lift `-4px` on hover with subtle gold glow.
- **FAQ**: standard accordion, smooth `max-height` expansion, gold `+` icon rotates 45° to `×` when open.

---

## Reduced motion

`prefers-reduced-motion: reduce` must:
- Skip all GSAP ScrollTriggers
- Stack pinned sections as static blocks
- Show all panels at once
- Disable transforms

The CSS already has `@media (prefers-reduced-motion: reduce)` killing animations. Mirror this in JS by checking `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and bailing out of GSAP setup.

---

## Responsive behavior

| Breakpoint | What changes |
|---|---|
| ≥1025px | Full cinematic experience |
| 768–1024px | Nav links hide, padding tightens, protocol grid narrows |
| <768px | Orbit bottle hidden, panels stack vertically with pin disabled, SA panel goes single-column, protocol accordion hidden, why cards single-column |

On mobile, **disable GSAP pinning** for orbit, SA, and protocol. Render each panel as a normal stacked section. Preserve fade/slide entry animations via `IntersectionObserver` or Framer Motion `whileInView`.

---

## Asset

- `Nexovia_Skin_serum.png` — the bottle. The prototype expects it at `uploads/Nexovia_Skin_serum.png`. In Next.js, drop it in `public/products/` and reference as `/products/Nexovia_Skin_serum.png` (or import it for `<Image />`).
- The bottle appears in: orbit stage (1×), all 8 SA slides, all 4 protocol panels.

---

## Suggested file structure

```
app/
  layout.tsx
  page.tsx                       // composes all sections
  globals.css                    // GFS Didot import, base reset
components/
  Nav.tsx
  ScrollProgress.tsx
  sections/
    OrbitSection.tsx             // pinned, GSAP ScrollTrigger
    SupportingArchitectureSection.tsx
    ProtocolSection.tsx
    WhyNexovia.tsx
    FAQ.tsx
  Footer.tsx
hooks/
  useReducedMotion.ts
  useGSAPScroll.ts               // wraps GSAP+ScrollTrigger lifecycle for SSR safety
lib/
  motion-config.ts               // shared easings, durations
public/
  products/
    Nexovia_Skin_serum.png
tailwind.config.ts
```

---

## SSR / Next.js gotchas

- GSAP ScrollTrigger is client-only. Wrap any component using it with `'use client'` and lazy-init inside `useEffect`.
- Use `gsap.context()` for cleanup so triggers tear down on route change / re-render.
- `dynamic(() => import('...'), { ssr: false })` for OrbitSection, SA, and Protocol if hydration mismatch is a concern.
- Don't put `window` references at module top level.

---

## Known issues in the prototype to fix during the rebuild

1. **The SA section's `1000vh` pin is too long** — feels sluggish at the end. Try `800vh` (100vh per slide).
2. **The orbit `setOrbitPanel` switch on `Math.floor(progress * 4)` causes a hard threshold** — panels jump abruptly at the boundary. Consider using GSAP timeline with `scrub` for smoother interpolation, or add a small dead zone / lerp.
3. **Bottle 3D rotation has no `transform-style: preserve-3d` on parent in some inherited contexts** — verify the perspective wrapper actually flattens correctly across all browsers.
4. **The tweaks panel** (Mood / Motion / Type) was an authoring tool — strip it from production. It's not in the file you're getting (it's in `tweaks-panel.jsx` which we're not shipping).
5. **All copy is `[Placeholder]`** — keep the placeholders in the rebuild. Final copy will be added later by the content team.
6. **The `<body style="font-family: 'GFS Didot'; background: rgb(197, 124, 138);">` inline override** was an experiment — drop it. Body should default to sans-serif on burgundy.

---

## What to do FIRST in Claude Code

1. Open `nexovia-homepage-design.html` in a browser. Scroll through the whole thing. Watch the orbit, the SA carousel, and the protocol wipes. **The motion is the spec.**
2. Set up a fresh Next.js + Tailwind + Framer Motion + GSAP project.
3. Port the design tokens to `tailwind.config.ts`.
4. Build `<Nav />` and `<Footer />` first — easiest, get the chrome right.
5. Build `<OrbitSection />` next — it's the hardest and sets the bar for everything else.
6. Build `<SupportingArchitectureSection />`.
7. Build `<ProtocolSection />`.
8. Build `<WhyNexovia />` and `<FAQ />`.
9. Add `useReducedMotion` and mobile fallbacks.

---

## What NOT to do

- Don't copy the prototype's HTML structure verbatim. Recreate the **visual output** with proper React components.
- Don't bring over the inline `<style>` block. Convert to Tailwind classes + a small `globals.css` for keyframes.
- Don't add a "Professionals" / "For Practitioners" page. Removed intentionally.
- Don't add a "Nexovia Skin Serum" product purchase section between Why Nexovia and FAQ. The order is strictly: Why Nexovia → FAQ.
- Don't add prices anywhere.
- Don't introduce blue, green, or any color outside the locked palette.
- Don't replace GFS Didot with a "similar" serif. It must be GFS Didot.
- Don't add emojis. Anywhere.
