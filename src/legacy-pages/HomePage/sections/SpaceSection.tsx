'use client'

import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PublicActionLink } from '@/components/wrappers/PublicAction'

gsap.registerPlugin(ScrollTrigger)

const SPACE_IMAGES = [
  { src: '/images/space/contrast-space-1.webp', label: '01 — NGỒI XUỐNG', alt: 'Khách ngồi làm việc tại Contrast Coffee' },
  { src: '/images/space/contrast-space-2.webp', label: '02 — VÀO VIỆC', alt: 'Góc không gian làm việc tại Contrast Coffee' },
  { src: '/images/space/contrast-space-3.webp', label: '03 — Ở LẠI VỚI NÓ', alt: 'Không gian học tập tại Contrast Coffee' },
]

export function SpaceSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const media = gsap.matchMedia()
    media.add({ reduce: '(prefers-reduced-motion: reduce)', motion: '(prefers-reduced-motion: no-preference)' }, (context) => {
      if (context.conditions?.reduce) return
      const photos = Array.from(section.querySelectorAll<HTMLElement>('.space-photo'))
      const note = section.querySelector<HTMLElement>('.space-section__red-tag')
      const lines = Array.from(section.querySelectorAll<HTMLElement>('.space-section__red-tag-line'))
      const copy = Array.from(section.querySelectorAll<HTMLElement>('.space-section__copy > :not(.chapter-count)'))
      photos.forEach((photo, index) => {
        gsap.fromTo(photo,
          { autoAlpha: 0, scale: 0.9, y: 48 + index * 14, filter: 'blur(10px)' },
          { autoAlpha: 1, scale: 1, y: 0, filter: 'blur(0px)', ease: 'none',
            scrollTrigger: { trigger: section, start: 'top 96%', end: 'top 58%', scrub: 0.45 } },
        )
      })
      if (note) {
        gsap.fromTo(note,
          { autoAlpha: 0, scale: 0.92, rotation: -2, filter: 'blur(8px)' },
          { autoAlpha: 1, scale: 1, rotation: 7, filter: 'blur(0px)', ease: 'none',
            scrollTrigger: { trigger: section, start: 'top 92%', end: 'top 54%', scrub: 0.4 } },
        )
      }
      gsap.fromTo(lines, { autoAlpha: 0, yPercent: 75, filter: 'blur(6px)' }, { autoAlpha: 1, yPercent: 0, filter: 'blur(0px)', stagger: 0.08, ease: 'none', scrollTrigger: { trigger: section, start: 'top 90%', end: 'top 50%', scrub: 0.38 } })
      gsap.fromTo(copy, { autoAlpha: 0, y: 34, filter: 'blur(7px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', stagger: 0.1, ease: 'none', scrollTrigger: { trigger: section, start: 'top 86%', end: 'top 46%', scrub: 0.42 } })
    })
    return () => media.revert()
  }, [])

  return (
    <section ref={sectionRef} className="space-section" id="space" aria-labelledby="space-title">
      <div className="space-section__visual">
        {SPACE_IMAGES.map((image, index) => (
          <figure className={`space-photo space-photo--${index + 1}`} key={image.src}>
            <img src={image.src} alt={image.alt} width="1200" height="1200" loading="lazy" decoding="async" />
            <figcaption>{image.label}</figcaption>
          </figure>
        ))}
        <div className="space-section__red-tag" aria-hidden="true">
          <span className="space-section__red-tag-line">MỘT VIỆC.</span>
          <span className="space-section__red-tag-line">RỒI VIỆC</span>
          <span className="space-section__red-tag-line">TIẾP THEO.</span>
        </div>
      </div>
      <div className="space-section__copy">
        <span className="chapter-count">04 — 11</span>
        <h2 id="space-title">
          ĐẾN ĐỂ
          <br />
          <span>LÀM VIỆC.</span>
        </h2>
        <p>Không gian Contrast dành cho việc học sâu và làm việc nghiêm túc.</p>
        <p>
          Không phải background để check-in.
          <br />
          Đến đây là để làm cho xong.
        </p>
        <strong>Một nơi giúp bạn ngồi lại với mục tiêu đến cùng.</strong>
        <PublicActionLink className="space-section__action" href="#locations">XEM KHÔNG GIAN</PublicActionLink>
      </div>
    </section>
  )
}