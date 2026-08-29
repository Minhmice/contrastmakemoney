import { useEffect, useRef } from 'react'
import { BrandLink } from '@/components/shared/BrandLink'
import { PublicActionButton } from '@/components/wrappers/PublicAction'

const HERO_VIDEO = '/video/contrast-wall-of-wishes.mp4'
const HERO_POSTER = '/video/contrast-wall-of-wishes.webp'

type HeroSectionProps = {
  onFindLocations: () => void
}

export function HeroSection({ onFindLocations }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotionPreference = () => {
      if (!videoRef.current) return
      if (mediaQuery.matches) videoRef.current.pause()
      else void videoRef.current.play()
    }

    syncMotionPreference()
    mediaQuery.addEventListener('change', syncMotionPreference)
    return () => mediaQuery.removeEventListener('change', syncMotionPreference)
  }, [])

  return (
    <section className="hero" id="top">
      <div className="hero__paper">
        <div className="hero__copy">
          <h1 className="hero__headline">
            <span className="hero__headline-line">CÒN VIỆC?</span>
            <span className="hero__headline-line hero__headline-joiner">CÒN</span>
            <span className="hero__headline-line hero__headline-brand">CONTRAST.</span>
          </h1>
          <p className="hero__lede">
            Việc chưa xong thì Contrast vẫn còn chỗ cho bạn.
          </p>
          <div className="hero__actions">
            <PublicActionButton className="hero__location-button" onClick={onFindLocations}>
              CHỌN CƠ SỞ
            </PublicActionButton>
            <BrandLink href="/menu">XEM MENU</BrandLink>
          </div>
        </div>
      </div>
      <div className="hero__media">
        <video
          ref={videoRef}
          className="hero__video"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={HERO_POSTER}
          aria-hidden="true"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      </div>
    </section>
  )
}
