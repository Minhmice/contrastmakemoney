'use client'

import { useLayoutEffect, useRef } from 'react'
import { PublicActionLink } from '@/components/wrappers/PublicAction'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MOTION } from '@/lib/motion'

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
    media.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(
        steps,
        { autoAlpha: 0, y: 40 },
        {
          autoAlpha: 1,
          y: 0,
          duration: MOTION.duration.reveal,
          ease: 'power3.out',
          stagger: MOTION.duration.stagger,
          clearProps: 'transform,opacity,visibility',
          scrollTrigger: { trigger: steps[0], start: MOTION.reveal.start, once: true },
        },
      )
    })

    return () => media.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="focus-interlude section-dark"
      aria-label="Đến để làm việc"
    >
      <ol className="focus-interlude__steps">
        {FOCUS_STEPS.map((step, index) => (
          <li className="focus-step" key={step}>
            <span aria-hidden="true">0{index + 1}.</span>
            <strong>{step}</strong>
          </li>
        ))}
      </ol>
      <div className="focus-interlude__footer">
        <PublicActionLink className="focus-trigger" href="/workspace">
          VÀO WORKSPACE
        </PublicActionLink>
        <p className="focus-interlude__stamp">KIÊN TRÌ — KỶ LUẬT</p>
      </div>
    </section>
  )
}
