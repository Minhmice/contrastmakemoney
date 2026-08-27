---
target: hero của homepage
total_score: 18
p0_count: 0
p1_count: 6
timestamp: 2026-08-27T20-09-39Z
slug: src-app-tsx-homepage-hero
---
## Design health score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of System Status | 2/4 | Location CTA scrolls, but no result confirmation or selected-location state. |
| 2 | Match System / Real World | 2/4 | Mood labels communicate attitude, not usable café facts. |
| 3 | User Control and Freedom | 3/4 | Clear controls and Escape close exist; smooth scroll remains less controllable. |
| 4 | Consistency and Standards | 2/4 | Hero CTA uses button scroll, menu uses `/menu`, other nav uses hashes. |
| 5 | Error Prevention | 1/4 | Primary action does not state its destination or expose map action. |
| 6 | Recognition Rather Than Recall | 2/4 | Users must infer where address, hours, and directions appear. |
| 7 | Flexibility and Efficiency | 2/4 | Location shortcut exists, but no direct map or nearby choice. |
| 8 | Aesthetic and Minimalist Design | 2/4 | Strong structure, but ornamental labels compete with action. |
| 9 | Error Recovery | 1/4 | No hero-level handling for unavailable or provisional location data. |
| 10 | Help and Documentation | 1/4 | No context for verified location, hours, or CTA outcome. |
| **Total** | | **18/40** | **Poor: major UX work needed** |

## Anti-pattern verdict

**Moderate AI-slop risk.** Paper, ink, red split, typography, and red-square geometry fit Contrast. Hero still stacks common brutalist landing-page signals: oversized slogan, chapter counter, rotated stamp, vertical scroll cue, focus micro-labels. Detector found no automated findings. The visual issue is not generic CSS quality; it is too much art direction before enough café proof.

## Overall impression

Memorable brand entrance. Weak first-visit orientation. Visitor understands attitude faster than offer. Single biggest opportunity: make the same red-square contrast composition identify a real place to study or work, with verified location access, instead of adding more mood text.

## What's working

- Paper/ink split gives Contrast a recognisable visual system, not generic café minimalism.
- H1 has clear dominance and direct Vietnamese campaign tone.
- Native controls, skip link, focus rule, stacked mobile composition, and no horizontal overflow are solid foundations.

## Priority issues

### [P1] Hero sells attitude before café choice

**Location:** `src/App.tsx:93-130`; hero styles `src/index.css:184-318`

**Why it matters:** Students and remote workers need to decide whether this place fits today's session. Hero gives slogan and mood, but no verified place evidence.

**Fix:** Keep H1. Add one concise verified proof line near the primary CTA, such as a confirmed location area or current hours status. Add one authentic Contrast space photo in the ink panel when available. Never invent facts.

**Suggested command:** `$impeccable clarify`, then `$impeccable polish`

### [P1] Primary CTA does not promise directions

**Location:** `src/App.tsx:115-123`

**Why it matters:** Product goal is location choice and directions. `TÌM CƠ SỞ` only scrolls, so users cannot predict the next step.

**Fix:** Use an explicit destination label such as `CHỌN CƠ SỞ` or `XEM CƠ SỞ`. Expose `MỞ BẢN ĐỒ` on each verified location. Keep menu secondary.

**Suggested command:** `$impeccable clarify`

### [P1] Hero text stack breaks the first-viewport contract

**Location:** `src/App.tsx:95-156`; `src/index.css:212-277`, `src/index.css:436-487`

**Why it matters:** Hero contains counter, label, H1, lede, two actions, side note, focus index, ink copy, stamp, and scroll cue. Decorative hierarchy competes with the primary path. This also violates the project's no-scroll-cue, no-section-number, and no-em-dash rules.

**Fix:** Remove `01 / 11`, `FOCUS MODE`, rotated stamp, and vertical scroll cue. Keep brand, H1, short lede, primary CTA, secondary menu link, and one useful proof line. Use red square as the single interruption.

**Suggested command:** `$impeccable quieter`, then `$impeccable distill`

### [P1] Hero copy must be verified as UTF-8 in source and browser

**Location:** `src/App.tsx:100-106`, `src/App.tsx:143-150`

**Why it matters:** Source review showed dash-heavy strings; browser evidence rendered Vietnamese diacritics correctly. Any editor or build encoding drift will damage comprehension and SEO. The source currently includes forbidden em-dash characters in visible hero strings.

**Fix:** Replace every visible `—` and `–` with periods, commas, or regular hyphens. Keep UTF-8 declaration and test actual browser rendering at desktop, mobile, focus, and reduced-motion states.

**Suggested command:** `$impeccable clarify`

### [P2] Mobile hero intentionally delays ink panel below first viewport

**Location:** `src/index.css:1642-1678`, `src/index.css:1809-1830`

**Why it matters:** Browser evidence measured `390 × 1072.7px` hero at `390 × 844px`. No overflow or clipped CTA, but red-square proof sits below initial mobile viewport. This delays the visual contrast gesture and any potential place evidence.

**Fix:** Keep CTA in paper panel. Treat ink panel as secondary. If it becomes proof-bearing, shorten paper panel or move only the useful proof into the first viewport. Test `320×568`, `390×844`, `768×600`, `1162×874`, and `1440×800`.

**Suggested command:** `$impeccable adapt`

### [P1] Two hero text colors fail or nearly fail WCAG AA

**Location:** `src/index.css:5-14`, `src/index.css:268-277`, `src/index.css:305-318`, `src/index.css:446-460`

**Why it matters:** Browser measurement found `#d9191f` on `#f1f0eb` at `4.48:1`, below 4.5:1. Audit also found red emphasis on ink at about `3.70:1` for text that can render below large-text threshold.

**Fix:** Use surface-specific red tokens. Darken red for paper CTA and use lighter red for normal text on ink. Recheck default, hover, focus, and textured paper.

**Suggested command:** `$impeccable colorize`

## Persona red flags

- **First-time student:** compelling slogan, no immediate hours, address area, seat/noise, outlet, or verified location evidence. Must scroll and decode CTA.
- **Remote worker on mobile:** location shortcut collapses into menu; stacked hero delays location path and proof.
- **Returning visitor in a hurry:** no direct map link or remembered location; menu has similar prominence despite location being primary.

## Minor observations

- `src/App.tsx:120` uses `/menu` while navigation uses hash anchors. Align destination semantics.
- `src/App.tsx:116` uses a button for an intra-page destination. Link semantics improve history, keyboard, and discoverability.
- `src/index.css:294-298` uses `letter-spacing: -0.075em` and `line-height: 0.86`; verify Vietnamese diacritics at heavy weight.
- `src/index.css:412-428` continuously animates signature geometry. It reads as ambient decoration unless tied to meaningful state.
- Hero has no authentic photography. Design brief says real Contrast photography should anchor atmosphere and evidence; current CSS texture is material, not place proof.

## Detector and browser evidence

- Detector command: `node .agents/skills/impeccable/scripts/detect.mjs --json src/App.tsx`
- Exit code: `0`
- Findings: `[]`
- Desktop browser: `1162×874`; hero visible; no horizontal overflow; H1, lede, actions, red square visible.
- Mobile browser: `390×844`; hero `1072.7px` tall; no horizontal overflow; CTA visible; ink panel continues below fold.
- Menu button has 44×44 target, `aria-expanded`, `aria-controls`, `aria-label`; Escape closes menu.
- Focus rule exists, but real keyboard focus ring was not conclusively proven by synthetic test.
- No application runtime exception confirmed. No user-visible overlay injected because no live overlay session was available.

## Technical audit

| Dimension | Score | Finding |
|---|---:|---|
| Accessibility | 2/4 | Semantics and focus rule present; two red contrast gaps and explicit smooth scroll ignore reduced motion. |
| Performance | 2/4 | Transform animation is sound; animated grain causes continuous repaint work. |
| Responsive Design | 4/4 | Mobile recomposition, 44px targets, no measured horizontal overflow. |
| Theming | 3/4 | Tokens mostly used; hard-coded muted grays and duplicate texture reference remain. |
| Anti-Patterns | 4/4 | Distinctive brand composition; no detector hits or generic product UI. |
| **Total** | **15/20** | **Good: fix weak dimensions before release** |

### Audit issues

- **[P1] Accessibility:** CTA red/paper `4.48:1`; ink red text about `3.70:1`. Create surface-aware accent tokens.
- **[P1] Accessibility:** `scrollIntoView({ behavior: 'smooth' })` ignores `prefers-reduced-motion`. Select `auto` when reduced motion matches.
- **[P2] Performance:** `src/noise.css:16-38,59-70` animates a large blended grain layer every 0.5s. Make texture static or disable on constrained devices.
- **[P2] Theming:** `src/index.css:436-440,461-466` hard-codes muted gray values and hero texture duplicates token.
- **[P2] Reduced motion:** `src/index.css:2025-2029` globally forces all transitions to near-zero. Scope to known motion components to preserve useful state feedback.

## Systemic issues

- One accent token is used across surfaces with different contrast needs.
- CSS reduced-motion rules do not cover explicit JavaScript smooth scrolling.
- Hero uses both tokenized and literal texture references.
- Hero does not yet provide an authentic place image or verified location proof.

## Questions to consider

- Can the red square become the verified-location entry point instead of a passive badge?
- What real Contrast photo makes “study/work café” undeniable in two seconds?
- Does visitor need counter, focus index, stamp, and scroll cue before knowing where to go?

## Run notes

- Target slug: `src-app-tsx-homepage-hero`
- Ignore list: none found
- Assessment independence: A design review, B detector/browser evidence, and technical audit ran separately
- CLI detector: completed once, exit `0`, zero findings
- Browser visibility: completed at desktop and mobile
- Overlay injection: mutation probe succeeded; Impeccable overlay unavailable, no overlay claimed
- Live server cleanup: existing Vite server was left running because it was user-owned and already active
- Temp-file cleanup: pending until write completes
