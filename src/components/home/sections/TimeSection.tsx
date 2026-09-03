'use client'

import { useEffect, useState } from 'react'

type TimeSlot = {
  period: string
  quote: string
  startHour: number
}

const TIME_SLOTS: TimeSlot[] = [
  { period: 'SÁNG', quote: 'Bắt đầu trước khi ngày kịp ồn.', startHour: 5 },
  { period: 'TRƯA', quote: 'Giữ nhịp qua phần khó nhất.', startHour: 11 },
  { period: 'CHIỀU', quote: 'Còn việc thì còn tập trung.', startHour: 13 },
  { period: 'TỐI', quote: 'Làm tiếp một chút, xong thêm một việc.', startHour: 18 },
  { period: 'ĐÊM', quote: 'Khi thành phố nghỉ, mục tiêu vẫn ở đây.', startHour: 22 },
]

function getHanoiHour(date: Date) {
  const hour = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: 'numeric',
    hour12: false,
  }).formatToParts(date).find((part) => part.type === 'hour')?.value

  return Number(hour) % 24
}

function getActiveSlot(hour: number) {
  return TIME_SLOTS.toReversed().find((slot) => hour >= slot.startHour) ?? TIME_SLOTS.at(-1)!
}

function formatHanoiTime(date: Date, includeSeconds = true) {
  return new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
    hour12: false,
  }).format(date)
}

export function TimeSection() {
  const [now, setNow] = useState<Date | null>(null)
  const activeSlot = now ? getActiveSlot(getHanoiHour(now)) : null

  useEffect(() => {
    let interval: number
    const timeout = window.setTimeout(() => {
      setNow(new Date())
      interval = window.setInterval(() => setNow(new Date()), 1000)
    }, 0)

    return () => {
      window.clearTimeout(timeout)
      window.clearInterval(interval)
    }
  }, [])


  return (
    <section className="time-section" id="time" aria-labelledby="time-title">
      <div className="time-stage">
        <div className="time-stage__red-field" aria-hidden="true" />
        <div className="time-stage__heading">
          <h2 id="time-title">
            <span className="time-stage__mask">
              <span className="time-stage__line">GIỜ NÀO</span>
            </span>
            <span className="time-stage__mask time-stage__mask--offset">
              <span className="time-stage__line">CŨNG CÓ THỂ</span>
            </span>
            <span className="time-stage__mask time-stage__mask--red">
              <span className="time-stage__line">BẮT ĐẦU.</span>
            </span>
          </h2>
          <p className="time-section__copy">Cần tập trung, cứ đến Contrast.</p>
        </div>

        <div className="time-stage__clock" aria-live="off">
          <span className="time-stage__clock-label">HÀ NỘI, UTC+7</span>
          <time dateTime={now?.toISOString()}>{now ? formatHanoiTime(now, false) : '--:--'}</time>
          <strong>{activeSlot?.period ?? 'ĐANG CHẠY'}</strong>
          <p>{activeSlot?.quote ?? 'Giờ nào cũng có thể bắt đầu.'}</p>
        </div>
      </div>

      <ol
        className="time-ruler"
        aria-label={now ? `Giờ hiện tại tại Hà Nội: ${formatHanoiTime(now)}` : 'Giờ hoạt động tại Hà Nội'}
      >
        {TIME_SLOTS.map((slot) => {
          const isActive = slot.period === activeSlot?.period
          return (
            <li className={`time-ruler__item${isActive ? ' is-active' : ''}`} key={slot.period}>
              <span className="time-ruler__period">{slot.period}</span>
              <time dateTime={isActive && now ? now.toISOString() : undefined}>
                {isActive && now ? formatHanoiTime(now) : `TỪ ${String(slot.startHour).padStart(2, '0')}:00`}
              </time>
              <strong>{slot.quote}</strong>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
