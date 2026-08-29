import { useEffect, useState, type FormEvent } from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from 'lucide-react'
import { ContrastLogo } from '@/components/brand/ContrastLogo'
import { Button } from '@/components/ui/button'
import { AuthField } from '@/components/shared'
import { supabase } from '@/lib/supabase'

type AuthMode = 'login' | 'register'
type FieldErrors = Partial<
  Record<'name' | 'email' | 'password' | 'confirmPassword', string>
>
type FormValues = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const EMPTY_FORM: FormValues = { name: '', email: '', password: '', confirmPassword: '' }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(mode: AuthMode, values: FormValues) {
  const errors: FieldErrors = {}
  if (mode === 'register' && values.name.trim().length < 2)
    errors.name = 'Tên cần ít nhất 2 ký tự.'
  if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Nhập email hợp lệ.'
  if (values.password.length < 6) errors.password = 'Mật khẩu cần ít nhất 6 ký tự.'
  if (mode === 'register' && values.confirmPassword !== values.password)
    errors.confirmPassword = 'Mật khẩu chưa khớp.'
  return errors
}

function getReturnTo() {
  const returnTo = new URLSearchParams(window.location.search).get('returnTo')
  return returnTo === '/workspace' ? returnTo : '/workspace'
}

function getAuthErrorMessage(message: string) {
  const normalized = message.toLowerCase()
  if (normalized.includes('invalid login credentials'))
    return 'Email hoặc mật khẩu không đúng.'
  if (
    normalized.includes('user already registered') ||
    normalized.includes('already been registered')
  )
    return 'Email này đã có tài khoản.'
  if (normalized.includes('password should be at least'))
    return 'Mật khẩu chưa đạt yêu cầu bảo mật.'
  if (normalized.includes('rate limit'))
    return 'Bạn thử quá nhiều lần. Vui lòng chờ rồi thử lại.'
  if (normalized.includes('failed to fetch') || normalized.includes('network'))
    return 'Không thể kết nối máy chủ. Kiểm tra mạng rồi thử lại.'
  return 'Không thể xác thực lúc này. Vui lòng thử lại.'
}

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [values, setValues] = useState<FormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    document.body.classList.add('auth-is-open')
    return () => document.body.classList.remove('auth-is-open')
  }, [])

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    setErrors({})
    setFormError('')
  }

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setFormError('')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return

    const nextErrors = validate(mode, values)
    setErrors(nextErrors)
    setFormError('')
    if (Object.keys(nextErrors).length > 0) return

    setPending(true)
    try {
      const email = values.email.trim().toLowerCase()
      const result =
        mode === 'login'
          ? await supabase.auth.signInWithPassword({ email, password: values.password })
          : await supabase.auth.signUp({
              email,
              password: values.password,
              options: { data: { full_name: values.name.trim() } },
            })

      if (result.error) {
        setFormError(getAuthErrorMessage(result.error.message))
        return
      }
      if (!result.data.session) {
        setFormError('Tài khoản đã tạo. Kiểm tra email để xác nhận rồi đăng nhập.')
        return
      }
      window.location.replace(getReturnTo())
    } catch {
      setFormError('Không thể kết nối máy chủ. Kiểm tra mạng rồi thử lại.')
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="auth-page">
      <a className="auth-back" href="/" aria-label="Quay lại trang chủ">
        <ArrowLeft size={17} strokeWidth={1.8} aria-hidden="true" />
        TRANG CHỦ
      </a>

      <section className="auth-brand" aria-label="Contrast Coffee video giới thiệu">
        <video
          className="auth-brand__video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/video/contrast-wall-of-wishes.webp"
          aria-hidden="true"
        >
          <source src="/video/contrast-wall-of-wishes.mp4" type="video/mp4" />
        </video>
        <div className="auth-brand__scrim" aria-hidden="true" />
        <div className="auth-brand__noise" aria-hidden="true" />
        <div className="auth-brand__top">
          <ContrastLogo variant="wordmark-light" className="auth-logo" />
          <span>MEMBER ACCESS / 24H</span>
        </div>
        <div className="auth-brand__footer">
          <span>STUDY · WORK · COFFEE</span>
          <span>HỒ CHÍ MINH CITY</span>
        </div>
      </section>

      <section className="auth-panel" aria-labelledby="auth-title">
        <div
          className="auth-panel__inner"
          id="auth-content"
          role="tabpanel"
          aria-labelledby={`${mode}-tab`}
        >
          <div
            className="auth-switcher"
            role="tablist"
            aria-label="Chọn hình thức truy cập"
          >
            <Button
              variant="ghost"
              type="button"
              role="tab"
              id="login-tab"
              aria-controls="auth-content"
              aria-selected={mode === 'login'}
              disabled={pending}
              onClick={() => changeMode('login')}
            >
              ĐĂNG NHẬP
            </Button>
            <Button
              variant="ghost"
              type="button"
              role="tab"
              id="register-tab"
              aria-controls="auth-content"
              aria-selected={mode === 'register'}
              disabled={pending}
              onClick={() => changeMode('register')}
            >
              ĐĂNG KÝ
            </Button>
          </div>

          <div className="auth-heading" key={mode}>
            <h2 id="auth-title">
              {mode === 'login' ? 'Tiếp tục việc đang làm.' : 'Tạo tài khoản.'}
            </h2>
          </div>

          <form
            className={`auth-form auth-form--${mode}`}
            onSubmit={handleSubmit}
            noValidate
            aria-busy={pending}
          >
            {mode === 'register' ? (
              <AuthField
                inputId="name"
                label="HỌ VÀ TÊN"
                error={errors.name}
                errorId="name-error"
                icon={<UserRound size={18} strokeWidth={1.6} />}
              >
                <input
                  id="name"
                  name="name"
                  autoComplete="name"
                  disabled={pending}
                  value={values.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  placeholder=" "
                />
              </AuthField>
            ) : null}
            <AuthField
              inputId="email"
              label="EMAIL"
              error={errors.email}
              errorId="email-error"
              icon={<Mail size={18} strokeWidth={1.6} />}
            >
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                spellCheck={false}
                disabled={pending}
                value={values.email}
                onChange={(event) => updateField('email', event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? 'email-error' : undefined}
                placeholder=" "
              />
            </AuthField>
            <AuthField
              inputId="password"
              label="MẬT KHẨU"
              error={errors.password}
              errorId="password-error"
              icon={<LockKeyhole size={18} strokeWidth={1.6} />}
              action={
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? (
                    <EyeOff size={18} strokeWidth={1.6} />
                  ) : (
                    <Eye size={18} strokeWidth={1.6} />
                  )}
                </button>
              }
            >
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                disabled={pending}
                value={values.password}
                onChange={(event) => updateField('password', event.target.value)}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'password-error' : undefined}
                placeholder=" "
              />
            </AuthField>
            {mode === 'register' ? (
              <AuthField
                inputId="confirm-password"
                label="NHẬP LẠI MẬT KHẨU"
                error={errors.confirmPassword}
                errorId="confirm-password-error"
                icon={<LockKeyhole size={18} strokeWidth={1.6} />}
              >
                <input
                  id="confirm-password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  disabled={pending}
                  value={values.confirmPassword}
                  onChange={(event) => updateField('confirmPassword', event.target.value)}
                  aria-invalid={Boolean(errors.confirmPassword)}
                  aria-describedby={
                    errors.confirmPassword ? 'confirm-password-error' : undefined
                  }
                  placeholder=" "
                />
              </AuthField>
            ) : null}

            {formError ? (
              <p className="auth-form-error" role="alert">
                {formError}
              </p>
            ) : null}
            <button className="auth-submit" type="submit" disabled={pending}>
              {pending
                ? 'ĐANG XỬ LÝ...'
                : mode === 'login'
                  ? 'ĐĂNG NHẬP'
                  : 'TẠO TÀI KHOẢN'}
              <ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" />
            </button>
          </form>
        </div>
        <span className="auth-index">CC / MEMBER / 01</span>
      </section>
    </main>
  )
}
