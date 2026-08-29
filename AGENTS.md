# Adaptive UI rules

Applies to every visual change.

## Source of truth

- `src/app/globals.css` is sole CSS source of truth for global, homepage, and route styles.
- Do not create, import, or use route/feature stylesheets or CSS Modules.
- Next.js surfaces must keep all CSS in `src/app/globals.css`.

## Layout

- Support 320px through desktop. Add breakpoints where content fails, not for device names.
- Every flex or grid child that can contain text needs `min-width: 0`.
- Use `minmax(0, …)`, `clamp()`, and intrinsic sizing before fixed dimensions.
- Do not give text containers fixed width or height unless content is bounded and has a visible fallback.
- `overflow: hidden` or `clip` around text needs a deliberate crop reason and enough line-box padding. Prefer clipping decoration only.
- Mobile recomposes desktop; it does not shrink it. Stack columns, remove collision-prone absolute layers, preserve core actions.
- Preserve menu's intentional horizontal track. No other page may create document-level horizontal scroll.

## Vietnamese type

- Keep display text at `line-height: 1.02` or above. Body text: `1.4` or above.
- Keep display tracking at `-0.04em` or looser.
- Use `text-wrap: balance` for headings and `text-wrap: pretty` for prose.
- Use `overflow-wrap: anywhere` only for unbounded or user-supplied strings.
- `white-space: nowrap` needs an overflow strategy or an explicit scoped exception.
- Never use `leading-none` for Vietnamese labels. Never clip diacritics to force a graphic composition.

## Interaction and checks

- Keep touch controls at least 44×44 CSS px.
- Respect safe areas, 200% zoom, virtual keyboards, and `prefers-reduced-motion`.
- Check changed visual routes at 320, 375, 768, 1024, and 1440px; also check a short viewport and long Vietnamese copy.
- Run `npm run lint`, `npm run smoke:responsive`, and `npm run build` for responsive changes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
