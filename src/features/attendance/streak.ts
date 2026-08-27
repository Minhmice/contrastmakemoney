import { addDays, toDateKey } from './date'

export function calculateCurrentStreak(attendanceDates: Set<string>, today = new Date()) {
  const dates = new Set(attendanceDates)
  let cursor = toDateKey(today)
  let count = 0
  while (dates.has(cursor)) {
    count += 1
    const previous = addDays(cursor, -1)
    if (!previous) break
    cursor = previous
  }
  return count
}
