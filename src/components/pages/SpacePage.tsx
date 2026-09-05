'use client'

import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { ArrowDown, ArrowUpRight, MapPin, Phone } from 'lucide-react'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SiteNav } from '@/components/nav/SiteNav'
import { getMapFlyVector, LOCATIONS } from '@/data/locations'
import { MOTION } from '@/lib/motion'

gsap.registerPlugin(CustomEase, ScrollTrigger)
CustomEase.create('contrast-out', '0.23,1,0.32,1')

type MapLayer = 'a' | 'b'

type MapTransition = {
  targetIndex: number
  incomingLayer: MapLayer
  flyoutDone: boolean
  incomingReady: boolean
}

const SPACE_IMAGES = [
  { src: '/images/space/contrast-space-1.webp', alt: 'Khách ngồi làm việc tại Contrast Coffee' },
  { src: '/images/space/contrast-space-2.webp', alt: 'Góc làm việc tại Contrast Coffee' },
  { src: '/images/space/contrast-space-3.webp', alt: 'Không gian học tập tại Contrast Coffee' },
]

function otherLayer(layer: MapLayer): MapLayer {
  return layer === 'a' ? 'b' : 'a'
}

export default function SpacePage({ user: _user }: { user: User | null }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLElement>(null)
  const mapStageRef = useRef<HTMLDivElement>(null)
  const layerARef = useRef<HTMLDivElement>(null)
  const layerBRef = useRef<HTMLDivElement>(null)
  const transitionRef = useRef<MapTransition | null>(null)
  const flyTweenRef = useRef<gsap.core.Tween | null>(null)
  const fallbackTimerRef = useRef<number | null>(null)

  const [activeLocation, setActiveLocation] = useState(0)
  const [visibleLayer, setVisibleLayer] = useState<MapLayer>('a')
  const [layerUrls, setLayerUrls] = useState<{ a: string; b: string }>({
    a: LOCATIONS[0]?.embedUrl ?? '',
    b: '',
  })
  const [isInitialMapLoad, setIsInitialMapLoad] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const location = LOCATIONS[activeLocation] ?? LOCATIONS[0]

  const getLayerEl = useCallback((layer: MapLayer) => {
    return layer === 'a' ? layerARef.current : layerBRef.current
  }, [])

  const completeTransition = useCallback(() => {
    if (fallbackTimerRef.current) {
      window.clearTimeout(fallbackTimerRef.current)
      fallbackTimerRef.current = null
    }

    const pending = transitionRef.current
    const stage = mapStageRef.current
    if (!pending || !pending.flyoutDone || !pending.incomingReady || !stage) return

    const outgoingLayer = otherLayer(pending.incomingLayer)
    const outgoingEl = getLayerEl(outgoingLayer)
    const incomingEl = getLayerEl(pending.incomingLayer)
    if (!incomingEl) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targetIndex = pending.targetIndex
    const nextVisible = pending.incomingLayer

    flyTweenRef.current?.kill()
    flyTweenRef.current = null

    const timeline = gsap.timeline({
      defaults: { ease: 'contrast-out', overwrite: 'auto' },
      onComplete: () => {
        setVisibleLayer(nextVisible)
        setActiveLocation(targetIndex)
        setIsTransitioning(false)
        transitionRef.current = null
        gsap.set(stage, { clearProps: 'transform,filter,opacity,visibility' })
        if (outgoingEl) gsap.set(outgoingEl, { autoAlpha: 0, clearProps: 'zIndex' })
        gsap.set(incomingEl, { clearProps: 'opacity,visibility,zIndex' })
      },
    })

    if (reduceMotion) {
      if (outgoingEl) timeline.to(outgoingEl, { autoAlpha: 0, duration: 0.18 }, 0)
      timeline.to(incomingEl, { autoAlpha: 1, duration: 0.18 }, 0)
    } else {
      if (outgoingEl) timeline.to(outgoingEl, { autoAlpha: 0, duration: 0.28 }, 0)
      timeline.to(incomingEl, { autoAlpha: 1, duration: 0.28 }, 0)
      timeline.to(
        stage,
        { scale: 1, x: 0, y: 0, filter: 'blur(0px)', autoAlpha: 1, duration: 0.32 },
        '-=0.12',
      )
    }
  }, [getLayerEl])

  const tryCompleteTransition = useCallback(() => {
    completeTransition()
  }, [completeTransition])

  const runFlyover = useCallback(
    (fromIndex: number, toIndex: number, incomingLayer: MapLayer) => {
      const stage = mapStageRef.current
      const from = LOCATIONS[fromIndex]
      const to = LOCATIONS[toIndex]
      const incomingEl = getLayerEl(incomingLayer)
      if (!stage || !from || !to || !incomingEl) return

      gsap.set(incomingEl, { autoAlpha: 0, zIndex: 2 })
      const outgoingEl = getLayerEl(otherLayer(incomingLayer))
      if (outgoingEl) gsap.set(outgoingEl, { zIndex: 1 })

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) {
        if (transitionRef.current) transitionRef.current.flyoutDone = true
        tryCompleteTransition()
        return
      }

      const vector = getMapFlyVector(from, to)
      flyTweenRef.current?.kill()
      flyTweenRef.current = gsap.to(stage, {
        scale: 0.9,
        x: vector.x,
        y: vector.y,
        filter: 'blur(6px)',
        autoAlpha: 0.72,
        duration: 0.42,
        ease: 'contrast-out',
        overwrite: 'auto',
        onComplete: () => {
          if (transitionRef.current) {
            transitionRef.current.flyoutDone = true
            tryCompleteTransition()
          }
        },
      })
    },
    [getLayerEl, tryCompleteTransition],
  )

  const chooseLocation = useCallback(
    (index: number) => {
      if (index === activeLocation || isTransitioning) return

      const from = LOCATIONS[activeLocation]
      const to = LOCATIONS[index]
      if (!from || !to) return

      const incomingLayer = otherLayer(visibleLayer)
      const alreadyCached = layerUrls[incomingLayer] === to.embedUrl
      transitionRef.current = {
        targetIndex: index,
        incomingLayer,
        flyoutDone: false,
        incomingReady: alreadyCached,
      }

      if (fallbackTimerRef.current) {
        window.clearTimeout(fallbackTimerRef.current)
      }
      fallbackTimerRef.current = window.setTimeout(() => {
        if (transitionRef.current && transitionRef.current.targetIndex === index) {
          transitionRef.current.incomingReady = true
          tryCompleteTransition()
        }
      }, 700)

      setIsTransitioning(true)
      setLayerUrls((prev) => ({ ...prev, [incomingLayer]: to.embedUrl }))
      runFlyover(activeLocation, index, incomingLayer)
    },
    [activeLocation, isTransitioning, layerUrls, runFlyover, tryCompleteTransition, visibleLayer],
  )

  const handleMapLoad = useCallback(
    (layer: MapLayer) => {
      if (isInitialMapLoad && layer === visibleLayer) {
        setIsInitialMapLoad(false)
        return
      }

      const pending = transitionRef.current
      if (!pending || pending.incomingLayer !== layer) return

      pending.incomingReady = true
      tryCompleteTransition()
    },
    [isInitialMapLoad, tryCompleteTransition, visibleLayer],
  )

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const mm = gsap.matchMedia()
    mm.add({ motion: '(prefers-reduced-motion: no-preference)' }, (context) => {
      if (!context.conditions?.motion) return
      const select = gsap.utils.selector(root)
      const hero = gsap.timeline({ defaults: { ease: 'contrast-out', overwrite: 'auto' } })
      hero
        .fromTo(select('.space-hero__image'), { clipPath: 'inset(0 0 100% 0)', scale: 1.04, filter: 'blur(9px)' }, { clipPath: 'inset(0 0 0 0)', scale: 1, filter: 'blur(0px)', duration: 0.82 })
        .fromTo(select('.space-hero h1'), { y: 42, autoAlpha: 0, filter: 'blur(7px)' }, { y: 0, autoAlpha: 1, filter: 'blur(0px)', duration: 0.58 }, '-=0.5')
        .fromTo(select('.space-hero__copy p, .space-hero__copy a'), { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.42, stagger: 0.08 }, '-=0.26')

      const sequence = select('.space-sequence')[0]
      const gallery = gsap.utils.toArray<HTMLElement>(select('.space-sequence__gallery figure'))
      const quote = select('.space-sequence blockquote')
      if (sequence) {
        gallery.forEach((figure, index) => {
          const image = figure.querySelector('img')
          gsap.fromTo(figure, { y: 64 - index * 14, autoAlpha: 0, filter: 'blur(8px)' }, {
            y: 0,
            autoAlpha: 1,
            filter: 'blur(0px)',
            ease: 'none',
            scrollTrigger: { trigger: sequence, ...MOTION.reveal },
          })
          if (image) gsap.fromTo(image, { scale: 1.12, filter: 'blur(6px) saturate(.62)' }, {
            scale: 1,
            filter: 'blur(0px) saturate(.78)',
            ease: 'none',
            scrollTrigger: { trigger: sequence, ...MOTION.reveal },
          })
        })
        gsap.fromTo(select('.space-sequence > header > *'), { y: 34, autoAlpha: 0, filter: 'blur(7px)' }, {
          y: 0, autoAlpha: 1, filter: 'blur(0px)', stagger: MOTION.duration.stagger, ease: MOTION.ease,
          scrollTrigger: { trigger: sequence, ...MOTION.reveal },
        })
        gsap.fromTo(quote, { yPercent: 30, autoAlpha: 0, filter: 'blur(6px)' }, {
          yPercent: 0, autoAlpha: 1, filter: 'blur(0px)', ease: 'none',
          scrollTrigger: { trigger: sequence, ...MOTION.reveal },
        })
      }

      const locations = select('.space-locations')[0]
      if (locations) {
        gsap.fromTo(select('.space-locations > header > *'), { y: 36, autoAlpha: 0, filter: 'blur(7px)' }, {
          y: 0, autoAlpha: 1, filter: 'blur(0px)', stagger: MOTION.duration.stagger, ease: MOTION.ease,
          scrollTrigger: { trigger: locations, ...MOTION.reveal },
        })
        gsap.fromTo(select('.space-locations__map'), { y: 48, autoAlpha: 0, scale: 0.985, filter: 'blur(9px)' }, {
          y: 0, autoAlpha: 1, scale: 1, filter: 'blur(0px)', ease: 'none',
          scrollTrigger: { trigger: locations, ...MOTION.reveal },
        })
        gsap.fromTo(select('.space-location'), { x: 36, autoAlpha: 0, filter: 'blur(6px)' }, {
          x: 0, autoAlpha: 1, filter: 'blur(0px)', stagger: MOTION.duration.stagger, ease: MOTION.ease,
          scrollTrigger: { trigger: locations, ...MOTION.reveal },
        })
      }
    }, root)
    return () => {
      if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current)
      flyTweenRef.current?.kill()
      mm.revert()
    }
  }, [])

  if (!location) return null

  const renderMapLayer = (layer: MapLayer) => {
    const url = layerUrls[layer]
    const isVisible = visibleLayer === layer
    const loc = LOCATIONS.find((item) => item.embedUrl === url)

    return (
      <div
        ref={layer === 'a' ? layerARef : layerBRef}
        className="space-locations__map-layer"
        data-visible={isVisible || undefined}
        aria-hidden={!isVisible}
      >
        {url ? (
          <iframe
            title={loc ? `Bản đồ Contrast Coffee ${loc.name}` : 'Bản đồ Contrast Coffee'}
            src={url}
            loading="eager"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            onLoad={() => handleMapLoad(layer)}
          />
        ) : null}
      </div>
    )
  }

  return (
    <div ref={rootRef} className="space-page">
      <SiteNav current="space" />
      <main>
        <section className="space-hero" aria-labelledby="space-page-title">
          <div className="space-hero__copy">
            <h1 id="space-page-title">CHỖ ĐỂ<br /><span>VÀO VIỆC.</span></h1>
            <p>Không gian cho buổi học sâu, deadline dài và công việc cần làm cho xong.</p>
            <a href="#experience">KHÁM PHÁ KHÔNG GIAN <ArrowDown size={17} aria-hidden="true" /></a>
          </div>
          <figure className="space-hero__image">
            <img src={SPACE_IMAGES[0].src} alt={SPACE_IMAGES[0].alt} width="1200" height="1200" fetchPriority="high" />
          </figure>
        </section>

        <section className="space-sequence" id="experience" aria-labelledby="space-sequence-title">
          <header><h2 id="space-sequence-title">MỘT NHỊP<br />ĐỦ TĨNH.</h2><p>Đến, chọn chỗ, đặt laptop xuống. Phần còn lại là việc của bạn.</p></header>
          <div className="space-sequence__gallery">
            {SPACE_IMAGES.slice(1).map((image) => <figure key={image.src}><img src={image.src} alt={image.alt} width="1200" height="1200" loading="lazy" decoding="async" /></figure>)}
            <blockquote>“Không cần cảm hứng.<br />Cần một chỗ để bắt đầu.”</blockquote>
          </div>
        </section>

        <section className="space-locations" aria-labelledby="space-locations-title">
          <header><h2 id="space-locations-title">TÌM ĐÚNG<br /><span>CHỖ NGỒI.</span></h2><p>Địa chỉ và liên hệ được cập nhật từ Facebook Contrast Coffee. Chọn cơ sở để xem vị trí.</p></header>
          <div className="space-locations__layout">
            <article ref={mapRef} id="space-map" className="space-locations__map" aria-live="polite" aria-busy={isInitialMapLoad || isTransitioning}>
              <div ref={mapStageRef} className="space-locations__map-stage">
                {renderMapLayer('a')}
                {renderMapLayer('b')}
                <div className="space-map-loader" data-loading={isInitialMapLoad || undefined} aria-hidden="true"><span /><strong>ĐANG MỞ BẢN ĐỒ</strong></div>
              </div>
              <div className="space-locations__map-info">
                <div className="space-locations__map-info-inner" key={location.embedUrl}>
                  <strong>CONTRAST COFFEE {location.name}</strong>
                  <span>{location.address}</span>
                </div>
              </div>
            </article>
            <div className="space-locations__list" role="tablist" aria-label="Chọn cơ sở Contrast Coffee">
              {LOCATIONS.map((item, index) => <article key={item.name} className="space-location" data-active={activeLocation === index || undefined}>
                <button type="button" role="tab" aria-selected={activeLocation === index} aria-controls="space-map" id={'space-location-' + index} onClick={() => chooseLocation(index)}><span>CS{index + 1}</span><strong>{item.name}</strong><ArrowUpRight size={20} aria-hidden="true" /></button>
                <div className="space-location__detail" aria-hidden={activeLocation !== index}>
                  <div className="space-location__detail-inner">
                    <p className="space-location__note">{item.note}</p>
                    <div className="space-location__info">
                      <address className="space-location__meta-item">
                        <MapPin size={16} aria-hidden="true" />
                        <span>{item.address}</span>
                      </address>
                      <a className="space-location__meta-item space-location__phone" href={'tel:' + item.phone.replace(/\s/g, '')}>
                        <Phone size={15} aria-hidden="true" />
                        <span>{item.phone}</span>
                      </a>
                    </div>
                    <a className="space-location__map-action" href={item.mapsUrl} target="_blank" rel="noreferrer">
                      <span>MỞ GOOGLE MAPS</span>
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </article>)}
            </div>
          </div>
        </section>
      </main>
      <footer className="space-footer"><strong>CONTRAST<br /><span>COFFEE</span></strong><p>Một chỗ ngồi không làm thay công việc.<br />Nhưng giúp bạn bắt đầu.</p><a href="/menu">CHỌN MỘT MÓN <ArrowUpRight size={17} aria-hidden="true" /></a></footer>
    </div>
  )
}
