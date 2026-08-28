import { useEffect, useState, type FormEvent } from 'react'
import { ArrowLeft, ArrowUpRight, Check, Eye, EyeOff, LockKeyhole, Mail, Phone, UserRound } from 'lucide-react'
import { ContrastLogo } from '@/components/brand/ContrastLogo'
import { Button } from '@/components/ui/button'
import { AuthField } from '@/components/shared'

type AuthMode = 'login' | 'register'
type FieldErrors = Partial<Record<'name' | 'phone' | 'email' | 'password' | 'confirmPassword', string>>
type FormValues = { name: string; phone: string; email: string; password: string; confirmPassword: string }

const EMPTY_FORM: FormValues = { name: '', phone: '', email: '', password: '', confirmPassword: '' }
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(mode: AuthMode, values: FormValues) {
  const errors: FieldErrors = {}
  if (mode === 'register' && values.name.trim().length < 2) errors.name = 'Tên cần ít nhất 2 ký tự.'
  if (mode === 'register' && values.phone.trim() && !/^[+\d][\d\s().-]{7,}$/.test(values.phone.trim())) errors.phone = 'Nhập số điện thoại hợp lệ.'
  if (!EMAIL_PATTERN.test(values.email)) errors.email = 'Nhập email hợp lệ.'
  if (values.password.length < 6) errors.password = 'Mật khẩu cần ít nhất 6 ký tự.'
  if (mode === 'register' && values.confirmPassword !== values.password) errors.confirmPassword = 'Mật khẩu chưa khớp.'
  return errors
}

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('login')
  const [values, setValues] = useState<FormValues>(EMPTY_FORM)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    document.body.classList.add('auth-is-open')
    return () => document.body.classList.remove('auth-is-open')
  }, [])

  const changeMode = (nextMode: AuthMode) => {
    setMode(nextMode)
    setErrors({})
    setSubmitted(false)
  }

  const updateField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSubmitted(false)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(mode, values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length === 0) setSubmitted(true)
  }

  return (
    <main className="auth-page">
      <a className="auth-back" href="/" aria-label="Quay lại trang chủ"><ArrowLeft size={17} strokeWidth={1.8} aria-hidden="true" />TRANG CHỦ</a>

      <section className="auth-brand" aria-label="Contrast Coffee video giới thiệu">
        <video className="auth-brand__video" autoPlay muted loop playsInline preload="metadata" poster="/video/contrast-wall-of-wishes.webp" aria-hidden="true">
          <source src="/video/contrast-wall-of-wishes.mp4" type="video/mp4" />
        </video>
        <div className="auth-brand__scrim" aria-hidden="true" />
        <div className="auth-brand__noise" aria-hidden="true" />
        <div className="auth-brand__top"><ContrastLogo variant="wordmark-light" className="auth-logo" /><span>MEMBER ACCESS / 24H</span></div>
        <div className="auth-brand__footer"><span>STUDY · WORK · COFFEE</span><span>HỒ CHÍ MINH CITY</span></div>
      </section>

      <section className="auth-panel" aria-labelledby="auth-title">
        <div className="auth-panel__inner" id="auth-content" role="tabpanel" aria-labelledby={`${mode}-tab`}>
          <div className="auth-switcher" role="tablist" aria-label="Chọn hình thức truy cập">
            <Button variant="ghost" type="button" role="tab" id="login-tab" aria-controls="auth-content" aria-selected={mode === 'login'} onClick={() => changeMode('login')}>ĐĂNG NHẬP</Button>
            <Button variant="ghost" type="button" role="tab" id="register-tab" aria-controls="auth-content" aria-selected={mode === 'register'} onClick={() => changeMode('register')}>ĐĂNG KÝ</Button>
          </div>

          <div className="auth-heading" key={mode}>
            <h2 id="auth-title">{mode === 'login' ? 'Tiếp tục việc đang làm.' : 'Tạo tài khoản Contrast.'}</h2>
          </div>

          {submitted ? (
            <div className="auth-success" role="status"><span><Check size={22} strokeWidth={2} aria-hidden="true" /></span><div><strong>{mode === 'login' ? 'ĐĂNG NHẬP THÀNH CÔNG.' : 'TÀI KHOẢN ĐÃ SẴN SÀNG.'}</strong><p>Demo giao diện đã xác nhận dữ liệu. Kết nối API khi backend sẵn sàng.</p></div><button type="button" onClick={() => setSubmitted(false)}>QUAY LẠI FORM</button></div>
          ) : (
            <form className={`auth-form auth-form--${mode}`} key={mode} onSubmit={handleSubmit} noValidate>
              {mode === 'register' ? <AuthField label="HỌ VÀ TÊN" error={errors.name} errorId="name-error" icon={<UserRound size={18} strokeWidth={1.6} />}><input autoComplete="name" value={values.name} onChange={(event) => updateField('name', event.target.value)} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} placeholder="Nguyễn Minh" /></AuthField> : null}
              {mode === 'register' ? <AuthField label="SỐ ĐIỆN THOẠI (TÙY CHỌN)" error={errors.phone} errorId="phone-error" icon={<Phone size={18} strokeWidth={1.6} />}><input type="tel" autoComplete="tel" value={values.phone} onChange={(event) => updateField('phone', event.target.value)} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} placeholder="090 123 4567" /></AuthField> : null}
              <AuthField label="EMAIL" error={errors.email} errorId="email-error" icon={<Mail size={18} strokeWidth={1.6} />}><input type="email" autoComplete="email" value={values.email} onChange={(event) => updateField('email', event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'email-error' : undefined} placeholder="ban@email.com" /></AuthField>
              <AuthField label="MẬT KHẨU" error={errors.password} errorId="password-error" icon={<LockKeyhole size={18} strokeWidth={1.6} />} action={<button type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>{showPassword ? <EyeOff size={18} strokeWidth={1.6} /> : <Eye size={18} strokeWidth={1.6} />}</button>}><input type={showPassword ? 'text' : 'password'} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={values.password} onChange={(event) => updateField('password', event.target.value)} aria-invalid={Boolean(errors.password)} aria-describedby={errors.password ? 'password-error' : undefined} placeholder="Tối thiểu 6 ký tự" /></AuthField>
              {mode === 'register' ? <AuthField label="NHẬP LẠI MẬT KHẨU" error={errors.confirmPassword} errorId="confirm-password-error" icon={<LockKeyhole size={18} strokeWidth={1.6} />}><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={values.confirmPassword} onChange={(event) => updateField('confirmPassword', event.target.value)} aria-invalid={Boolean(errors.confirmPassword)} aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined} placeholder="Nhập lại mật khẩu" /></AuthField> : null}

              {mode === 'login' ? <div className="auth-options"><label><input type="checkbox" /><span>GHI NHỚ ĐĂNG NHẬP</span></label><button type="button">QUÊN MẬT KHẨU?</button></div> : <p className="auth-terms">Bằng cách đăng ký, bạn đồng ý với điều khoản sử dụng và chính sách riêng tư.</p>}
              <button className="auth-submit" type="submit">{mode === 'login' ? 'ĐĂNG NHẬP' : 'TẠO TÀI KHOẢN'}<ArrowUpRight size={18} strokeWidth={1.8} aria-hidden="true" /></button>
            </form>
          )}

          <p className="auth-alternate">{mode === 'login' ? 'CHƯA CÓ TÀI KHOẢN?' : 'ĐÃ CÓ TÀI KHOẢN?'}<button type="button" onClick={() => changeMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'ĐĂNG KÝ' : 'ĐĂNG NHẬP'}</button></p>
        </div>
        <span className="auth-index">CC / MEMBER / 01</span>
      </section>
    </main>
  )
}
