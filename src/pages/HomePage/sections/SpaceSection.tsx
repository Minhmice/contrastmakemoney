import { ArrowLink } from '@/components/shared/ArrowLink'

const SPACE_IMAGES = [
  { src: '/images/space/contrast-space-1.webp', label: '01 — NGỒI XUỐNG', alt: 'Khách ngồi làm việc tại Contrast Coffee' },
  { src: '/images/space/contrast-space-2.webp', label: '02 — VÀO VIỆC', alt: 'Góc không gian làm việc tại Contrast Coffee' },
  { src: '/images/space/contrast-space-3.webp', label: '03 — Ở LẠI VỚI NÓ', alt: 'Không gian học tập tại Contrast Coffee' },
]

export function SpaceSection() {
  return (
    <section className="space-section" id="space" aria-labelledby="space-title">
      <div className="space-section__visual">
        {SPACE_IMAGES.map((image, index) => (
          <figure className={`space-photo space-photo--${index + 1}`} key={image.src}>
            <img src={image.src} alt={image.alt} width="1200" height="1200" loading="lazy" decoding="async" />
            <figcaption>{image.label}</figcaption>
          </figure>
        ))}
        <div className="space-section__red-tag" aria-hidden="true">
          MỘT VIỆC.
          <br />
          RỒI VIỆC
          <br />
          TIẾP THEO.
        </div>
      </div>
      <div className="space-section__copy">
        <span className="chapter-count">04 — 11</span>
        <h2 id="space-title">
          ĐẾN ĐỂ
          <br />
          <span>LÀM VIỆC.</span>
        </h2>
        <p>Không gian Contrast dành cho việc học sâu và làm việc nghiêm túc.</p>
        <p>
          Không phải background để check-in.
          <br />
          Đến đây là để làm cho xong.
        </p>
        <strong>Một nơi giúp bạn ngồi lại với mục tiêu đến cùng.</strong>
        <ArrowLink href="#locations">XEM KHÔNG GIAN</ArrowLink>
      </div>
    </section>
  )
}
