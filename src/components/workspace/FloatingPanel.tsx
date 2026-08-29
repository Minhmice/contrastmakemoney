'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import type { PanelLayout } from '@/features/workspace/layout'
import { clampPanel } from '@/features/workspace/layout'

type Props = {
  id: string
  title: string
  layout: PanelLayout
  resizable?: boolean
  className?: string
  onLayout: (layout: PanelLayout) => void
  onClose: () => void
  children: React.ReactNode
}

export function FloatingPanel({ id, title, layout, resizable = false, className = '', onLayout, onClose, children }: Props) {
  const panelRef = useRef<HTMLElement>(null)
  const dragRef = useRef<{ pointerId: number; x: number; y: number; layout: PanelLayout } | null>(null)
  const resizeRef = useRef<{ pointerId: number; x: number; y: number; layout: PanelLayout } | null>(null)
  const reduceMotion = useReducedMotion()
  const [origin, setOrigin] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateOrigin = () => {
      const dock = document.querySelector('[data-toolbar-dock-toggle]')
      const panel = panelRef.current
      if (!dock || !panel) return
      const dockRect = dock.getBoundingClientRect()
      const panelRect = panel.getBoundingClientRect()
      setOrigin({
        x: dockRect.left + dockRect.width / 2 - (panelRect.left + panelRect.width / 2),
        y: dockRect.top + dockRect.height / 2 - (panelRect.top + panelRect.height / 2),
      })
    }
    updateOrigin()
    window.addEventListener('resize', updateOrigin)
    return () => window.removeEventListener('resize', updateOrigin)
  }, [])

  const beginDrag = (event: React.PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest('button')) return
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, layout }
  }

  const moveDrag = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return
    onLayout(clampPanel({ ...drag.layout, x: drag.layout.x + event.clientX - drag.x, y: drag.layout.y + event.clientY - drag.y }, window.innerWidth, window.innerHeight))
  }

  const beginResize = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    resizeRef.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, layout }
  }

  const moveResize = (event: React.PointerEvent<HTMLButtonElement>) => {
    const resize = resizeRef.current
    if (!resize || resize.pointerId !== event.pointerId) return
    onLayout(clampPanel({ ...resize.layout, width: resize.layout.width + event.clientX - resize.x, height: resize.layout.height + event.clientY - resize.y }, window.innerWidth, window.innerHeight))
  }

  return (
    <motion.section
      ref={panelRef}
      id={id}
      className={'workspace-floating-panel ' + className}
      style={{ '--panel-x': layout.x + 'px', '--panel-y': layout.y + 'px', '--panel-width': layout.width + 'px', '--panel-height': layout.height + 'px' } as React.CSSProperties}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translate(' + origin.x + 'px, ' + origin.y + 'px) scaleX(0.76) scaleY(0.12) skewX(-8deg)', borderRadius: '999px' }}
      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, transform: 'translate(0px, 0px) scaleX(1) scaleY(1) skewX(0deg)', borderRadius: '14px' }}
      transition={reduceMotion ? { duration: 0.12 } : { type: 'spring', stiffness: 430, damping: 32, mass: 0.72 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: 'translate(' + origin.x + 'px, ' + origin.y + 'px) scaleX(0.06) scaleY(0.06) skewX(8deg)', borderRadius: '999px', transition: { duration: 0.28, ease: [0.23, 1, 0.32, 1] } }}
      aria-label={title}
    >
      <header className="workspace-floating-panel__header" onPointerDown={beginDrag} onPointerMove={moveDrag} onPointerUp={() => { dragRef.current = null }}>
        <h2>{title}</h2>
        <button type="button" onClick={onClose} aria-label={'Đóng ' + title}><X size={17} /></button>
      </header>
      <div className="workspace-floating-panel__body">{children}</div>
      {resizable ? <button className="workspace-floating-panel__resize" type="button" aria-label={'Đổi kích thước ' + title} onPointerDown={beginResize} onPointerMove={moveResize} onPointerUp={() => { resizeRef.current = null }} /> : null}
    </motion.section>
  )
}
