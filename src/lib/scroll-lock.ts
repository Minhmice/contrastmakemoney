type Scroller = {
  stop: () => void
  start: () => void
}

// Only pages that run a smooth-scroll instance register one. Native-scroll pages
// rely on the overlay's own scroll lock, so every call here is a safe no-op.
let active: Scroller | null = null

export function registerScroller(scroller: Scroller) {
  active = scroller
  return () => {
    if (active === scroller) active = null
  }
}

export function setScrollLocked(locked: boolean) {
  if (!active) return
  if (locked) active.stop()
  else active.start()
}
