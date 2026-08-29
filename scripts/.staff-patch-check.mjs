import { createClient } from '@supabase/supabase-js'
const url=process.env.VITE_SUPABASE_URL, key=process.env.SERVICE_SUPABASESERVICE_KEY
if(!url||!key) throw new Error('missing credentials')
const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}})
const sql = await import('node:fs/promises').then((fs)=>fs.readFile('supabase/migrations/20260828070000_staff_dashboard.sql','utf8'))
console.log('Migration file ready:', sql.length, 'bytes')
