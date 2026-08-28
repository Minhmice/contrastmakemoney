import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  LogOut,
  MapPin,
  UserRound,
} from 'lucide-react'
import { ContrastLogo } from '@/components/brand/ContrastLogo'
import { AttendanceCalendar } from '@/components/attendance/AttendanceCalendar'
import { AttendanceStreak } from '@/components/attendance/AttendanceStreak'
import { toDateKey } from '@/features/attendance/date'
import { calculateCurrentStreak } from '@/features/attendance/streak'
import { loadAttendance } from '@/features/attendance/storage'

const PROFILE_NAME = 'Nguyễn Minh'
const PROFILE_EMAIL = 'ban@email.com'
const DEMO_ATTENDANCE_DATES = [-4, -3, -2, -1, 0]

export default function ProfilePage() {
  const [signedOut, setSignedOut] = useState(false)
  const [records] = useState(loadAttendance)
  const today = toDateKey()
  const attendanceDates = useMemo(() => {
    const dates = new Set(records.map((record) => record.date))
    if (dates.size === 0) {
      DEMO_ATTENDANCE_DATES.forEach((delta) => {
        const date = new Date()
        date.setDate(date.getDate() + delta)
        dates.add(toDateKey(date))
      })
    }
    return dates
  }, [records])
  const streak = calculateCurrentStreak(attendanceDates)
  const hasAttendedToday = attendanceDates.has(today)

  if (signedOut) {
    return <SignedOutState onReturn={() => (window.location.href = '/auth')} />
  }

  return (
    <main className="profile-page">
      <header className="profile-header">
        <a className="profile-header__brand" href="/" aria-label="Về trang chủ Contrast Coffee">
          <ContrastLogo variant="wordmark-dark" className="profile-logo" />
        </a>
        <div className="profile-header__meta">
          <span>MEMBER AREA / 24H</span>
          <a className="profile-home-link" href="/workspace">
            VÀO WORKSPACE <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
          </a>
          <a className="profile-home-link" href="/">
            VỀ TRANG CHỦ <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
          </a>
        </div>
      </header>

      <section className="profile-hero" aria-labelledby="profile-title">
        <div className="profile-hero__mark" aria-hidden="true">
          <UserRound size={30} strokeWidth={1.4} />
        </div>
        <div>
          <p className="section-label">CONTRAST / MEMBER 01</p>
          <h1 id="profile-title">
            CHÀO, <span>{PROFILE_NAME.toUpperCase()}.</span>
          </h1>
          <p className="profile-hero__lede">
            Một nơi để nhìn lại những ngày bạn đã ngồi xuống, bắt đầu và làm tiếp.
          </p>
        </div>
        <div className="profile-hero__side-note">
          <span>STUDY · WORK · COFFEE</span>
          <span>HỒ CHÍ MINH CITY</span>
        </div>
      </section>

      <section className="profile-overview" aria-label="Tổng quan tài khoản">
        <div className="profile-identity">
          <div className="profile-avatar" aria-hidden="true">
            NM
          </div>
          <div>
            <span className="profile-eyebrow">THÀNH VIÊN CONTRAST</span>
            <h2>{PROFILE_NAME}</h2>
            <p>{PROFILE_EMAIL}</p>
          </div>
        </div>
        <div className="profile-stats">
          <div>
            <span>NGÀY ĐÃ ĐIỂM DANH</span>
            <strong>{attendanceDates.size}</strong>
          </div>
          <div>
            <span>CHUỖI HIỆN TẠI</span>
            <strong>{streak} ngày</strong>
          </div>
          <div>
            <span>TRẠNG THÁI HÔM NAY</span>
            <strong>{hasAttendedToday ? 'ĐÃ CÓ MẶT' : 'CHƯA ĐIỂM DANH'}</strong>
          </div>
        </div>
      </section>

      <div className="profile-content">
        <AttendanceCalendar attendanceDates={attendanceDates} />
        <div className="profile-side-column">
          <AttendanceStreak streak={streak} hasAttendedToday={hasAttendedToday} />
          <section className="profile-next-step" aria-labelledby="next-step-title">
            <div className="profile-next-step__icon">
              <CalendarDays size={20} strokeWidth={1.6} aria-hidden="true" />
            </div>
            <div>
              <p className="profile-eyebrow">NEXT PRACTICE</p>
              <h2 id="next-step-title">GIỮ NHỊP NGÀY MAI.</h2>
              <p>Quay lại Contrast, chọn chỗ ngồi và thêm một dấu vào lịch.</p>
              <a href="/#locations">
                TÌM CƠ SỞ <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
              </a>
            </div>
          </section>
        </div>
      </div>

      <section className="profile-account-actions" aria-label="Quản lý tài khoản">
        <div>
          <span className="profile-eyebrow">ACCOUNT / SESSION</span>
          <h2>ĐẾN RỒI THÌ Ở LẠI VỚI VIỆC.</h2>
        </div>
        <button type="button" className="profile-logout" onClick={() => setSignedOut(true)}>
          <LogOut size={17} strokeWidth={1.8} aria-hidden="true" /> ĐĂNG XUẤT
        </button>
      </section>

      <footer className="profile-footer">
        <a href="/" aria-label="Về trang chủ Contrast Coffee">
          <ContrastLogo variant="wordmark-dark" className="profile-footer__logo" />
        </a>
        <span>KIÊN TRÌ — KỶ LUẬT</span>
        <a href="/" className="profile-footer__back">
          <ArrowLeft size={15} strokeWidth={1.8} aria-hidden="true" /> TRANG CHỦ
        </a>
      </footer>
    </main>
  )
}

function SignedOutState({ onReturn }: { onReturn: () => void }) {
  return (
    <main className="profile-signed-out">
      <div className="profile-signed-out__mark">
        <Check size={28} strokeWidth={1.7} aria-hidden="true" />
      </div>
      <p className="section-label">CONTRAST / SESSION CLOSED</p>
      <h1>ĐÃ ĐĂNG XUẤT.</h1>
      <p>Phiên làm việc đã kết thúc. Quay lại màn hình đăng nhập để tiếp tục.</p>
      <button type="button" className="button button--red" onClick={onReturn}>
        VỀ MÀN HÌNH LOGIN <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
      </button>
      <MapPin className="profile-signed-out__line" size={18} strokeWidth={1.5} aria-hidden="true" />
    </main>
  )
}
