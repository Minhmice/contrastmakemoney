# 003 — Animate space location tab accordion and map label swap

- **Status**: DONE
- **Commit**: 5c58a56
- **Severity**: MEDIUM
- **Category**: Missed opportunities · Physicality & origin · Accessibility
- **Estimated scope**: 2 files (~80 lines changed)

## Problem

On `/space`, choosing a cơ sở tab (`#space-location-0`, etc.) is the main interactive moment in the locations block. Today it feels flat and abrupt:

1. **Detail panel teleports** — `.space-location__detail` toggles `display: none` → `display: grid` with no bridge. Address, phone, and note snap in/out while the user is comparing branches.

```css
/* src/app/globals.css:5678-5686 — current */
.space-location__detail {
  display: none;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 11px 18px;
}
.space-location[data-active] .space-location__detail {
  display: grid;
  padding: 0 0 24px 58px;
}
```

2. **Tab state snaps** — active color flips instantly; the tab button has `:active { transform: scale(0.97) }` but no `transition` on the button itself (only the child `svg` transitions). Menu tabs in the same codebase already transition `color` smoothly.

```css
/* src/app/globals.css:5646-5674 — current */
.space-location button {
  /* … */
  color: var(--ink);
  /* no transition */
}
.space-location[data-active] button {
  color: var(--red-dark);
}
```

3. **Map footer label snaps** — while the iframe loader covers the map, `.space-locations__map-info` text updates instantly when `activeLocation` changes. The GSAP panel fade only runs after `isMapLoading` clears, so the name/address jump is visible immediately.

```tsx
/* src/legacy-pages/SpacePage.tsx:139 — current */
<div className="space-locations__map-info"><strong>CONTRAST COFFEE {location.name}</strong><span>{location.address}</span></div>
```

**Frequency**: Occasional (user picks among 3 locations once per visit). Motion is warranted.

**Do not change**: existing GSAP scroll entrances (`SpacePage.tsx:76-90`), hero timeline, or the post-load map panel GSAP (`SpacePage.tsx:100-107`). Those already work.

## Target

A cohesive tab-switch moment: accordion detail eases open/closed, tab label/color/press feel crisp, map footer label fades in on swap. All values use repo tokens.

| Element | Duration | Curve | Properties |
| --- | --- | --- | --- |
| Accordion open/close | 280ms rows, 220ms opacity | `var(--ease-out)` | `grid-template-rows`, `opacity` only |
| Tab color | 180ms | `var(--ease-out)` | `color` |
| Tab press | 160ms | `var(--ease-out)` | `transform` (`scale(0.97)` on `:active`, existing rule) |
| Map info enter | 220ms | `var(--ease-out)` | `opacity`, `transform: translateY(4px)` → `0` |
| Reduced motion | 120ms or instant | `var(--ease-out)` | `opacity` only; no `translateY`, no row animation |

Easing token (already in repo):

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
```

### Markup target (`SpacePage.tsx`)

```tsx
<div className="space-location__detail">
  <div className="space-location__detail-inner">
    <p>{item.note}</p>
    <address>…</address>
    …
  </div>
</div>

<div className="space-locations__map-info">
  <div className="space-locations__map-info-inner" key={location.embedUrl}>
    <strong>CONTRAST COFFEE {location.name}</strong>
    <span>{location.address}</span>
  </div>
</div>
```

### CSS target (accordion + tab + map info)

```css
.space-location button {
  transition:
    color 180ms var(--ease-out),
    transform 160ms var(--ease-out);
}

.space-location__detail {
  display: grid;
  grid-template-rows: 0fr;
  opacity: 0;
  padding: 0;
  transition:
    grid-template-rows 280ms var(--ease-out),
    opacity 220ms var(--ease-out);
}

.space-location[data-active] .space-location__detail {
  grid-template-rows: 1fr;
  opacity: 1;
  padding: 0 0 24px 58px;
}

.space-location__detail-inner {
  overflow: hidden;
  min-height: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 11px 18px;
}

.space-locations__map-info-inner {
  display: grid;
  gap: 5px;
  animation: space-map-info-enter 220ms var(--ease-out) both;
}

@keyframes space-map-info-enter {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .space-location__detail {
    transition: opacity 120ms var(--ease-out) !important;
  }
  .space-location[data-active] .space-location__detail {
    grid-template-rows: 1fr; /* no animated collapse — instant height */
  }
  .space-location:not([data-active]) .space-location__detail {
    grid-template-rows: 0fr;
  }
  @keyframes space-map-info-enter {
    from { opacity: 0; }
    to { opacity: 1; }
  }
}
```

Move existing `.space-location__detail p`, `address`, `a`, and `> a:last-child` selectors to target `.space-location__detail-inner` children instead of `.space-location__detail` direct children (same rules, updated selector prefix).

Update mobile override at `globals.css:5811` from `.space-location[data-active] .space-location__detail { padding-left: 0; }` to `.space-location[data-active] .space-location__detail { padding-left: 0; }` (unchanged selector; still applies to outer shell).

## Repo conventions to follow

- **Easing**: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` in `src/app/globals.css:3092`. GSAP uses the same curve as `contrast-out` (`SpacePage.tsx:13`).
- **Tab color transition exemplar**: `.menu-tabs button` at `globals.css:5218-5220` — `transition: background-color 180ms var(--ease-out), color 180ms var(--ease-out)`.
- **Press feedback exemplar**: `.space-location button:active` at `globals.css:5758-5760` — `transform: scale(0.97)`; pair with `160ms var(--ease-out)` on the same element.
- **Reduced motion on space page**: block at `globals.css:5818-5826` — currently zeroes all transitions. Extend it for the new rules above; do not remove the loader `animation: none` rule.
- **CSS source of truth**: all styles stay in `src/app/globals.css` per `AGENTS.md`.

## Steps

1. **`src/legacy-pages/SpacePage.tsx:144`** — Wrap detail content in `<div className="space-location__detail-inner">…</div>` inside each `.space-location__detail`. Do not change keys, handlers, or ARIA.

2. **`src/legacy-pages/SpacePage.tsx:139`** — Replace bare `strong`/`span` with:
   ```tsx
   <div className="space-locations__map-info-inner" key={location.embedUrl}>
     <strong>CONTRAST COFFEE {location.name}</strong>
     <span>{location.address}</span>
   </div>
   ```
   `key={location.embedUrl}` forces remount on location change so the enter animation runs.

3. **`src/app/globals.css`** — On `.space-location button` (~5646), add:
   ```css
   transition:
     color 180ms var(--ease-out),
     transform 160ms var(--ease-out);
   ```

4. **`src/app/globals.css`** — Replace `.space-location__detail` / `[data-active] .space-location__detail` block (~5678-5686) with the accordion rules in **Target** (grid-template-rows `0fr`/`1fr`, opacity, padding only when active). Remove `display: none` / `display: grid` toggle entirely.

5. **`src/app/globals.css`** — Add `.space-location__detail-inner` with `overflow: hidden; min-height: 0; display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 11px 18px;`.

6. **`src/app/globals.css`** — Retarget selectors:
   - `.space-location__detail p` → `.space-location__detail-inner p`
   - `.space-location__detail address, .space-location__detail a` → `.space-location__detail-inner address, .space-location__detail-inner a`
   - `.space-location__detail > a:last-child` → `.space-location__detail-inner > a:last-child`
   - Mobile `grid-column` override (~5814) → `.space-location__detail-inner > a:last-child`

7. **`src/app/globals.css`** — After `.space-locations__map-info span` (~5631), add `.space-locations__map-info-inner` and `@keyframes space-map-info-enter` from **Target**. Remove `gap` from `.space-locations__map-info` if duplicated on inner (keep `gap: 5px` on inner only).

8. **`src/app/globals.css:5818-5826`** — Inside the existing `@media (prefers-reduced-motion: reduce)` block for `.space-page`, append the reduced-motion accordion and keyframe overrides from **Target**. Keep `transition-duration: 0ms !important` on `.space-page *` but let the more specific `.space-location__detail` rule use `opacity 120ms !important` so open state remains legible.

## Boundaries

- Do NOT touch GSAP timelines in `SpacePage.tsx` (hero, scroll, map panel).
- Do NOT add npm dependencies (no Framer Motion, no new GSAP plugins).
- Do NOT animate `width`, `height`, `margin`, or `display`.
- Do NOT add stagger, bounce, or elastic easing.
- Do NOT change copy, location data, map iframe logic, or `chooseLocation` behavior.
- If line numbers drift from commit `5c58a56`, locate rules by class name; if structure differs materially, STOP and report.

## Verification

- **Mechanical**:
  ```bash
  npm run lint
  npm run build
  ```
  Both must exit 0.

- **Feel check** (dev server on `/space`, scroll to “TÌM ĐÚNG CHỖ NGỒI”):
  1. Click **CS2 VŨ TÔNG PHAN** — detail panel below CS2 should **ease open** (~280ms); CS1 detail should **ease closed** in parallel if it was open. No pop-in.
  2. Click **CS1 TÔ HIỆU** again — reverse should feel symmetric; rapid toggling between CS1↔CS2 should **retarget smoothly** (CSS transitions, not restarting from zero).
  3. Tab label color should **fade** ink → red-dark over ~180ms; press tab and release — button should **scale to 0.97** and ease back (160ms).
  4. On each tab change, map footer **“CONTRAST COFFEE …”** should **fade up** (4px → 0, 220ms) while loader may still show on iframe.
  5. DevTools → Rendering → **Emulate prefers-reduced-motion: reduce** — accordion should open/close with **opacity only** (no visible slide); map info fade has **no vertical movement**.
  6. Test at **375px** width — accordion padding-left `0` on mobile still applies; content not clipped.
  7. DevTools Animations panel at **10% speed** — confirm accordion uses `grid-template-rows` + `opacity`, not `display` toggle.

- **Done when**: all three seams (detail accordion, tab feedback, map info enter) animate per Target; lint + build pass; reduced-motion path keeps comprehension without spatial motion.
