'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PublicActionLink } from '@/components/wrappers/PublicAction'
import { HOME_MENU_FEATURES, type HomeMenuItem } from '@/components/home/data'
import { MOTION } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger)

type MenuPreviewSectionProps = { items?: HomeMenuItem[] }
type MediaLayer = 'a' | 'b'

export function MenuPreviewSection({ items = HOME_MENU_FEATURES }: MenuPreviewSectionProps) {
  const rootRef = useRef<HTMLElement>(null)
  const mediaStageRef = useRef<HTMLDivElement>(null)
  const layerARef = useRef<HTMLDivElement>(null)
  const layerBRef = useRef<HTMLDivElement>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [visibleLayer, setVisibleLayer] = useState<MediaLayer>('a')
  const [layerAIndex, setLayerAIndex] = useState(0)
  const [layerBIndex, setLayerBIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const getLayerEl = useCallback((layer: MediaLayer) => {
    return layer === 'a' ? layerARef.current : layerBRef.current
  }, [])

  const chooseItem = useCallback((index: number) => {
    if (index === activeIndex || isTransitioning) return
    const stage = mediaStageRef.current
    const direction = index > activeIndex ? 1 : -1
    const incomingLayer: MediaLayer = visibleLayer === 'a' ? 'b' : 'a'

    setActiveIndex(index)

    if (incomingLayer === 'a') setLayerAIndex(index)
    else setLayerBIndex(index)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion || !stage) {
      setVisibleLayer(incomingLayer)
      return
    }

    const incomingEl = getLayerEl(incomingLayer)
    const outgoingEl = getLayerEl(visibleLayer)
    if (!incomingEl || !outgoingEl) {
      setVisibleLayer(incomingLayer)
      return
    }

    setIsTransitioning(true)
    gsap.killTweensOf(stage)
    gsap.killTweensOf(incomingEl)
    gsap.killTweensOf(outgoingEl)

    gsap.set(incomingEl, { autoAlpha: 0, zIndex: 2 })
    gsap.set(outgoingEl, { zIndex: 1 })

    const tl = gsap.timeline({
      onComplete: () => {
        setVisibleLayer(incomingLayer)
        setIsTransitioning(false)
      },
    })

    // Animation similar to map in SpacePage:
    // Scale down slightly, shift in direction of movement, blur and lower opacity
    tl.to(stage, {
      scale: 0.94,
      y: direction * 16,
      filter: 'blur(5px)',
      autoAlpha: 0.75,
      duration: 0.22,
      ease: 'power2.inOut',
    })
    tl.to(incomingEl, {
      autoAlpha: 1,
      duration: 0.2,
    }, '-=0.08')
    tl.to(outgoingEl, {
      autoAlpha: 0,
      duration: 0.15,
    }, '<')
    // Spring back into place
    tl.to(stage, {
      scale: 1,
      y: 0,
      filter: 'blur(0px)',
      autoAlpha: 1,
      duration: 0.32,
      ease: 'power3.out',
    }, '-=0.06')
  }, [activeIndex, isTransitioning, visibleLayer, getLayerEl])

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
        <div className="menu-preview__media" data-menu-motion="media" aria-live="polite">
          <div ref={mediaStageRef} className="menu-preview__media-stage">
            <div
              ref={layerARef}
              className="menu-preview__layer"
              data-visible={visibleLayer === 'a' || undefined}
              aria-hidden={visibleLayer !== 'a'}
            >
              {items[layerAIndex]?.image ? (
                <img src={items[layerAIndex].image} alt={items[layerAIndex].name} />
              ) : (
                <div className="menu-preview__media-fallback" aria-hidden="true">CONTRAST</div>
              )}
            </div>
            <div
              ref={layerBRef}
              className="menu-preview__layer"
              data-visible={visibleLayer === 'b' || undefined}
              aria-hidden={visibleLayer !== 'b'}
            >
              {items[layerBIndex]?.image ? (
                <img src={items[layerBIndex].image} alt={items[layerBIndex].name} />
              ) : (
                <div className="menu-preview__media-fallback" aria-hidden="true">CONTRAST</div>
              )}
            </div>
          </div>
          <span className="menu-preview__category">MÓN NỔI BẬT</span>
        </div>

        <div className="menu-preview__ledger" data-menu-motion="support">
          <div className="menu-list" role="tablist" aria-label="Danh sách món nổi bật">
            {items.map((item, index) => {
              const isSelected = activeIndex === index
              return (
                <button
                  type="button"
                  role="tab"
                  className="menu-item"
                  key={item.name}
                  data-active={isSelected || undefined}
                  aria-selected={isSelected}
                  onClick={() => chooseItem(index)}
                >
                  <span className="menu-item__name">
                    <strong>{item.name}</strong>
                    <small>{item.detail}</small>
                  </span>
                  <span className="menu-item__price">{item.price}</span>
                </button>
              )
            })}
          </div>
          <PublicActionLink className="menu-preview-link" href="/menu">KHÁM PHÁ MENU</PublicActionLink>
        </div>
      </div>
    </section>
  )
}
