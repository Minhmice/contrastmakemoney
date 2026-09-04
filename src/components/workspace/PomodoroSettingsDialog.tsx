import { useState } from 'react'
import { Check, Minus, Plus, RotateCcw, SlidersHorizontal, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { PomodoroSettings } from '@/features/pomodoro'

type PomodoroSettingsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: PomodoroSettings
  onSave: (settings: PomodoroSettings) => void
}

type Preset = {
  id: string
  name: string
  work: number
  shortBreak: number
  longBreak: number
}

const PRESETS: Preset[] = [
  { id: 'standard', name: 'Tiêu chuẩn', work: 25, shortBreak: 5, longBreak: 15 },
  { id: 'deep', name: 'Tập trung sâu', work: 50, shortBreak: 10, longBreak: 20 },
  { id: 'sprint', name: 'Nước rút', work: 15, shortBreak: 3, longBreak: 10 },
  { id: 'ultradian', name: 'Chu kỳ dài', work: 90, shortBreak: 20, longBreak: 30 },
]

function PomodoroSettingsDialogContent({
  settings,
  onClose,
  onSave,
}: {
  settings: PomodoroSettings
  onClose: () => void
  onSave: (settings: PomodoroSettings) => void
}) {
  const [work, setWork] = useState(settings.workMinutes)
  const [shortBreak, setShortBreak] = useState(settings.shortBreakMinutes)
  const [longBreak, setLongBreak] = useState(settings.longBreakMinutes)
  const [prevSettings, setPrevSettings] = useState(settings)

  if (settings !== prevSettings) {
    setPrevSettings(settings)
    setWork(settings.workMinutes)
    setShortBreak(settings.shortBreakMinutes)
    setLongBreak(settings.longBreakMinutes)
  }

  const applyPreset = (preset: Preset) => {
    setWork(preset.work)
    setShortBreak(preset.shortBreak)
    setLongBreak(preset.longBreak)
  }

  const isCurrentPreset = (preset: Preset) =>
    work === preset.work && shortBreak === preset.shortBreak && longBreak === preset.longBreak

  const handleSave = () => {
    onSave({
      workMinutes: Math.min(120, Math.max(1, work)),
      shortBreakMinutes: Math.min(60, Math.max(1, shortBreak)),
      longBreakMinutes: Math.min(90, Math.max(1, longBreak)),
      workTurnsBeforeLongBreak: 4,
    })
    onClose()
  }

  const handleResetDefault = () => {
    setWork(25)
    setShortBreak(5)
    setLongBreak(15)
  }

  return (
    <DialogContent className="workspace-settings-dialog" showCloseButton={false}>
      <div className="workspace-settings-dialog__header">
        <div>
          <DialogHeader style={{ padding: 0, textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <SlidersHorizontal size={16} color="#e01920" />
              <DialogTitle className="workspace-settings-dialog__title">
                THỜI GIAN PHIÊN
              </DialogTitle>
            </div>
            <DialogDescription className="workspace-settings-dialog__desc">
              Tùy chỉnh độ dài các phiên học tập và nghỉ ngơi (Pomodoro).
            </DialogDescription>
          </DialogHeader>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng cài đặt thời gian"
          className="workspace-tool-card__close-btn"
        >
          <X size={16} />
        </button>
      </div>

      {/* Quick Presets */}
      <div>
        <span
          style={{
            display: 'block',
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: '0.12em',
            color: '#6a6962',
            marginBottom: 8,
            textTransform: 'uppercase',
          }}
        >
          Mẫu nhịp phổ biến
        </span>
        <div className="workspace-preset-grid">
          {PRESETS.map((preset) => {
            const active = isCurrentPreset(preset)
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className={`workspace-preset-btn ${active ? 'workspace-preset-btn--active' : ''}`}
              >
                <div style={{ display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="workspace-preset-btn__name">{preset.name}</span>
                  {active ? <Check size={14} color="#e01920" /> : null}
                </div>
                <span className="workspace-preset-btn__times">
                  {preset.work}p • {preset.shortBreak}p • {preset.longBreak}p
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Steppers */}
      <div>
        <span
          style={{
            display: 'block',
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: '0.12em',
            color: '#6a6962',
            marginBottom: 8,
            textTransform: 'uppercase',
          }}
        >
          Tùy chỉnh từng phiên
        </span>
        <div className="workspace-duration-rows">
          {/* Work duration */}
          <div className="workspace-duration-row">
            <div className="workspace-duration-row__label">
              <span style={{ width: 6, height: 6, backgroundColor: '#e01920', display: 'inline-block' }} />
              <span>Phiên tập trung</span>
            </div>
            <div className="workspace-duration-stepper">
              <button
                type="button"
                onClick={() => setWork((v) => Math.max(1, v - (v > 15 ? 5 : 1)))}
                aria-label="Giảm thời gian tập trung"
                className="workspace-stepper-btn"
              >
                <Minus size={14} />
              </button>
              <span className="workspace-stepper-value">{work} phút</span>
              <button
                type="button"
                onClick={() => setWork((v) => Math.min(120, v + (v >= 15 ? 5 : 1)))}
                aria-label="Tăng thời gian tập trung"
                className="workspace-stepper-btn"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Short break duration */}
          <div className="workspace-duration-row">
            <div className="workspace-duration-row__label">
              <span style={{ width: 6, height: 6, backgroundColor: '#6a6962', display: 'inline-block' }} />
              <span>Nghỉ ngắn</span>
            </div>
            <div className="workspace-duration-stepper">
              <button
                type="button"
                onClick={() => setShortBreak((v) => Math.max(1, v - 1))}
                aria-label="Giảm thời gian nghỉ ngắn"
                className="workspace-stepper-btn"
              >
                <Minus size={14} />
              </button>
              <span className="workspace-stepper-value">{shortBreak} phút</span>
              <button
                type="button"
                onClick={() => setShortBreak((v) => Math.min(30, v + 1))}
                aria-label="Tăng thời gian nghỉ ngắn"
                className="workspace-stepper-btn"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Long break duration */}
          <div className="workspace-duration-row">
            <div className="workspace-duration-row__label">
              <span style={{ width: 6, height: 6, backgroundColor: '#10110f', display: 'inline-block' }} />
              <span>Nghỉ dài (Sau 4 hiệp)</span>
            </div>
            <div className="workspace-duration-stepper">
              <button
                type="button"
                onClick={() => setLongBreak((v) => Math.max(5, v - 5))}
                aria-label="Giảm thời gian nghỉ dài"
                className="workspace-stepper-btn"
              >
                <Minus size={14} />
              </button>
              <span className="workspace-stepper-value">{longBreak} phút</span>
              <button
                type="button"
                onClick={() => setLongBreak((v) => Math.min(60, v + 5))}
                aria-label="Tăng thời gian nghỉ dài"
                className="workspace-stepper-btn"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 10, marginTop: 4 }}>
        <Button
          type="button"
          onClick={handleSave}
          className="workspace-ctrl-red"
          style={{
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            fontSize: 11,
            fontWeight: 900,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          <Check size={16} /> ÁP DỤNG THIẾT LẬP
        </Button>
        <Button
          type="button"
          onClick={handleResetDefault}
          className="workspace-ctrl-paper"
          style={{
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: 11,
            fontWeight: 800,
          }}
          title="Khôi phục mặc định 25 / 5 / 15"
        >
          <RotateCcw size={14} /> MẶC ĐỊNH
        </Button>
      </div>
    </DialogContent>
  )
}

export function PomodoroSettingsDialog({
  open,
  onOpenChange,
  settings,
  onSave,
}: PomodoroSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <PomodoroSettingsDialogContent
        settings={settings}
        onClose={() => onOpenChange(false)}
        onSave={onSave}
      />
    </Dialog>
  )
}
