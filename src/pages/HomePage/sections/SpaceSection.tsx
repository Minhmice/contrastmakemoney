import { ArrowLink } from '@/components/shared/ArrowLink'
import { SectionLabel } from '@/components/shared/SectionLabel'

export function SpaceSection() {
  return (
    <section className="space-section" id="space" aria-labelledby="space-title">
      <div className="space-section__visual">
        <div className="space-photo space-photo--one">
          <div className="photo-silhouette photo-silhouette--person" aria-hidden="true" />
          <span>01 — NGỒI XUỐNG</span>
        </div>
        <div className="space-photo space-photo--two">
          <div className="photo-silhouette photo-silhouette--lamp" aria-hidden="true" />
          <span>02 — VÀO VIỆC</span>
        </div>
        <div className="space-photo space-photo--three">
          <div className="photo-silhouette photo-silhouette--desk" aria-hidden="true" />
          <span>03 — Ở LẠI VỚI NÓ</span>
        </div>
        <div className="space-section__red-tag" aria-hidden="true">
          MỘT VIỆC.
          <br />
          RỒI VIỆC
          <br />
          TIẾP THEO.
        </div>
      </div>
      <div className="space-section__copy">
        <SectionLabel>KHÔNG GIAN</SectionLabel>
        <span className="chapter-count">04 — 11</span>
        <h2 id="space-title">
          ĐẾN ĐỂ
          <br />
          <span>LÀM VIỆC.</span>
        </h2>
        <p>Không gian của Contrast được đặt trọng tâm vào việc học và làm việc.</p>
        <p>
          Không phải background để check-in.
          <br />
          Không phải một góc đẹp rồi thôi.
        </p>
        <strong>Một nơi để bạn ở lại với việc mình đang làm.</strong>
        <ArrowLink href="#locations">XEM KHÔNG GIAN</ArrowLink>
      </div>
    </section>
  )
}
