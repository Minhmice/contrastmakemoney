---
name: Contrast Coffee - Controlled Contrast
description: A controlled visual tension system balancing discipline and play, order and disruption, physical brand materials and digital performance.
---

<!-- SEED: established with the user before implementation; re-run $impeccable document once there's code to capture the actual tokens and components. -->

# Design System: Contrast Coffee

## Overview

**Creative North Star: "Controlled Contrast"**

Contrast Coffee's digital identity is built around controlled tension. The brand lives between discipline and play, concentration and release, order and disruption, black and white, red and neutral, stillness and velocity, work and social energy, and physical print and digital motion.

The website should neither imitate a printed poster nor become a generic modern café site. It should feel like Contrast Coffee's existing visual identity has learned to move, react, transform, and perform on screen. Discipline defines how the system operates. Contrast creates its memorable moments.

The experience may be bold, cinematic, playful, spatial, and experimental when composition, hierarchy, interaction, and timing remain deliberate. The recurring behavior is **ORDER → INTERRUPTION → RESPONSE → RESOLUTION**. A stable composition may be interrupted by photography, typography, cursor movement, a red field, or motion before resolving into a new controlled state.

Contrast should feel like **a disciplined person who knows exactly when to break the rules**.

**Key Characteristics:**

- focused, not sterile;
- youthful, not childish;
- graphic, not poster-bound;
- playful, not random;
- industrial, not brutalist for its own sake;
- experimental, not decorative;
- energetic, not exhausting;
- disciplined, but willing to break its own rules deliberately.

### Material System

Contrast uses multiple visual materials rather than forcing the experience into one aesthetic.

- **Paper:** Cool paper and photocopy texture connect menus, study materials, notices, posters, handouts, location information, and campaign fragments. It may show subtle fibers, toner grain, registration, ink variation, folds, or edges. It stays contemporary and functional, never kraft, parchment, scrapbook, or nostalgic café material.
- **Ink:** Ink black and Contrast red may become full fields, typography, masks, interruptions, transitions, annotations, and navigation states. Red has enough authority to dominate a moment when hierarchy calls for it.
- **Photography:** Real Contrast photography provides atmosphere, people, drinks, architecture, lifestyle, and emotional reality. It may be full bleed, heavily cropped, oversized, masked, layered behind typography, isolated, cinematic, or spatially transformed. It should not automatically sit inside UI cards.
- **Digital Space:** Interactive typography, cursor behavior, responsive transformation, time, depth, velocity, masking, transitions, overlays, and spatial movement may be unapologetically digital. They do not need to imitate print.

Motion is a primary brand medium with four behavioral states:

1. **CONTROL:** Precise snapping, alignment, tracking, clean masking, measured reveals, and grid locking.
2. **BREAK:** Controlled interruption through escaping typography, bleeding imagery, red fields, displacement, cursor disturbance, or temporary misregistration.
3. **RECOVER:** Geometry, typography, imagery, information, and navigation reorganize into a clear controlled state.
4. **RELEASE:** Lighter moments use product interaction, mascot behavior, subtle physics, cursor response, photographic parallax, expressive labels, or unexpected micro-transitions.

Not every section moves heavily. Stillness is part of the contrast. Reduced-motion experiences preserve the hierarchy, story, meaning, navigation, and state changes without relying on spatial movement.

## Colors

The core identity remains dominated by Contrast red, deep ink black, and cool paper white. Exact production values remain **[to be resolved from master logo, vector, or canonical first-party brand assets during implementation]**. Social-media JPEG and PNG exports are not color authority.

The core palette does not prohibit other colors. Product photography, environmental photography, lighting, drinks, seasonal campaigns, and contextual imagery may introduce natural or temporary color.

**The Structural Palette Rule.** Brand structure stays red, black, and white. Content may bring the world into it.

**The Red Authority Rule.** Red may act as an accent or own a complete visual field depending on hierarchy. It should not be reduced to timid decoration.

**The Contextual Gradient Rule.** Gradients may emerge from light, photography, heat, depth, transition, or movement. Do not use generic decorative SaaS aurora gradients disconnected from Contrast or its content.

**The Contemporary Paper Rule.** Cool paper may carry subtle photocopy and toner material. It must not become beige café minimalism, kraft packaging, aged parchment, vintage stains, or scrapbook texture.

## Typography

Typography is one of Contrast's strongest graphic and performative devices. The system favors a strong sans-serif display voice paired with highly legible body typography. Exact licensed families and production values remain **[to be resolved during implementation]** after testing complete Vietnamese support.

Display typography may exceed conventional web proportions, crop against viewport boundaries, overlap photography, rotate or shift, compress, stretch compositionally, move independently, inhabit red fields, form image masks, and transition between horizontal and vertical states. It may perform while remaining semantically clear.

Vietnamese diacritics must remain structurally correct at every scale, weight, crop, transform, animation state, and line-height.

**The Perform-before-Decorate Rule.** Make typography move, transform, or organize information before adding ornamental styling.

**The Accent Integrity Rule.** Preserve Vietnamese diacritics, approved capitalization, and campaign phrasing before pursuing dramatic type treatment.

**The Semantic Clarity Rule.** Performative type may alter composition, not the visitor's ability to understand content or action.

### Vietnamese Responsive Type

Vietnamese diacritics are content, not decoration. Display type uses a minimum `line-height: 1.02` and tracking no tighter than `-0.04em`; body copy uses at least `1.4`. Headings balance; prose wraps naturally. Containers do not clip text to preserve a composition. Use `overflow-wrap: anywhere` only for unbounded names, URLs, or user content. `nowrap` requires a visible overflow strategy and is never default behavior for labels or buttons.

## Layout

A grid provides underlying discipline, but not every element must visibly obey it at every moment. Layout may alternate between strict editorial grids, cinematic image fields, sparse paper structures, asymmetrical compositions, oversized typography, modular content systems, spatial overlaps, and controlled off-grid events.

The system creates and resolves tension intentionally. Responsive composition is allowed to change structure rather than scale desktop literally.

**The Know-the-Grid Rule.** Understand and establish the grid before breaking it.

**The Purposeful Break Rule.** Grid breaks must create emphasis, narrative, movement, meaningful contrast, visual surprise, or spatial depth. Avoid arbitrary positioning without compositional purpose.

**The One-Dominant-Gesture Rule.** Each major viewport normally has one leading gesture: typography, photography, color field, movement, geometry, or negative space. Supporting elements do not compete at equal volume.

**The Meaningful Modularity Rule.** Modular and bento-like compositions are welcome when hierarchy, scale, material, and behavior vary meaningfully. Avoid generic equal-card grids.

Mobile is a recomposition, not a reduced desktop layout. Large gestures may become horizontal typography, shorter spatial sequences, touch-driven interactions, swipeable structures, simplified depth, alternate crops, or non-cursor behavior. Identity and action must survive when advanced interaction is unavailable.

Every responsive change holds from 320px through desktop, at 200% zoom, with long Vietnamese copy and short viewports. Use intrinsic grid/flex sizing before fixed dimensions; every text-bearing grid/flex child may shrink. Intentional horizontal interaction, such as the menu ledger, stays inside its own viewport and never becomes document overflow.

## Elevation & Depth

Depth may come from photography, parallax, masking, occlusion, layering, perspective, scale change, focus and blur, scroll movement, paper stacking, and physical shadows inside imagery. Surface treatment follows the represented material rather than one global flatness rule.

Blur may communicate focus versus distraction, spatial depth, or transient state change. It should not become generic glass-card styling. Shadows may be soft, hard, photographic, graphic, or absent depending on context.

**The Material-Truth Rule.** Paper, photography, ink, and digital space may each carry different depth behavior. Use the behavior that belongs to the material.

**The Focus-Blur Rule.** Blur is a transition and focus metaphor, not a default container aesthetic.

**The Spatial-Purpose Rule.** Parallax and perspective must strengthen atmosphere, hierarchy, or narrative direction. Keep them restrained, directional, and composition-bound.

## Shapes

Square and rectangular geometry remain strongly associated with Contrast's identity and logo, but the website is not restricted to hard corners. Curves may appear when they create meaningful contrast or originate naturally from drinkware, people, photography, motion paths, ergonomic controls, or transitional geometry.

Sharp and curved forms may coexist deliberately. Rounded elements should not become generic SaaS softness, and square geometry should not become a rigid rule applied to every component.

The logo-derived red square remains a signature element. It may behave as a marker, cursor state, transition object, mask, active indicator, navigation device, loading behavior, or spatial anchor. It should evolve through interaction rather than repeat as decoration.

**The Contrast-in-Geometry Rule.** Use sharp and curved forms to create intentional tension, not inconsistent styling.

**The Red-Square Behavior Rule.** The red square performs a meaningful state, orientation, or transition role whenever it appears.

**The Native-Form Rule.** Geometry may inherit useful softness from products, bodies, controls, and motion without weakening brand recognition.

## Do's and Don'ts

### Preserve:

- **Do** preserve Contrast's recognizable red, black, and white structure, logo geometry, bold typography, real photography, Vietnamese campaign language, study/work culture, youthful energy, and direct communication.
- **Do** treat discipline as clarity of composition, hierarchy, timing, and interaction rather than one rigid shape language.
- **Do** use authentic photography as atmosphere, evidence, and emotional anchor.
- **Do** let digital behavior extend the brand beyond existing print and social-media artifacts.
- **Do** keep important information visible and complete without performative motion.

### Explore:

- **Do** explore cool paper texture, cinematic photography, modular compositions, controlled parallax, cursor behavior, responsive typography, pinned narrative moments, spatial transitions, blur as a focus metaphor, curves against hard geometry, mascot behavior, gradients derived from content or light, and playful interaction.
- **Do** use one or two pinned sequences when scroll physically transforms a major narrative composition.
- **Do** use cursor behavior when it manipulates brand geometry, reveals content, changes state, or creates meaningful contrast.
- **Do** use gradients, rounded forms, modular grids, physics, and depth when their role is specific and recognizably Contrast.

### Avoid:

- **Don't** default to beige specialty-café sameness, generic premium café styling, generic SaaS UI, decorative glassmorphism, stock coffee imagery, arbitrary grunge, or visual personality borrowed from another brand.
- **Don't** add random movement, novelty-only pointer effects, fashionable techniques without a brand role, or animation that weakens hierarchy and orientation.
- **Don't** make the entire site a pinned presentation, perpetual parallax field, cursor experiment, animated poster archive, or technical showcase.
- **Don't** reproduce campaign layouts literally when digital interaction, responsive systems, or spatial composition can extend the identity more effectively.

### Final Test

Every design decision should answer at least one question:

1. Does it strengthen Contrast's existing identity?
2. Does it communicate focus, work, discipline, youth, energy, or place?
3. Does it create meaningful contrast?
4. Does it improve orientation, hierarchy, or interaction?
5. Does it make digital capable of something the existing print identity cannot do?

If none apply, reconsider it.
