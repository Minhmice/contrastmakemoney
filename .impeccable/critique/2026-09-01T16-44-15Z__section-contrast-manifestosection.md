---
target: "section#contrast ManifestoSection"
total_score: 19
p0_count: 1
p1_count: 2
timestamp: 2026-09-01T16-44-15Z
slug: section-contrast-manifestosection
---
# Critique — ManifestoSection (#contrast)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Music `aria-live` status works; no section-level "preview vs real" signal |
| 2 | Match System / Real World | 3 | Vietnamese task labels land; English READY/PLAYING and MOCK/ prefixes break café voice |
| 3 | User Control and Freedom | 2 | Todo/music feel real; scroll-away audio pause good; demo boundary unclear |
| 4 | Consistency and Standards | 2 | Two workspace CTAs; unused CSS for title/cta-copy vs current TSX |
| 5 | Error Prevention | 2 | Interactive mocks invite mis-clicks; contrast reveal hover-only on touch |
| 6 | Recognition Rather Than Recall | 2 | No h2/framing — user must infer "workspace preview" from tiles alone |
| 7 | Flexibility and Efficiency | n/a | Persuade surface |
| 8 | Aesthetic and Minimalist Design | 2 | Six competing widgets + six identical eyebrows; no narrative anchor |
| 9 | Error Recovery | 2 | Music notices at 9px uppercase — easy to miss |
| 10 | Help and Documentation | n/a | Persuade surface |
| **Total** | | **19/32** | **Good (lower band)** |

## Anti-Patterns Verdict

**LLM assessment:** Partial AI slop — not full template, but several tells. Glassmorphism on music tile (`filter: blur(10px)`), hero-metric pattern (04 streak, 25:00 pomodoro), uniform `MOCK /` eyebrows on all six tiles, ghost-card sheen (`::after` gradient on every tile). The contrast tile ("Ngoài kia xô bồ quá") is distinctly Contrast and saves the section from generic SaaS.

**Deterministic scan:** CLI on TSX returned 0 findings. Live browser scan on `#contrast` found **16 issues**: 14× `undersized-ui-text` (9px functional labels), 1× `low-contrast` (record label 4.48:1), 1× `tiny-text` (11px track title). Detector confirms the eyebrow/micro-label problem is measurable, not subjective.

## Overall Impression

Strong craft in the bento composition and contrast-tile voice, undermined by missing section framing and pervasive `MOCK /` labeling that reads as staging, not intentional preview. The section tries to sell a workspace product on a café homepage without anchoring why a student should care — six equal widgets compete instead of one dominant gesture.

## What's Working

1. **`manifesto-tile--contrast`** — Paper-on-ink hover reveal with Vietnamese copy is on-brand Controlled Contrast, not interchangeable café UI.
2. **Asymmetric bento grid** — `0.9fr / 1fr / 1fr / 1.3fr` avoids identical card-grid sameness; tall music column creates rhythm.
3. **Functional demo depth** — Real audio with scroll-gated playback, interactive todos, spinning record — shows product beyond static mockups.

## Priority Issues

### [P0] Section arrives without framing
- **What:** No `h2.manifesto__title` or body copy in TSX; CSS still defines title/CTA-copy styles unused in markup.
- **Why:** First-timers hit six widgets with no "this is Contrast Workspace" anchor.
- **Fix:** Restore one bold headline + one-line promise above `manifesto__workbench`.
- **Suggested command:** `$impeccable clarify ManifestoSection` + `$impeccable layout ManifestoSection`

### [P1] `MOCK /` eyebrows destroy credibility
- **What:** Every `manifesto-tile__topline` reads `MOCK / CHUỖI`, `MOCK / TO-DO`, etc. at 9px.
- **Why:** Signals placeholder; detector flags all 14 instances as undersized functional text.
- **Fix:** Product-native labels (`CHUỖI HỌC`, `CHECK-IN`) or one container-level "Xem trước" badge.
- **Suggested command:** `$impeccable clarify ManifestoSection`

### [P1] Interactive mocks read as real product
- **What:** Todo checkboxes, music controls, streak `04` present as live data.
- **Why:** False affordances → disappointment when `/workspace` differs.
- **Fix:** Static tiles or persistent preview disclaimer; consider disabling todo toggles.
- **Suggested command:** `$impeccable distill ManifestoSection`

### [P2] Glassmorphism on music tile
- **What:** Blurred café photo background + gradient scrim on `manifesto-tile--music`.
- **Why:** Template tell; fights sharp red/black discipline.
- **Fix:** Solid ink + cropped photo inset or duotone without blur.
- **Suggested command:** `$impeccable quieter ManifestoSection`

### [P2] Contrast CTA invisible on touch
- **What:** `manifesto-contrast__reveal` only under `@media (hover: hover)`.
- **Why:** Primary brand moment loses its action on mobile.
- **Fix:** Always show arrow + "Tới ngay Contrast" on touch, or tap-to-reveal.
- **Suggested command:** `$impeccable adapt ManifestoSection`

## Persona Red Flags

**Jordan (first-timer):** No headline on landing; `MOCK /` feels like staging; contrast tile doesn't read as button without hover; two CTAs to same `/workspace`.

**Casey (mobile):** Six-tile vertical stack is long scroll; contrast reveal hidden; music buttons 34×34px; task toggles 18×18px.

**Minh (Vietnamese student):** Todo labels resonate; wants café proof (wifi, hours, outlets) not app widgets; Billie Jean mismatches study-playlist expectation; no location/price path from this section.

## Minor Observations

- `manifesto-turntable` / `manifesto-tonearm` markup has no CSS — tonearm likely invisible.
- Duplicate workspace paths on contrast tile and `PublicActionButton`.
- English `PLAYING` / `READY` in music topline vs Vietnamese body copy.
- `manifesto__cta-copy` defined in CSS but omitted from TSX.
- Streak badge `letter-spacing: -0.08em` below -0.04em display floor.

## Questions to Consider

1. If the contrast tile is the emotional peak, why is it one of six equal citizens instead of the section hero?
2. What if `MOCK` were removed and the section sold the *feeling* of studying at Contrast?
3. Should this section prove the physical café or the digital workspace — and is six tiles the right format for either?
