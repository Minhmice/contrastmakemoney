import type { ReactNode } from 'react'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
type AuthFieldProps = {
  inputId: string
  label: string
  error?: string
  errorId: string
  icon: ReactNode
  action?: ReactNode
  children: ReactNode
}

export function AuthField({ inputId, label, error, errorId, icon, action, children }: AuthFieldProps) {
  return (
    <Field data-invalid={Boolean(error)} className="auth-field">
      <span className="auth-input" data-invalid={Boolean(error)}>
        <span className="auth-input__icon" aria-hidden="true">{icon}</span>
        <span className="auth-input__control">
          {children}
          <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
        </span>
        {action}
        <span className="auth-input__line" aria-hidden="true" />
        <span className="auth-input__progress" aria-hidden="true" />
      </span>
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </Field>
  )
}
