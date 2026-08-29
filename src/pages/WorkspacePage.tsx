import { useEffect, useMemo, useRef, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { ArrowLeft, ArrowUpRight, Check, Circle, Coffee, Focus, Play, Plus, RotateCcw, SkipForward } from 'lucide-react'
import { SiteNav } from '@/components/nav/SiteNav'
import { AttendanceScanner } from '@/components/attendance/AttendanceScanner'
import { formatTime, getNextPhaseLabel, getProgressPercent, getRingAngle, usePomodoro } from '@/features/pomodoro'
import type { PomodoroPhase } from '@/features/pomodoro'
import { addTask as insertTask, consumeCheckInToken, loadPomodoroPreferences, loadTasks, recordFocusSession, savePomodoroPreferences, setTaskDone, type WorkspaceTask } from '@/features/user-data/api'
import { migrateLocalAttendance } from '@/features/user-data/migration'

const PHASE_COPY: Record<PomodoroPhase, { label: string; title: string; icon: typeof Focus }> = {
  work: { label: 'FOCUS / WORK', title: 'ĐANG LÀM VIỆC', icon: Focus },
  shortBreak: { label: 'RESET / SHORT BREAK', title: 'NGHỈ NGẮN', icon: Coffee },
  longBreak: { label: 'RESET / LONG BREAK', title: 'NGHỈ DÀI', icon: Coffee },
}

export default function WorkspacePage({ user }: { user: User | null }) {
  const { state, start, reset, skip, setDuration, setSettings } = usePomodoro()
  const savedCompletedWork = useRef(0); const sessionStartedAt = useRef<string | null>(null)
  const [tasks, setTasks] = useState<WorkspaceTask[]>([]); const [newTask, setNewTask] = useState(''); const [notice, setNotice] = useState(''); const [scannerOpen, setScannerOpen] = useState(false); const [pending, setPending] = useState(false)
  useEffect(() => { loadPomodoroPreferences().then((prefs) => { setSettings({ workMinutes: prefs.work_minutes, shortBreakMinutes: prefs.short_break_minutes, longBreakMinutes: prefs.long_break_minutes, workTurnsBeforeLongBreak: 4 }) }).catch(() => undefined); migrateLocalAttendance().then(loadTasks).then(setTasks).catch((cause) => setNotice(cause instanceof Error ? cause.message : 'Không thể tải dữ liệu.')) }, [setSettings])
  useEffect(() => { if (!user) return; const prefs = state.settings; void savePomodoroPreferences(user.id, { work_minutes: prefs.workMinutes, short_break_minutes: prefs.shortBreakMinutes, long_break_minutes: prefs.longBreakMinutes }).catch(() => undefined) }, [state.settings, user])
  useEffect(() => { if (state.status === 'running' && state.phase === 'work' && !sessionStartedAt.current) sessionStartedAt.current = new Date().toISOString(); if (user && state.completedWork > savedCompletedWork.current && sessionStartedAt.current) { savedCompletedWork.current = state.completedWork; void recordFocusSession(user.id, state.settings.workMinutes * 60, sessionStartedAt.current).catch(() => undefined); sessionStartedAt.current = null } }, [state.completedWork, state.phase, state.settings.workMinutes, state.status, user])
  const phaseCopy = PHASE_COPY[state.phase]; const PhaseIcon = phaseCopy.icon; const progress = getProgressPercent(state.remainingSeconds, state.durationSeconds); const angle = getRingAngle(progress); const completedTasks = useMemo(() => tasks.filter((task) => task.done).length, [tasks]); const durationMinutes = Math.round(state.durationSeconds / 60)
  const toggleTask = async (id: string) => { const task = tasks.find((item) => item.id === id); if (!task || pending) return; setPending(true); try { await setTaskDone(id, !task.done); setTasks((current) => current.map((item) => item.id === id ? { ...item, done: !item.done } : item)) } catch (cause) { setNotice(cause instanceof Error ? cause.message : 'Không thể lưu task.') } finally { setPending(false) } }
  const addTask = async () => { const title = newTask.trim(); if (!title || !user || pending) return; setPending(true); try { const task = await insertTask(user.id, title, tasks.length); setTasks((current) => [...current, task]); setNewTask('') } catch (cause) { setNotice(cause instanceof Error ? cause.message : 'Không thể thêm task.') } finally { setPending(false) } }
  const checkIn = async (token: string) => { await consumeCheckInToken(token); setNotice('ĐÃ ĐIỂM DANH HÔM NAY.'); setScannerOpen(false) }
  return (
    <div className="workspace-shell">
      <a className="skip-link" href="#workspace-content">Bỏ qua đến workspace</a><SiteNav current="workspace" />
      <main id="workspace-content">
        <section className="workspace-workbench" aria-label="Bàn làm việc">
          <div className="workspace-timer-panel">
            <div className="workspace-panel-meta"><span>{phaseCopy.label}</span><span>{state.status === 'running' ? 'LIVE' : 'READY'}</span></div>
            <div className={`workspace-timer${state.status === 'running' ? ' is-running' : ''}`}><div className="workspace-timer__ring" style={{ '--ring-angle': `${angle}deg` } as React.CSSProperties}><div className="workspace-timer__face"><PhaseIcon size={20} /><strong>{formatTime(state.remainingSeconds)}</strong><span>{phaseCopy.title}</span></div></div></div>
            <div className="workspace-timer__controls"><button type="button" className="workspace-primary-action" onClick={start} disabled={state.status === 'running'}><Play size={17} />{state.status === 'running' ? 'ĐANG CHẠY' : 'BẮT ĐẦU'}</button><button type="button" className="workspace-icon-action" onClick={reset} aria-label="Đặt lại"><RotateCcw size={17} /></button><button type="button" className="workspace-icon-action" onClick={skip} aria-label="Bỏ qua"><SkipForward size={17} /></button></div>
            <div className="workspace-timer__footer"><span>TIẾP THEO / {getNextPhaseLabel(state.phase, state.workTurn)}</span><span>TURN {state.workTurn} / 04</span></div>
          </div>
          <aside className="workspace-task-panel">
            <div className="workspace-panel-meta workspace-panel-meta--ink"><span>TODAY'S LIST</span><span>{completedTasks}/{tasks.length} XONG</span></div>
            <ul className="workspace-task-list">{tasks.map((task) => <li className={task.done ? 'is-done' : ''} key={task.id}><button type="button" disabled={pending} onClick={() => toggleTask(task.id)}>{task.done ? <Check size={15} /> : <Circle size={15} />}</button><span>{task.title}</span></li>)}</ul>
            <form className="workspace-add-task" onSubmit={(event) => { event.preventDefault(); void addTask() }}><label htmlFor="new-workspace-task">THÊM VIỆC</label><div><input id="new-workspace-task" value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="Một bước tiếp theo..." /><button type="submit" disabled={pending} aria-label="Thêm việc"><Plus size={18} /></button></div></form>
          </aside>
        </section>
        <section className="workspace-settings"><div><p className="workspace-label">CHỈNH NHỊP</p><h2>ĐỦ DÀI ĐỂ TẬP TRUNG.<br /><span>ĐỦ NGẮN ĐỂ GIỮ NHỊP.</span></h2></div><div className="workspace-duration-control"><div className="workspace-duration-control__top"><span>THỜI LƯỢNG {state.phase === 'work' ? 'FOCUS' : 'BREAK'}</span><strong>{durationMinutes} PHÚT</strong></div><input type="range" min="1" max="120" value={durationMinutes} onChange={(event) => setDuration(Number(event.target.value))} disabled={state.status === 'running'} /></div></section>
        <section className="workspace-attendance"><div><p className="workspace-label">KEEP THE RHYTHM</p><h2>MỘT ROUND<br /><span>MỘT DẤU.</span></h2></div><div className="workspace-attendance__action"><p>Quét token QR một lần được phát tại quán.</p><button type="button" onClick={() => setScannerOpen(true)}><Check size={16} /> QUÉT QR ĐIỂM DANH</button>{notice ? <span role="status">{notice}</span> : null}{scannerOpen ? <AttendanceScanner onCheckIn={checkIn} onClose={() => setScannerOpen(false)} /> : null}</div></section>
      </main>
      <footer className="workspace-footer"><a href="/"><ArrowLeft size={15} /> TRANG CHỦ</a><span>KIÊN TRÌ — KỶ LUẬT</span><a href="/profile">HỒ SƠ <ArrowUpRight size={15} /></a></footer>
    </div>
  )
}
