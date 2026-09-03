'use client'

import { useEffect, useRef } from 'react'
import { PublicActionLink } from '@/components/wrappers/PublicAction'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ContrastLogo } from '@/components/brand/ContrastLogo'
import { MOTION } from '@/lib/motion'

gsap.registerPlugin(ScrollTrigger)

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const footer = footerRef.current
    if (
      !footer ||
      !window.matchMedia('(min-width: 768px) and (prefers-reduced-motion: no-preference)').matches
    ) return

    const refresh = () => ScrollTrigger.refresh()

    const ctx = gsap.context(() => {
      const headline = footer.querySelector('.site-footer__headline')
      const headlineLines = footer.querySelectorAll('.site-footer__headline-line')
      if (!headline || headlineLines.length === 0) return

      const lineReveal = { yPercent: 72, autoAlpha: 0, filter: 'blur(8px)' }
      const lineSettled = { yPercent: 0, autoAlpha: 1, filter: 'blur(0px)', ease: 'none' as const }
      const lineDuration = MOTION.duration.reveal
      const lineGap = MOTION.duration.sequenceDelay

      gsap.set(headlineLines, lineReveal)

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: headline,
          start: MOTION.reveal.start,
          end: MOTION.reveal.end,
          scrub: MOTION.reveal.scrub,
          invalidateOnRefresh: true,
        },
      })

      headlineLines.forEach((line, index) => {
        timeline.fromTo(
          line,
          lineReveal,
          { ...lineSettled, duration: lineDuration },
          index * lineGap,
        )
      })

      timeline
        .fromTo(
          '.footer-red-block',
          { xPercent: 36, rotate: 4, autoAlpha: 0 },
          { xPercent: 0, rotate: 0, autoAlpha: 1, ease: 'none', duration: lineDuration },
          lineGap + 0.1,
        )
        .fromTo(
          '.site-footer__details > *',
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, stagger: 0.06, ease: 'none' },
          lineGap * 2 + 0.12,
        )
    }, footer)

    void document.fonts?.ready.then(refresh)
    window.addEventListener('resize', refresh)
    requestAnimationFrame(refresh)

    return () => {
      window.removeEventListener('resize', refresh)
      ctx.revert()
    }
  }, [])

  return (
    <footer className="site-footer" ref={footerRef}>
      <div className="site-footer__action">
        <div className="site-footer__statement">
          <p className="site-footer__kicker">KIÊN TRÌ - KỶ LUẬT</p>
          <h2 className="site-footer__headline">
            <span className="site-footer__headline-mask">
              <span className="site-footer__headline-line">VIỆC CHƯA XONG?</span>
            </span>
            <span className="site-footer__headline-mask">
              <span className="site-footer__headline-line site-footer__headline-line--red">CỨ ĐẾN CONTRAST.</span>
            </span>
          </h2>
          <PublicActionLink className="site-footer__cta" href="/space">CHỌN KHÔNG GIAN</PublicActionLink>
        </div>

        <div className="footer-red-block" aria-label="Contrast Coffee mở cửa 24 giờ">
          <span>CONTRAST</span>
          <span>COFFEE</span>
          <strong>24H</strong>
        </div>
      </div>

      <div className="site-footer__details">
        <div className="site-footer__identity">
          <a className="footer-brand" href="#top" aria-label="Về đầu trang">
            <ContrastLogo variant="wordmark-dark" className="brand-logo brand-logo--footer" />
          </a>
          <p>Không gian cho những ngày cần tập trung.</p>
        </div>

        <nav className="footer-links" aria-label="Liên kết cuối trang">
          <div>
            <span>KHÁM PHÁ</span>
            <a href="/space">KHÔNG GIAN</a>
            <a href="/menu">MENU</a>
          </div>
          <div>
            <span>TRUY CẬP</span>
            <a href="/workspace">WORKSPACE</a>
            <a href="/staff-checkin">CHECK-IN</a>
          </div>
        </nav>
      </div>

      <div className="site-footer__bottom">
        <span>© {new Date().getFullYear()} CONTRAST COFFEE</span>
        <span>THÀNH PHỐ HỒ CHÍ MINH, VIỆT NAM</span>
      </div>
    </footer>
  )
}
