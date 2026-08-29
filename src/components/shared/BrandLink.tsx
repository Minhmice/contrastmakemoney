import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type BrandLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode
  light?: boolean
}

export function BrandLink({
  children,
  light = false,
  className,
  ...props
}: BrandLinkProps) {
  return (
    <a className={cn('text-link', light && 'text-link--light', className)} {...props}>
      <span className="text-link__content">
        <span className="text-link__text">{children}</span>
        <ArrowUpRight
          className="text-link__icon"
          size={16}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </span>
    </a>
  )
}
