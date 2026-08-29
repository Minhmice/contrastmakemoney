import { useEffect, useState } from 'react'
import { Dialog } from '@base-ui/react/dialog'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight, Menu as MenuIcon, UserRound, X } from 'lucide-react'
import { ContrastLogo } from '@/components/brand/ContrastLogo'
import { PublicActionLink } from '@/components/wrappers/PublicAction'
import { useAuth } from '@/app/auth-context'
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
  { key: 'space', label: 'KHÔNG GIAN', href: '/space' },
  { key: 'menu', label: 'MENU', href: '/menu', spyTarget: '#menu' },
  { key: 'locations', label: 'CƠ SỞ', href: '/#locations', spyTarget: '#locations' },
]

type SiteNavProps = {
  /** Marks the item matching the current page. */
  current?: NavKey
  /** Let scroll position drive the marker. Home page only, where the sections live. */
  spy?: boolean
}

export function SiteNav({ current, spy = false }: SiteNavProps) {
  const user = useAuth()
  const workspaceHref = '/workspace'
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [readingKey, setReadingKey] = useState<NavKey | undefined>(undefined)

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
      <header className="site-nav">
        <div className="site-nav__inner">
          <a
            className="site-nav__brand"
            href="/"
            aria-label="Contrast Coffee, về trang chủ"
          >
            <ContrastLogo variant="wordmark-dark" className="site-nav__logo" />
          </a>

          <div className="site-nav__cluster">
            <nav className="site-nav__links" aria-label="Điều hướng chính">
              {NAV_ITEMS.map((item) => (
                <a
                  className="site-nav__link"
                  key={`desktop-${item.key}`}
                  href={item.href}
                  data-active={activeKey === item.key}
                  aria-current={current === item.key ? 'page' : undefined}
                >
                  <span className="site-nav__marker" aria-hidden="true" />
                  {item.label}
                </a>
              ))}
            </nav>

            <PublicActionLink
              className="site-nav__workspace"
              href={workspaceHref}
              size="nav"
              aria-current={current === 'workspace' ? 'page' : undefined}
            >
              WORKSPACE
            </PublicActionLink>

            {user ? (
              <a className="site-nav__profile" href="/profile" aria-label="Hồ sơ cá nhân">
                <UserRound size={17} strokeWidth={1.7} aria-hidden="true" />
              </a>
            ) : null}

            <Dialog.Trigger className="site-nav__toggle" aria-label="Mở điều hướng">
              <MenuIcon size={22} strokeWidth={1.6} aria-hidden="true" />
            </Dialog.Trigger>
          </div>
        </div>
      </header>

      <Dialog.Portal>
        <Dialog.Popup className="nav-drawer">
          <Dialog.Title className="nav-drawer__title">
            Điều hướng Contrast Coffee
          </Dialog.Title>

          <Dialog.Close className="nav-drawer__close" aria-label="Đóng điều hướng">
            <X size={22} strokeWidth={1.6} aria-hidden="true" />
          </Dialog.Close>

          <nav className="nav-drawer__links">
            {NAV_ITEMS.map((item) => (
              <a
                key={`drawer-${item.key}`}
                href={item.href}
                aria-current={current === item.key ? 'page' : undefined}
                onClick={() => setDrawerOpen(false)}
              >
                {item.label}
                <ArrowUpRight size={22} strokeWidth={1.4} aria-hidden="true" />
              </a>
            ))}
            <a
              className="nav-drawer__workspace"
              href={workspaceHref}
              aria-current={current === 'workspace' ? 'page' : undefined}
              onClick={() => setDrawerOpen(false)}
            >
              WORKSPACE
              <ArrowUpRight size={22} strokeWidth={1.4} aria-hidden="true" />
            </a>
            {user ? (
              <a
                className="nav-drawer__profile"
                href="/profile"
                onClick={() => setDrawerOpen(false)}
              >
                HỒ SƠ CÁ NHÂN
                <UserRound size={22} strokeWidth={1.4} aria-hidden="true" />
              </a>
            ) : null}
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
