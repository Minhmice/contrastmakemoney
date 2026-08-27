import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type BrandButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  variant?: 'red' | 'dark' | 'light' | 'ghost'
}

const variantClasses = {
  red: 'button button--red',
  dark: 'button button--dark',
  light: 'button button--light',
  ghost: 'button button--ghost',
} as const

export function BrandButton({ children, variant = 'dark', className, ...props }: BrandButtonProps) {
  return (
    <Button className={cn(variantClasses[variant], className)} {...props}>
      {children}
    </Button>
  )
}
