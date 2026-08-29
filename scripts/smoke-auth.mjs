import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'node:crypto'

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY
const serviceKey = process.env.SERVICE_SUPABASESERVICE_KEY
if (!url || !key || !serviceKey || url.includes('your-project') || key.includes('your_key')) throw new Error('Thiếu Supabase credential thật trong .env')

const settings = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key } })
if (!settings.ok) throw new Error(`Không đọc được Supabase Auth settings (HTTP ${settings.status})`)
const { mailer_autoconfirm: autoConfirm } = await settings.json()
if (!autoConfirm) throw new Error('Confirm email đang bật. Với Supabase self-host, đặt ENABLE_EMAIL_AUTOCONFIRM=true rồi restart Auth/GoTrue.')

const supabase = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } })
const admin = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } })
const email = `auth-smoke-${Date.now()}-${randomBytes(4).toString('hex')}@example.com`
const password = `Smoke!${randomBytes(12).toString('base64url')}`
let userId

try {
  const signup = await supabase.auth.signUp({ email, password, options: { data: { full_name: 'Auth Smoke Test' } } })
  if (signup.error) throw signup.error
  if (!signup.data.session || !signup.data.user) throw new Error('Signup không trả session dù Confirm email đã tắt.')
  userId = signup.data.user.id

  const logout = await supabase.auth.signOut()
  if (logout.error) throw logout.error
  const login = await supabase.auth.signInWithPassword({ email, password })
  if (login.error || login.data.user?.id !== userId) throw login.error ?? new Error('Login không trả đúng user vừa tạo')
  await supabase.auth.signOut()
  console.log('PASS signup + immediate session + logout + login')
} finally {
  if (userId) {
    const deleted = await admin.auth.admin.deleteUser(userId)
    if (deleted.error) console.error('WARN không xóa được auth smoke user:', deleted.error.message)
  }
}
