'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { ArrowDown, ArrowUpRight, MapPin, Phone } from 'lucide-react'
import { gsap } from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SiteNav } from '@/components/nav/SiteNav'
import { LOCATIONS } from '@/data/locations'

gsap.registerPlugin(CustomEase, ScrollTrigger)
CustomEase.create('contrast-out', '0.23,1,0.32,1')

const SPACE_IMAGES = [
  { src: '/images/space/contrast-space-1.webp', alt: 'Khách ngồi làm việc tại Contrast Coffee' },
  { src: '/images/space/contrast-space-2.webp', alt: 'Góc làm việc tại Contrast Coffee' },
  { src: '/images/space/contrast-space-3.webp', alt: 'Không gian học tập tại Contrast Coffee' },
]

export default function SpacePage({ user: _user }: { user: User | null }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<HTMLElement>(null)
  const [activeLocation, setActiveLocation] = useState(0)
  const [isMapLoading, setIsMapLoading] = useState(true)
  const location = LOCATIONS[activeLocation] ?? LOCATIONS[0]
  const chooseLocation = (index: number) => {
    if (index === activeLocation) return
    setIsMapLoading(true)
    setActiveLocation(index)
  }

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
            scrollTrigger: { trigger: sequence, start: 'top 96%', end: 'top 54%', scrub: 0.45 },
          })
          if (image) gsap.fromTo(image, { scale: 1.12, filter: 'blur(6px) saturate(.62)' }, {
            scale: 1,
            filter: 'blur(0px) saturate(.78)',
            ease: 'none',
            scrollTrigger: { trigger: sequence, start: 'top 94%', end: 'top 48%', scrub: 0.5 },
          })
        })
        gsap.fromTo(select('.space-sequence > header > *'), { y: 34, autoAlpha: 0, filter: 'blur(7px)' }, {
          y: 0, autoAlpha: 1, filter: 'blur(0px)', stagger: 0.1, ease: 'none',
          scrollTrigger: { trigger: sequence, start: 'top 90%', end: 'top 48%', scrub: 0.42 },
        })
        gsap.fromTo(quote, { yPercent: 30, autoAlpha: 0, filter: 'blur(6px)' }, {
          yPercent: 0, autoAlpha: 1, filter: 'blur(0px)', ease: 'none',
          scrollTrigger: { trigger: sequence, start: 'top 88%', end: 'top 46%', scrub: 0.4 },
        })
      }

      const locations = select('.space-locations')[0]
      if (locations) {
        gsap.fromTo(select('.space-locations > header > *'), { y: 36, autoAlpha: 0, filter: 'blur(7px)' }, {
          y: 0, autoAlpha: 1, filter: 'blur(0px)', stagger: 0.1, ease: 'none',
          scrollTrigger: { trigger: locations, start: 'top 92%', end: 'top 54%', scrub: 0.42 },
        })
        gsap.fromTo(select('.space-locations__map'), { y: 48, autoAlpha: 0, scale: 0.985, filter: 'blur(9px)' }, {
          y: 0, autoAlpha: 1, scale: 1, filter: 'blur(0px)', ease: 'none',
          scrollTrigger: { trigger: locations, start: 'top 96%', end: 'top 50%', scrub: 0.5 },
        })
        gsap.fromTo(select('.space-location'), { x: 36, autoAlpha: 0, filter: 'blur(6px)' }, {
          x: 0, autoAlpha: 1, filter: 'blur(0px)', stagger: 0.08, ease: 'none',
          scrollTrigger: { trigger: locations, start: 'top 90%', end: 'top 46%', scrub: 0.42 },
        })
      }
    }, root)
    return () => mm.revert()
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsMapLoading(false), 4500)
    return () => window.clearTimeout(timeoutId)
  }, [activeLocation])

  useEffect(() => {
    const panel = mapRef.current
    if (!panel || isMapLoading || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const context = gsap.context(() => {
      gsap.fromTo(panel, { autoAlpha: 0.64, scale: 0.985, filter: 'blur(6px)' }, { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.42, ease: 'contrast-out', overwrite: 'auto' })
    }, panel)
    return () => context.revert()
  }, [activeLocation, isMapLoading])

  if (!location) return null
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
            <article ref={mapRef} id="space-map" className="space-locations__map" aria-live="polite" aria-busy={isMapLoading}>
              <iframe key={location.embedUrl} title={'Bản đồ Contrast Coffee ' + location.name} src={location.embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen onLoad={() => setIsMapLoading(false)} />
              <div className="space-map-loader" data-loading={isMapLoading || undefined} aria-hidden="true"><span /><strong>ĐANG MỞ BẢN ĐỒ</strong></div>
              <div className="space-locations__map-info"><strong>CONTRAST COFFEE {location.name}</strong><span>{location.address}</span></div>
            </article>
            <div className="space-locations__list" role="tablist" aria-label="Chọn cơ sở Contrast Coffee">
              {LOCATIONS.map((item, index) => <article key={item.name} className="space-location" data-active={activeLocation === index || undefined}>
                <button type="button" role="tab" aria-selected={activeLocation === index} aria-controls="space-map" id={'space-location-' + index} onClick={() => chooseLocation(index)}><span>CS{index + 1}</span><strong>{item.name}</strong><ArrowUpRight size={20} aria-hidden="true" /></button>
                <div className="space-location__detail"><p>{item.note}</p><address><MapPin size={17} aria-hidden="true" />{item.address}</address><a href={'tel:' + item.phone.replace(/\s/g, '')}><Phone size={16} aria-hidden="true" />{item.phone}</a><a href={item.mapsUrl} target="_blank" rel="noreferrer">MỞ GOOGLE MAPS <ArrowUpRight size={16} aria-hidden="true" /></a></div>
              </article>)}
            </div>
          </div>
        </section>
      </main>
      <footer className="space-footer"><strong>CONTRAST<br /><span>COFFEE</span></strong><p>Một chỗ ngồi không làm thay công việc.<br />Nhưng giúp bạn bắt đầu.</p><a href="/menu">CHỌN MỘT MÓN <ArrowUpRight size={17} aria-hidden="true" /></a></footer>
    </div>
  )
}
