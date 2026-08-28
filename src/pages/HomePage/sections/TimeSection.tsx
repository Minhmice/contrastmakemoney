import { SectionLabel } from '@/components/shared/SectionLabel'

const TIME_MARKERS = [
  ['06:00', 'BẮT ĐẦU'],
  ['12:00', 'TIẾP TỤC'],
  ['18:00', 'TĂNG TỐC'],
  ['00:00', 'CHƯA XONG THÌ CHƯA DỪNG'],
] as const

export function TimeSection() {
  return (
    <section className="time-section" id="time">
      <div className="time-section__header">
        <SectionLabel>00 — 24</SectionLabel>
        <span className="chapter-count">03 — 11</span>
      </div>
      <div className="time-section__grid">
        <h2>
          MỖI GIỜ
          <br />
          ĐỀU CÓ THỂ
          <br />
          <span>LÀ GIỜ BẮT ĐẦU.</span>
        </h2>
        <div className="time-section__copy">
          <p>
            Sáng sớm. Giữa trưa. Sau giờ học. Sau giờ làm. Hay khi thành phố đã chậm lại.
          </p>
          <p>Contrast được xây quanh một ý tưởng đơn giản:</p>
          <strong>
            Khi bạn cần một nơi để tập trung,
            <br />
            hãy có một nơi để đến.
          </strong>
        </div>
      </div>
      <div className="time-ruler" aria-label="Nhịp một ngày tại Contrast">
        {TIME_MARKERS.map(([time, label], index) => (
          <div
            className={`time-ruler__item${index === TIME_MARKERS.length - 1 ? ' is-active' : ''}`}
            key={time}
          >
            <span>{time}</span>
            <i />
            <strong>{label}</strong>
          </div>
        ))}
      </div>
      <p className="verified-note">
        * Exact operating hours are shown separately for each location after first-party
        verification.
      </p>
    </section>
  )
}
