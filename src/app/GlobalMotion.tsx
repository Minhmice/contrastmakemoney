import { useEffect, useRef, type ReactNode } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { registerScroller } from '@/lib/scroll-lock'

gsap.registerPlugin(ScrollTrigger)

export default function GlobalMotion({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({
      autoRaf: false,
      anchors: true,
      lerp: reduceMotion ? 1 : 0.09,
      duration: reduceMotion ? 0 : 1.05,
      respectReducedMotion: true,
    })
    const syncScroll = (time: number) => lenis.raf(time * 1000)
    const removeScrollListener = lenis.on('scroll', ScrollTrigger.update)
    const unregisterScroller = registerScroller(lenis)

    gsap.ticker.add(syncScroll)
    gsap.ticker.lagSmoothing(0)

    const refresh = () => ScrollTrigger.refresh()
    const initialHashFrame = window.requestAnimationFrame(() => {
      const targetId = window.location.hash.slice(1)
      const target = targetId ? document.getElementById(targetId) : null
      if (target) {
        window.history.replaceState(null, '', `#${targetId}`)
        lenis.resize()
        lenis.scrollTo(target, { immediate: true, force: true })
      }
      refresh()
    })
    window.addEventListener('load', refresh, { once: true })

    const ctx = gsap.context(() => {
      if (reduceMotion) return
      gsap.from(root, {
        opacity: 0.96,
        duration: 0.45,
        ease: 'power2.out',
      })
    }, root)

    return () => {
      window.removeEventListener('load', refresh)
      window.cancelAnimationFrame(initialHashFrame)
      ctx.revert()
      unregisterScroller()
      removeScrollListener()
      gsap.ticker.remove(syncScroll)
      lenis.destroy()
    }
  }, [])

  return (
    <div ref={rootRef} data-motion-root>
      {children}
    </div>
  )
}
