---
target: menu page
total_score: 22
max_score: 36
na_heuristics: 10
p0_count: 2
p1_count: 2
timestamp: 2026-08-29T07-01-23Z
slug: src-legacy-pages-menupage-tsx
---
# Menu page critique and audit

## Design Health Score

| # | Heuristic | Score | Key issue |
|---|---|---:|---|
| 1 | Visibility of system status | 2 | Active category works; journey progress and durable order confirmation remain weak. |
| 2 | Match system / real world | 3 | Menu imagery and pricing are natural; vertical input driving horizontal travel stays implicit. |
| 3 | User control and freedom | 2 | Close and Escape work; short viewports can hide decision controls. |
| 4 | Consistency and standards | 3 | Brand system coherent; card/detail relationship remains visually unresolved. |
| 5 | Error prevention | 3 | Pending order is disabled; detail layout can still place CTA outside usable viewport. |
| 6 | Recognition rather than recall | 3 | Category and price are visible; hidden detail affordance is weak on touch. |
| 7 | Flexibility and efficiency | 2 | Category jump exists; returning users lack fast repeat or compact browse mode. |
| 8 | Aesthetic and minimalist design | 2 | Strong editorial shell, repetitive card inventory pattern and duplicated bilingual density. |
| 9 | Error recovery | 2 | Save error names failure, but recovery path is only retry by inference. |
| 10 | Help and documentation | n/a | Experience surface does not require documentation. |
| **Total** | | **22/36** | **Needs focused structural revision** |

## Design Specificity Verdict

Authored brand shell, generic product-card core. Ink/paper/red, vertical chapter rails, horizontal canvas and category typography clearly belong to Contrast. Card internals could serve any café. Automated detector returned zero mechanical findings, which means problems are structural and experiential, not basic anti-pattern syntax.

## Overall Impression

Canvas concept worth keeping. Adaptive behavior is weakest layer. Mobile shrinks desktop composition instead of recomposing it. Card animation was decorative and has now been removed temporarily so next card redesign starts from stable static states.

## What's Working

- One continuous GSAP horizontal journey remains distinctive and technically scoped.
- Real product imagery, visible pricing, native buttons, ARIA expanded/pressed and Escape close provide solid foundation.
- Reduced-motion fallback converts horizontal journey into stacked content instead of freezing interaction.

## Priority Issues

### P0 Mobile is scaled desktop, not adaptive composition
At 320/375px card stays 66vw and detail stays 82vw inside same horizontal pair. Fixed site nav plus category nav consumes large first-view height. Fix: design explicit mobile card/detail composition while preserving vertical-wheel-driven horizontal canvas.

### P0 Short viewport can hide order completion
Detail stretches with chapter, has no internal overflow plan, and short-height query excludes mobile. Fix: bounded detail content, visible size/order area, test 320x568 and desktop 1024x600.

### P1 Card lacks product hierarchy
Every drink repeats identical 3:4 image, bilingual names, chip and hidden detail label. Fix: rebuild card from static baseline with one clear visual hierarchy and a touch-visible affordance before adding motion.

### P1 Navigation orientation is weak
Active category helps, but hidden-scroll category nav and horizontal travel offer weak progress context. Fix: active item centering, edge affordance and compact journey progress without adding another carousel.

### P2 Error and success feedback are thin
Fixed message confirms save/failure, but recovery and next action are unclear. Fix: state-specific message with explicit retry or destination.

## Persona Red Flags

- Mobile student, one hand: fixed nav stack and wide card/detail pair make fast scanning laborious.
- Taste-led desktop explorer: horizontal canvas creates interest, but uniform card cadence drains appetite and comparison.
- Short-screen laptop user: detail text and controls can compete for vertical space; order button visibility is not guaranteed.

## Minor Observations

- Touch users never receive former hover image story.
- Dark/light chapter alternation is bold but increases adaptation burden for card tokens.
- Existing responsive smoke checks document overflow, not task completion or visible CTA.

## Questions to Consider

- Should mobile detail remain inline horizontal, or become an in-canvas viewport panel while still avoiding modal behavior?
- Should rebuilt card optimize fast comparison or visual appetite first?
- Is bilingual naming essential on every card, or can English move into detail?
