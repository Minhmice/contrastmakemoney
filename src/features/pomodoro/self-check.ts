import { createPomodoroState, pomodoroReducer } from './reducer.ts'
import { getRingAngle, isValidDurationMinutes } from './timer.ts'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

const state = createPomodoroState()
const running = pomodoroReducer(state, { type: 'START', now: 1000 })
assert(running.endsAt === 1_501_000, 'start uses remaining timestamp')
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
