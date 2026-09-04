'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Image as ImageIcon, ListChecks, Music2, NotebookPen, SlidersHorizontal, X } from 'lucide-react'
import { useAuth, useAuthLoading } from '@/app/auth-context'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FocusStage } from '@/components/workspace/FocusStage'
import { PomodoroSettingsDialog } from '@/components/workspace/PomodoroSettingsDialog'
import { TaskPanel } from '@/components/workspace/TaskPanel'
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader'
import { WorkspaceMigrationPrompt } from '@/components/workspace/WorkspaceMigrationPrompt'
import { type Appearance, type NoteStatus, type WorkspaceTool, WorkspaceTools } from '@/components/workspace/WorkspaceTools'
import { getProgressPercent, usePomodoro } from '@/features/pomodoro'
import { loadWorkspaceNote, saveWorkspaceNote, type WorkspaceTask } from '@/features/user-data/api'
import { getWorkspaceMode } from '@/features/workspace/model'
import { createAccountWorkspaceRepository, createGuestWorkspaceRepository } from '@/features/workspace/repository'

const backgrounds = [
  { id: 'night', label: 'Tĩnh đêm', src: '/images/space/contrast-space-1.webp' },
  { id: 'studio', label: 'Bàn học', src: '/images/space/contrast-space-2.webp' },
  { id: 'window', label: 'Khung cửa', src: '/images/space/contrast-space-3.webp' },
] as const

const tracks = [
  { id: 'billie-jean', title: 'Billie Jean', artist: 'Michael Jackson', src: '/songs/06%20-%20Michael%20Jackson%20-%20Billie%20Jean.flac' },
  { id: 'phong-so-12', title: 'Phòng Số 12', artist: 'TeuYungBoy', src: '/songs/07%20-%20TeuYungBoy%20-%20Phòng%20Số%2012.flac' },
] as const

function useDesktop() {
  const [desktop, setDesktop] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1024px)')
    const update = () => setDesktop(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return desktop
}

function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [trackId, setTrackId] = useState<string>(tracks[0].id)
  const [volume, setVolume] = useState(.55)
  const [playing, setPlaying] = useState(false)
  const [repeat, setRepeat] = useState(true)
  const [shuffle, setShuffle] = useState(false)
  const track = tracks.find((item) => item.id === trackId) ?? tracks[0]

  useEffect(() => {
    const audio = new Audio(track.src)
    audio.preload = 'none'
    audio.volume = volume
    audio.loop = repeat
    audio.addEventListener('error', () => setPlaying(false))
    audio.addEventListener('ended', () => setPlaying(false))
    audioRef.current = audio
    return () => { audio.pause(); audio.src = ''; audioRef.current = null }
  }, [track.src, volume, repeat])

  const change = (step: -1 | 1) => setTrackId((current) => {
    const index = tracks.findIndex((item) => item.id === current)
    return tracks[(index + step + tracks.length) % tracks.length].id
  })
  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) void audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    else { audio.pause(); setPlaying(false) }
  }

  return { track, trackId, setTrackId, volume, setVolume, playing, repeat, setRepeat, shuffle, setShuffle, toggle, previous: () => change(-1), next: () => change(1) }
}

export default function WorkspacePage() {
  const user = useAuth()
  const authLoading = useAuthLoading()
  const desktop = useDesktop()
  const mode = getWorkspaceMode(Boolean(user))
  const repository = useMemo(() => authLoading ? null : user ? createAccountWorkspaceRepository(user.id) : createGuestWorkspaceRepository(typeof window === 'undefined' ? undefined : window.localStorage), [authLoading, user])
  const { state, start, pause, reset, skip, setSettings } = usePomodoro()
  const audio = useAudio()
  const [tasks, setTasks] = useState<WorkspaceTask[]>([])
  const [loading, setLoading] = useState(true)
  const [draft, setDraft] = useState('')
  const [activeId, setActiveId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [tool, setTool] = useState<WorkspaceTool | null>(null)
  const [toolPosition, setToolPosition] = useState<{ x: number; y: number } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const cardRef = useRef<HTMLDivElement | null>(null)

  const [taskOpen, setTaskOpen] = useState(true)
  const [taskPosition, setTaskPosition] = useState<{ x: number; y: number } | null>(null)
  const [isDraggingTask, setIsDraggingTask] = useState(false)
  const taskCardRef = useRef<HTMLDivElement | null>(null)

  const [mobileNoteOpen, setMobileNoteOpen] = useState(false)
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false)
  const [mobileTaskOpen, setMobileTaskOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [appearance, setAppearance] = useState<Appearance>({ id: 'night', overlay: .58 })
  const [note, setNote] = useState('')
  const [noteStatus, setNoteStatus] = useState<NoteStatus>('idle')
  const savedWork = useRef(0)
  const previousCompletedWork = useRef(state.completedWork)
  const [completionPulse, setCompletionPulse] = useState(0)
  const startedAt = useRef<string | null>(null)

  useEffect(() => {
    if (state.completedWork > previousCompletedWork.current) {
      setCompletionPulse((value) => value + 1)
    }
    previousCompletedWork.current = state.completedWork
  }, [state.completedWork])

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    if ((e.target as HTMLElement).closest('button, input, textarea, form, a, label, [role="checkbox"]')) return

    const card = cardRef.current
    if (!card) return

    const handle = e.currentTarget
    const pointerId = e.pointerId

    try {
      handle.setPointerCapture(pointerId)
    } catch {
      // Safe fallback if pointer capture fails
    }

    const initialRect = card.getBoundingClientRect()
    const startX = e.clientX
    const startY = e.clientY
    const initLeft = initialRect.left
    const initTop = initialRect.top
    const cardWidth = initialRect.width
    const cardHeight = initialRect.height

    const minX = 0
    const maxX = Math.max(0, window.innerWidth - cardWidth)
    const minY = 0
    const maxY = Math.max(0, window.innerHeight - cardHeight)

    let finalLeft = initLeft
    let finalTop = initTop

    setIsDragging(true)

    const onPointerMove = (ev: PointerEvent) => {
      const rawDeltaX = ev.clientX - startX
      const rawDeltaY = ev.clientY - startY
      const clampedX = Math.min(Math.max(initLeft + rawDeltaX, minX), maxX)
      const clampedY = Math.min(Math.max(initTop + rawDeltaY, minY), maxY)
      finalLeft = clampedX
      finalTop = clampedY

      const renderDeltaX = clampedX - initLeft
      const renderDeltaY = clampedY - initTop
      card.style.transform = `translate3d(${renderDeltaX}px, ${renderDeltaY}px, 0)`
    }

    const onPointerUp = () => {
      try {
        handle.releasePointerCapture(pointerId)
      } catch {
        // Safe release
      }
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)

      card.style.left = `${finalLeft}px`
      card.style.top = `${finalTop}px`
      card.style.transform = ''
      setToolPosition({ x: finalLeft, y: finalTop })
      setIsDragging(false)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  }, [])

  const handleTaskPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    if ((e.target as HTMLElement).closest('button, input, textarea, form, a, label, [role="checkbox"]')) return

    const card = taskCardRef.current
    if (!card) return

    const handle = e.currentTarget
    const pointerId = e.pointerId

    try {
      handle.setPointerCapture(pointerId)
    } catch {
      // Safe fallback if pointer capture fails
    }

    const initialRect = card.getBoundingClientRect()
    const startX = e.clientX
    const startY = e.clientY
    const initLeft = initialRect.left
    const initTop = initialRect.top
    const cardWidth = initialRect.width
    const cardHeight = initialRect.height

    const minX = 0
    const maxX = Math.max(0, window.innerWidth - cardWidth)
    const minY = 0
    const maxY = Math.max(0, window.innerHeight - cardHeight)

    let finalLeft = initLeft
    let finalTop = initTop

    setIsDraggingTask(true)

    const onPointerMove = (ev: PointerEvent) => {
      const rawDeltaX = ev.clientX - startX
      const rawDeltaY = ev.clientY - startY
      const clampedX = Math.min(Math.max(initLeft + rawDeltaX, minX), maxX)
      const clampedY = Math.min(Math.max(initTop + rawDeltaY, minY), maxY)
      finalLeft = clampedX
      finalTop = clampedY

      const renderDeltaX = clampedX - initLeft
      const renderDeltaY = clampedY - initTop
      card.style.transform = `translate3d(${renderDeltaX}px, ${renderDeltaY}px, 0)`
    }

    const onPointerUp = () => {
      try {
        handle.releasePointerCapture(pointerId)
      } catch {
        // Safe release
      }
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)

      card.style.left = `${finalLeft}px`
      card.style.top = `${finalTop}px`
      card.style.transform = ''
      setTaskPosition({ x: finalLeft, y: finalTop })
      setIsDraggingTask(false)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    window.addEventListener('pointercancel', onPointerUp)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const minX = 0
      const minY = 0

      setToolPosition((prev) => {
        if (!prev) return null
        const cardWidth = cardRef.current?.offsetWidth ?? 360
        const cardHeight = cardRef.current?.offsetHeight ?? 300
        const maxX = Math.max(minX, window.innerWidth - cardWidth)
        const maxY = Math.max(minY, window.innerHeight - cardHeight)
        return {
          x: Math.min(Math.max(prev.x, minX), maxX),
          y: Math.min(Math.max(prev.y, minY), maxY),
        }
      })

      setTaskPosition((prev) => {
        if (!prev) return null
        const cardWidth = taskCardRef.current?.offsetWidth ?? 360
        const cardHeight = taskCardRef.current?.offsetHeight ?? 300
        const maxX = Math.max(minX, window.innerWidth - cardWidth)
        const maxY = Math.max(minY, window.innerHeight - cardHeight)
        return {
          x: Math.min(Math.max(prev.x, minX), maxX),
          y: Math.min(Math.max(prev.y, minY), maxY),
        }
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const refresh = useCallback(async () => {
    if (!repository) return
    setLoading(true)
    try {
      const [items, preferences] = await Promise.all([repository.getTodos(), repository.getPreferences()])
      setTasks(items)
      setSettings({ workMinutes: preferences.work_minutes, shortBreakMinutes: preferences.short_break_minutes, longBreakMinutes: preferences.long_break_minutes, workTurnsBeforeLongBreak: 4 })
      if (repository.mode === 'account') setSaveStatus('saved')
    } catch {
      setTasks([])
      if (repository.mode === 'account') setSaveStatus('error')
    } finally { setLoading(false) }
  }, [repository, setSettings])

  useEffect(() => { if (repository) void refresh() }, [repository, refresh])
  useEffect(() => {
    if (!user) { setNote(''); setNoteStatus('idle'); return }
    setNoteStatus('loading')
    void loadWorkspaceNote().then((value) => { setNote(value?.content ?? ''); setNoteStatus('saved') }).catch(() => setNoteStatus('error'))
  }, [user])
  useEffect(() => {
    if (!repository || loading) return
    void repository.savePreferences({ work_minutes: state.settings.workMinutes, short_break_minutes: state.settings.shortBreakMinutes, long_break_minutes: state.settings.longBreakMinutes }).then(() => repository.mode === 'account' && setSaveStatus('saved')).catch(() => repository.mode === 'account' && setSaveStatus('error'))
  }, [repository, state.settings, loading])
  useEffect(() => { if (repository && state.status === 'running' && state.phase === 'work' && !startedAt.current) startedAt.current = new Date().toISOString() }, [repository, state.phase, state.status])
  useEffect(() => {
    if (!repository || state.completedWork <= savedWork.current || !startedAt.current) return
    savedWork.current = state.completedWork
    void repository.saveFocusSession(state.settings.workMinutes * 60, startedAt.current).then(() => repository.mode === 'account' && setSaveStatus('saved')).catch(() => repository.mode === 'account' && setSaveStatus('error'))
    startedAt.current = null
  }, [repository, state.completedWork, state.settings.workMinutes])
  useEffect(() => {
    if (!user || noteStatus !== 'saving') return
    const timeout = window.setTimeout(() => void saveWorkspaceNote(user.id, note).then(() => setNoteStatus('saved')).catch(() => setNoteStatus('error')), 650)
    return () => window.clearTimeout(timeout)
  }, [user, note, noteStatus])

  const addTask = async () => {
    const title = draft.trim()
    if (!title || !repository) return
    const item = await repository.createTodo(title, tasks.length)
    setTasks((current) => [...current, item])
    setDraft('')
    setActiveId(item.id)
  }
  const selectTask = (id: string) => { setActiveId(id); setMobileTaskOpen(false) }
  const toggleTask = async (task: WorkspaceTask) => {
    if (!repository) return
    const done = !task.done
    setTasks((current) => current.map((item) => item.id === task.id ? { ...item, done } : item))
    if (done && activeId === task.id) setActiveId(null)
    try { await repository.updateTodo(task.id, done) } catch { setTasks((current) => current.map((item) => item.id === task.id ? task : item)) }
  }
  const setNoteValue = (value: string) => { setNote(value); setNoteStatus('saving') }
  const background = backgrounds.find((item) => item.id === appearance.id) ?? backgrounds[0]
  const activeTask = tasks.find((task) => task.id === activeId && !task.done)?.title ?? null
  const progress = getProgressPercent(state.remainingSeconds, state.durationSeconds)

  if (authLoading) return <main className="workspace-page" aria-busy="true" />

  return <main className="workspace-page" data-status={state.status} data-phase={state.phase} data-running={state.status === 'running'}>
    {/* Full-bleed atmospheric background covering entire workspace page */}
    <div
      key={background.src}
      className="workspace-backdrop"
      aria-hidden="true"
      style={{ backgroundImage: `url(${background.src})` }}
    />
    <div className="workspace-backdrop__overlay" aria-hidden="true" style={{ opacity: appearance.overlay }} />
    <div className="workspace-backdrop__grain" aria-hidden="true" />

    <WorkspaceHeader mode={mode} status={saveStatus} completedWork={state.completedWork} />
    {repository?.mode === 'account' ? <WorkspaceMigrationPrompt account={repository} onImported={() => void refresh()} /> : null}

    <div className="workspace-container">
      <FocusStage
        phase={state.phase}
        status={state.status}
        remainingSeconds={state.remainingSeconds}
        durationSeconds={state.durationSeconds}
        workTurn={state.workTurn}
        completedWork={state.completedWork}
        completionPulse={completionPulse}
        progress={progress}
        background={background.src}
        overlay={appearance.overlay}
        activeTask={activeTask}
        taskOpen={desktop ? taskOpen : false}
        onOpenTasks={() => {
          if (desktop) setTaskOpen(true)
          else setMobileTaskOpen(true)
        }}
        onStart={start}
        onPause={pause}
        onReset={reset}
        onSkip={skip}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      {!desktop ? (
        <div style={{ display: 'grid', gap: 10, width: '100%', maxWidth: 520, margin: '14px auto 0' }}>
          <Button
            type="button"
            onClick={() => setMobileTaskOpen(true)}
            className="workspace-ctrl-paper"
            style={{
              display: 'grid',
              gridTemplateColumns: 'auto minmax(0, 1fr) auto',
              width: '100%',
              gap: 12,
              alignItems: 'center',
              textAlign: 'left',
              minHeight: 52,
            }}
          >
            <ListChecks color="#e01920" size={20} />
            <span style={{ minWidth: 0 }}>
              <strong style={{ display: 'block', fontSize: 13, lineHeight: 1.2 }}>{activeTask ?? 'CHỌN VIỆC CẦN LÀM'}</strong>
              <span style={{ display: 'block', marginTop: 2, color: '#6a6962', fontSize: 10, fontWeight: 800 }}>MỞ TASK LEDGER</span>
            </span>
            <span style={{ fontSize: 11, fontWeight: 900, background: '#e01920', color: '#f3f1ea', padding: '2px 8px' }}>
              {tasks.filter((t) => !t.done).length}
            </span>
          </Button>

          <Button
            type="button"
            onClick={() => setMobileToolsOpen(true)}
            className="workspace-ctrl-paper"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              minHeight: 48,
            }}
          >
            <Music2 size={16} color="#e01920" />
            <span>MỞ TIỆN ÍCH</span>
          </Button>
        </div>
      ) : null}
    </div>

    {/* Desktop Floating & Draggable Task Card */}
    {desktop ? (
      <div
        ref={taskCardRef}
        className={`workspace-tool-card workspace-task-card--floating ${isDraggingTask ? 'workspace-tool-card--dragging' : ''}`}
        data-open={taskOpen}
        style={
          taskPosition
            ? { left: `${taskPosition.x}px`, top: `${taskPosition.y}px`, right: 'auto' }
            : { left: '28px', top: '88px', right: 'auto' }
        }
      >
        <TaskPanel
          tasks={tasks}
          draft={draft}
          loading={loading}
          activeId={activeId}
          compact={false}
          onClose={() => setTaskOpen(false)}
          dragHandleProps={{
            onPointerDown: handleTaskPointerDown,
            style: { cursor: isDraggingTask ? 'grabbing' : 'grab' },
          }}
          onDraftChange={setDraft}
          onAdd={() => void addTask()}
          onSelect={selectTask}
          onToggle={(task) => void toggleTask(task)}
        />
      </div>
    ) : null}

    {/* Desktop Floating & Draggable Tool Card */}
    {desktop ? (
      <div
        ref={cardRef}
        className={`workspace-tool-card workspace-tool-card--floating ${isDragging ? 'workspace-tool-card--dragging' : ''}`}
        data-open={tool !== null}
        style={
          toolPosition
            ? { left: `${toolPosition.x}px`, top: `${toolPosition.y}px`, right: 'auto' }
            : { right: '28px', top: '88px', left: 'auto' }
        }
      >
        <WorkspaceTools
          selected={tool ?? 'audio'}
          onSelect={setTool}
          onClose={() => setTool(null)}
          dragHandleProps={{
            onPointerDown: handlePointerDown,
            style: { cursor: isDragging ? 'grabbing' : 'grab' },
          }}
          audio={audio}
          tracks={tracks}
          appearance={appearance}
          setAppearance={setAppearance}
          backgrounds={backgrounds}
          note={note}
          noteStatus={noteStatus}
          noteEnabled={Boolean(user)}
          onNoteChange={setNoteValue}
        />
      </div>
    ) : null}

    {/* Floating tool trigger button (accessible and responsive across all viewports) */}
    <Button
      className="workspace-tool-trigger"
      type="button"
      aria-expanded={mobileToolsOpen}
      aria-controls="workspace-tool-menu"
      onClick={() => setMobileToolsOpen((open) => !open)}
      aria-label="Công cụ"
    >
      <NotebookPen size={16} />
      <span>Công cụ</span>
    </Button>

    {mobileToolsOpen ? (
      <nav
        id="workspace-tool-menu"
        aria-label="Công cụ workspace"
        className="workspace-tool-menu-popover"
      >
        <div
          style={{
            padding: '6px 10px 4px',
            borderBottom: '1px solid rgba(16, 17, 15, 0.12)',
            marginBottom: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: '0.12em', color: '#6a6962' }}>
            BỘ TIỆN ÍCH
          </span>
          {(tool || (desktop && taskOpen)) ? (
            <span style={{ fontSize: 9, fontWeight: 800, background: '#e01920', color: '#f3f1ea', padding: '1px 6px' }}>
              ĐANG MỞ
            </span>
          ) : null}
        </div>

        <Button
          type="button"
          onClick={() => {
            if (desktop) {
              setTaskOpen((open) => !open)
            } else {
              setMobileTaskOpen(true)
            }
            setMobileToolsOpen(false)
          }}
          className="workspace-ctrl-paper"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            justifyContent: 'flex-start',
            border: 0,
            background: (desktop && taskOpen) ? 'rgba(224, 25, 32, 0.08)' : undefined,
            fontWeight: (desktop && taskOpen) ? 900 : 800,
          }}
        >
          <ListChecks size={16} color="#e01920" />
          <span style={{ flex: 1, textAlign: 'left' }}>Việc cần làm</span>
          {(desktop && taskOpen) ? <span style={{ fontSize: 10, color: '#e01920', fontWeight: 900 }}>• Đang mở</span> : null}
        </Button>

        <Button
          type="button"
          onClick={() => {
            setTool('audio')
            setMobileToolsOpen(false)
            if (!desktop) setMobileNoteOpen(true)
          }}
          className="workspace-ctrl-paper"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            justifyContent: 'flex-start',
            border: 0,
            background: tool === 'audio' ? 'rgba(224, 25, 32, 0.08)' : undefined,
            fontWeight: tool === 'audio' ? 900 : 800,
          }}
        >
          <Music2 size={16} color="#e01920" />
          <span style={{ flex: 1, textAlign: 'left' }}>Âm thanh</span>
          {tool === 'audio' ? <span style={{ fontSize: 10, color: '#e01920', fontWeight: 900 }}>• Đang mở</span> : null}
        </Button>

        <Button
          type="button"
          onClick={() => {
            setTool('appearance')
            setMobileToolsOpen(false)
            if (!desktop) setMobileNoteOpen(true)
          }}
          className="workspace-ctrl-paper"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            justifyContent: 'flex-start',
            border: 0,
            background: tool === 'appearance' ? 'rgba(224, 25, 32, 0.08)' : undefined,
            fontWeight: tool === 'appearance' ? 900 : 800,
          }}
        >
          <ImageIcon size={16} color="#e01920" />
          <span style={{ flex: 1, textAlign: 'left' }}>Không gian</span>
          {tool === 'appearance' ? <span style={{ fontSize: 10, color: '#e01920', fontWeight: 900 }}>• Đang mở</span> : null}
        </Button>

        <Button
          type="button"
          onClick={() => {
            setTool('notes')
            setMobileToolsOpen(false)
            if (!desktop) setMobileNoteOpen(true)
          }}
          className="workspace-ctrl-paper"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            justifyContent: 'flex-start',
            border: 0,
            background: tool === 'notes' ? 'rgba(224, 25, 32, 0.08)' : undefined,
            fontWeight: tool === 'notes' ? 900 : 800,
          }}
        >
          <NotebookPen size={16} color="#e01920" />
          <span style={{ flex: 1, textAlign: 'left' }}>Ghi chú</span>
          {tool === 'notes' ? <span style={{ fontSize: 10, color: '#e01920', fontWeight: 900 }}>• Đang mở</span> : null}
        </Button>

        <Button
          type="button"
          onClick={() => {
            setSettingsOpen(true)
            setMobileToolsOpen(false)
          }}
          className="workspace-ctrl-paper"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            justifyContent: 'flex-start',
            border: 0,
            fontWeight: 800,
          }}
        >
          <SlidersHorizontal size={16} color="#e01920" />
          <span style={{ flex: 1, textAlign: 'left' }}>Thời gian phiên</span>
        </Button>

        {(tool !== null || (desktop && taskOpen)) ? (
          <Button
            type="button"
            onClick={() => {
              setTool(null)
              if (desktop) setTaskOpen(false)
              setMobileNoteOpen(false)
              setMobileToolsOpen(false)
            }}
            className="workspace-ctrl-paper"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              justifyContent: 'flex-start',
              borderTop: '1px solid rgba(16, 17, 15, 0.12)',
              marginTop: 4,
              color: '#e01920',
            }}
          >
            <X size={16} />
            <span>Tắt toàn bộ cửa sổ</span>
          </Button>
        ) : null}
      </nav>
    ) : null}

    {/* Task Dialog for Mobile */}
    <Dialog open={mobileTaskOpen} onOpenChange={setMobileTaskOpen}>
      <DialogContent className="workspace-sheet-content">
        <DialogHeader>
          <DialogTitle style={{ fontSize: 24, lineHeight: 1.05, letterSpacing: '-0.04em', fontWeight: 900 }}>
            TASK LEDGER
          </DialogTitle>
          <DialogDescription style={{ color: '#6a6962', fontSize: 12 }}>
            Chọn một việc trước khi bắt đầu phiên tập trung.
          </DialogDescription>
        </DialogHeader>
        <TaskPanel
          tasks={tasks}
          draft={draft}
          loading={loading}
          activeId={activeId}
          compact
          onClose={() => setMobileTaskOpen(false)}
          onDraftChange={setDraft}
          onAdd={() => void addTask()}
          onSelect={selectTask}
          onToggle={(task) => void toggleTask(task)}
        />
        <DialogFooter style={{ margin: '14px 0 0', padding: 0, border: 0, background: 'transparent' }}>
          <Button
            type="button"
            onClick={() => setMobileTaskOpen(false)}
            className="workspace-ctrl-paper"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <X size={16} /> ĐÓNG
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Tool/Notes Dialog for Mobile */}
    <Dialog open={mobileNoteOpen} onOpenChange={setMobileNoteOpen}>
      <DialogContent className="workspace-sheet-content workspace-notes-dialog-content">
        <DialogHeader>
          <DialogTitle style={{ fontSize: 24, lineHeight: 1.05, letterSpacing: '-0.04em', fontWeight: 900 }}>
            BỘ CÔNG CỤ
          </DialogTitle>
          <DialogDescription style={{ color: '#6a6962', fontSize: 12 }}>
            Giữ ý tưởng, âm nhạc và không gian gần phiên tập trung.
          </DialogDescription>
        </DialogHeader>
        <WorkspaceTools
          selected={tool ?? 'notes'}
          onSelect={setTool}
          onClose={() => setMobileNoteOpen(false)}
          audio={audio}
          tracks={tracks}
          appearance={appearance}
          setAppearance={setAppearance}
          backgrounds={backgrounds}
          note={note}
          noteStatus={noteStatus}
          noteEnabled={Boolean(user)}
          onNoteChange={setNoteValue}
        />
        <DialogFooter style={{ margin: '14px 0 0', padding: 0, border: 0, background: 'transparent' }}>
          <Button
            type="button"
            onClick={() => setMobileNoteOpen(false)}
            className="workspace-ctrl-paper"
            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <X size={16} /> ĐÓNG
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    {/* Pomodoro Session Durations Settings Dialog */}
    <PomodoroSettingsDialog
      open={settingsOpen}
      onOpenChange={setSettingsOpen}
      settings={state.settings}
      onSave={setSettings}
    />
  </main>
}

