import { SectionLabel } from '@/components/shared/SectionLabel'

export function ManifestoSection() {
  return (
    <section className="manifesto section-dark" id="contrast">
      <div className="manifesto__top">
        <SectionLabel dark>THE CONTRAST</SectionLabel>
        <span className="chapter-count">02 — 11</span>
      </div>
      <div className="manifesto__grid">
        <h2>
          NGOÀI KIA
          <br />
          <span>CÓ THỂ ỒN.</span>
          <br />Ở ĐÂY
          <br />
          <span className="red-word">TẬP TRUNG.</span>
        </h2>
        <div className="manifesto__body">
          <p>
            Contrast được tạo ra cho những khoảng thời gian cần sự tập trung — một buổi học
            chưa xong, một deadline đang tới, một kế hoạch vẫn còn dang dở.
          </p>
          <p>Không cần chờ đúng mood.</p>
          <strong>
            Ngồi xuống.
            <br />
            Bắt đầu.
            <br />
            Tiếp tục.
          </strong>
        </div>
      </div>
      <div className="manifesto__statements">
        <div>
          <span>01</span>
          <strong>KIÊN TRÌ.</strong>
          <p>Làm tiếp khi cảm hứng đã hết.</p>
        </div>
        <div>
          <span>02</span>
          <strong>KỶ LUẬT.</strong>
          <p>Làm điều cần làm, đúng lúc cần làm.</p>
        </div>
        <div className="manifesto__mark" aria-hidden="true">
          ×
        </div>
      </div>
    </section>
  )
}
