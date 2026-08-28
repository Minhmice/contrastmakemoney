import { Play } from 'lucide-react'

const FOCUS_STEPS = [
  'MỞ VIỆC CẦN LÀM.',
  'ĐẶT ĐIỆN THOẠI XUỐNG.',
  'BẮT ĐẦU.',
  'ĐỪNG NGHĨ QUÁ NHIỀU.',
  'LÀM TIẾP.',
]

export function FocusInterludeSection() {
  return (
    <section className="focus-interlude section-dark">
      <div className="focus-interlude__label">
        <span>07 — 11</span>
        <span>FOCUS INTERLUDE</span>
      </div>
      <div className="focus-interlude__steps">
        {FOCUS_STEPS.map((step, index) => (
          <div className="focus-step" key={step}>
            <span>0{index + 1}.</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>
      <a className="focus-trigger" href="/workspace">
        VÀO WORKSPACE <Play size={13} fill="currentColor" strokeWidth={1.5} aria-hidden="true" />
      </a>
      <div className="focus-interlude__stamp">KIÊN TRÌ — KỶ LUẬT</div>
    </section>
  )
}
