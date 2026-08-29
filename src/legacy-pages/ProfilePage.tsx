import { useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { ArrowLeft, ArrowUpRight, CalendarDays, LogOut, UserRound } from 'lucide-react'
import { ContrastLogo } from '@/components/brand/ContrastLogo'
import { AttendanceCalendar } from '@/components/attendance/AttendanceCalendar'
import { AttendanceStreak } from '@/components/attendance/AttendanceStreak'
import { toDateKey } from '@/features/attendance/date'
import type { AttendanceRecord } from '@/features/attendance/types'
import { loadAttendanceRecords, loadUserStats, type UserStats } from '@/features/user-data/api'
import { migrateLocalAttendance } from '@/features/user-data/migration'
import { supabase } from '@/lib/supabase'


export default function ProfilePage({ user }: { user: User | null }) {
  const email = user?.email ?? ''
  const profileName = typeof user?.user_metadata.full_name === 'string' && user.user_metadata.full_name.trim()
    ? user.user_metadata.full_name.trim()
    : email.split('@')[0] || 'Thành viên'
  const initials = profileName.split(/\s+/).slice(-2).map((part) => part[0]).join('').toUpperCase()
  const [logoutPending, setLogoutPending] = useState(false)
  const [logoutError, setLogoutError] = useState('')
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [stats, setStats] = useState<UserStats>({ attendance_count: 0, current_streak: 0, drink_order_count: 0, completed_focus_count: 0 })
  const [dataError, setDataError] = useState('')
  useEffect(() => { migrateLocalAttendance().then(() => Promise.all([loadAttendanceRecords(), loadUserStats()])).then(([nextRecords, nextStats]) => { setRecords(nextRecords); setStats(nextStats) }).catch((cause) => setDataError(cause instanceof Error ? cause.message : 'Không thể tải dữ liệu hồ sơ.')) }, [])
  const today = toDateKey()
  const attendanceDates = useMemo(() => new Set(records.map((record) => record.date)), [records])
  const streak = stats.current_streak
  const hasAttendedToday = attendanceDates.has(today)

  if (!user) return null

  const signOut = async () => {
    if (logoutPending) return
    setLogoutPending(true)
    setLogoutError('')
    const { error } = await supabase.auth.signOut()
    if (error) {
      setLogoutError('Không thể đăng xuất. Vui lòng thử lại.')
      setLogoutPending(false)
      return
    }
    window.location.replace('/auth')
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
            CHÀO, <span>{profileName.toUpperCase()}.</span>
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
            {initials}
          </div>
          <div>
            <span className="profile-eyebrow">THÀNH VIÊN CONTRAST</span>
            <h2>{profileName}</h2>
            <p>{email}</p>
          </div>
        </div>
        <div className="profile-stats">
          <div>
            <span>NGÀY ĐÃ ĐIỂM DANH</span>
            <strong>{stats.attendance_count}</strong>
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

      {dataError ? <p className="profile-logout-error" role="alert">{dataError}</p> : null}
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
              <p>{stats.drink_order_count} đồ uống đã order · {stats.completed_focus_count} phiên focus hoàn tất.</p>
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
        <div>
          {logoutError ? <p className="profile-logout-error" role="alert">{logoutError}</p> : null}
          <button type="button" className="profile-logout" disabled={logoutPending} onClick={signOut}>
            <LogOut size={17} strokeWidth={1.8} aria-hidden="true" /> {logoutPending ? 'ĐANG ĐĂNG XUẤT...' : 'ĐĂNG XUẤT'}
          </button>
        </div>
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
