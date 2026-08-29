import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const isPlaceholder = !url || !publishableKey || url.includes('your-project') || publishableKey.includes('your_key')

if (isPlaceholder) {
  throw new Error('Thiếu cấu hình Supabase thật trong .env: NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(url, publishableKey)