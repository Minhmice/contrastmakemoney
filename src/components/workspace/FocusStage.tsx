import { Pause, Play, RotateCcw, SkipForward, TimerReset } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatTime } from '@/features/pomodoro'
import { eyebrow, workspaceColor, workspaceControl } from './workspace-styles'

type FocusStageProps = {
  phase: 'work' | 'shortBreak' | 'longBreak'
  status: 'idle' | 'running'
  remainingSeconds: number
  durationSeconds: number
  workTurn: number
  completedWork: number
  progress: number
  background: string
  overlay: number
  activeTask: string | null
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
}

const phaseLabel = { work: 'TẬP TRUNG', shortBreak: 'NGHỈ NGẮN', longBreak: 'NGHỈ DÀI' }

export function FocusStage({ phase, status, remainingSeconds, durationSeconds, workTurn, completedWork, progress, background, overlay, activeTask, onStart, onPause, onReset, onSkip }: FocusStageProps) {
  const running = status === 'running'

  return (
    <section className="workspace-clock" aria-labelledby="focus-stage-title" style={{ position: 'relative', isolation: 'isolate', display: 'grid', alignContent: 'space-between', minHeight: 'clamp(500px, calc(100dvh - 150px), 700px)', overflow: 'hidden', background: workspaceColor.ink, color: workspaceColor.paper, padding: 'clamp(24px, 5vw, 68px)' }}>
      <div aria-hidden="true" style={{ position: 'absolute', zIndex: -2, inset: 0, backgroundImage: `url(${background})`, backgroundPosition: 'center', backgroundSize: 'cover', filter: 'saturate(.76)' }} />
      <div aria-hidden="true" style={{ position: 'absolute', zIndex: -1, inset: 0, background: `linear-gradient(112deg, rgba(16,17,15,${Math.min(.95, overlay + .22)}) 18%, rgba(16,17,15,${overlay}) 66%, rgba(16,17,15,${Math.min(.94, overlay + .16)}))` }} />
      <div aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 12, background: workspaceColor.red, transform: `scaleX(${running ? 1 : .5})`, transformOrigin: 'left', transition: 'transform 180ms ease-out' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, alignItems: 'start' }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ ...eyebrow, color: workspaceColor.paper }}>{phaseLabel[phase]} / PHIÊN {workTurn}/4</p>
          <h1 id="focus-stage-title" style={{ margin: '8px 0 0', maxWidth: 460, fontSize: 'clamp(24px, 3.2vw, 44px)', lineHeight: 1.04, letterSpacing: '-0.04em' }}>{activeTask ?? 'CHỌN MỘT VIỆC.'}</h1>
        </div>
        <div aria-live="polite" style={{ flex: '0 0 auto', textAlign: 'right', fontSize: 10, fontWeight: 800, letterSpacing: '0.1em' }}>{running ? 'ĐANG CHẠY' : 'SẴN SÀNG'}<br />{completedWork} ĐÃ XONG</div>
      </div>

      <div style={{ maxWidth: 660, minWidth: 0, paddingTop: 40 }}>
        <time dateTime={`PT${remainingSeconds}S`} style={{ display: 'block', fontSize: 'clamp(84px, 13vw, 190px)', fontWeight: 900, letterSpacing: '-0.09em', lineHeight: .88, fontVariantNumeric: 'tabular-nums' }}>{formatTime(remainingSeconds)}</time>
        <div aria-label={`${Math.round(progress)}% thời lượng đã trôi qua`} style={{ height: 6, marginTop: 'clamp(24px, 4vw, 38px)', background: 'rgba(243,241,234,.28)' }}><div style={{ width: `${progress}%`, height: '100%', background: workspaceColor.red, transition: 'width 220ms linear' }} /></div>
        <p style={{ margin: '12px 0 0', color: 'rgba(243,241,234,.74)', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em' }}>{Math.ceil(durationSeconds / 60)} PHÚT / {phase === 'work' ? 'MỘT VIỆC. MỘT NHỊP.' : 'ĐỨNG DẬY. HÍT THỞ. QUAY LẠI.'}</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', paddingTop: 32 }}>
        <Button type="button" onClick={running ? onPause : onStart} style={{ ...workspaceControl('red'), minWidth: 160, minHeight: 52 }}>{running ? <Pause size={18} /> : <Play size={18} />}{running ? 'TẠM DỪNG' : 'BẮT ĐẦU'}</Button>
        <Button type="button" onClick={onReset} aria-label="Đặt lại phiên" style={{ ...workspaceControl('paper'), width: 52, minHeight: 52, padding: 0 }}><RotateCcw size={18} /></Button>
        <Button type="button" onClick={onSkip} aria-label="Chuyển phiên" style={{ ...workspaceControl('paper'), width: 52, minHeight: 52, padding: 0 }}><SkipForward size={18} /></Button>
        <span style={{ display: 'inline-flex', gap: 7, alignItems: 'center', color: 'rgba(243,241,234,.76)', fontSize: 11, fontWeight: 700 }}><TimerReset size={15} />TỰ LƯU PHIÊN HOÀN THÀNH</span>
      </div>
    </section>
  )
}
