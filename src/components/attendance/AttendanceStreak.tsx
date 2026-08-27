import { Flame, Target } from 'lucide-react'

type AttendanceStreakProps = {
  streak: number
  hasAttendedToday: boolean
}

export function AttendanceStreak({ streak, hasAttendedToday }: AttendanceStreakProps) {
  return (
    <section className="streak-panel" aria-labelledby="streak-title">
      <div className="attendance-panel__top">
        <div>
          <p className="label-print label-print--light">CHUỖI HIỆN TẠI</p>
          <h2 id="streak-title">
            {streak}
            <span> ngày</span>
          </h2>
        </div>
        <div className="status-mark">
          {hasAttendedToday ? (
            <Flame size={22} aria-hidden="true" />
          ) : (
            <Target size={22} aria-hidden="true" />
          )}
        </div>
      </div>
      <p>
        {hasAttendedToday
          ? 'Bạn đã có mặt hôm nay. Ngày mai, tiếp tục giữ nhịp.'
          : 'Chuỗi chỉ tính khi bạn đã điểm danh hôm nay.'}
      </p>
    </section>
  )
}
