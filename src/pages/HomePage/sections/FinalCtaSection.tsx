import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

type FinalCtaSectionProps = {
  onFindLocations: () => void
}

export function FinalCtaSection({ onFindLocations }: FinalCtaSectionProps) {
  return (
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
          <Button type="button" className="button button--white" onClick={onFindLocations}>
            TÌM CƠ SỞ <ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
          </Button>
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
  )
}
