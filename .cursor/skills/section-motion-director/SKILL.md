---
name: section-motion-director
description: Designs and implements animation for exactly one named frontend section using deterministic role-aware GSAP choices. Use for section motion, scroll reveals, image slides, text blur reveals, parallax, sequencing, animation review, or motion polish in React and Next.js.
---

# Section Motion Director

## Non-negotiable scope

Animate exactly one explicitly named section per invocation. Target must identify route plus section name, component, selector, or visible heading. If missing or ambiguous, ask: "Bạn muốn làm animation cho section nào trước? Gửi tên section hoặc heading hiển thị." Then stop.

Do not animate adjacent sections, build a page-wide motion system, rewrite copy, redesign layout, change routes, or add dependencies. Preserve existing motion outside target. Finish target, report it, then wait for user approval before touching another section.

## Required skills

Load before reading animation code:

1. animate
2. gsap-core
3. gsap-react for React or Next.js
4. gsap-scrolltrigger for scroll-linked work
5. gsap-timeline when two or more beats form one sequence
6. gsap-performance
7. gsap-utils when using selection, clamp, map, wrap, snap, or random helpers
8. emil-design-eng
9. design-taste-frontend
10. gpt-taste
11. impeccable and its reference/animate.md playbook

Load superdesign only for explicitly requested canvas exploration, redesign directions, or visual comparisons. Never run Superdesign CLI for scoped code-only motion.

Conflict order: direct request, project rules, accessibility/correctness, official GSAP skills, animate, design taste. Section scope overrides taste-skill requirements to generate full pages, AIDA layouts, navigation, bento grids, or multiple GSAP paradigms.

## Phase 1: inspect before deciding

Read:

- Target component and only its imported child components needed to understand DOM.
- Target CSS plus global tokens affecting it.
- Parent section order to understand viewport entry.
- package.json to confirm GSAP and @gsap/react availability.
- Existing Lenis, ScrollTrigger, GSAP registration, motion providers, and reduced-motion conventions.

Identify:

- Section root and stable scoping ref.
- Existing transforms. Never let GSAP overwrite transforms required by layout or hover.
- Overflow and stacking contexts.
- Image loading and dimensions.
- Desktop and mobile composition.
- Whether section starts above fold, enters viewport normally, is sticky, or is already pinned.
- Existing animation ownership. Extend it rather than create a second controller.

Do not edit until inspection answers these questions.

## Phase 2: motion brief

Write internal brief with exactly these fields:

- Target: route, component, section root.
- Design read: existing visual language, not a new aesthetic.
- Purpose: one of hierarchy, storytelling, explanation, feedback, state transition, preventing a jarring change.
- Frequency: page entry, scroll pass, repeated interaction.
- Roles present: image, heading, body, list, decoration, interactive.
- Constraints: mobile, reduced motion, existing transforms, clipping, sticky behavior.

If purpose cannot be named, implement no animation and explain why. Marketing section reveal normally uses hierarchy or storytelling.

## Phase 3: deterministic selection

Random means varied, not uncontrolled. Never use Math.random(), random GSAP stagger order, current time, or unstable DOM order.

Seed string:

~~~text
<normalized-route>|<component-or-section-name>|<normalized-user-request>
~~~

Normalize by trimming, lowercasing, and collapsing whitespace. Compute unsigned 32-bit FNV-1a:

~~~ts
function motionSeed(input: string) {
  let hash = 0x811c9dc5;
  for (const char of input) {
    hash ^= char.codePointAt(0)!;
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}
~~~

For role index r and pool length n:

~~~ts
const index = ((seed + Math.imul(r + 1, 0x9e3779b1)) >>> 0) % n;
~~~

Start there, then move circularly until variant passes compatibility rules. Record rejected variant and reason when fallback occurs. Same input must produce same selection.

## Role pools and exact recipes

Use no more than three animation languages in one section: one dominant visual, one text family, one accent. Repeated elements share one recipe.

### Image

1. slide-scale: from xPercent -8 or 8 based on layout entry edge, y 24, scale 0.94, autoAlpha 0, blur 8px; to zero, scale 1, autoAlpha 1, blur 0.
2. vertical-depth: from y 56 desktop or 28 mobile, scale 0.9, autoAlpha 0; to settled state.
3. clip-reveal: wrapper clipPath inset from a layout-compatible edge; image counter-moves 5%; finish inset 0 and transform 0.
4. masked-lateral: overflow wrapper reveals while image translates opposite direction. Never use when wrapper clips essential content.
5. restrained-parallax: visible image moves at most 8% or 48px across section passage. Use only for decorative or large editorial media, never instructional content.

Reject image variant when it conflicts with object positioning, existing transform hover, tiny mobile viewport, reading order, or performance. Animate wrapper if image transform already belongs to hover.

### Heading

1. blur-rise: from y 24, autoAlpha 0, blur 6px; settle quickly.
2. line-mask: split only through existing line wrappers or safe authored spans. Never mutate text into inaccessible per-character markup.
3. short-rise: from y 18 and autoAlpha 0.
4. tracking-settle: from autoAlpha 0 and letterSpacing 0.02em to existing tracking. Reject for Vietnamese display text if it risks clipping or awkward shaping.

Heading must become readable early. Never leave core headline blurred through most viewport travel.

### Body

1. blur-fade: autoAlpha 0 and blur 4px, no large movement.
2. short-rise: y 14 and autoAlpha 0.
3. sentence-stagger: only when semantic spans already exist; 40-70ms equivalent spacing.
4. plain-fade: autoAlpha only, preferred for long or dense copy.

Never split arbitrary prose into words solely for animation.

### List

1. compact-stagger: y 12, autoAlpha 0, stagger 0.04-0.08.
2. alternating-slide: x -12 and 12, only for short decorative lists; reject for tables or reading sequences.
3. grouped-fade: autoAlpha 0 with stagger 0.05.

Total stagger tail should normally stay under 350ms or equivalent scroll distance.

### Decoration or note

1. scale-rotate: scale 0.94, rotation plus or minus 2 degrees, autoAlpha 0.
2. side-drift: xPercent plus or minus 6, autoAlpha 0.
3. clip-reveal: use existing bounded wrapper.
4. static: correct choice when another dominant motion already exists.

### Interactive

Use CSS transition for press and hover unless runtime physics is required. Press: scale 0.97-0.98 for 100-160ms. Gate hover behind (hover: hover) and (pointer: fine). Do not attach scroll animation and hover animation to same transform owner; add wrapper if both are necessary.

## Phase 4: choose controller

- Scroll position must control progress or reverse on scroll back: GSAP ScrollTrigger with scrub.
- Several elements form one narrative beat: one gsap.timeline with one ScrollTrigger, not separate triggers fighting each other.
- Independent elements enter at different viewport positions: separate scoped triggers.
- Simple interaction state: CSS transition, not GSAP.
- Existing component already uses another motion owner: preserve it and avoid mixed ownership on same property.

Do not pin unless content requires a pinned narrative and user requested or existing composition supports it. Do not add horizontal scroll hijacking for a reveal request.

## Phase 5: implementation pattern

Prefer data attributes scoped beneath section ref. Add only attributes needed by target, for example data-motion-image, data-motion-heading, data-motion-copy, and data-motion-accent. Avoid selectors shared across page.

React and Next.js requirements:

- Client boundary only at smallest animated leaf.
- Register required plugins once in client-safe module scope.
- Prefer useGSAP from @gsap/react when installed.
- scope all selector text to root ref.
- gsap.matchMedia handles desktop, mobile, and prefers-reduced-motion.
- Revert media/context on unmount. No orphan ScrollTriggers.
- Do not call ScrollTrigger.refresh on every render. Refresh only when target geometry genuinely changes after media/font/image load and existing app does not already handle it.

Reference skeleton:

~~~tsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function TargetSection() {
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add({
      desktop: "(min-width: 768px)",
      mobile: "(max-width: 767px)",
      reduce: "(prefers-reduced-motion: reduce)",
    }, (context) => {
      const { desktop, reduce } = context.conditions!;
      const images = gsap.utils.toArray<HTMLElement>("[data-motion-image]");
      const text = gsap.utils.toArray<HTMLElement>("[data-motion-heading], [data-motion-copy]");

      if (reduce) {
        gsap.set([...images, ...text], { clearProps: "all", autoAlpha: 1 });
        return;
      }

      gsap.fromTo(images,
        { xPercent: desktop ? -8 : 0, y: desktop ? 24 : 16, scale: 0.94, autoAlpha: 0, filter: "blur(8px)" },
        { xPercent: 0, y: 0, scale: 1, autoAlpha: 1, filter: "blur(0px)", ease: "none", scrollTrigger: { trigger: root.current, start: "top 92%", end: "top 55%", scrub: 0.4, invalidateOnRefresh: true } }
      );

      gsap.fromTo(text,
        { y: desktop ? 18 : 10, autoAlpha: 0, filter: "blur(4px)" },
        { y: 0, autoAlpha: 1, filter: "blur(0px)", ease: "none", stagger: 0.06, scrollTrigger: { trigger: root.current, start: "top 88%", end: "top 52%", scrub: 0.35 } }
      );
    });

    return () => mm.revert();
  }, { scope: root });

  return <section ref={root}>{/* existing content */}</section>;
}
~~~

Adapt skeleton to selected variants. Do not paste it blindly. When @gsap/react is absent, use useLayoutEffect plus scoped gsap.context and revert cleanup; do not install dependency for this alone.

## Timing and trigger policy

Default marketing reveal must appear early and finish in short range:

- Dominant media: start top 94-92%, end top 60-55%, scrub 0.3-0.5.
- Heading: start top 90-86%, end top 58-50%, scrub 0.25-0.45.
- Supporting text: start top 86-82%, end top 54-46%, scrub 0.25-0.45.

Treat these as bounded defaults, not magic constants. Above-fold section should initialize visible or use short load entrance, not wait for scroll. Very tall section may use element-specific triggers. Never use an end range so long that content remains ghosted while user is already reading it.

Scrubbed tweens use ease none. Non-scrub entrances use strong ease-out such as power3.out. Do not combine scrub with decorative easing. Use autoAlpha when hidden content must not intercept interaction. Keep blur at or below 10px and avoid many simultaneous filtered layers.

## Responsive and accessibility

Desktop and mobile may use different offsets, but same hierarchy and narrative. At less than 768px:

- Remove collision-prone lateral travel.
- Reduce distances roughly 40-60%.
- Disable parallax when image height or scroll space is insufficient.
- Preserve DOM reading order and core actions.
- Check document has no horizontal overflow.

Reduced motion:

- No parallax, pinning, scrub, large translation, rotation, or scale travel.
- Content is immediately visible, or uses brief opacity-only transition if comprehension benefits.
- Never leave initial hidden styles active when animation is skipped.

Do not hide semantic content from assistive technology. Animation wrappers must not change heading hierarchy, labels, focus order, or pointer access.

## Performance rules

Prefer transform and autoAlpha. clip-path and small blur are allowed only on few bounded elements. Avoid width, height, top, left, margin, and padding animation. Avoid will-change on static content; apply narrowly and remove or clear it when no longer needed. Batch reads before writes. Never create a ScrollTrigger per word. Never use window scroll listeners, requestAnimationFrame loops touching React state, or duplicated Lenis instances.

## Verification, one bounded pass

Check only target route and section:

1. First-load state: no flash, invisible content, hydration warning, or layout shift.
2. Scroll down: content appears before reading point and selected hierarchy is clear.
3. Scroll back: scrubbed motion reverses without jump.
4. Rapid scroll: no stale blur, half-visible content, or trigger desync.
5. Widths: 320, 375, 768, 1024, 1440 when project rules require them.
6. Short viewport and long Vietnamese text.
7. Reduced motion.
8. No document-level horizontal overflow.
9. No console errors or leaked triggers after route navigation.
10. Run project-required lint, responsive smoke, and build commands relevant to changed files.

Fix findings in one batch, confirm once, then stop. Do not polish indefinitely.

## Completion report

Use this exact compact structure:

~~~text
Section: <route / section>
Purpose: <one valid purpose>
Seed: <unsigned integer>
Variants: image=<name>; heading=<name>; body=<name>; accent=<name or static>
Changed: <paths>
Checks: <commands and visual widths>
Review next: chờ duyệt section này; chưa sửa section khác
~~~

## Hard failure conditions

Work is not complete if any is true:

- More than one section changed.
- Selection is not reproducible.
- Core content appears late or stays hidden.
- Reduced-motion path leaves hidden inline styles.
- Cleanup is missing.
- Animation and hover overwrite same transform owner.
- Mobile is only scaled desktop choreography.
- New dependency was added without explicit approval.
- Global scroll listener or per-frame React state was introduced.
- Verification expanded into unrelated redesign work.
