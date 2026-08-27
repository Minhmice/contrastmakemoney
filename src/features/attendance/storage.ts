import type { AttendanceRecord } from './types'

const STORAGE_KEY = 'contrast:attendance:v1'

function isRecord(value: unknown): value is AttendanceRecord {
  if (!value || typeof value !== 'object') return false
  const record = value as Partial<AttendanceRecord>
  return (
    typeof record.date === 'string' &&
    typeof record.location === 'string' &&
    typeof record.scannedAt === 'string'
  )
}

export function loadAttendance(): AttendanceRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter(isRecord) : []
  } catch {
    return []
  }
}

export function saveAttendance(records: AttendanceRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
    return true
  } catch {
    return false
  }
}

export function hasAttendanceOnDate(records: AttendanceRecord[], date: string) {
  return records.some((record) => record.date === date)
}
