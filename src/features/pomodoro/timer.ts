import type { PomodoroPhase, PomodoroSettings } from './types.ts'

export const MIN_DURATION_MINUTES = 1
export const MAX_DURATION_MINUTES = 120

export function isValidDurationMinutes(minutes: number): boolean {
  return Number.isInteger(minutes) && minutes >= MIN_DURATION_MINUTES && minutes <= MAX_DURATION_MINUTES
}

export function clampDurationMinutes(minutes: number): number {
  return Math.min(MAX_DURATION_MINUTES, Math.max(MIN_DURATION_MINUTES, Math.round(minutes)))
}

export function minutesToSeconds(minutes: number): number {
  return clampDurationMinutes(minutes) * 60
}

export function getPhaseDurationSeconds(phase: PomodoroPhase, settings: PomodoroSettings): number {
  if (phase === 'shortBreak') return minutesToSeconds(settings.shortBreakMinutes)
  if (phase === 'longBreak') return minutesToSeconds(settings.longBreakMinutes)
  return minutesToSeconds(settings.workMinutes)
}

export function getDisplaySeconds(remainingSeconds: number, endsAt: number | null, now: number): number {
  if (endsAt === null) return Math.max(0, Math.ceil(remainingSeconds))
  return Math.max(0, Math.ceil((endsAt - now) / 1000))
}

export function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function getProgressPercent(remainingSeconds: number, durationSeconds: number): number {
  if (durationSeconds <= 0) return 0
  return Math.min(100, Math.max(0, (1 - remainingSeconds / durationSeconds) * 100))
}

export function getRingAngle(progressPercent: number): number {
  return Math.min(360, Math.max(0, progressPercent * 3.6))
}

export function snapDurationMinutes(minutes: number): number {
  return clampDurationMinutes(minutes)
}

export function getDurationAngle(minutes: number): number {
  return ((snapDurationMinutes(minutes) - MIN_DURATION_MINUTES) /
    (MAX_DURATION_MINUTES - MIN_DURATION_MINUTES)) * 360
}

export function getMinutesFromRingAngle(angle: number): number {
  const normalizedAngle = ((angle % 360) + 360) % 360
  return snapDurationMinutes(
    MIN_DURATION_MINUTES +
      (normalizedAngle / 360) * (MAX_DURATION_MINUTES - MIN_DURATION_MINUTES),
  )
}

export function getNextPhaseLabel(phase: PomodoroPhase, workTurn: number): string {
  if (phase === 'work') return workTurn === 4 ? 'NGHỈ DÀI' : 'NGHỈ NGẮN'
  if (phase === 'shortBreak') return `LÀM VIỆC ${workTurn + 1}`
  return 'LÀM VIỆC 1'
}
