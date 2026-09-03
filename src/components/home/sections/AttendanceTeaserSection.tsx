import { ArrowUpRight } from 'lucide-react'
import { SectionLabel } from '@/components/shared/SectionLabel'

type AttendanceTeaserSectionProps = {
  open: boolean
  onToggle: () => void
}

export function AttendanceTeaserSection({ open, onToggle }: AttendanceTeaserSectionProps) {
  return (
    <section
      id="attendance"
      className="attendance-teaser"
      aria-labelledby="attendance-title"
      aria-describedby="attendance-note"
    >
      <div>
        <SectionLabel>CONTRAST / DAILY PRACTICE</SectionLabel>
        <h2 id="attendance-title">
          MỘT NGÀY.
          <br />
          MỘT DẤU.
        </h2>
        <p id="attendance-note">
          Giữ nhịp học bằng một lần xuất hiện. Điểm danh sẽ mở khi hệ thống first-party được
          xác nhận.
        </p>
      </div>
      <button type="button" className="button button--dark" onClick={onToggle} aria-expanded={open}>
        {open ? 'ĐÓNG THÔNG TIN' : 'XEM CÁCH GIỮ NHỊP'} <ArrowUpRight size={16} aria-hidden="true" />
      </button>
      {open ? (
        <p className="attendance-teaser__note" role="status">
          QR scanner và lịch cá nhân sẽ được kết nối sau khi backend được xác nhận.
        </p>
      ) : null}
    </section>
  )
}
