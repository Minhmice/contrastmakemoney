import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const sql = readFileSync(new URL('../supabase/migrations/20260828060000_user_data.sql', import.meta.url), 'utf8')
for (const table of ['attendance','drink_orders','workspace_tasks','pomodoro_preferences','focus_sessions','check_in_tokens','staff_locations']) assert.match(sql, new RegExp('create table if not exists public\\.' + table))
assert.equal((sql.match(/enable row level security/g) ?? []).length, 8)
assert.ok(sql.includes('unique (user_id, attendance_date)'))
assert.ok(sql.includes('select * into v_token from public.check_in_tokens where id = p_token for update'))
assert.ok(sql.indexOf('update public.check_in_tokens set used_at') < sql.indexOf('select * into v_existing'))
assert.match(sql, /grant execute on function public\.create_check_in_token/)
console.log('PASS user-data migration structure + one-time token invariants')
