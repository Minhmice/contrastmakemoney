import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { BrandLink } from '@/components/shared/BrandLink'
import { SectionLabel } from '@/components/shared/SectionLabel'
import { Button } from '@/components/ui/button'

type HeroSectionProps = {
  onFindLocations: () => void
}

export function HeroSection({ onFindLocations }: HeroSectionProps) {
  return (
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
            <Button className="button button--red" onClick={onFindLocations}>
              TÌM CƠ SỞ <ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
            </Button>
            <BrandLink href="/menu">
              XEM MENU <ArrowDownRight size={16} strokeWidth={1.7} aria-hidden="true" />
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
          24H <span>—</span> STUDY <span>—</span> WORK <span>—</span> COFFEE <span>—</span>
        </div>
      </div>
      <div className="scroll-cue" aria-hidden="true">
        <span>CUỘN ĐỂ VÀO VIỆC</span>
        <ArrowDownRight size={18} strokeWidth={1.5} />
      </div>
    </section>
  )
}
