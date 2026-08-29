import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Circle,
  Coffee,
  Focus,
  Headphones,
  Image as ImageIcon,
  ListChecks,
  Music2,
  NotebookPen,
  Pause,
  Play,
  Plus,
  Repeat2,
  RotateCcw,
  Share2,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
} from 'lucide-react'
import { useAuth, useAuthLoading } from '@/app/auth-context'
import { ToolbarDock } from '@/components/ui/toolbar-dock'
import { FloatingPanel } from '@/components/workspace/FloatingPanel'
import { WorkspaceMigrationPrompt } from '@/components/workspace/WorkspaceMigrationPrompt'
import {
  formatTime,
  getNextPhaseLabel,
  getProgressPercent,
  getRingAngle,
  usePomodoro,
} from '@/features/pomodoro'
import type { PomodoroPhase } from '@/features/pomodoro'
import {
  loadWorkspaceNote,
  saveWorkspaceNote,
  type WorkspaceTask,
} from '@/features/user-data/api'
import { getAccountAuthHref, getWorkspaceMode } from '@/features/workspace/model'
import {
  createAccountWorkspaceRepository,
  createGuestWorkspaceRepository,
} from '@/features/workspace/repository'
import {
  APPEARANCE_STORAGE_KEY,
  DEFAULT_TASK_PANEL,
  DEFAULT_TOOL_PANELS,
  PANEL_STORAGE_KEY,
  clampPanel,
  readStoredValue,
  writeStoredValue,
  type PanelKind,
  type PanelLayout,
} from '@/features/workspace/layout'

const TRACKS = [
  {
    id: 'billie-jean',
    title: 'Billie Jean',
    artist: 'Michael Jackson',
    src: '/songs/06%20-%20Michael%20Jackson%20-%20Billie%20Jean.flac',
  },
  {
    id: 'phong-so-12',
    title: 'Phòng Số 12',
    artist: 'TeuYungBoy',
    src: '/songs/07%20-%20TeuYungBoy%20-%20Phòng%20Số%2012.flac',
  },
] as const
const BACKGROUNDS = [
  { id: 'night', label: 'Tĩnh đêm', src: '/images/space/contrast-space-1.webp' },
  { id: 'studio', label: 'Bàn học', src: '/images/space/contrast-space-2.webp' },
  { id: 'window', label: 'Khung cửa', src: '/images/space/contrast-space-3.webp' },
] as const
type Appearance = { backgroundId: string; overlay: number }
type NoteStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error'

function useWorkspaceAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [trackId, setTrackId] = useState<string>(TRACKS[0].id)
  const [playing, setPlaying] = useState(false)
  const [volume, setVolume] = useState(0.55)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState(true)
  const track = TRACKS.find((item) => item.id === trackId) ?? TRACKS[0]
  useEffect(() => {
    const audio = new Audio(track.src)
    audio.loop = repeat
    audio.addEventListener('error', () => setPlaying(false))
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [track.src, repeat])
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])
  const changeTrack = useCallback((direction: -1 | 1) => {
    setTrackId((current) => {
      const index = TRACKS.findIndex((item) => item.id === current)
      return TRACKS[(index + direction + TRACKS.length) % TRACKS.length].id
    })
  }, [])
  const toggle = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    if (!audio.paused) {
      audio.pause()
      setPlaying(false)
      return
    }
    try {
      await audio.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }, [])
  return {
    track,
    trackId,
    setTrackId,
    playing,
    volume,
    setVolume,
    shuffle,
    setShuffle,
    repeat,
    setRepeat,
    toggle,
    previous: () => changeTrack(-1),
    next: () => changeTrack(1),
  }
}

function WorkspaceTopbar({
  completedWork,
  guest,
  saveStatus,
}: {
  completedWork: number
  guest: boolean
  saveStatus: 'idle' | 'saving' | 'saved' | 'error'
}) {
  return (
    <header className="workspace-topbar">
      <a href="/" aria-label="Về trang chủ">
        <ArrowLeft size={18} />
      </a>
      <div className="workspace-topbar__brand">
        <span>CONTRAST</span>
        <small>FOCUS SPACE</small>
      </div>
      <div className="workspace-topbar__status">
        <span>
          {guest
            ? 'Lưu trên thiết bị này'
            : saveStatus === 'saving'
              ? 'Đang lưu...'
              : saveStatus === 'error'
                ? 'Lưu chưa thành công'
                : 'ĐÃ ĐỒNG BỘ'}
        </span>
        <strong>{completedWork} phiên</strong>
        {guest ? (
          <a href={getAccountAuthHref('sync')}>
            LƯU &amp; ĐỒNG BỘ <ArrowUpRight size={13} />
          </a>
        ) : null}
      </div>
    </header>
  )
}

function PomodoroStage({
  state,
  activeTask,
  onStart,
  onPause,
  onReset,
  onSkip,
  onChooseTask,
}: {
  state: ReturnType<typeof usePomodoro>['state']
  activeTask?: WorkspaceTask
  onStart: () => void
  onPause: () => void
  onReset: () => void
  onSkip: () => void
  onChooseTask: () => void
}) {
  const progress = getProgressPercent(state.remainingSeconds, state.durationSeconds)
  const PhaseIcon = state.phase === 'work' ? Focus : Coffee
  return (
    <main className="workspace-stage" aria-label="Pomodoro">
      <div className="workspace-stage__phase">
        <PhaseIcon size={15} />
        <span>
          {state.phase === 'work'
            ? 'TẬP TRUNG'
            : state.phase === 'shortBreak'
              ? 'NGHỈ NGẮN'
              : 'NGHỈ DÀI'}
        </span>
      </div>
      <div
        className="workspace-clock"
        style={{ '--progress': progress * 3.6 + 'deg' } as React.CSSProperties}
      >
        <div className="workspace-clock__face">
          <span>{formatTime(state.remainingSeconds)}</span>
          <small>PHIÊN {state.workTurn}/4</small>
        </div>
      </div>
      <div className="workspace-stage__controls">
        <button
          className="workspace-primary-action"
          type="button"
          onClick={state.status === 'running' ? onPause : onStart}
        >
          <span>{state.status === 'running' ? 'TẠM DỪNG' : 'BẮT ĐẦU'}</span>
          <Play size={18} />
        </button>
        <button type="button" onClick={onReset} aria-label="Đặt lại">
          <RotateCcw size={18} />
        </button>
        <button type="button" onClick={onSkip} aria-label="Bỏ qua">
          <SkipForward size={18} />
        </button>
      </div>
      <button className="workspace-active-task" type="button" onClick={onChooseTask}>
        <span>{activeTask ? 'ĐANG LÀM' : 'CHƯA CHỌN CÔNG VIỆC'}</span>
        <strong>{activeTask?.title ?? 'Chọn việc để bắt đầu'}</strong>
        <ArrowUpRight size={16} />
      </button>
    </main>
  )
}

function TaskContent({
  tasks,
  activeTaskId,
  draft,
  loading,
  onDraft,
  onAdd,
  onToggle,
  onSelect,
}: {
  tasks: WorkspaceTask[]
  activeTaskId: string | null
  draft: string
  loading: boolean
  onDraft: (value: string) => void
  onAdd: () => void
  onToggle: (task: WorkspaceTask) => void
  onSelect: (id: string) => void
}) {
  return (
    <>
      <form
        className="workspace-task-form"
        onSubmit={(event) => {
          event.preventDefault()
          onAdd()
        }}
      >
        <label htmlFor="workspace-task-input">Công việc mới</label>
        <div>
          <input
            id="workspace-task-input"
            value={draft}
            onChange={(event) => onDraft(event.target.value)}
            placeholder="Viết việc cần hoàn thành"
            maxLength={140}
          />
          <button type="submit" aria-label="Thêm công việc">
            <Plus size={18} />
          </button>
        </div>
      </form>
      <div className="workspace-task-list">
        {loading ? (
          <p className="workspace-panel-message">Đang tải công việc...</p>
        ) : tasks.length === 0 ? (
          <p className="workspace-panel-message">
            Chưa có việc nào. Thêm một việc để bắt đầu phiên tập trung.
          </p>
        ) : (
          tasks.map((task) => (
            <article
              key={task.id}
              className={
                activeTaskId === task.id ? 'workspace-task is-active' : 'workspace-task'
              }
            >
              <button
                type="button"
                className="workspace-task__check"
                onClick={() => onToggle(task)}
                aria-label={
                  task.done ? 'Mở lại ' + task.title : 'Hoàn thành ' + task.title
                }
              >
                {task.done ? <Check size={16} /> : <Circle size={16} />}
              </button>
              <button
                type="button"
                className="workspace-task__title"
                onClick={() => onSelect(task.id)}
              >
                <span className={task.done ? 'is-done' : ''}>{task.title}</span>
                <small>
                  {activeTaskId === task.id ? 'Đang tập trung' : 'Chọn công việc'}
                </small>
              </button>
            </article>
          ))
        )}
      </div>
    </>
  )
}

export default function WorkspacePage() {
  const user = useAuth()
  const authLoading = useAuthLoading()
  const mode = getWorkspaceMode(Boolean(user))
  const repository = useMemo(
    () =>
      authLoading
        ? null
        : user
          ? createAccountWorkspaceRepository(user.id)
          : createGuestWorkspaceRepository(
              typeof window === 'undefined' ? undefined : window.localStorage,
            ),
    [authLoading, user],
  )
  const { state, start, pause, reset, skip, setSettings } = usePomodoro()
  const audio = useWorkspaceAudio()
  const [tasks, setTasks] = useState<WorkspaceTask[]>([])
  const [tasksLoading, setTasksLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>(
    'idle',
  )
  const [taskDraft, setTaskDraft] = useState('')
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null)
  const [taskLayout, setTaskLayout] = useState<PanelLayout>(DEFAULT_TASK_PANEL)
  const [toolLayouts, setToolLayouts] = useState(DEFAULT_TOOL_PANELS)
  const [toolsOpen, setToolsOpen] = useState(true)
  const [appearance, setAppearance] = useState<Appearance>({
    backgroundId: 'night',
    overlay: 0.52,
  })
  const [note, setNote] = useState('')
  const [noteStatus, setNoteStatus] = useState<NoteStatus>('idle')
  const hydrated = useRef(false)
  const savedCompletedWork = useRef(0)
  const sessionStartedAt = useRef<string | null>(null)
  const refreshWorkspace = useCallback(async () => {
    if (!repository) return
    setTasksLoading(true)
    try {
      const [data, preferences] = await Promise.all([
        repository.getTodos(),
        repository.getPreferences(),
      ])
      setTasks(data)
      setSettings({
        workMinutes: preferences.work_minutes,
        shortBreakMinutes: preferences.short_break_minutes,
        longBreakMinutes: preferences.long_break_minutes,
        workTurnsBeforeLongBreak: 4,
      })
      if (repository.mode === 'account') setSaveStatus('saved')
    } catch {
      if (repository.mode === 'account') setSaveStatus('error')
      setTasks([])
      setActiveTaskId(null)
    } finally {
      setTasksLoading(false)
    }
  }, [repository, setSettings])
  useEffect(() => {
    const stored = readStoredValue(PANEL_STORAGE_KEY, {
      tasks: DEFAULT_TASK_PANEL,
      tools: DEFAULT_TOOL_PANELS,
      activeTaskId: null as string | null,
    })
    setTaskLayout(clampPanel(stored.tasks, window.innerWidth, window.innerHeight))
    setToolLayouts({
      audio: clampPanel(stored.tools.audio, window.innerWidth, window.innerHeight),
      appearance: clampPanel(
        stored.tools.appearance,
        window.innerWidth,
        window.innerHeight,
      ),
      notes: clampPanel(stored.tools.notes, window.innerWidth, window.innerHeight),
    })
    setActiveTaskId(stored.activeTaskId)
    setAppearance(
      readStoredValue(APPEARANCE_STORAGE_KEY, { backgroundId: 'night', overlay: 0.52 }),
    )
    hydrated.current = true
  }, [])
  useEffect(() => {
    if (hydrated.current)
      writeStoredValue(PANEL_STORAGE_KEY, {
        tasks: taskLayout,
        tools: toolLayouts,
        activeTaskId,
      })
  }, [taskLayout, toolLayouts, activeTaskId])
  useEffect(() => {
    if (hydrated.current) writeStoredValue(APPEARANCE_STORAGE_KEY, appearance)
  }, [appearance])
  useEffect(() => {
    if (!repository) {
      setTasks([])
      setActiveTaskId(null)
      setTasksLoading(true)
      return
    }
    void refreshWorkspace()
    if (!user) {
      setNote('')
      setNoteStatus('idle')
      return
    }
    setNoteStatus('loading')
    void loadWorkspaceNote()
      .then((data) => {
        setNote(data?.content ?? '')
        setNoteStatus('saved')
      })
      .catch(() => setNoteStatus('error'))
  }, [repository, refreshWorkspace, user])
  useEffect(() => {
    if (!repository || tasksLoading) return
    const preferences = {
      work_minutes: state.settings.workMinutes,
      short_break_minutes: state.settings.shortBreakMinutes,
      long_break_minutes: state.settings.longBreakMinutes,
    }
    setSaveStatus(repository.mode === 'account' ? 'saving' : 'idle')
    void repository
      .savePreferences(preferences)
      .then(() => {
        if (repository.mode === 'account') setSaveStatus('saved')
      })
      .catch(() => {
        if (repository.mode === 'account') setSaveStatus('error')
      })
  }, [repository, state.settings, tasksLoading])
  useEffect(() => {
    if (
      !repository ||
      state.status !== 'running' ||
      state.phase !== 'work' ||
      sessionStartedAt.current
    )
      return
    sessionStartedAt.current = new Date().toISOString()
  }, [repository, state.phase, state.status])
  useEffect(() => {
    if (
      !repository ||
      state.completedWork <= savedCompletedWork.current ||
      !sessionStartedAt.current
    )
      return
    savedCompletedWork.current = state.completedWork
    setSaveStatus(repository.mode === 'account' ? 'saving' : 'idle')
    void repository
      .saveFocusSession(state.settings.workMinutes * 60, sessionStartedAt.current)
      .then(() => {
        if (repository.mode === 'account') setSaveStatus('saved')
      })
      .catch(() => {
        if (repository.mode === 'account') setSaveStatus('error')
      })
    sessionStartedAt.current = null
  }, [repository, state.completedWork, state.settings.workMinutes])
  useEffect(() => {
    if (!user || noteStatus !== 'saving') return
    const timeout = window.setTimeout(() => {
      void saveWorkspaceNote(user.id, note)
        .then(() => setNoteStatus('saved'))
        .catch(() => setNoteStatus('error'))
    }, 650)
    return () => window.clearTimeout(timeout)
  }, [note, noteStatus, user])
  const activeTask = tasks.find((task) => task.id === activeTaskId)
  const background =
    BACKGROUNDS.find((item) => item.id === appearance.backgroundId) ?? BACKGROUNDS[0]
  const addNewTask = async () => {
    const title = taskDraft.trim()
    if (!title || !repository) return
    setSaveStatus(repository.mode === 'account' ? 'saving' : 'idle')
    try {
      const task = await repository.createTodo(title, tasks.length)
      setTasks((current) => [...current, task])
      setTaskDraft('')
      setActiveTaskId(task.id)
      if (repository.mode === 'account') setSaveStatus('saved')
    } catch {
      if (repository.mode === 'account') setSaveStatus('error')
    }
  }
  const toggleTask = async (task: WorkspaceTask) => {
    if (!repository) return
    const done = !task.done
    setTasks((current) =>
      current.map((item) => (item.id === task.id ? { ...item, done } : item)),
    )
    try {
      await repository.updateTodo(task.id, done)
      if (repository.mode === 'account') setSaveStatus('saved')
    } catch {
      setTasks((current) => current.map((item) => (item.id === task.id ? task : item)))
      if (repository.mode === 'account') setSaveStatus('error')
    }
  }
  const openTool = useCallback((kind: PanelKind) => {
    setToolsOpen(true)
    if (kind === 'tasks') {
      setTaskLayout((current) => ({ ...current, open: true }))
      return
    }
    setToolLayouts((current) => ({
      ...current,
      [kind]: { ...current[kind], open: true },
    }))
  }, [])
  const renderToolPanel = (kind: Exclude<PanelKind, 'tasks'>) => {
    if (kind === 'audio')
      return (
        <div className="workspace-audio">
          <div className="workspace-audio__now">
            <div className="workspace-audio__art" aria-hidden="true">
              <Music2 size={24} />
            </div>
            <span>
              <strong>{audio.track.title}</strong>
              <small>{audio.track.artist}</small>
            </span>
          </div>
          <div className="workspace-audio__controls">
            <div className="workspace-audio__volume">
              <Volume2 size={21} aria-hidden="true" />
              <label htmlFor="workspace-volume">Âm lượng</label>
              <input
                id="workspace-volume"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={audio.volume}
                onChange={(event) => audio.setVolume(Number(event.target.value))}
              />
            </div>
            <button
              type="button"
              aria-label="Xáo trộn"
              aria-pressed={audio.shuffle}
              onClick={() => audio.setShuffle((current) => !current)}
            >
              <Shuffle size={20} />
            </button>
            <button type="button" aria-label="Bài trước" onClick={audio.previous}>
              <SkipBack size={22} />
            </button>
            <button
              type="button"
              className="workspace-audio__play"
              onClick={audio.toggle}
              aria-label={audio.playing ? 'Tạm dừng nhạc' : 'Phát nhạc'}
            >
              {audio.playing ? <Pause size={28} /> : <Play size={28} />}
            </button>
            <button type="button" aria-label="Bài tiếp theo" onClick={audio.next}>
              <SkipForward size={22} />
            </button>
            <button
              type="button"
              aria-label="Lặp bài hiện tại"
              aria-pressed={audio.repeat}
              onClick={() => audio.setRepeat((current) => !current)}
            >
              <Repeat2 size={20} />
            </button>
            <button type="button" aria-label="Chia sẻ, chưa khả dụng" disabled>
              <Share2 size={21} />
            </button>
          </div>
          <label className="workspace-audio__track-label" htmlFor="workspace-track">
            Bản nhạc
          </label>
          <select
            id="workspace-track"
            value={audio.trackId}
            onChange={(event) => audio.setTrackId(event.target.value)}
          >
            {TRACKS.map((track) => (
              <option key={track.id} value={track.id}>
                {track.title}
              </option>
            ))}
          </select>
        </div>
      )
    if (kind === 'appearance')
      return (
        <div className="workspace-appearance">
          <fieldset>
            <legend>Không gian</legend>
            {BACKGROUNDS.map((item) => (
              <button
                key={item.id}
                type="button"
                className={appearance.backgroundId === item.id ? 'is-selected' : ''}
                onClick={() =>
                  setAppearance((current) => ({ ...current, backgroundId: item.id }))
                }
                style={{ backgroundImage: 'url("' + item.src + '")' }}
              >
                <span>{item.label}</span>
                {appearance.backgroundId === item.id ? <Check size={17} /> : null}
              </button>
            ))}
          </fieldset>
          <label htmlFor="workspace-overlay">Độ tối nền</label>
          <input
            id="workspace-overlay"
            type="range"
            min="0.2"
            max="0.78"
            step="0.02"
            value={appearance.overlay}
            onChange={(event) =>
              setAppearance((current) => ({
                ...current,
                overlay: Number(event.target.value),
              }))
            }
          />
        </div>
      )
    return (
      <div className="workspace-notes">
        <label htmlFor="workspace-note">Ghi chú phiên tập trung</label>
        <textarea
          id="workspace-note"
          value={note}
          onChange={(event) => {
            setNote(event.target.value)
            setNoteStatus('saving')
          }}
          placeholder={
            user
              ? 'Ghi ý tưởng, quyết định hoặc việc cần nhớ...'
              : 'Đăng nhập để lưu ghi chú trên Supabase.'
          }
          disabled={!user}
          maxLength={12000}
        />
        <small className={noteStatus === 'error' ? 'is-error' : ''}>
          {noteStatus === 'loading'
            ? 'Đang tải...'
            : noteStatus === 'saving'
              ? 'Đang lưu...'
              : noteStatus === 'saved'
                ? 'Đã lưu'
                : noteStatus === 'error'
                  ? 'Lưu thất bại. Nội dung vẫn còn trên màn hình.'
                  : note.length + '/12000'}
        </small>
      </div>
    )
  }
  const dockItems = [
    {
      kind: 'tasks' as const,
      label: 'Công việc',
      icon: <ListChecks size={20} strokeWidth={1.8} />,
    },
    {
      kind: 'audio' as const,
      label: 'Âm thanh',
      icon: <Headphones size={20} strokeWidth={1.8} />,
    },
    {
      kind: 'appearance' as const,
      label: 'Giao diện',
      icon: <ImageIcon size={20} strokeWidth={1.8} />,
    },
    {
      kind: 'notes' as const,
      label: 'Ghi chú',
      icon: <NotebookPen size={20} strokeWidth={1.8} />,
    },
  ]
  if (authLoading) return <div className="workspace-focus" aria-busy="true" />
  return (
    <div
      className="workspace-focus"
      style={
        {
          '--workspace-bg': 'url("' + background.src + '")',
          '--workspace-overlay': appearance.overlay,
        } as React.CSSProperties
      }
    >
      <WorkspaceTopbar
        completedWork={state.completedWork}
        guest={mode === 'guest'}
        saveStatus={saveStatus}
      />
      {repository?.mode === 'account' ? (
        <WorkspaceMigrationPrompt
          account={repository}
          onImported={() => {
            void refreshWorkspace()
          }}
        />
      ) : null}
      <PomodoroStage
        state={state}
        activeTask={activeTask}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onSkip={skip}
        onChooseTask={() => openTool('tasks')}
      />
      <ToolbarDock
        className="workspace-tool-dock"
        defaultCollapsed={!toolsOpen}
        onCollapsedChange={setToolsOpen}
        items={dockItems.map(({ kind, label, icon }) => ({
          id: kind,
          label,
          icon,
          onClick: () => openTool(kind),
        }))}
      />
      {taskLayout.open ? (
        <FloatingPanel
          id="workspace-task-panel"
          title="Công việc"
          layout={taskLayout}
          resizable
          onLayout={setTaskLayout}
          onClose={() => setTaskLayout((current) => ({ ...current, open: false }))}
        >
          <TaskContent
            tasks={tasks}
            activeTaskId={activeTaskId}
            draft={taskDraft}
            loading={tasksLoading}
            onDraft={setTaskDraft}
            onAdd={() => {
              void addNewTask()
            }}
            onToggle={(task) => {
              void toggleTask(task)
            }}
            onSelect={setActiveTaskId}
          />
        </FloatingPanel>
      ) : null}
      {(['audio', 'appearance', 'notes'] as const).map((kind) =>
        toolLayouts[kind].open ? (
          <FloatingPanel
            key={kind}
            id={'workspace-' + kind + '-panel'}
            title={
              kind === 'audio'
                ? 'Âm thanh'
                : kind === 'appearance'
                  ? 'Giao diện'
                  : 'Ghi chú'
            }
            layout={toolLayouts[kind]}
            className={'workspace-floating-panel--' + kind}
            onLayout={(layout) =>
              setToolLayouts((current) => ({ ...current, [kind]: layout }))
            }
            onClose={() =>
              setToolLayouts((current) => ({
                ...current,
                [kind]: { ...current[kind], open: false },
              }))
            }
          >
            {renderToolPanel(kind)}
          </FloatingPanel>
        ) : null,
      )}
    </div>
  )
}
