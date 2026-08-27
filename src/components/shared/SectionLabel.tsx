import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type SectionLabelProps = {
  children: ReactNode
  dark?: boolean
  className?: string
}

export function SectionLabel({ children, dark = false, className }: SectionLabelProps) {
  return (
    <p className={cn('section-label', dark && 'section-label--dark', className)}>
      <span className="section-label__line" />
      {children}
    </p>
  )
}
