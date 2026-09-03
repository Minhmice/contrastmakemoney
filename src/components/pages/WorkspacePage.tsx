'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Image as ImageIcon, ListChecks, Music2, NotebookPen, X } from 'lucide-react'
import { useAuth, useAuthLoading } from '@/app/auth-context'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { FocusStage } from '@/components/workspace/FocusStage'
import { TaskPanel } from '@/components/workspace/TaskPanel'
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader'
import { WorkspaceMigrationPrompt } from '@/components/workspace/WorkspaceMigrationPrompt'
import { type Appearance, type NoteStatus, type WorkspaceTool, WorkspaceTools } from '@/components/workspace/WorkspaceTools'
import { workspaceColor, workspaceControl } from '@/components/workspace/workspace-styles'
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
  const [tool, setTool] = useState<WorkspaceTool>('audio')
  const [mobileNoteOpen, setMobileNoteOpen] = useState(false)
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false)
  const [mobileTaskOpen, setMobileTaskOpen] = useState(false)
  const [appearance, setAppearance] = useState<Appearance>({ id: 'night', overlay: .58 })
  const [note, setNote] = useState('')
  const [noteStatus, setNoteStatus] = useState<NoteStatus>('idle')
  const savedWork = useRef(0)
  const startedAt = useRef<string | null>(null)

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

  if (authLoading) return <main style={{ minHeight: '100dvh', background: workspaceColor.ink }} aria-busy="true" />

  const taskPanel = <TaskPanel tasks={tasks} draft={draft} loading={loading} activeId={activeId} compact={!desktop} onDraftChange={setDraft} onAdd={() => void addTask()} onSelect={selectTask} onToggle={(task) => void toggleTask(task)} />
  const tools = <WorkspaceTools selected={tool} onSelect={setTool} audio={audio} tracks={tracks} appearance={appearance} setAppearance={setAppearance} backgrounds={backgrounds} note={note} noteStatus={noteStatus} noteEnabled={Boolean(user)} onNoteChange={setNoteValue} />

  return <main style={{ minHeight: '100dvh', background: workspaceColor.ink, color: workspaceColor.paper }}>
    <WorkspaceHeader mode={mode} status={saveStatus} completedWork={state.completedWork} />
    {repository?.mode === 'account' ? <WorkspaceMigrationPrompt account={repository} onImported={() => void refresh()} /> : null}
    <div style={{ width: 'min(1440px, 100%)', margin: '0 auto', padding: desktop ? 24 : 0, display: 'grid', gridTemplateColumns: desktop ? 'minmax(280px, .78fr) minmax(0, 1.58fr) minmax(280px, .78fr)' : '1fr', gap: desktop ? 16 : 0, alignItems: 'start' }}>
      <aside style={{ minWidth: 0, order: desktop ? 0 : 1, background: workspaceColor.paper, color: workspaceColor.ink, padding: 'clamp(20px, 3vw, 32px)' }}>{desktop ? taskPanel : <Button type="button" onClick={() => setMobileTaskOpen(true)} style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0, 1fr) auto', width: '100%', gap: 12, alignItems: 'center', background: 'transparent', color: workspaceColor.ink, textAlign: 'left', padding: 0 }}><ListChecks color={workspaceColor.red} /><span style={{ minWidth: 0 }}><strong style={{ display: 'block' }}>{activeTask ?? 'CHỌN VIỆC CẦN LÀM'}</strong><span style={{ display: 'block', marginTop: 3, color: workspaceColor.muted, fontSize: 11 }}>MỞ TASK LEDGER</span></span><span aria-hidden="true">{tasks.filter((task) => !task.done).length}</span></Button>}</aside>
      <FocusStage phase={state.phase} status={state.status} remainingSeconds={state.remainingSeconds} durationSeconds={state.durationSeconds} workTurn={state.workTurn} completedWork={state.completedWork} progress={progress} background={background.src} overlay={appearance.overlay} activeTask={activeTask} onStart={start} onPause={pause} onReset={reset} onSkip={skip} />
      <aside style={{ minWidth: 0, order: desktop ? 2 : 2, background: workspaceColor.paper, color: workspaceColor.ink, padding: 'clamp(20px, 3vw, 32px)' }}>{desktop ? tools : <div style={{ display: 'grid', gap: 8 }}><p style={{ margin: 0, color: workspaceColor.muted, fontSize: 12 }}>Âm thanh, không gian, ghi chú</p><Button type="button" onClick={() => setMobileToolsOpen(true)} style={{ ...workspaceControl('ink'), width: '100%' }}><Music2 size={16} />MỞ CÔNG CỤ</Button></div>}</aside>
    </div>

    {!desktop ? <Button className="workspace-tool-trigger" type="button" aria-expanded={mobileToolsOpen} aria-controls="workspace-tool-menu" onClick={() => setMobileToolsOpen((open) => !open)} style={{ ...workspaceControl('ink'), position: 'fixed', zIndex: 20, right: 12, bottom: 12, minHeight: 48 }}><NotebookPen size={16} />Công cụ</Button> : null}
    {!desktop && mobileToolsOpen ? <nav id="workspace-tool-menu" aria-label="Công cụ workspace" style={{ position: 'fixed', zIndex: 21, right: 12, bottom: 68, display: 'grid', width: 'min(320px, calc(100vw - 24px))', gap: 1, background: workspaceColor.paper, border: `1px solid ${workspaceColor.ink}`, padding: 6 }}><Button type="button" onClick={() => { setTool('audio'); setMobileToolsOpen(false) }} style={{ ...workspaceControl('paper'), justifyContent: 'start' }}><Music2 size={16} />Âm thanh</Button><Button type="button" onClick={() => { setTool('appearance'); setMobileToolsOpen(false) }} style={{ ...workspaceControl('paper'), justifyContent: 'start' }}><ImageIcon size={16} />Không gian</Button><Button type="button" onClick={() => { setTool('notes'); setMobileNoteOpen(true); setMobileToolsOpen(false) }} style={{ ...workspaceControl('paper'), justifyContent: 'start' }}><NotebookPen size={16} />Ghi chú</Button></nav> : null}

    <Dialog open={mobileTaskOpen} onOpenChange={setMobileTaskOpen}><DialogContent style={{ width: 'min(100vw, 560px)', maxHeight: '88dvh', overflowY: 'auto', borderRadius: 0, background: workspaceColor.paper, color: workspaceColor.ink, padding: 24 }}><DialogHeader><DialogTitle style={{ fontSize: 28, lineHeight: 1.04, letterSpacing: '-0.04em' }}>TASK LEDGER</DialogTitle><DialogDescription>Chọn một việc trước khi bắt đầu phiên.</DialogDescription></DialogHeader>{taskPanel}</DialogContent></Dialog>
    <Dialog open={!desktop && mobileNoteOpen} onOpenChange={(open) => setMobileNoteOpen(open)}><DialogContent style={{ position: 'fixed', top: 'auto', right: 0, bottom: 0, left: 0, transform: 'none', width: '100vw', maxWidth: '100vw', maxHeight: '78dvh', overflowY: 'auto', borderRadius: 0, background: workspaceColor.paper, color: workspaceColor.ink, padding: 24 }}><DialogHeader><DialogTitle style={{ fontSize: 28, lineHeight: 1.04, letterSpacing: '-0.04em' }}>GHI CHÚ</DialogTitle><DialogDescription>Giữ ý tưởng gần phiên tập trung.</DialogDescription></DialogHeader>{tools}<DialogFooter style={{ margin: '8px 0 0', padding: 0, border: 0, background: 'transparent' }}><Button type="button" onClick={() => { setTool('audio'); setMobileNoteOpen(false) }} style={workspaceControl('ink')}><X size={16} />ĐÓNG</Button></DialogFooter></DialogContent></Dialog>
  </main>
}
