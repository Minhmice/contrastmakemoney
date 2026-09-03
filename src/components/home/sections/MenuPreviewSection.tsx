'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PublicActionLink } from '@/components/wrappers/PublicAction'
import { HOME_MENU_FEATURES, type HomeMenuItem } from '@/components/home/data'
import { MOTION } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger)

type MenuPreviewSectionProps = { items?: HomeMenuItem[] }

export function MenuPreviewSection({ items = HOME_MENU_FEATURES }: MenuPreviewSectionProps) {
  const rootRef = useRef<HTMLElement>(null)
  const featuredItem = items[0]

  useEffect(() => {
    const root = rootRef.current
    if (
      !root ||
      !window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)').matches
    ) return

    const context = gsap.context(() => {
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: root, ...MOTION.reveal },
      })
        .fromTo('[data-menu-motion="media"]', { xPercent: -6, y: 24, scale: 0.94, autoAlpha: 0 }, { xPercent: 0, y: 0, scale: 1, autoAlpha: 1 }, 0)
        .fromTo('[data-menu-motion="heading"]', { y: 18, autoAlpha: 0, filter: 'blur(6px)' }, { y: 0, autoAlpha: 1, filter: 'blur(0px)' }, 0.08)
        .fromTo('[data-menu-motion="support"]', { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06 }, 0.18)
    }, root)

    return () => context.revert()
  }, [])

  return (
    <section className="menu-section menu-preview" id="menu" ref={rootRef}>
      <div className="menu-preview__intro">
        <h2 data-menu-motion="heading">NẠP LẠI.<span>LÀM TIẾP.</span></h2>
        <p data-menu-motion="support">Ba món đáng thử cho quãng nghỉ ngắn. Toàn bộ lựa chọn nằm ở trang menu.</p>
      </div>

      <div className="menu-preview__stage">
        <div className="menu-preview__media" data-menu-motion="media">
          {featuredItem?.image ? <img src={featuredItem.image} alt={featuredItem.name} /> : <div className="menu-preview__media-fallback" aria-hidden="true">CONTRAST</div>}
          <span className="menu-preview__category">MÓN NỔI BẬT</span>
        </div>

        <div className="menu-preview__ledger" data-menu-motion="support">
          <div className="menu-list">
            {items.map((item) => (
              <div className="menu-item" key={item.name}>
                <span className="menu-item__name"><strong>{item.name}</strong><small>{item.detail}</small></span>
                <span className="menu-item__price">{item.price}</span>
              </div>
            ))}
          </div>
          <PublicActionLink className="menu-preview-link" href="/menu">KHÁM PHÁ MENU</PublicActionLink>
        </div>
      </div>
    </section>
  )
}
