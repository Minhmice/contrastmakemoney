import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BrandLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode
  light?: boolean
}

export function BrandLink({ children, light = false, className, ...props }: BrandLinkProps) {
  return (
    <a className={cn('text-link', light && 'text-link--light', className)} {...props}>
      {children}
    </a>
  )
}
