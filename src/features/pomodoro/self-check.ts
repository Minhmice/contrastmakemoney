import { createPomodoroState, pomodoroReducer } from './reducer'
import { getDisplaySeconds, getRingAngle, isValidDurationMinutes } from './timer'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

const state = createPomodoroState()
const running = pomodoroReducer(state, { type: 'START', now: 1000 })
assert(running.endsAt === 1_501_000, 'start uses remaining timestamp')
const paused = pomodoroReducer(running, { type: 'PAUSE', now: 61_000 })
assert(paused.status === 'idle' && paused.remainingSeconds === 1_440 && paused.endsAt === null, 'pause keeps remaining time')
const resumed = pomodoroReducer(paused, { type: 'START', now: 61_000 })
assert(resumed.endsAt === 1_501_000, 'resume keeps paused timestamp')
assert(getDisplaySeconds(paused.remainingSeconds, paused.endsAt, 61_000) === paused.remainingSeconds, 'paused display stays stable')
const shortBreak = pomodoroReducer(running, { type: 'TICK', now: 1_501_000 })
assert(shortBreak.phase === 'shortBreak' && shortBreak.status === 'idle', 'work completes into stopped short break')
const skipped = pomodoroReducer(state, { type: 'SKIP' })
assert(skipped.phase === 'shortBreak' && skipped.completedWork === 0, 'skip does not complete work')
const finalWork = { ...state, workTurn: 4 as const }
const longBreak = pomodoroReducer(finalWork, { type: 'SKIP' })
assert(longBreak.phase === 'longBreak', 'final work enters long break')
assert(pomodoroReducer(longBreak, { type: 'SKIP' }).workTurn === 1, 'long break resets turn')
assert(!isValidDurationMinutes(0) && !isValidDurationMinutes(1.5), 'invalid durations rejected')
assert(getRingAngle(-10) === 0 && getRingAngle(110) === 360, 'ring angle clamps')