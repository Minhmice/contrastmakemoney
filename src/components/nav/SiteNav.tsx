import { useEffect, useRef, useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Menu as MenuIcon, UserRound, X } from 'lucide-react'
import { ContrastLogo } from '@/components/brand/ContrastLogo'
import { setScrollLocked } from '@/lib/scroll-lock'

gsap.registerPlugin(ScrollTrigger)

export type NavKey = 'space' | 'workspace' | 'menu' | 'locations'

type NavItem = {
  key: NavKey
  label: string
  href: string
  /** Section on the home page that marks this item while reading, when one exists. */
  spyTarget?: string
}

const NAV_ITEMS: readonly NavItem[] = [
  { key: 'space', label: 'KHÔNG GIAN', href: '/#space', spyTarget: '#space' },
  { key: 'workspace', label: 'WORKSPACE', href: '/workspace' },
  { key: 'menu', label: 'MENU', href: '/menu', spyTarget: '#menu' },
  { key: 'locations', label: 'CƠ SỞ', href: '/#locations', spyTarget: '#locations' },
]

// Below this the bar always stays put, so the first scroll gesture of a session
// never flickers it away.
const REVEAL_THRESHOLD = 90

type SiteNavProps = {
  /** Marks the item matching the current page. */
  current?: NavKey
  /** Let scroll position drive the marker. Home page only, where the sections live. */
  spy?: boolean
}

export function SiteNav({ current, spy = false }: SiteNavProps) {
  const navRef = useRef<HTMLElement>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [readingKey, setReadingKey] = useState<NavKey | undefined>(undefined)

  // Hide while reading down, return the moment intent reverses. ScrollTrigger is
  // the only mechanism that behaves identically on both pages, since one runs
  // Lenis and the other is on native scroll.
  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let hidden = false
    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const next = self.scroll() > REVEAL_THRESHOLD && self.direction === 1
        if (next === hidden) return
        hidden = next
        nav.dataset.hidden = next ? 'true' : 'false'
      },
    })

    return () => trigger.kill()
  }, [])

  useEffect(() => {
    if (!spy) return

    const triggers = NAV_ITEMS.flatMap((item) => {
      const section = item.spyTarget ? document.querySelector(item.spyTarget) : null
      if (!section) return []
      return [
        ScrollTrigger.create({
          trigger: section,
          start: 'top 32%',
          end: 'bottom 32%',
          onToggle: (self) =>
            setReadingKey((prev) => {
              if (self.isActive) return item.key
              return prev === item.key ? undefined : prev
            }),
        }),
      ]
    })

    return () => triggers.forEach((trigger) => trigger.kill())
  }, [spy])

  useEffect(() => {
    setScrollLocked(drawerOpen)
    return () => setScrollLocked(false)
  }, [drawerOpen])

  const activeKey = spy ? (readingKey ?? current) : current

  return (
    <Dialog.Root open={drawerOpen} onOpenChange={setDrawerOpen} modal>
      <header className="site-nav" ref={navRef} data-hidden="false">
        <div className="site-nav__inner">
          <a className="site-nav__brand" href="/" aria-label="Contrast Coffee, về trang chủ">
            <ContrastLogo variant="wordmark-light" className="site-nav__logo" />
          </a>

          <div className="site-nav__cluster">
            <nav className="site-nav__links" aria-label="Điều hướng chính">
              {NAV_ITEMS.map((item) => (
                <a
                  className="site-nav__link"
                  key={item.key}
                  href={item.href}
                  data-active={activeKey === item.key}
                  aria-current={current === item.key ? 'page' : undefined}
                >
                  <span className="site-nav__marker" aria-hidden="true" />
                  {item.label}
                </a>
              ))}
            </nav>

            <a className="site-nav__profile" href="/profile">
              <UserRound size={17} strokeWidth={1.7} aria-hidden="true" />
              HỒ SƠ
            </a>

            <Dialog.Trigger
              className="site-nav__toggle"
              aria-label="Mở điều hướng"
            >
              <MenuIcon size={22} strokeWidth={1.6} aria-hidden="true" />
            </Dialog.Trigger>
          </div>
        </div>
      </header>

      <Dialog.Portal>
        <Dialog.Popup className="nav-drawer">
          <Dialog.Title className="nav-drawer__title">Điều hướng Contrast Coffee</Dialog.Title>

          <Dialog.Close className="nav-drawer__close" aria-label="Đóng điều hướng">
            <X size={22} strokeWidth={1.6} aria-hidden="true" />
          </Dialog.Close>

          <nav className="nav-drawer__links">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.key}
                href={item.href}
                aria-current={current === item.key ? 'page' : undefined}
                onClick={() => setDrawerOpen(false)}
              >
                {item.label}
                <ArrowUpRight size={22} strokeWidth={1.4} aria-hidden="true" />
              </a>
            ))}
            <a
              className="nav-drawer__profile"
              href="/profile"
              onClick={() => setDrawerOpen(false)}
            >
              HỒ SƠ CÁ NHÂN
              <UserRound size={22} strokeWidth={1.4} aria-hidden="true" />
            </a>
          </nav>

          <div className="nav-drawer__foot">
            <span>CONTRAST COFFEE 24H</span>
            <span>STUDY · WORK · COFFEE</span>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
