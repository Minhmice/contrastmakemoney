import { addDays, getCalendarDays, moveMonth } from './date'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}
assert(addDays('2026-08-28', -1) === '2026-08-27', 'addDays crosses one day')
assert(moveMonth('2026-08', 1) === '2026-09', 'moveMonth advances month')
assert(getCalendarDays('2026-08').length === 42, 'calendar has six weeks')
