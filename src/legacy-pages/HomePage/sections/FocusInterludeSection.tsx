'use client'

import { useLayoutEffect, useRef } from 'react'
import { PublicActionLink } from '@/components/wrappers/PublicAction'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const FOCUS_STEPS = [
  'MỞ VIỆC CẦN LÀM.',
  'ĐẶT ĐIỆN THOẠI XUỐNG.',
  'BẮT ĐẦU.',
  'ĐỪNG NGHĨ QUÁ NHIỀU.',
  'LÀM TIẾP.',
]

export function FocusInterludeSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const steps = section.querySelectorAll('.focus-step')
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        steps,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: { trigger: steps[0], start: 'top 90%', once: true },
        },
      )
    })

    return () => media.revert()
  }, [])

  return (
    <section ref={sectionRef} className="focus-interlude section-dark">
      <div className="focus-interlude__steps">
        {FOCUS_STEPS.map((step, index) => (
          <div className="focus-step" key={step}>
            <span>0{index + 1}.</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>
      <PublicActionLink className="focus-trigger" href="/workspace">VÀO WORKSPACE</PublicActionLink>
      <div className="focus-interlude__stamp">KIÊN TRÌ — KỶ LUẬT</div>
    </section>
  )
}
