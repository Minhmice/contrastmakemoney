import { Pause, Play, RotateCcw, SkipForward, SlidersHorizontal, TimerReset } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatTime } from '@/features/pomodoro'

type FocusStageProps = {
  phase: 'work' | 'shortBreak' | 'longBreak'
  status: 'idle' | 'running'
  remainingSeconds: number
  durationSeconds: number
  workTurn: number
  completedWork: number
  completionPulse?: number
  progress: number
  background?: string
  overlay?: number
  activeTask: string | null
  taskOpen?: boolean
  onOpenTasks?: () => void
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
  onOpenSettings?: () => void
}

const phaseLabel = {
  work: 'TẬP TRUNG',
  shortBreak: 'NGHỈ NGẮN',
  longBreak: 'NGHỈ DÀI',
}

const RADIUS = 136
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function FocusStage({
  phase,
  status,
  remainingSeconds,
  durationSeconds,
  workTurn,
  completedWork,
  completionPulse = 0,
  progress,
  activeTask,
  taskOpen = true,
  onOpenTasks,
  onStart,
  onPause,
  onReset,
  onSkip,
  onOpenSettings,
}: FocusStageProps) {
  const running = status === 'running'
  const clampedProgress = Math.min(100, Math.max(0, progress))
  const strokeDashoffset = CIRCUMFERENCE * (1 - clampedProgress / 100)

  return (
    <section
      className="workspace-clock workspace-stage"
      aria-labelledby="focus-stage-title"
    >
      {/* Top Session Progress Bar */}
      <div className="workspace-stage__accent-track" aria-hidden="true" />
      <div
        className="workspace-stage__accent"
        role="progressbar"
        aria-label={`Tiến trình phiên ${phaseLabel[phase]}`}
        aria-valuenow={Math.round(clampedProgress)}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          transform: `scaleX(${clampedProgress / 100})`,
          transition: clampedProgress === 0 ? 'none' : 'transform 0.25s linear',
        }}
      />

      {/* Active Task Banner */}
      <div className="workspace-stage__task-banner">
        <div className="workspace-stage__eyebrow-row">
          <span className="workspace-stage__badge">
            <span
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                backgroundColor: '#e01920',
              }}
              aria-hidden="true"
            />
            <span key={phase} className="workspace-stage__phase-copy">
              {phaseLabel[phase]}
            </span> / PHIÊN {workTurn}/4
          </span>
          <span className="workspace-stage__status-text" aria-live="polite">
            {running ? 'ĐANG CHẠY' : 'SẴN SÀNG'} • {completedWork} ĐÃ XONG
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
          <h1 id="focus-stage-title" className="workspace-stage__title">
            {activeTask ?? 'CHỌN MỘT VIỆC.'}
          </h1>
          {!taskOpen && onOpenTasks ? (
            <button
              type="button"
              onClick={onOpenTasks}
              style={{
                fontSize: 10,
                fontWeight: 800,
                padding: '3px 10px',
                minHeight: 26,
                border: '1px solid rgba(243, 241, 234, 0.3)',
                background: 'rgba(243, 241, 234, 0.1)',
                color: '#f3f1ea',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'background 0.15s ease',
              }}
            >
              MỞ VIỆC
            </button>
          ) : null}
        </div>
      </div>

      {/* Circular Pomodoro Dial */}
      <div
        className="workspace-dial"
        role="region"
        aria-label={`Bộ đếm Pomodoro: ${formatTime(remainingSeconds)} còn lại`}
      >
        <svg
          className="workspace-dial__svg"
          viewBox="0 0 320 320"
          aria-hidden="true"
        >
          {/* Outer dial ticks */}
          <circle
            cx="160"
            cy="160"
            r="150"
            className="workspace-dial__tick-ring"
          />
          {/* Base track */}
          <circle
            cx="160"
            cy="160"
            r={RADIUS}
            className="workspace-dial__track"
          />
          {/* Active progress arc */}
          <circle
            cx="160"
            cy="160"
            r={RADIUS}
            className="workspace-dial__progress"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>

        <div className="workspace-dial__content">
          <span key={phase} className="workspace-dial__phase workspace-stage__phase-copy">
            {phaseLabel[phase]}
          </span>
          <time
            dateTime={`PT${remainingSeconds}S`}
            className="workspace-dial__time"
          >
            {formatTime(remainingSeconds)}
          </time>
          {completionPulse > 0 ? (
            <span
              key={completionPulse}
              className="workspace-completion-mark"
              aria-live="polite"
            >
              XONG MỘT PHIÊN.
            </span>
          ) : null}
          <span className="workspace-dial__phrase">
            {phase === 'work'
              ? 'MỘT VIỆC. MỘT NHỊP.'
              : 'ĐỨNG DẬY. HÍT THỞ. QUAY LẠI.'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="workspace-controls">
        <Button
          type="button"
          onClick={running ? onPause : onStart}
          className="workspace-btn-primary"
        >
          {running ? <Pause size={18} /> : <Play size={18} />}
          {running ? 'TẠM DỪNG' : 'BẮT ĐẦU'}
        </Button>
        <Button
          type="button"
          onClick={onReset}
          aria-label="Đặt lại phiên"
          className="workspace-btn-secondary"
        >
          <RotateCcw size={18} />
        </Button>
        <Button
          type="button"
          onClick={onSkip}
          aria-label="Chuyển phiên"
          className="workspace-btn-secondary"
        >
          <SkipForward size={18} />
        </Button>
        {onOpenSettings ? (
          <Button
            type="button"
            onClick={onOpenSettings}
            aria-label="Cài đặt thời gian phiên"
            title="Chỉnh thời gian phiên"
            className="workspace-btn-secondary"
          >
            <SlidersHorizontal size={18} />
          </Button>
        ) : null}
      </div>

      <div className="workspace-stage__footer-hint">
        <TimerReset size={14} />
        <span>{Math.ceil(durationSeconds / 60)} PHÚT / TỰ LƯU PHIÊN HOÀN THÀNH</span>
      </div>
    </section>
  )
}

