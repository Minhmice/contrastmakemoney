import { useRef, useState } from 'react'
import { ArrowDownRight, ArrowUpRight, MapPin, MoveUpRight, Play } from 'lucide-react'
import { ContrastLogo } from '@/components/brand/ContrastLogo'
import { SiteNav } from '@/components/nav/SiteNav'
import { Button } from '@/components/ui/button'
import { ArrowLink, BrandLink, SectionLabel } from '@/components/shared'

type MenuItem = { name: string; detail: string; price: string }
type Location = { name: string; note: string }

const menuGroups: Record<string, MenuItem[]> = {
  CAFFEIN: [
    { name: 'COLD BREW', detail: 'Ủ lạnh · uống chậm', price: '[GIÁ VERIFIED]' },
    { name: 'ESPRESSO', detail: 'Đậm · ngắn · tỉnh', price: '[GIÁ VERIFIED]' },
    { name: 'LATTE', detail: 'Mềm · cân bằng', price: '[GIÁ VERIFIED]' },
  ],
  'COLD BREW': [
    { name: 'COLD BREW', detail: 'Ủ lạnh · uống chậm', price: '[GIÁ VERIFIED]' },
    { name: 'COLD BREW MILK', detail: 'Lạnh · mượt · làm tiếp', price: '[GIÁ VERIFIED]' },
  ],
  'MILK TEA': [
    { name: 'MILK TEA', detail: 'Trà sữa · làm tiếp', price: '[GIÁ VERIFIED]' },
    { name: 'TEA LATTE', detail: 'Trà · sữa · dịu', price: '[GIÁ VERIFIED]' },
  ],
  'FRESH SIPS': [
    { name: 'FRESH SIPS', detail: 'Tươi · tỉnh · nhẹ', price: '[GIÁ VERIFIED]' },
    { name: 'CITRUS TEA', detail: 'Thanh · sáng · mát', price: '[GIÁ VERIFIED]' },
  ],
  FREEZE: [
    { name: 'FREEZE', detail: 'Lạnh · nhanh · tiếp tục', price: '[GIÁ VERIFIED]' },
  ],
}

const menuTabs = Object.keys(menuGroups)
const locations: Location[] = [
  { name: 'PHAN VĂN TRỊ', note: 'Một nhịp ngồi sâu. Hợp cho buổi học dài.' },
  { name: 'THẢO ĐIỀN', note: 'Nhiều ánh sáng. Hợp cho một ngày cần bắt đầu lại.' },
  { name: 'TÂN BÌNH', note: 'Không gian mở. Đến, đặt laptop, vào việc.' },
]

export default function App() {
  const [activeLocation, setActiveLocation] = useState(0)
  const [selectedTab, setSelectedTab] = useState('CAFFEIN')
  const [attendanceOpen, setAttendanceOpen] = useState(false)
  const locationsRef = useRef<HTMLElement>(null)

  const scrollToLocations = () => {
    locationsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const currentItems = menuGroups[selectedTab]

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Bỏ qua đến nội dung chính
      </a>
      <SiteNav spy />

      <main id="main-content">
        <section className="hero" id="top">
          <div className="hero__paper">
            <div className="hero__meta">
              <span>01 / 11</span>
              <span>HỒ CHÍ MINH CITY</span>
            </div>
            <div className="hero__copy">
              <SectionLabel>KIÊN TRÌ — KỶ LUẬT</SectionLabel>
              <h1>
                CÒN VIỆC
                <br />
                <span>THÌ CÒN</span>
                <br />
                CONTRAST.
              </h1>
              <p className="hero__lede">
                Một chỗ để ngồi xuống.
                <br />
                Tập trung vào việc cần làm.
                <br />
                Và làm cho xong.
              </p>
              <div className="hero__actions">
                <Button className="button button--red" onClick={scrollToLocations}>
                  TÌM CƠ SỞ{' '}
                  <ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
                </Button>
                <BrandLink href="/menu">
                  XEM MENU{' '}
                  <ArrowDownRight size={16} strokeWidth={1.7} aria-hidden="true" />
                </BrandLink>
              </div>
            </div>
            <div className="hero__side-note">
              <span>CONTRAST COFFEE 24H</span>
              <span>STUDY · WORK · COFFEE</span>
            </div>
          </div>
          <div className="hero__ink">
            <div className="hero__red-square" aria-hidden="true">
              <span>
                CONTRAST
                <br />
                COFFEE
              </span>
              <span className="hero__red-square__cross">+</span>
            </div>
            <div className="hero__index">
              / / / <span>FOCUS MODE</span>
            </div>
            <p className="hero__ink-copy">
              ĐỪNG CHỜ
              <br />
              <em>ĐÚNG MOOD.</em>
            </p>
            <div className="hero__stamp" aria-hidden="true">
              24H <span>—</span> STUDY <span>—</span> WORK <span>—</span> COFFEE{' '}
              <span>—</span>
            </div>
          </div>
          <div className="scroll-cue" aria-hidden="true">
            <span>CUỘN ĐỂ VÀO VIỆC</span>
            <ArrowDownRight size={18} strokeWidth={1.5} />
          </div>
        </section>

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
                Contrast được tạo ra cho những khoảng thời gian cần sự tập trung — một
                buổi học chưa xong, một deadline đang tới, một kế hoạch vẫn còn dang dở.
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
                Sáng sớm. Giữa trưa. Sau giờ học. Sau giờ làm. Hay khi thành phố đã chậm
                lại.
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
            {[
              ['06:00', 'BẮT ĐẦU'],
              ['12:00', 'TIẾP TỤC'],
              ['18:00', 'TĂNG TỐC'],
              ['00:00', 'CHƯA XONG THÌ CHƯA DỪNG'],
            ].map(([time, label], index) => (
              <div
                className={`time-ruler__item${index === 3 ? 'is-active' : ''}`}
                key={time}
              >
                <span>{time}</span>
                <i />
                <strong>{label}</strong>
              </div>
            ))}
          </div>
          <p className="verified-note">
            * Exact operating hours are shown separately for each location after
            first-party verification.
          </p>
        </section>

        <section className="space-section" id="space" aria-labelledby="space-title">
          <div className="space-section__visual">
            <div className="space-photo space-photo--one">
              <div
                className="photo-silhouette photo-silhouette--person"
                aria-hidden="true"
              />
              <span>01 — NGỒI XUỐNG</span>
            </div>
            <div className="space-photo space-photo--two">
              <div
                className="photo-silhouette photo-silhouette--lamp"
                aria-hidden="true"
              />
              <span>02 — VÀO VIỆC</span>
            </div>
            <div className="space-photo space-photo--three">
              <div
                className="photo-silhouette photo-silhouette--desk"
                aria-hidden="true"
              />
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

        <section className="culture section-red">
          <div className="culture__side">
            05 — 11
            <br />
            <span>STUDY CULTURE</span>
          </div>
          <div className="culture__main">
            <h2>
              KHÔNG CẦN
              <br />
              <span>HỨNG.</span>
              <br />
              CẦN
              <br />
              <em>KỶ LUẬT.</em>
            </h2>
            <p>Có những ngày mọi thứ chạy rất nhanh.</p>
            <p>Cũng có những ngày một trang tài liệu mất cả tiếng.</p>
            <strong>Chỉ tạo ra một nơi để bạn tiếp tục.</strong>
          </div>
          <div className="culture__circle" aria-hidden="true">
            <span>KEEP GOING</span>
            <span>KEEP GOING</span>
            <span>KEEP GOING</span>
          </div>
        </section>

        <section className="menu-section" id="menu">
          <div className="menu-section__header">
            <SectionLabel>NẠP LẠI. LÀM TIẾP.</SectionLabel>
            <span className="chapter-count">06 — 11</span>
          </div>
          <div className="menu-section__heading">
            <h2>
              COFFEE
              <br />
              <span>FOR THE</span>
              <br />
              NEXT ROUND.
            </h2>
            <div>
              <p>Một buổi làm việc dài vẫn cần những khoảng nghỉ.</p>
              <p>
                Chọn món. Nghỉ một chút.
                <br />
                Rồi quay lại việc đang làm.
              </p>
            </div>
          </div>
          <div className="menu-tabs" role="tablist" aria-label="Danh mục menu">
            {menuTabs.map((item, index) => (
              <button
                type="button"
                key={item}
                role="tab"
                aria-selected={selectedTab === item}
                aria-controls={`menu-panel-${index}`}
                id={`menu-tab-${index}`}
                className={selectedTab === item ? 'is-selected' : ''}
                onClick={() => setSelectedTab(item)}
              >
                {String(index + 1).padStart(2, '0')} / {item}
              </button>
            ))}
          </div>
          <div
            className="menu-list"
            id={`menu-panel-${menuTabs.indexOf(selectedTab)}`}
            role="tabpanel"
            aria-labelledby={`menu-tab-${menuTabs.indexOf(selectedTab)}`}
            aria-live="polite"
          >
            {currentItems.map((item, index) => (
              <div className="menu-item" key={item.name}>
                <span className="menu-item__number">0{index + 1}</span>
                <span>
                  <strong>{item.name}</strong>
                  <small>{item.detail}</small>
                </span>
                <span className="menu-item__price">{item.price}</span>
                <ArrowUpRight size={18} strokeWidth={1.6} aria-hidden="true" />
              </div>
            ))}
          </div>
          <span className="menu-placeholder">FULL MENU / PRICES VERIFIED SOON</span>
        </section>

        <section className="focus-interlude section-dark">
          <div className="focus-interlude__label">
            <span>07 — 11</span>
            <span>FOCUS INTERLUDE</span>
          </div>
          <div className="focus-interlude__steps">
            {[
              'MỞ VIỆC CẦN LÀM.',
              'ĐẶT ĐIỆN THOẠI XUỐNG.',
              'BẮT ĐẦU.',
              'ĐỪNG NGHĨ QUÁ NHIỀU.',
              'LÀM TIẾP.',
            ].map((step, index) => (
              <div
                className="focus-step"
                key={step}
              >
                <span>0{index + 1}.</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
          <a className="focus-trigger" href="/workspace">
            VÀO WORKSPACE{' '}
            <Play size={13} fill="currentColor" strokeWidth={1.5} aria-hidden="true" />
          </a>
          <div className="focus-interlude__stamp">KIÊN TRÌ — KỶ LUẬT</div>
        </section>

        <section className="locations-section" id="locations" ref={locationsRef}>
          <div className="locations-section__top">
            <SectionLabel>CONTRAST GẦN BẠN</SectionLabel>
            <span className="chapter-count">08 — 11</span>
          </div>
          <div className="locations-section__heading">
            <h2>
              HÔM NAY
              <br />
              <span>NGỒI ĐÂU?</span>
            </h2>
            <p>
              Mỗi cơ sở có không gian và nhịp riêng.
              <br />
              Chọn nơi phù hợp với buổi học hoặc làm việc hôm nay.
            </p>
          </div>
          <div className="locations-layout">
            <div
              className="location-list"
              role="tablist"
              aria-label="Chọn cơ sở Contrast"
            >
              {locations.map((location, index) => (
                <button
                  type="button"
                  className={`location-tab${activeLocation === index ? 'is-active' : ''}`}
                  key={location.name}
                  onClick={() => setActiveLocation(index)}
                  role="tab"
                  aria-selected={activeLocation === index}
                  aria-controls={`location-panel-${index}`}
                  id={`location-tab-${index}`}
                >
                  <span>0{index + 1}</span>
                  <strong>CONTRAST — {location.name}</strong>
                  <MoveUpRight size={19} strokeWidth={1.5} aria-hidden="true" />
                </button>
              ))}
            </div>
            <article
              className="location-detail"
              id={`location-panel-${activeLocation}`}
              aria-labelledby={`location-tab-${activeLocation}`}
              aria-live="polite"
            >
              <div className="location-detail__map">
                <div className="map-grid" aria-hidden="true" />
                <MapPin size={31} strokeWidth={1.3} aria-hidden="true" />
                <span>
                  CONTRAST
                  <br />
                  {locations[activeLocation].name}
                </span>
                <div className="map-coordinates">
                  MAP / DIRECTIONS
                  <br />
                  VERIFIED SOON
                </div>
              </div>
              <div className="location-detail__info">
                <span className="location-detail__eyebrow">
                  SELECTED LOCATION / 0{activeLocation + 1}
                </span>
                <h3>{locations[activeLocation].name}</h3>
                <p>{locations[activeLocation].note}</p>
                <dl>
                  <div>
                    <dt>ĐỊA CHỈ</dt>
                    <dd>[VERIFIED SOON]</dd>
                  </div>
                  <div>
                    <dt>HÔM NAY</dt>
                    <dd>[HOURS VERIFIED SOON]</dd>
                  </div>
                </dl>
                <div className="location-detail__actions">
                  <span className="location-placeholder">
                    MAP / DIRECTIONS VERIFIED SOON
                  </span>
                </div>
              </div>
            </article>
          </div>
          <button type="button" className="location-all" onClick={scrollToLocations}>
            XEM TẤT CẢ CƠ SỞ{' '}
            <ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
          </button>
        </section>

        <section className="campaign section-red">
          <div className="campaign__meta">
            <span>09 — 11</span>
            <span>FROM CONTRAST</span>
          </div>
          <div className="campaign__content">
            <p className="campaign__small">CONTRAST / CAMPAIGN WALL</p>
            <h2>
              GIỜ RA CHƠI.
              <br />
              <span>RỒI</span>
              <br />
              QUAY LẠI.
            </h2>
            <div className="campaign__fragments">
              <span>KIÊN TRÌ — KỶ LUẬT</span>
              <span>TĂNG TỐC — VỀ ĐÍCH</span>
              <span>PHẢI KỶ LUẬT.</span>
            </div>
          </div>
          <div className="campaign__seal" aria-hidden="true">
            <span>CONTRAST</span>
            <strong>CC</strong>
            <span>COFFEE</span>
          </div>
        </section>

        <section className="final-cta section-dark">
          <div className="final-cta__top">
            <span>10 — 11</span>
            <span>CONTRAST COFFEE 24H</span>
          </div>
          <div className="final-cta__grid">
            <h2>
              VIỆC
              <br />
              VẪN CÒN?
              <br />
              <span>ĐẾN CONTRAST.</span>
            </h2>
            <div className="final-cta__copy">
              <p>
                Mang theo laptop.
                <br />
                Mang theo sách.
                <br />
                Mang theo việc cần hoàn thành.
              </p>
              <button
                type="button"
                className="button button--white"
                onClick={scrollToLocations}
              >
                TÌM CƠ SỞ <ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
              </button>
              <a className="text-link text-link--light" href="/menu">
                XEM MENU <ArrowDownRight size={16} strokeWidth={1.7} aria-hidden="true" />
              </a>
            </div>
          </div>
          <div className="final-cta__bottom">
            <span>STUDY · WORK · COFFEE</span>
            <span>KIÊN TRÌ — KỶ LUẬT</span>
          </div>
        </section>

        <section
          id="attendance"
          className="attendance-teaser"
          aria-labelledby="attendance-title"
          aria-describedby="attendance-note"
        >
          <div>
            <p className="section-label">CONTRAST / DAILY PRACTICE</p>
            <h2 id="attendance-title">
              MỘT NGÀY.
              <br />
              MỘT DẤU.
            </h2>
            <p id="attendance-note">
              Giữ nhịp học bằng một lần xuất hiện. Điểm danh sẽ mở khi hệ thống
              first-party được xác nhận.
            </p>
          </div>
          <button
            type="button"
            className="button button--dark"
            onClick={() => setAttendanceOpen((open) => !open)}
            aria-expanded={attendanceOpen}
          >
            {attendanceOpen ? 'ĐÓNG THÔNG TIN' : 'XEM CÁCH GIỮ NHỊP'}{' '}
            <ArrowUpRight size={16} aria-hidden="true" />
          </button>
          {attendanceOpen ? (
            <p className="attendance-teaser__note" role="status">
              QR scanner và lịch cá nhân sẽ được kết nối sau khi backend được xác nhận.
            </p>
          ) : null}
        </section>
      </main>

      <footer className="site-footer">
        <div className="site-footer__main">
          <div>
            <a className="footer-brand" href="#top">
              <ContrastLogo
                variant="wordmark-dark"
                className="brand-logo brand-logo--footer"
              />
            </a>
            <p>KIÊN TRÌ — KỶ LUẬT</p>
          </div>
          <div className="footer-links">
            <div>
              <span>KHÁM PHÁ</span>
              <a href="#space">KHÔNG GIAN</a>
              <a href="/menu">MENU</a>
              <a href="#locations">CƠ SỞ</a>
            </div>
            <div>
              <span>KẾT NỐI</span>
              <span className="footer-placeholder">SOCIAL LINKS / VERIFIED SOON</span>
            </div>
          </div>
          <div className="footer-red-block">
            CONTRAST
            <br />
            COFFEE
            <br />
            <span>24H</span>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© CONTRAST COFFEE</span>
          <span>[LEGAL / PRIVACY IF REQUIRED]</span>
          <span>HỒ CHÍ MINH CITY / VIỆT NAM</span>
        </div>
      </footer>
    </div>
  )
}
