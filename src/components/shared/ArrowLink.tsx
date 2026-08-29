import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type ArrowLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode
  light?: boolean
}

export function ArrowLink({
  children,
  href = '#',
  light = false,
  className,
  ...props
}: ArrowLinkProps) {
  return (
    <a
      className={cn('arrow-link', light && 'arrow-link--light', className)}
      href={href}
      {...props}
    >
      <span className="arrow-link__content">
        <span className="arrow-link__text">{children}</span>
        <ArrowUpRight
          className="arrow-link__icon"
          size={16}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </span>
    </a>
  )
}
