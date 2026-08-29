import { supabase } from '@/lib/supabase'
import type { AttendanceRecord } from '@/features/attendance/types'

export type WorkspaceTask = { id: string; title: string; done: boolean; sort_order: number }
export type PomodoroPreferences = { work_minutes: number; short_break_minutes: number; long_break_minutes: number }
export type UserStats = { attendance_count: number; current_streak: number; drink_order_count: number; completed_focus_count: number }
export type StaffLocation = { location_id: string; locations: { name: string } | null }

const fail = (error: { message: string } | null) => { if (error) throw new Error(error.message) }

export async function loadAttendanceRecords() {
  const { data, error } = await supabase.from('attendance').select('attendance_date,checked_in_at,locations(name)').order('attendance_date')
  fail(error)
  return (data ?? []).map((row: any): AttendanceRecord => ({ date: row.attendance_date, location: row.locations?.name ?? 'Contrast', scannedAt: row.checked_in_at }))
}

export async function importLocalAttendance(records: AttendanceRecord[]) {
  if (!records.length) return 0
  const { data, error } = await supabase.rpc('import_legacy_attendance', { p_records: records })
  fail(error)
  return Number(data ?? 0)
}

export async function consumeCheckInToken(token: string) {
  const { data, error } = await supabase.rpc('consume_check_in_token', { p_token: token })
  fail(error)
  return data?.[0]
}

export async function loadTasks() {
  const { data, error } = await supabase.from('workspace_tasks').select('id,title,done,sort_order').order('sort_order').order('created_at')
  fail(error)
  return (data ?? []) as WorkspaceTask[]
}

export async function addTask(userId: string, title: string, sortOrder: number) {
  const { data, error } = await supabase.from('workspace_tasks').insert({ user_id: userId, title, sort_order: sortOrder }).select('id,title,done,sort_order').single()
  fail(error)
  return data as WorkspaceTask
}

export async function setTaskDone(id: string, done: boolean) {
  const { error } = await supabase.from('workspace_tasks').update({ done }).eq('id', id)
  fail(error)
}

export async function createDrinkOrder(userId: string, product: { id: string; name: string; size: string; price: number }) {
  const { error } = await supabase.from('drink_orders').insert({ user_id: userId, product_id: product.id, product_name: product.name, size: product.size, unit_price: product.price })
  fail(error)
}

export async function loadPomodoroPreferences(): Promise<PomodoroPreferences> {
  const { data, error } = await supabase.from('pomodoro_preferences').select('work_minutes,short_break_minutes,long_break_minutes').maybeSingle()
  fail(error)
  return data ?? { work_minutes: 25, short_break_minutes: 5, long_break_minutes: 15 }
}

export async function savePomodoroPreferences(userId: string, preferences: PomodoroPreferences) {
  const { error } = await supabase.from('pomodoro_preferences').upsert({ user_id: userId, ...preferences })
  fail(error)
}

export async function recordFocusSession(userId: string, durationSeconds: number, startedAt: string) {
  const { error } = await supabase.from('focus_sessions').insert({ user_id: userId, duration_seconds: durationSeconds, started_at: startedAt })
  fail(error)
}

export async function loadUserStats(): Promise<UserStats> {
  const { data, error } = await supabase.rpc('get_user_stats')
  fail(error)
  const row = data?.[0]
  return { attendance_count: Number(row?.attendance_count ?? 0), current_streak: Number(row?.current_streak ?? 0), drink_order_count: Number(row?.drink_order_count ?? 0), completed_focus_count: Number(row?.completed_focus_count ?? 0) }
}

export async function loadStaffLocations() {
  const { data, error } = await supabase.from('staff_locations').select('location_id,locations(name)')
  fail(error)
  return (data ?? []) as unknown as StaffLocation[]
}

export async function createCheckInToken(locationId: string) {
  const { data, error } = await supabase.rpc('create_check_in_token', { p_location_id: locationId })
  fail(error)
  return data?.[0] as { token: string; location_id: string; location_name: string; expires_at: string }
}

export async function isCurrentUserStaff() {
  const { data, error } = await supabase.rpc('is_staff')
  fail(error)
  return Boolean(data)
}

export async function loadStaffDashboard() {
  const { data, error } = await supabase.rpc('get_staff_dashboard')
  fail(error)
  const row = data?.[0]
  return { attendance_today: Number(row?.attendance_today ?? 0), orders_today: Number(row?.orders_today ?? 0), active_tokens: Number(row?.active_tokens ?? 0), total_users: Number(row?.total_users ?? 0) }
}
