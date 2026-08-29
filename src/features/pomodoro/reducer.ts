import { getPhaseDurationSeconds, isValidDurationMinutes, minutesToSeconds } from './timer'
import type { PomodoroAction, PomodoroPhase, PomodoroSettings, PomodoroState } from './types'

export const DEFAULT_POMODORO_SETTINGS: PomodoroSettings = {
  workMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  workTurnsBeforeLongBreak: 4,
}

export function createPomodoroState(
  settings: PomodoroSettings = DEFAULT_POMODORO_SETTINGS,
): PomodoroState {
  return {
    phase: 'work',
    status: 'idle',
    workTurn: 1,
    completedWork: 0,
    durationSeconds: getPhaseDurationSeconds('work', settings),
    remainingSeconds: getPhaseDurationSeconds('work', settings),
    endsAt: null,
    settings,
  }
}

function nextPhase(phase: PomodoroPhase, workTurn: 1 | 2 | 3 | 4): { phase: PomodoroPhase; workTurn: 1 | 2 | 3 | 4 } {
  if (phase === 'work') {
    return workTurn === 4 ? { phase: 'longBreak', workTurn } : { phase: 'shortBreak', workTurn }
  }
  if (phase === 'shortBreak') {
    return { phase: 'work', workTurn: (workTurn + 1) as 1 | 2 | 3 | 4 }
  }
  return { phase: 'work', workTurn: 1 }
}

function transition(state: PomodoroState, completedNaturally: boolean): PomodoroState {
  const next = nextPhase(state.phase, state.workTurn)
  const completedWork = completedNaturally && state.phase === 'work' ? state.completedWork + 1 : state.completedWork
  const durationSeconds = getPhaseDurationSeconds(next.phase, state.settings)
  return {
    ...state,
    ...next,
    status: 'idle',
    completedWork,
    durationSeconds,
    remainingSeconds: durationSeconds,
    endsAt: null,
  }
}

export function pomodoroReducer(state: PomodoroState, action: PomodoroAction): PomodoroState {
  switch (action.type) {
    case 'START':
      if (state.status === 'running' || state.remainingSeconds <= 0) return state
      return { ...state, status: 'running', endsAt: action.now + state.remainingSeconds * 1000 }
    case 'PAUSE': {
      if (state.status !== 'running' || state.endsAt === null) return state
      return {
        ...state,
        status: 'idle',
        remainingSeconds: Math.max(0, Math.ceil((state.endsAt - action.now) / 1000)),
        endsAt: null,
      }
    }
    case 'TICK': {
      if (state.status !== 'running' || state.endsAt === null) return state
      const remainingSeconds = Math.max(0, Math.ceil((state.endsAt - action.now) / 1000))
      return remainingSeconds > 0 ? { ...state, remainingSeconds } : transition(state, true)
    }
    case 'RESET': {
      const durationSeconds = getPhaseDurationSeconds(state.phase, state.settings)
      return { ...state, status: 'idle', durationSeconds, remainingSeconds: durationSeconds, endsAt: null }
    }
    case 'SKIP':
      return transition(state, false)
    case 'SET_SETTINGS': {
      const durationSeconds = getPhaseDurationSeconds(state.phase, action.settings)
      return { ...state, settings: action.settings, durationSeconds, remainingSeconds: durationSeconds }
    }
    case 'SET_DURATION':
      if (state.status === 'running' || !isValidDurationMinutes(action.minutes)) return state
      return {
        ...state,
        settings: state.phase === 'work'
          ? { ...state.settings, workMinutes: action.minutes }
          : state.phase === 'shortBreak'
            ? { ...state.settings, shortBreakMinutes: action.minutes }
            : { ...state.settings, longBreakMinutes: action.minutes },
        durationSeconds: minutesToSeconds(action.minutes),
        remainingSeconds: minutesToSeconds(action.minutes),
      }
  }
}