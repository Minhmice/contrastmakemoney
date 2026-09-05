# Workspace Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a distinctive but restrained motion system to Contrast Workspace that clarifies focus states, rewards meaningful progress, and remains smooth on mobile and lower-powered devices.

**Architecture:** Drive motion from semantic UI state (`data-status`, `data-phase`, `data-active`, `data-open`) and keep most animation in scoped CSS inside `src/app/globals.css`. Use only `transform`, `opacity`, and occasional `clip-path` for motion; retain the existing linear SVG progress update. React should only expose state or remount rare one-shot effects, not run per-frame animation loops.

**Tech Stack:** Next.js 16, React 19, TypeScript, Base UI dialogs, CSS transitions/keyframes, Playwright, Node test runner. Do not add a dependency; Motion is installed but is unnecessary for this scope.

**Spec:** `DESIGN.md`, `PRODUCT.md`, and the existing `/workspace` behavior.

## Global Constraints

- Preserve task, Pomodoro, audio, appearance, notes, guest/account, sync, migration, and settings behavior.
- Keep every workspace style in `src/app/globals.css`; do not add CSS Modules or route stylesheets.
- Reuse `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` and add only the two missing shared curves specified below.
- UI motion stays at or below 280ms. The rare natural-completion acknowledgement may run for 520ms.
- Animate `transform`, `opacity`, and `clip-path`; color and border-color may transition for feedback. Never animate `filter`, `backdrop-filter`, layout dimensions, position, or box-shadow.
- Do not use `transition: all`, built-in `ease-in`, continuous decorative loops, scroll-linked motion, mouse-tracking, or per-second animation on the timer digits.
- Hover motion must be inside `@media (hover: hover) and (pointer: fine)`.
- Reduced motion keeps opacity/color feedback but removes translation, scaling, sweeping, and stagger.
- Do not use `will-change` permanently. Add it only while dragging or during a one-shot state.
- Do not alter user-authored unrelated changes in the dirty worktree.
- Preserve Vietnamese type rules, 44×44px touch targets, keyboard access, focus visibility, and 320–1440px responsiveness.

## Motion Map

| Surface | Frequency | Purpose | Motion |
| --- | --- | --- | --- |
| Primary and secondary controls | High | Feedback | 120ms press; 160ms color hover |
| Task selection/completion | Medium | State indication | 160–180ms marker, opacity, check response |
| Tool card/popover | Occasional | Spatial consistency | 180–200ms opacity + clip reveal |
| Settings modal | Occasional | Spatial consistency | 220ms opacity + scale 0.96→1 |
| Mobile bottom sheet | Occasional | Spatial consistency | 280ms translateY with drawer curve |
| Start/pause focus | Medium | State indication | 220ms rail fade and accent response |
| Phase change | Low | Prevent jarring change | 200ms label/content fade-through-ink |
| Natural work completion | Low | Feedback + restrained delight | One 520ms red sweep plus completion label |
| Background selection | Low | Prevent jarring change | 240ms fade-through-ink |
| Dragging floating cards | Medium | Direct manipulation | 1:1 transform, no easing while dragging |

Do not animate typing, note autosave on every keystroke, timer digits each second, volume movement, or list scrolling.

## File Structure

- Modify `src/app/globals.css`: motion tokens, state selectors, component transitions, reduced-motion overrides.
- Modify `src/components/pages/WorkspacePage.tsx`: expose semantic state, trigger the one-shot completion acknowledgement, and remove render-per-pointer drag updates.
- Modify `src/components/workspace/FocusStage.tsx`: add phase/status hooks and render the completion acknowledgement.
- Modify `src/components/workspace/TaskPanel.tsx`: expose task state for scoped feedback.
- Modify `src/components/workspace/WorkspaceTools.tsx`: expose selected/open/dragging state without changing tool logic.
- Modify `src/components/workspace/PomodoroSettingsDialog.tsx`: let Base UI retain the popup long enough to animate exit.
- Modify `tests/responsive-smoke.test.mjs`: verify semantic motion states, panel bounds, and reduced-motion behavior.
- Create `tests/workspace-motion-contract.test.mjs`: reject expensive or overly broad workspace CSS.
- Modify `package.json`: add the motion-contract test command.

---

### Task 1: Establish the motion contract and regression guard

**Files:**
- Create: `tests/workspace-motion-contract.test.mjs`
- Modify: `src/app/globals.css:4-18`
- Modify: `src/app/globals.css:6537-7342`
- Modify: `package.json`

**Interfaces:**
- Consumes: the `WORKSPACE ROUTE` section marker in `globals.css`.
- Produces: shared `--ease-in-out` and `--ease-drawer` tokens plus a static test that guards the workspace motion budget.

- [ ] **Step 1: Write the failing motion-contract test**

```js
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8')
const marker = 'WORKSPACE ROUTE (Controlled Focus / Focus Desk)'
const workspace = css.slice(css.indexOf(marker))

test('workspace motion avoids broad and paint-heavy transitions', () => {
  assert.doesNotMatch(workspace, /transition\s*:\s*all\b/)
  assert.doesNotMatch(workspace, /transition\s*:[^;]*(?:filter|backdrop-filter|box-shadow)/)
})

test('workspace defines a reduced-motion policy', () => {
  assert.match(workspace, /@media\s*\(prefers-reduced-motion:\s*reduce\)/)
})
```

- [ ] **Step 2: Run the test and confirm it fails on the current CSS**

Run: `node --test tests/workspace-motion-contract.test.mjs`

Expected: FAIL because the workspace contains `transition: all`, transitions `filter`, and has no scoped reduced-motion block.

- [ ] **Step 3: Add the missing shared easing tokens**

Add beside `--ease-out` in `:root`:

```css
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

- [ ] **Step 4: Remove current motion violations**

Replace both workspace `transition: all 0.15s ease` declarations with named properties. Remove `filter` from the running-rail transition and state; use opacity only. Replace built-in `ease-out` with `var(--ease-out)`.

```css
.workspace-preset-btn {
  transition:
    color 160ms var(--ease-out),
    background-color 160ms var(--ease-out),
    border-color 160ms var(--ease-out),
    transform 120ms var(--ease-out);
}

.workspace-stepper-btn {
  transition:
    color 160ms var(--ease-out),
    background-color 160ms var(--ease-out),
    transform 120ms var(--ease-out);
}

.workspace-page[data-status='running'] .workspace-tool-card {
  opacity: 0.52;
}
```

- [ ] **Step 5: Add a scoped reduced-motion block**

```css
@media (prefers-reduced-motion: reduce) {
  .workspace-page *,
  .workspace-page *::before,
  .workspace-page *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }

  .workspace-tool-card,
  .workspace-settings-dialog,
  .workspace-sheet-content,
  .workspace-stage__phase-copy,
  .workspace-completion-mark {
    transform: none !important;
    clip-path: none !important;
  }
}
```

Do not disable the timer ring's linear progress transition; it communicates progress rather than decoration.

- [ ] **Step 6: Run the contract test**

Run: `node --test tests/workspace-motion-contract.test.mjs`

Expected: PASS.

- [ ] **Step 7: Add the package script and commit**

Add: `"check:workspace-motion": "node --test tests/workspace-motion-contract.test.mjs"`

```bash
git add package.json src/app/globals.css tests/workspace-motion-contract.test.mjs
git commit -m "test: guard workspace motion budget"
```

### Task 2: Make focus state and phase changes legible

**Files:**
- Modify: `src/components/pages/WorkspacePage.tsx:299-360`
- Modify: `src/components/workspace/FocusStage.tsx`
- Modify: `src/app/globals.css:6541-6938`
- Modify: `tests/responsive-smoke.test.mjs`

**Interfaces:**
- Consumes: `state.status`, `state.phase`, `state.completedWork`, and the existing `FocusStage` props.
- Produces: root `data-status`/`data-phase`, `completionPulse: number`, and a keyed `.workspace-completion-mark` rendered by `FocusStage`.

- [ ] **Step 1: Add a failing Playwright assertion for semantic status**

Extend the workspace smoke coverage:

```js
test('/workspace exposes focus state without moving controls', async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(`${baseUrl}/workspace`, { waitUntil: 'networkidle' })
  const root = page.locator('.workspace-page')
  assert.equal(await root.getAttribute('data-status'), 'idle')
  await page.getByRole('button', { name: 'Bắt đầu' }).click()
  assert.equal(await root.getAttribute('data-status'), 'running')
  await page.getByRole('button', { name: 'Tạm dừng' }).click()
  assert.equal(await root.getAttribute('data-status'), 'idle')
  await page.close()
})
```

- [ ] **Step 2: Run the focused smoke test and confirm failure**

Run: `node --test --test-name-pattern="exposes focus state" tests/responsive-smoke.test.mjs`

Expected: FAIL because the root only exposes `data-running`.

- [ ] **Step 3: Expose semantic state and detect natural completion**

In `WorkspacePage`, replace `data-running` with:

```tsx
<main
  className="workspace-page"
  data-status={state.status}
  data-phase={state.phase}
>
```

Add a separate ref for visual acknowledgement; do not reuse `savedWork` because that ref controls persistence:

```tsx
const previousCompletedWork = useRef(state.completedWork)
const [completionPulse, setCompletionPulse] = useState(0)

useEffect(() => {
  if (state.completedWork > previousCompletedWork.current) {
    setCompletionPulse((value) => value + 1)
  }
  previousCompletedWork.current = state.completedWork
}, [state.completedWork])
```

Pass `completionPulse` to `FocusStage`.

- [ ] **Step 4: Render phase and completion motion hooks**

In `FocusStage`, add `completionPulse: number` to the props. Key the phase copy by phase and the completion mark by pulse so one-shot CSS animation restarts only on a real state change.

```tsx
<span key={phase} className="workspace-stage__phase-copy">
  {phaseLabel[phase]}
</span>

{completionPulse > 0 ? (
  <span
    key={completionPulse}
    className="workspace-completion-mark"
    aria-live="polite"
  >
    XONG MỘT PHIÊN.
  </span>
) : null}
```

- [ ] **Step 5: Add the controlled state motion**

```css
.workspace-tool-card {
  transition: opacity 220ms var(--ease-out);
}

.workspace-page[data-status='running'] .workspace-tool-card {
  opacity: 0.52;
}

@media (hover: hover) and (pointer: fine) {
  .workspace-page[data-status='running'] .workspace-tool-card:hover,
  .workspace-page[data-status='running'] .workspace-tool-card:focus-within {
    opacity: 1;
  }
}

.workspace-stage__phase-copy {
  animation: workspace-phase-enter 200ms var(--ease-out) both;
}

@keyframes workspace-phase-enter {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.workspace-completion-mark {
  animation: workspace-completion 520ms var(--ease-in-out) both;
}

@keyframes workspace-completion {
  0% { opacity: 0; transform: translateY(6px); clip-path: inset(0 100% 0 0); }
  35%, 72% { opacity: 1; transform: translateY(0); clip-path: inset(0 0 0 0); }
  100% { opacity: 0; transform: translateY(-4px); clip-path: inset(0 0 0 0); }
}
```

Keep the completion mark small and close to the dial. Do not flash or cover the full screen.

- [ ] **Step 6: Add button and accent feedback**

- Primary/secondary press: `transform: scale(0.97)` for 120ms.
- Start/pause state: accent expands or contracts with `transform: scaleX()` over 220ms.
- Phase tint: change only static color/overlay variables; never animate the photo filter.
- Timer digits remain stationary and tabular.

- [ ] **Step 7: Run checks and commit**

Run: `node --test --test-name-pattern="workspace" tests/responsive-smoke.test.mjs`

Expected: PASS.

```bash
git add src/components/pages/WorkspacePage.tsx src/components/workspace/FocusStage.tsx src/app/globals.css tests/responsive-smoke.test.mjs
git commit -m "feat: add workspace focus state motion"
```

### Task 3: Animate panels, settings, and background changes spatially

**Files:**
- Modify: `src/components/pages/WorkspacePage.tsx`
- Modify: `src/components/workspace/WorkspaceTools.tsx`
- Modify: `src/components/workspace/PomodoroSettingsDialog.tsx`
- Modify: `src/app/globals.css:7012-7204`
- Modify: `tests/responsive-smoke.test.mjs`

**Interfaces:**
- Consumes: `taskOpen`, `tool`, Base UI `data-starting-style`/`data-ending-style`, and `background.src`.
- Produces: symmetric open/close motion for floating panels, dialogs, and mobile sheets without a new library.

- [ ] **Step 1: Add failing reduced-motion and panel-bound tests**

```js
test('/workspace panel motion respects reduced motion', async () => {
  const page = await browser.newPage({ viewport: { width: 375, height: 667 } })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(`${baseUrl}/workspace`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Công cụ' }).click()
  const menu = page.locator('#workspace-tool-menu')
  const style = await menu.evaluate((element) => {
    const computed = getComputedStyle(element)
    return { animationDuration: computed.animationDuration, transform: computed.transform }
  })
  assert.ok(style.animationDuration === '0.01ms' || style.animationDuration === '0s')
  assert.ok(style.transform === 'none' || style.transform.includes('matrix(1'))
  await page.close()
})
```

- [ ] **Step 2: Run the test and confirm failure**

Run: `node --test --test-name-pattern="reduced motion" tests/responsive-smoke.test.mjs`

Expected: FAIL until the scoped reduced-motion policy and panel states are wired.

- [ ] **Step 3: Replace keyframe-only tool entrances with state transitions**

Keep desktop floating cards mounted while desktop mode is active and expose `data-open`. Use opacity and clip-path so the card's transform remains available for dragging.

```css
.workspace-tool-card {
  opacity: 0;
  clip-path: inset(0 0 8% 0);
  visibility: hidden;
  pointer-events: none;
  transition:
    opacity 180ms var(--ease-out),
    clip-path 180ms var(--ease-out),
    visibility 0s linear 180ms;
}

.workspace-tool-card[data-open='true'] {
  opacity: 1;
  clip-path: inset(0 0 0 0);
  visibility: visible;
  pointer-events: auto;
  transition-delay: 0s;
}
```

Remove `workspaceToolEnter`; rapidly reopening a panel must retarget from its current state instead of restarting a keyframe.

- [ ] **Step 4: Use Base UI lifecycle attributes for modal and sheet motion**

Do not conditionally remove `PomodoroSettingsDialogContent` inside the open Dialog root. Allow Base UI to apply ending state before unmount.

```css
.workspace-settings-dialog {
  transition:
    opacity 220ms var(--ease-out),
    transform 220ms var(--ease-out);
}

.workspace-settings-dialog[data-starting-style],
.workspace-settings-dialog[data-ending-style] {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.96) !important;
}

.workspace-sheet-content {
  transform: translateY(0) !important;
  transition:
    opacity 280ms var(--ease-drawer),
    transform 280ms var(--ease-drawer);
}

.workspace-sheet-content[data-starting-style],
.workspace-sheet-content[data-ending-style] {
  opacity: 0;
  transform: translateY(100%) !important;
}
```

Animate the Base UI backdrop opacity for the same duration as its surface.

- [ ] **Step 5: Replace the ineffective background-image transition**

Key the background layer by `background.src` and animate only the new layer's opacity from 0 to 1 over the ink background.

```tsx
<div
  key={background.src}
  className="workspace-backdrop"
  aria-hidden="true"
  style={{ backgroundImage: `url(${background.src})` }}
/>
```

```css
.workspace-backdrop {
  animation: workspace-backdrop-enter 240ms var(--ease-out) both;
}

@keyframes workspace-backdrop-enter {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

This is a fade-through-ink, not a dual full-screen crossfade. It avoids retaining and painting two large image layers.

- [ ] **Step 6: Run tests and commit**

Run: `node --test --test-name-pattern="workspace" tests/responsive-smoke.test.mjs`

Expected: PASS for normal and reduced-motion panel coverage.

```bash
git add src/components/pages/WorkspacePage.tsx src/components/workspace/WorkspaceTools.tsx src/components/workspace/PomodoroSettingsDialog.tsx src/app/globals.css tests/responsive-smoke.test.mjs
git commit -m "feat: animate workspace surfaces"
```

### Task 4: Add restrained task feedback and make dragging frame-safe

**Files:**
- Modify: `src/components/pages/WorkspacePage.tsx:70-220`
- Modify: `src/components/workspace/TaskPanel.tsx`
- Modify: `src/components/workspace/WorkspaceTools.tsx`
- Modify: `src/app/globals.css:6977-7158`
- Modify: `tests/responsive-smoke.test.mjs`

**Interfaces:**
- Consumes: task `done`/active state and existing card refs/drag positions.
- Produces: `data-active`, `data-done`, direct `translate3d()` drag updates, and one React position update on pointer release.

- [ ] **Step 1: Add a failing pointer-drag containment test**

```js
test('/workspace floating card drag stays inside viewport', async () => {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  await page.goto(`${baseUrl}/workspace`, { waitUntil: 'networkidle' })
  const card = page.locator('.workspace-task-card--floating')
  const header = card.locator('.workspace-tool-card__header')
  const box = await header.boundingBox()
  await page.mouse.move(box.x + 20, box.y + 20)
  await page.mouse.down()
  await page.mouse.move(1380, 840, { steps: 8 })
  await page.mouse.up()
  const rect = await card.evaluate((element) => element.getBoundingClientRect())
  assert.ok(rect.left >= 0 && rect.right <= 1440)
  assert.ok(rect.top >= 0 && rect.bottom <= 900)
  await page.close()
})
```

- [ ] **Step 2: Run the focused test**

Run: `node --test --test-name-pattern="floating card drag" tests/responsive-smoke.test.mjs`

Expected: Record the current result. The new implementation must preserve containment while changing the update mechanism.

- [ ] **Step 3: Stop rendering React on every pointer move**

During `pointermove`, calculate the clamped delta and write a full transform directly to the card element:

```tsx
card.style.transform = `translate3d(${deltaX}px, ${deltaY}px, 0)`
```

Use pointer capture on the drag handle. Do not call `setToolPosition` or `setTaskPosition` inside `pointermove`. On `pointerup`, commit the final clamped `left`/`top` once, clear the transform, and release pointer capture.

Calculate both horizontal and vertical bounds from the card's current `getBoundingClientRect()`, including its real height. Before clearing the temporary transform, write the final `left` and `top` values to the element and then mirror those values into React state; this prevents a one-frame jump during release.

While dragging:

```css
.workspace-tool-card--dragging {
  will-change: transform;
  transition: none !important;
  outline: 2px solid #e01920;
  cursor: grabbing;
}
```

Do not animate the release unless the final position must be clamped. If clamping is needed, settle over 180ms with `var(--ease-out)`.

- [ ] **Step 4: Expose task semantics and add micro-feedback**

```tsx
<div
  className="workspace-task-item"
  data-active={active || undefined}
  data-done={task.done || undefined}
>
```

```css
.workspace-task-item {
  transition:
    opacity 160ms var(--ease-out),
    background-color 160ms var(--ease-out),
    border-color 160ms var(--ease-out);
}

.workspace-task-item[data-active='true']::before {
  transform: scaleY(1);
}

.workspace-task-item[data-done='true'] {
  opacity: 0.58;
}

.workspace-task-item [role='checkbox']:active {
  transform: scale(0.96);
}
```

Do not animate list height or move every neighboring task. The action should feel immediate.

- [ ] **Step 5: Gate hover feedback and preserve focus styles**

Move all workspace `:hover` visual motion into a fine-pointer media query. Keep `:focus-visible` outside the hover query so keyboard users receive the same state clarity.

- [ ] **Step 6: Run tests and commit**

Run: `node --test --test-name-pattern="workspace" tests/responsive-smoke.test.mjs`

Expected: PASS; both draggable cards remain in bounds.

```bash
git add src/components/pages/WorkspacePage.tsx src/components/workspace/TaskPanel.tsx src/components/workspace/WorkspaceTools.tsx src/app/globals.css tests/responsive-smoke.test.mjs
git commit -m "perf: make workspace drag motion frame-safe"
```

### Task 5: Verify motion quality, accessibility, and performance

**Files:**
- Modify only if verification finds a scoped issue.

**Interfaces:**
- Consumes: all prior tasks.
- Produces: verified motion behavior across input methods, viewports, and user preferences.

- [ ] **Step 1: Run automated checks**

```bash
npm run check:workspace-motion
npm run check:workspace
npm run lint
npm run smoke:responsive
npm run build
```

Expected: every command exits 0.

- [ ] **Step 2: Verify all motion states at normal speed**

At 1440×900, check:

- Page entry runs once and never blocks interaction.
- Start/pause feedback is visible but completes within 220ms.
- Timer digits do not bounce or crossfade every second.
- Natural completion shows one acknowledgement; skip does not show it.
- Work, short-break, and long-break states are distinct without depending on motion.
- Task and tool cards open/close symmetrically.
- Background changes fade through ink without a white flash.
- Dragging tracks the pointer without trailing and remains within the viewport.

- [ ] **Step 3: Verify mobile and short viewports**

Check 320×640, 375×667, and 768×900:

- Bottom sheets enter from and exit toward the bottom.
- The software keyboard does not hide task/note inputs.
- Floating actions do not overlap primary timer controls.
- No document-level horizontal scroll appears during animation.

- [ ] **Step 4: Verify reduced motion**

With reduced motion enabled:

- No translation, scale, clip sweep, stagger, or drag-release animation remains.
- Opacity and color changes still explain state.
- Natural completion remains readable as text without the red sweep.
- Dialogs and sheets remain fully usable with keyboard and screen reader semantics.

- [ ] **Step 5: Inspect performance in browser DevTools**

Record start/pause, open/close tool card, background change, and drag interactions. Acceptance criteria:

- No layout shift during start/pause or phase changes.
- No React render is triggered for every drag pointer event.
- No animation continuously runs while the workspace is idle.
- Animated surfaces use compositor-friendly properties.
- No long task above 50ms is introduced by a motion handler.
- Motion remains smooth under 4× CPU throttling.

- [ ] **Step 6: Feel-check at slow speed**

Replay the 180–280ms transitions at 4× duration in DevTools. Confirm that panels enter and exit along the same path, the completion acknowledgement does not cover the timer, and overlapping states never show two readable labels at once.

- [ ] **Step 7: Commit any verification-only corrections**

```bash
git add src/app/globals.css src/components/pages/WorkspacePage.tsx src/components/workspace tests
git commit -m "fix: polish workspace motion states"
```

If no correction is required, do not create an empty commit.

## Stop Conditions

- Do not add parallax, cursor-following decoration, animated grain, infinite pulses, floating particles, or full-screen celebration.
- Do not animate a value merely because it changes.
- Do not replace current product logic while implementing motion.
- Stop adding effects once start/pause, phase change, completion, panels, tasks, background, and drag states are clearly communicated.
