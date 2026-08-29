# 002 — Đẩy chữ bước sang trái khi hover

- **Status**: TODO
- **Commit**: 10baaff
- **Severity**: LOW
- **Category**: Missed opportunities; Accessibility
- **Estimated scope**: 1 file, khoảng 18 dòng CSS

## Problem

Các dòng hướng dẫn trong FocusInterludeSection có transition trên row nhưng không có hover state, nên desktop thiếu feedback khi người dùng khám phá section marketing.

`src/app/globals.css:5133-5152` — hiện tại:

```css
.focus-step {
  display: grid;
  grid-template-columns: 70px 1fr;
  align-items: baseline;
  padding: 18px 0;
  border-bottom: 1px solid var(--line-light);
  color: #92918a;
  transition:
    color 220ms var(--ease-out),
    transform 220ms var(--ease-out);
}
.focus-step span {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
}
.focus-step strong {
  font-size: clamp(36px, 6vw, 94px);
  font-weight: 750;
}
```

## Target

Hover desktop chỉ đẩy riêng text `strong` về trái `8px`; cột số giữ nguyên. Đây là feedback nhẹ cho surface tần suất vài lần mỗi lượt xem. Không thêm underline, scale, blur, parallax hoặc JS.

```css
.focus-step strong {
  min-width: 0;
  transition: transform 220ms var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .focus-step:hover strong {
    transform: translateX(-8px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .focus-step strong {
    transition: none;
  }
}
```

Curve repository token: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`. Duration `220ms` is near-imperceptible for a hover. Reduced motion keeps row static; current color remains unchanged, so no extra visual motion exists to preserve.

## Repo conventions to follow

- Global and route CSS belongs only in `src/app/globals.css`.
- Reuse `var(--ease-out)` from `src/app/globals.css:3092`.
- Existing row transition at `src/app/globals.css:5140-5142` already uses exact property transitions; do not use `transition: all`.
- Use CSS, not GSAP, because this is hover state with no runtime sequencing.

## Steps

1. Edit only `src/app/globals.css`, immediately after existing `.focus-step strong` rule.
2. Add `min-width: 0` and `transition: transform 220ms var(--ease-out)` to `.focus-step strong`. Preserve existing font declarations.
3. Add `@media (hover: hover) and (pointer: fine)` with `.focus-step:hover strong { transform: translateX(-8px); }`.
4. Add `@media (prefers-reduced-motion: reduce)` with `.focus-step strong { transition: none; }`.
5. Do not edit `.focus-step` transition. Do not change colors, border, text, markup, ScrollTrigger, CTA or stamp.

## Boundaries

- Only edit `src/app/globals.css`.
- Do not create/import stylesheets or CSS Modules.
- Do not alter source component markup, accessibility semantics, layout, typography, mobile interaction, or any other section.
- Do not add JS, GSAP code, dependencies, pseudo-elements, underline, scaling, blur, or horizontal document overflow.
- If source differs from commit `10baaff` excerpts, stop and report drift.

## Verification

- **Mechanical**: run `npm run lint`, `npm run smoke:responsive`, and `npm run build`. All should exit 0; pre-existing unrelated failures must be identified, not hidden.
- **Responsive**: check homepage at `320`, `375`, `768`, `1024`, and `1440px`; no horizontal page overflow. Hover motion only exists under fine hover pointer; touch layouts remain static.
- **Feel check**: at `1440px`, hover each FocusInterludeSection row. Confirm only the text moves left `8px`; number and border do not move. Move pointer quickly between rows; text retargets from current position with no flash. Use DevTools playback at `10%` to confirm movement is one axis, no scale. Toggle `prefers-reduced-motion: reduce`; confirm text does not translate.
- **Done when**: fine-pointer hover shifts only `.focus-step strong` left `8px` in `220ms`; reduced-motion and touch do not move it; no scope breach.
