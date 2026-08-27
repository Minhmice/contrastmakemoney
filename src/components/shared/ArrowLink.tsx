import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type ArrowLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode
  light?: boolean
}

export function ArrowLink({ children, href = '#', light = false, className, ...props }: ArrowLinkProps) {
  return (
    <a className={cn('arrow-link', light && 'arrow-link--light', className)} href={href} {...props}>
      <span>{children}</span>
      <span className="arrow-link__icon" aria-hidden="true">
        <ArrowUpRight size={16} strokeWidth={1.8} />
      </span>
    </a>
  )
}
