import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
const isPlaceholder = !url || !publishableKey || url.includes('your-project') || publishableKey.includes('your_key')

if (isPlaceholder) {
  throw new Error('Thiếu cấu hình Supabase thật trong .env: VITE_SUPABASE_URL và VITE_SUPABASE_PUBLISHABLE_KEY')
}

export const supabase = createClient(url, publishableKey)
