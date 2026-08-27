import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { NoiseBg } from './components/ui/NoiseBg'
import { SiteNav } from './components/nav/SiteNav'
import { MENU_CATEGORIES, MENU_SOURCE_STATUS } from './data/menu'
import './menu.css'

function menuImageSeed(categoryId: string, itemId: string) {
  return `contrast-${categoryId}-${itemId}`
}

export default function MenuPage() {
  const navLabelId = useId()
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0]?.id ?? '')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map())
  const observerRef = useRef<IntersectionObserver | null>(null)

  const scrollToCategory = useCallback((categoryId: string) => {
    const section = sectionRefs.current.get(categoryId)
    if (!section) return
    section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setActiveCategory(categoryId)
  }, [])

  useEffect(() => {
    document.documentElement.classList.add('menu-route')
    return () => document.documentElement.classList.remove('menu-route')
  }, [])

  useLayoutEffect(() => {
    const sections = MENU_CATEGORIES.map((c) => sectionRefs.current.get(c.id)).filter(
      Boolean,
    ) as HTMLElement[]

    if (sections.length === 0) return

    observerRef.current?.disconnect()
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]?.target instanceof HTMLElement) {
          const id = visible[0].target.dataset.categoryId
          if (id) setActiveCategory(id)
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.25, 0.5] },
    )

    sections.forEach((section) => observerRef.current?.observe(section))
    return () => observerRef.current?.disconnect()
  }, [])

  const toggleCard = useCallback((itemId: string) => {
    setExpandedId((prev) => (prev === itemId ? null : itemId))
  }, [])

  return (
    <div className="menu-shell">
      <NoiseBg />

      <a className="menu-skip" href="#menu-stage">
        Nhảy tới thực đơn
      </a>

      <SiteNav current="menu" />

      <div className="menu-layout">
        <aside className="menu-sidebar" aria-labelledby={navLabelId}>
          <p className="menu-sidebar__kicker">Thực đơn</p>
          <h1 className="menu-sidebar__title" id={navLabelId}>
            Menu
          </h1>
          <nav className="menu-sidebar__nav" aria-label="Danh mục đồ uống">
            <ul className="menu-sidebar__list">
              {MENU_CATEGORIES.map((category) => (
                <li key={category.id}>
                  <button
                    type="button"
                    className="menu-sidebar__link"
                    data-active={activeCategory === category.id ? 'true' : undefined}
                    aria-current={activeCategory === category.id ? 'true' : undefined}
                    onClick={() => scrollToCategory(category.id)}
                  >
                    {category.name}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          {MENU_SOURCE_STATUS === 'pending' ? (
            <p className="menu-sidebar__note">
              Giá minh hoạ. Cần xác minh trước khi công bố chính thức.
            </p>
          ) : null}
        </aside>

        <main className="menu-stage" id="menu-stage">
          {MENU_CATEGORIES.map((category) => (
            <section
              key={category.id}
              id={category.id}
              className="menu-section"
              data-category-id={category.id}
              ref={(node) => {
                if (node) sectionRefs.current.set(category.id, node)
                else sectionRefs.current.delete(category.id)
              }}
            >
              <header className="menu-section__head">
                <h2 className="menu-section__title">{category.name}</h2>
                <p className="menu-section__statement">{category.statement}</p>
              </header>

              <ul className="menu-drink-grid">
                {category.items.map((drink) => {
                  const isExpanded = expandedId === drink.id
                  const imageSeed = menuImageSeed(category.id, drink.id)

                  return (
                    <li key={drink.id}>
                      <article
                        className="menu-drink-card"
                        data-expanded={isExpanded ? 'true' : undefined}
                      >
                        <button
                          type="button"
                          className="menu-drink-card__trigger"
                          aria-expanded={isExpanded}
                          onClick={() => toggleCard(drink.id)}
                        >
                          <span className="menu-drink-card__visual">
                            <img
                              src={`https://picsum.photos/seed/${imageSeed}/480/360`}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              width={480}
                              height={360}
                            />
                          </span>
                          <span className="menu-drink-card__body">
                            <span className="menu-drink-card__name">{drink.name}</span>
                            <span className="menu-drink-card__english">{drink.english}</span>
                            <span className="menu-drink-card__price">{drink.price}k</span>
                          </span>
                        </button>
                        <div className="menu-drink-card__detail">
                          <div className="menu-drink-card__detail-inner">
                            <p>{drink.detail}</p>
                            <p className="menu-drink-card__meta">
                              Giá minh hoạ · {drink.price}k · {drink.english}
                            </p>
                          </div>
                        </div>
                      </article>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}

          <footer className="menu-stage__foot">
            <a className="menu-stage__cta" href="/#locations">
              Xem địa điểm
            </a>
          </footer>
        </main>
      </div>
    </div>
  )
}
