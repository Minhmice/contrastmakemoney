import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Circle,
  Coffee,
  Focus,
  Play,
  Plus,
  RotateCcw,
  SkipForward,
  TimerReset,
  UserRound,
} from 'lucide-react'
import { ContrastLogo } from '@/components/brand/ContrastLogo'
import { formatTime, getNextPhaseLabel, getProgressPercent, getRingAngle, usePomodoro } from '@/features/pomodoro'
import type { PomodoroPhase } from '@/features/pomodoro'
import { toDateKey } from '@/features/attendance/date'
import { loadAttendance, saveAttendance } from '@/features/attendance/storage'
import type { AttendanceRecord } from '@/features/attendance/types'

type WorkspaceTask = { id: number; title: string; done: boolean }

const INITIAL_TASKS: WorkspaceTask[] = [
  { id: 1, title: 'Chốt outline cho buổi học hôm nay', done: true },
  { id: 2, title: 'Đọc 20 trang tài liệu chính', done: false },
  { id: 3, title: 'Viết phần mở đầu', done: false },
]

const PHASE_COPY: Record<PomodoroPhase, { label: string; title: string; icon: typeof Focus }> = {
  work: { label: 'FOCUS / WORK', title: 'ĐANG LÀM VIỆC', icon: Focus },
  shortBreak: { label: 'RESET / SHORT BREAK', title: 'NGHỈ NGẮN', icon: Coffee },
  longBreak: { label: 'RESET / LONG BREAK', title: 'NGHỈ DÀI', icon: Coffee },
}

export default function WorkspacePage() {
  const { state, start, reset, skip, setDuration } = usePomodoro()
  const [tasks, setTasks] = useState(INITIAL_TASKS)
  const [newTask, setNewTask] = useState('')
  const [attendanceNotice, setAttendanceNotice] = useState('')
  const phaseCopy = PHASE_COPY[state.phase]
  const PhaseIcon = phaseCopy.icon
  const progress = getProgressPercent(state.remainingSeconds, state.durationSeconds)
  const angle = getRingAngle(progress)
  const completedTasks = useMemo(() => tasks.filter((task) => task.done).length, [tasks])
  const durationMinutes = Math.round(state.durationSeconds / 60)

  const toggleTask = (id: number) => {
    setTasks((current) => current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)))
  }

  const addTask = () => {
    const title = newTask.trim()
    if (!title) return
    setTasks((current) => [...current, { id: Date.now(), title, done: false }])
    setNewTask('')
  }

  const markAttendance = () => {
    const records = loadAttendance()
    const date = toDateKey()
    if (records.some((record) => record.date === date)) {
      setAttendanceNotice('HÔM NAY ĐÃ ĐƯỢC ĐÁNH DẤU.')
      return
    }
    const nextRecord: AttendanceRecord = { date, location: 'Workspace', scannedAt: new Date().toISOString() }
    setAttendanceNotice(saveAttendance([...records, nextRecord]) ? 'ĐÃ ĐÁNH DẤU HÔM NAY.' : 'KHÔNG THỂ LƯU. THỬ LẠI SAU.')
  }

  return (
    <div className="workspace-shell">
      {/* THESIS: Workspace turns discipline into a visible working rhythm, not another dashboard. OWN-WORLD: cool paper, ink-black workbench, red phase marker, square controls, Geist type. STORY: choose one task, start one timed round, record the next concrete step. FIRST VIEWPORT: a split workbench puts the live timer on the left and today's task list on the right, with the primary action inside the timer. FORM: rolled operate surface, centre-rail workbench; seed b0e68c9c. FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance. */}
      <a className="skip-link" href="#workspace-content">Bỏ qua đến workspace</a>
      <header className="workspace-header">
        <a href="/" aria-label="Về trang chủ Contrast Coffee">
          <ContrastLogo variant="wordmark-dark" className="workspace-header__logo" />
        </a>
        <div className="workspace-header__nav">
          <span>CONTRAST / WORKSPACE</span>
          <a href="/profile" aria-label="Mở trang cá nhân">
            <UserRound size={16} strokeWidth={1.7} aria-hidden="true" /> HỒ SƠ
          </a>
        </div>
      </header>

      <main id="workspace-content">
        <section className="workspace-intro" aria-labelledby="workspace-title">
          <div>
            <p className="workspace-label">DAILY WORKBENCH / 24H</p>
            <h1 id="workspace-title">NGỒI XUỐNG.<br /><span>LÀM CHO XONG.</span></h1>
          </div>
          <div className="workspace-intro__note">
            <span>HÔM NAY / {toDateKey().replaceAll('-', '.')}</span>
            <span>CHỌN MỘT VIỆC. GIỮ MỘT NHỊP.</span>
          </div>
        </section>

        <section className="workspace-workbench" aria-label="Bàn làm việc">
          <div className="workspace-timer-panel">
            <div className="workspace-panel-meta">
              <span>{phaseCopy.label}</span>
              <span>{state.status === 'running' ? 'LIVE' : 'READY'}</span>
            </div>
            <div className={`workspace-timer${state.status === 'running' ? ' is-running' : ''}`}>
              <div className="workspace-timer__ring" style={{ '--ring-angle': `${angle}deg` } as React.CSSProperties}>
                <div className="workspace-timer__face">
                  <PhaseIcon size={20} strokeWidth={1.5} aria-hidden="true" />
                  <strong>{formatTime(state.remainingSeconds)}</strong>
                  <span>{phaseCopy.title}</span>
                </div>
              </div>
            </div>
            <div className="workspace-timer__controls">
              <button type="button" className="workspace-primary-action" onClick={start} disabled={state.status === 'running'}>
                <Play size={17} fill="currentColor" strokeWidth={1.8} aria-hidden="true" />
                {state.status === 'running' ? 'ĐANG CHẠY' : 'BẮT ĐẦU'}
              </button>
              <button type="button" className="workspace-icon-action" onClick={reset} aria-label="Đặt lại bộ đếm">
                <RotateCcw size={17} strokeWidth={1.7} aria-hidden="true" />
              </button>
              <button type="button" className="workspace-icon-action" onClick={skip} aria-label="Bỏ qua phase hiện tại">
                <SkipForward size={17} strokeWidth={1.7} aria-hidden="true" />
              </button>
            </div>
            <div className="workspace-timer__footer">
              <span>TIẾP THEO / {getNextPhaseLabel(state.phase, state.workTurn)}</span>
              <span>TURN {state.workTurn} / 04</span>
            </div>
          </div>

          <aside className="workspace-task-panel" aria-labelledby="task-title">
            <div className="workspace-panel-meta workspace-panel-meta--ink">
              <span>TODAY'S LIST</span>
              <span>{completedTasks}/{tasks.length} XONG</span>
            </div>
            <div className="workspace-task-heading">
              <h2 id="task-title">VIỆC CẦN LÀM.</h2>
              <p>Giữ danh sách ngắn. Mỗi round chỉ cần một bước tiếp theo.</p>
            </div>
            <ul className="workspace-task-list">
              {tasks.map((task) => (
                <li className={task.done ? 'is-done' : ''} key={task.id}>
                  <button type="button" onClick={() => toggleTask(task.id)} aria-label={`${task.done ? 'Bỏ hoàn thành' : 'Đánh dấu hoàn thành'}: ${task.title}`}>
                    {task.done ? <Check size={15} strokeWidth={2} aria-hidden="true" /> : <Circle size={15} strokeWidth={1.5} aria-hidden="true" />}
                  </button>
                  <span>{task.title}</span>
                </li>
              ))}
            </ul>
            <form className="workspace-add-task" onSubmit={(event) => { event.preventDefault(); addTask() }}>
              <label htmlFor="new-workspace-task">THÊM VIỆC</label>
              <div>
                <input id="new-workspace-task" value={newTask} onChange={(event) => setNewTask(event.target.value)} placeholder="Một bước tiếp theo..." />
                <button type="submit" aria-label="Thêm việc mới"><Plus size={18} strokeWidth={1.8} aria-hidden="true" /></button>
              </div>
            </form>
          </aside>
        </section>

        <section className="workspace-settings" aria-labelledby="settings-title">
          <div>
            <p className="workspace-label">CHỈNH NHỊP</p>
            <h2 id="settings-title">ĐỦ DÀI ĐỂ VÀO VIỆC.<br /><span>ĐỦ NGẮN ĐỂ LÀM TIẾP.</span></h2>
          </div>
          <div className="workspace-duration-control">
            <div className="workspace-duration-control__top">
              <span>THỜI LƯỢNG {state.phase === 'work' ? 'FOCUS' : 'BREAK'}</span>
              <strong>{durationMinutes} PHÚT</strong>
            </div>
            <input type="range" min="1" max="120" step="1" value={durationMinutes} onChange={(event) => setDuration(Number(event.target.value))} disabled={state.status === 'running'} aria-label="Thời lượng phase hiện tại tính bằng phút" />
            <div className="workspace-range-labels"><span>01</span><span>120</span></div>
          </div>
          <div className="workspace-session-note">
            <TimerReset size={18} strokeWidth={1.6} aria-hidden="true" />
            <p>Pomodoro tự dừng ở phase tiếp theo. Không có pause: chỉ có bắt đầu lại khi bạn đã sẵn sàng.</p>
          </div>
        </section>

        <section className="workspace-attendance" aria-labelledby="attendance-title">
          <div>
            <p className="workspace-label">KEEP THE RHYTHM</p>
            <h2 id="attendance-title">MỘT ROUND<br /><span>MỘT DẤU.</span></h2>
          </div>
          <div className="workspace-attendance__action">
            <p>Đánh dấu bạn đã xuất hiện hôm nay. Lịch điểm danh sẽ giữ lại nhịp này trong hồ sơ.</p>
            <button type="button" onClick={markAttendance}><Check size={16} strokeWidth={2} aria-hidden="true" /> ĐIỂM DANH HÔM NAY</button>
            {attendanceNotice ? <span role="status">{attendanceNotice}</span> : null}
          </div>
        </section>
      </main>

      <footer className="workspace-footer">
        <a href="/" className="workspace-footer__back"><ArrowLeft size={15} strokeWidth={1.8} aria-hidden="true" /> TRANG CHỦ</a>
        <span>KIÊN TRÌ — KỶ LUẬT</span>
        <a href="/profile">HỒ SƠ <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" /></a>
      </footer>
    </div>
  )
}
