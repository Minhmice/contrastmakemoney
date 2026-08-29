import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { BrandLink } from '@/components/shared/BrandLink'
import { Button } from '@/components/ui/button'

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
          <h1>
            CÒN VIỆC?
            <br />
            <span>CÒN CONTRAST.</span>
          </h1>
          <p className="hero__lede">
            Một chỗ để tập trung, làm việc và hoàn thành điều đang dang dở.
          </p>
          <div className="hero__actions">
            <Button
              className="button button--red hero__location-button"
              size="lg"
              onClick={onFindLocations}
            >
              <span className="hero__location-button__label">TÌM CƠ SỞ</span>
              <ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
            </Button>
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
