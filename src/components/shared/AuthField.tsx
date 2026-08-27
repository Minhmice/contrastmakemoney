import type { ReactNode } from 'react'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
type AuthFieldProps = {
  label: string
  error?: string
  errorId: string
  icon: ReactNode
  action?: ReactNode
  children: ReactNode
}

export function AuthField({ label, error, errorId, icon, action, children }: AuthFieldProps) {
  return (
    <Field data-invalid={Boolean(error)} className="auth-field">
      <FieldLabel>{label}</FieldLabel>
      <span className="auth-input" data-invalid={Boolean(error)}>
        <span aria-hidden="true">{icon}</span>
        {children}
        {action}
      </span>
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </Field>
  )
}
