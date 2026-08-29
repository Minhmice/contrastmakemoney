import { loadAttendance } from '@/features/attendance/storage'
import { importLocalAttendance } from './api'

const STORAGE_KEY = 'contrast:attendance:v1'
const MIGRATED_KEY = 'contrast:attendance:supabase:v1'

export async function migrateLocalAttendance() {
  if (localStorage.getItem(MIGRATED_KEY)) return
  const records = loadAttendance()
  await importLocalAttendance(records)
  localStorage.removeItem(STORAGE_KEY)
  localStorage.setItem(MIGRATED_KEY, '1')
}
