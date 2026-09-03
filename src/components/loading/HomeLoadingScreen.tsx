import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ContrastLogo } from '@/components/brand/ContrastLogo'
import { HOME_LOADING_IMAGES } from '@/data/loadingImages'
import { setScrollLocked } from '@/lib/scroll-lock'
import { hasEnoughLoadingImages, selectLoadingImages } from './loading-state'

const IMAGE_LOAD_TIMEOUT = 700
const REDUCED_IMAGE_LOAD_TIMEOUT = 260
const REDUCED_STACK_HOLD = 140

type HomeLoadingScreenProps = {
  images?: readonly string[]
}

function preloadImage(src: string, timeout: number) {
  return new Promise<string | null>((resolve) => {
    const image = new window.Image()
    let timeoutId = 0
    let settled = false

    const settle = (result: string | null) => {
      if (settled) return
      settled = true
      window.clearTimeout(timeoutId)
      image.onload = null
      image.onerror = null
      resolve(result)
    }

    image.onload = () => settle(src)
    image.onerror = () => settle(null)
    timeoutId = window.setTimeout(() => settle(null), timeout)
    image.src = src

    if (image.complete) {
      settle(image.naturalWidth > 0 ? src : null)
    }
  })
}

export function HomeLoadingScreen({ images = HOME_LOADING_IMAGES }: HomeLoadingScreenProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [sources, setSources] = useState<readonly string[]>([])

  useEffect(() => {
    if (!visible) return

    const root = rootRef.current
    if (!root) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const selectedSources = selectLoadingImages(images)
    const previousHtmlOverflow = document.documentElement.style.overflow
    const previousBodyOverflow = document.body.style.overflow
    let cancelled = false
    let frame = 0
    let holdTimeout = 0
    let timeline: gsap.core.Timeline | null = null
    const loadingLogo = root.querySelector<HTMLElement>('[data-loading-logo]')
    const navLogo = document.querySelector<HTMLElement>('.site-nav__logo')
    const curtain = root.querySelector<HTMLElement>('[data-loading-curtain]')

    const restoreScroll = () => {
      setScrollLocked(false)
      document.documentElement.style.overflow = previousHtmlOverflow
      document.body.style.overflow = previousBodyOverflow
    }

    const finish = () => {
      if (cancelled) return
      if (navLogo) gsap.set(navLogo, { autoAlpha: 1 })
      restoreScroll()
      setVisible(false)
    }

    const exitWithoutStack = () => {
      gsap.to(root, {
        autoAlpha: 0,
        duration: 0.18,
        ease: 'power2.out',
        onComplete: finish,
      })
    }

    const liftCurtain = (cards: NodeListOf<HTMLElement>) => {
      if (!loadingLogo || !navLogo || !curtain) {
        exitWithoutStack()
        return
      }

      if (reduceMotion) {
        finish()
        return
      }

      const source = loadingLogo.getBoundingClientRect()
      const destination = navLogo.getBoundingClientRect()
      const x = destination.left + destination.width / 2 - (source.left + source.width / 2)
      const y = destination.top + destination.height / 2 - (source.top + source.height / 2)
      const scale = destination.width / source.width

      gsap.set(navLogo, { autoAlpha: 0 })
      gsap.set(curtain, { yPercent: 0, transformOrigin: '50% 100%' })
      timeline = gsap.timeline({ onComplete: finish })
      timeline
        .to(cards, {
          autoAlpha: 0,
          y: '+=10',
          duration: 0.2,
          ease: 'power2.out',
          stagger: { each: 0.018, from: 'center' },
        })
        .to(loadingLogo, {
          x,
          y,
          scale,
          duration: 0.56,
          ease: 'power3.inOut',
        }, '<0.04')
        .to(curtain, {
          yPercent: -100,
          duration: 0.58,
          ease: 'power3.inOut',
        }, '<0.12')
        .set(navLogo, { autoAlpha: 1 }, '>-0.08')
        .set(loadingLogo, { autoAlpha: 0 }, '<')
    }

    setScrollLocked(true)
    document.documentElement.style.overflow = 'hidden'
    document.body.style.overflow = 'hidden'

    const context = gsap.context(() => {}, root)
    const validSourcesPromise = Promise.all(
      selectedSources.map((src) =>
        preloadImage(src, reduceMotion ? REDUCED_IMAGE_LOAD_TIMEOUT : IMAGE_LOAD_TIMEOUT),
      ),
    )

    validSourcesPromise.then((results) => {
      if (cancelled) return

      const validSources = results.filter((src): src is string => Boolean(src))
      if (!hasEnoughLoadingImages(validSources)) {
        exitWithoutStack()
        return
      }

      setSources(validSources)
      frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(() => {
          if (cancelled) return

          const cards = root.querySelectorAll<HTMLElement>('[data-loading-card]')
          if (cards.length < 2) {
            finish()
            return
          }

          const viewportHeight = window.innerHeight
          const center = (cards.length - 1) / 2
          const getFinalX = (index: number) => (index - center) * 4.5
          const getFinalY = (index: number) => (index % 2 === 0 ? 2 : -2) + Math.abs(index - center) * 0.35
          const getFinalRotation = (index: number) => (index % 2 === 0 ? -2.2 : 2.4) + (index % 3) * 0.35

          context.add(() => {
            gsap.set(root, { autoAlpha: 1 })
            gsap.set(cards, {
              zIndex: (index) => index + 1,
              transformOrigin: '50% 50%',
            })

            if (reduceMotion) {
              gsap.set(loadingLogo, { autoAlpha: 1, scale: 1 })
              gsap.set(cards, {
                x: getFinalX,
                y: getFinalY,
                rotation: getFinalRotation,
                scale: 1,
                autoAlpha: 1,
              })
              holdTimeout = window.setTimeout(finish, REDUCED_STACK_HOLD)
              return
            }

            gsap.set(loadingLogo, {
              y: 16,
              scale: 0.96,
              autoAlpha: 0,
              transformOrigin: '50% 50%',
            })
            gsap.set(cards, {
              x: (index) => (index % 2 === 0 ? -1 : 1) * (window.innerWidth * 0.58 + 120 + (index % 3) * 28),
              y: (index) => viewportHeight + 120 + (index % 3) * 28,
              rotation: (index) => (index % 2 === 0 ? -1 : 1) * (11 + (index % 4) * 2),
              scale: 0.94,
              autoAlpha: 0,
            })

            timeline = gsap.timeline()
            timeline
              .to(loadingLogo, {
                y: 0,
                scale: 1,
                autoAlpha: 1,
                duration: 0.54,
                ease: 'power3.out',
              })
              .to(
                cards,
                {
                  x: getFinalX,
                  y: getFinalY,
                  rotation: getFinalRotation,
                  scale: 1,
                  autoAlpha: 1,
                  duration: 0.78,
                  ease: 'power3.out',
                  stagger: { each: 0.065, from: 'start' },
                },
                0.08,
              )
              .to(
                cards,
                {
                  x: getFinalX,
                  y: getFinalY,
                  rotation: getFinalRotation,
                  scale: 0.985,
                  duration: 0.24,
                  ease: 'power2.inOut',
                  stagger: { each: 0.015, from: 'end' },
                },
                '+=0.12',
              )
              .add(() => liftCurtain(cards), '+=0.18')
          })
        })
      })
    })

    return () => {
      cancelled = true
      window.cancelAnimationFrame(frame)
      window.clearTimeout(holdTimeout)
      timeline?.kill()
      context.revert()
      if (navLogo) gsap.set(navLogo, { clearProps: 'opacity,visibility' })
      restoreScroll()
    }
  }, [images, visible])

  if (!visible) return null

  return (
    <div ref={rootRef} className="home-loading" aria-hidden="true">
      <div className="home-loading__stage">
        <div className="home-loading__logo" data-loading-logo>
          <ContrastLogo variant="wordmark-light" alt="" />
        </div>
        <div className="home-loading__stack">
          {sources.map((src) => (
            <div className="home-loading__card" data-loading-card key={src}>
              <img className="home-loading__image" src={src} alt="" decoding="async" draggable="false" />
            </div>
          ))}
        </div>
        <div className="home-loading__curtain" data-loading-curtain aria-hidden="true" />
      </div>
    </div>
  )
}
