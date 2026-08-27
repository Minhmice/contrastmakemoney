export type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak'
export type PomodoroStatus = 'idle' | 'running'

export type PomodoroSettings = {
  workMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  workTurnsBeforeLongBreak: number
}

export type PomodoroState = {
  phase: PomodoroPhase
  status: PomodoroStatus
  workTurn: 1 | 2 | 3 | 4
  completedWork: number
  durationSeconds: number
  remainingSeconds: number
  endsAt: number | null
  settings: PomodoroSettings
}

export type PomodoroAction =
  | { type: 'START'; now: number }
  | { type: 'TICK'; now: number }
  | { type: 'RESET' }
  | { type: 'SKIP' }
  | { type: 'SET_DURATION'; minutes: number }
