import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { createPomodoroState, pomodoroReducer } from './reducer.ts'
import { getDisplaySeconds } from './timer.ts'

export function usePomodoro() {
  const [state, dispatch] = useReducer(pomodoroReducer, undefined, createPomodoroState)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (state.status !== 'running') return
    const interval = window.setInterval(() => setNow(Date.now()), 250)
    return () => window.clearInterval(interval)
  }, [state.status])

  useEffect(() => {
    const refresh = () => setNow(Date.now())
    document.addEventListener('visibilitychange', refresh)
    return () => document.removeEventListener('visibilitychange', refresh)
  }, [])

  useEffect(() => {
    if (state.status === 'running' && state.endsAt !== null && now >= state.endsAt) {
      dispatch({ type: 'TICK', now })
    }
  }, [now, state.endsAt, state.status])

  const start = useCallback(() => dispatch({ type: 'START', now: Date.now() }), [])
  const reset = useCallback(() => dispatch({ type: 'RESET' }), [])
  const skip = useCallback(() => dispatch({ type: 'SKIP' }), [])
  const setDuration = useCallback((minutes: number) => dispatch({ type: 'SET_DURATION', minutes }), [])
  const remainingSeconds = getDisplaySeconds(state.remainingSeconds, state.endsAt, now)
  const displayState = useMemo(() => ({ ...state, remainingSeconds }), [remainingSeconds, state])

  return { state: displayState, start, reset, skip, setDuration }
}
