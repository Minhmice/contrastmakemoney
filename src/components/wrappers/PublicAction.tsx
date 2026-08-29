import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

type BaseProps = { children: ReactNode; className?: string; size?: 'default' | 'nav' }
type LinkProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement>
type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>

function Content({ children }: Pick<BaseProps, 'children'>) {
  return <><span>{children}</span><ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" /></>
}

export function PublicActionLink({ children, className, size = 'default', ...props }: LinkProps) {
  return <a className={cn('public-action', 'public-action--' + size, className)} {...props}><Content>{children}</Content></a>
}

export function PublicActionButton({ children, className, size = 'default', type = 'button', ...props }: ButtonProps) {
  return <button className={cn('public-action', 'public-action--' + size, className)} type={type} {...props}><Content>{children}</Content></button>
}
