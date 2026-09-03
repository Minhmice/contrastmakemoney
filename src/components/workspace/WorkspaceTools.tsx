import { Headphones, Image as ImageIcon, Music2, NotebookPen, Pause, Play, Repeat2, Shuffle, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import type { Dispatch, SetStateAction } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Toggle } from '@/components/ui/toggle'
import { eyebrow, fieldStyle, workspaceColor, workspaceControl } from './workspace-styles'

export type WorkspaceTool = 'audio' | 'appearance' | 'notes'
export type Appearance = { id: string; overlay: number }
export type NoteStatus = 'idle' | 'loading' | 'saving' | 'saved' | 'error'

type AudioController = {
  track: { title: string; artist: string }
  trackId: string
  setTrackId: (id: string) => void
  volume: number
  setVolume: (value: number) => void
  playing: boolean
  repeat: boolean
  setRepeat: (value: boolean) => void
  shuffle: boolean
  setShuffle: (value: boolean) => void
  toggle: () => void
  previous: () => void
  next: () => void
}

type WorkspaceToolsProps = {
  selected: WorkspaceTool
  onSelect: (tool: WorkspaceTool) => void
  audio: AudioController
  tracks: readonly { id: string; title: string }[]
  appearance: Appearance
  setAppearance: Dispatch<SetStateAction<Appearance>>
  backgrounds: readonly { id: string; label: string; src: string }[]
  note: string
  noteStatus: NoteStatus
  noteEnabled: boolean
  onNoteChange: (value: string) => void
}

const labels: Record<WorkspaceTool, string> = { audio: 'Âm thanh', appearance: 'Không gian', notes: 'Ghi chú' }

export function WorkspaceTools({ selected, onSelect, audio, tracks, appearance, setAppearance, backgrounds, note, noteStatus, noteEnabled, onNoteChange }: WorkspaceToolsProps) {
  return (
    <section aria-label="Công cụ phiên tập trung" style={{ display: 'grid', gap: 20, minWidth: 0 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 1, borderBottom: `1px solid ${workspaceColor.line}` }}>
        {([['audio', Headphones], ['appearance', ImageIcon], ['notes', NotebookPen]] as const).map(([tool, Icon]) => <Button key={tool} type="button" onClick={() => onSelect(tool)} aria-pressed={selected === tool} aria-label={labels[tool]} style={{ minHeight: 48, borderRadius: 0, background: selected === tool ? workspaceColor.ink : 'transparent', color: selected === tool ? workspaceColor.paper : workspaceColor.ink, padding: 0 }}><Icon size={18} /></Button>)}
      </div>
      {selected === 'audio' ? <AudioTool audio={audio} tracks={tracks} /> : null}
      {selected === 'appearance' ? <AppearanceTool appearance={appearance} setAppearance={setAppearance} backgrounds={backgrounds} /> : null}
      {selected === 'notes' ? <NotesTool note={note} status={noteStatus} enabled={noteEnabled} onChange={onNoteChange} /> : null}
    </section>
  )
}

function AudioTool({ audio, tracks }: Pick<WorkspaceToolsProps, 'audio' | 'tracks'>) {
  return <div style={{ display: 'grid', gap: 18 }}>
    <div style={{ display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr)', gap: 11, alignItems: 'center' }}><div style={{ display: 'grid', placeItems: 'center', width: 44, height: 44, background: workspaceColor.red, color: workspaceColor.paper }}><Music2 size={20} /></div><div style={{ minWidth: 0 }}><p style={eyebrow}>ÂM THANH / SẴN SÀNG</p><strong style={{ display: 'block', marginTop: 4, overflowWrap: 'anywhere' }}>{audio.track.title}</strong><span style={{ color: workspaceColor.muted, fontSize: 12 }}>{audio.track.artist}</span></div></div>
    <div style={{ display: 'grid', gridTemplateColumns: '18px minmax(0, 1fr) 38px', gap: 10, alignItems: 'center' }}><Volume2 size={16} /><Slider value={[audio.volume]} min={0} max={1} step={0.05} onValueChange={(value) => audio.setVolume((Array.isArray(value) ? value[0] : value) ?? .55)} /><span style={{ fontSize: 12, textAlign: 'right' }}>{Math.round(audio.volume * 100)}%</span></div>
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4 }}><Toggle pressed={audio.shuffle} onPressedChange={audio.setShuffle} aria-label="Xáo trộn" style={{ ...workspaceControl('paper'), width: 44, padding: 0 }}><Shuffle size={16} /></Toggle><Button type="button" onClick={audio.previous} aria-label="Bài trước" style={{ ...workspaceControl('paper'), width: 44, padding: 0 }}><SkipBack size={16} /></Button><Button type="button" onClick={audio.toggle} aria-label="Phát hoặc tạm dừng" style={{ ...workspaceControl('red'), width: 52, minHeight: 52, padding: 0 }}>{audio.playing ? <Pause /> : <Play />}</Button><Button type="button" onClick={audio.next} aria-label="Bài tiếp" style={{ ...workspaceControl('paper'), width: 44, padding: 0 }}><SkipForward size={16} /></Button><Toggle pressed={audio.repeat} onPressedChange={audio.setRepeat} aria-label="Lặp bài" style={{ ...workspaceControl('paper'), width: 44, padding: 0 }}><Repeat2 size={16} /></Toggle></div>
    <div><Label htmlFor="workspace-track">Bản nhạc</Label><select id="workspace-track" value={audio.trackId} onChange={(event) => audio.setTrackId(event.target.value)} style={{ ...fieldStyle, marginTop: 7, padding: '0 10px' }}>{tracks.map((track) => <option key={track.id} value={track.id}>{track.title}</option>)}</select></div>
  </div>
}

function AppearanceTool({ appearance, setAppearance, backgrounds }: Pick<WorkspaceToolsProps, 'appearance' | 'setAppearance' | 'backgrounds'>) {
  return <div style={{ display: 'grid', gap: 18 }}><div><p style={eyebrow}>KHÔNG GIAN / CHỌN NỀN</p><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 6, marginTop: 10 }}>{backgrounds.map((item) => <button key={item.id} type="button" onClick={() => setAppearance((current) => ({ ...current, id: item.id }))} style={{ position: 'relative', isolation: 'isolate', minHeight: 88, overflow: 'hidden', border: appearance.id === item.id ? `3px solid ${workspaceColor.red}` : `1px solid ${workspaceColor.ink}`, background: workspaceColor.ink, color: workspaceColor.paper, fontSize: 10, fontWeight: 800, padding: 7 }}><span aria-hidden="true" style={{ position: 'absolute', zIndex: -1, inset: 0, backgroundImage: `linear-gradient(rgba(16,17,15,.25),rgba(16,17,15,.65)), url(${item.src})`, backgroundPosition: 'center', backgroundSize: 'cover' }} />{item.label}</button>)}</div></div><div><Label htmlFor="workspace-overlay">Độ tối nền</Label><Slider id="workspace-overlay" value={[appearance.overlay]} min={0.2} max={0.8} step={0.02} onValueChange={(value) => setAppearance((current) => ({ ...current, overlay: (Array.isArray(value) ? value[0] : value) ?? current.overlay }))} style={{ marginTop: 12 }} /></div></div>
}

function NotesTool({ note, status, enabled, onChange }: { note: string; status: NoteStatus; enabled: boolean; onChange: (value: string) => void }) {
  const message = !enabled ? 'Đăng nhập để lưu ghi chú trên tài khoản.' : status === 'saving' ? 'Đang lưu…' : status === 'error' ? 'Lưu thất bại. Nội dung vẫn ở đây.' : status === 'saved' ? 'Đã lưu' : `${note.length}/12000`
  return <div id="workspace-notes-panel" style={{ display: 'grid', gap: 10 }}><p style={eyebrow}>GHI CHÚ / PHIÊN NÀY</p><Label htmlFor="workspace-note" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>Ghi chú phiên tập trung</Label><textarea id="workspace-note" value={note} onChange={(event) => onChange(event.target.value)} disabled={!enabled} maxLength={12000} placeholder={enabled ? 'Ghi ý tưởng, quyết định hoặc việc cần nhớ…' : 'Đăng nhập để lưu ghi chú.'} style={{ ...fieldStyle, minHeight: 220, resize: 'vertical', padding: 12, lineHeight: 1.5 }} /><p aria-live="polite" style={{ margin: 0, color: status === 'error' ? workspaceColor.red : workspaceColor.muted, fontSize: 12 }}>{message}</p></div>
}
