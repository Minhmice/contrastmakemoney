'use client'

import { useEffect, useRef } from 'react'
import { PublicActionLink } from '@/components/wrappers/PublicAction'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ContrastLogo } from '@/components/brand/ContrastLogo'

gsap.registerPlugin(ScrollTrigger)

export function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const footer = footerRef.current
    if (!footer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: footer,
          start: 'top 88%',
          end: 'top 48%',
          scrub: 0.45,
        },
      })

      timeline
        .fromTo(
          '.site-footer__headline-line',
          { yPercent: 72, autoAlpha: 0, filter: 'blur(8px)' },
          { yPercent: 0, autoAlpha: 1, filter: 'blur(0px)', stagger: 0.08, ease: 'none' },
        )
        .fromTo(
          '.footer-red-block',
          { xPercent: 36, rotate: 4, autoAlpha: 0 },
          { xPercent: 0, rotate: 0, autoAlpha: 1, ease: 'none' },
          0.08,
        )
        .fromTo(
          '.site-footer__details > *',
          { y: 20, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, stagger: 0.06, ease: 'none' },
          0.18,
        )
    }, footer)

    return () => ctx.revert()
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
