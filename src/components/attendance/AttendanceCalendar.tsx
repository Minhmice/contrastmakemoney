import { useState } from 'react'
import { ChevronLeft, ChevronRight, CircleCheck } from 'lucide-react'
import {
  getCalendarDays,
  getMonthKey,
  getMonthLabel,
  moveMonth,
  toDateKey,
} from '@/features/attendance/date'

type AttendanceCalendarProps = { attendanceDates: Set<string> }
const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

export function AttendanceCalendar({ attendanceDates }: AttendanceCalendarProps) {
  const [month, setMonth] = useState(getMonthKey())
  const today = toDateKey()
  return (
    <section className="attendance-calendar" aria-labelledby="calendar-title">
      <div className="attendance-calendar__inner">
        <div className="attendance-calendar__header">
          <div>
            <p className="section-label">DAILY PRACTICE</p>
            <h2 id="calendar-title">LỊCH GIỮ NHỊP.</h2>
            <p>Mỗi dấu là một ngày bạn đã xuất hiện và bắt đầu phiên học.</p>
          </div>
          <div className="month-controls">
            <button
              type="button"
              className="icon-button"
              onClick={() => setMonth((current) => moveMonth(current, -1))}
              aria-label="Tháng trước"
            >
              <ChevronLeft aria-hidden="true" />
            </button>
            <strong>{getMonthLabel(month)}</strong>
            <button
              type="button"
              className="icon-button"
              onClick={() => setMonth((current) => moveMonth(current, 1))}
              aria-label="Tháng sau"
            >
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>
        <div className="calendar-grid">
          <div className="calendar-weekdays">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday}>{weekday}</span>
            ))}
          </div>
          <div className="calendar-days">
            {getCalendarDays(month).map((day) => {
              const attended = attendanceDates.has(day.date)
              const isToday = day.date === today
              const state = day.isCurrentMonth ? '' : ' is-muted'
              const marked = attended ? ' is-attended' : ''
              const current = isToday ? ' is-today' : ''
              return (
                <div
                  key={day.date}
                  className={'calendar-day' + state + marked + current}
                  aria-label={
                    day.dayNumber +
                    ', ' +
                    (attended ? 'đã điểm danh' : 'chưa điểm danh') +
                    (isToday ? ', hôm nay' : '')
                  }
                >
                  <span>{day.dayNumber}</span>
                  {attended ? <CircleCheck size={13} aria-hidden="true" /> : null}
                </div>
              )
            })}
          </div>
        </div>
        <div className="calendar-legend">
          <span>
            <i className="legend-square legend-square-attended" /> Đã điểm danh
          </span>
          <span>
            <i className="legend-square legend-square-today" /> Hôm nay
          </span>
          {attendanceDates.size === 0 ? (
            <span>Chưa có ngày nào. Mở scanner để bắt đầu.</span>
          ) : null}
        </div>
      </div>
    </section>
  )
}
