import { GripVertical, Headphones, Image as ImageIcon, Music2, NotebookPen, Pause, Play, Repeat2, Shuffle, SkipBack, SkipForward, Volume2, X } from 'lucide-react'
import type { Dispatch, HTMLAttributes, SetStateAction } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Toggle } from '@/components/ui/toggle'

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
  onClose?: () => void
  dragHandleProps?: HTMLAttributes<HTMLDivElement>
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

const labels: Record<WorkspaceTool, string> = {
  audio: 'Âm thanh',
  appearance: 'Không gian',
  notes: 'Ghi chú',
}

export function WorkspaceTools({
  selected,
  onSelect,
  onClose,
  dragHandleProps,
  audio,
  tracks,
  appearance,
  setAppearance,
  backgrounds,
  note,
  noteStatus,
  noteEnabled,
  onNoteChange,
}: WorkspaceToolsProps) {
  return (
    <section aria-label="Công cụ phiên tập trung" style={{ display: 'grid', gap: 14, minWidth: 0 }}>
      {/* Draggable Header with Title & Close Action */}
      <div className="workspace-tool-card__header" {...dragHandleProps}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 24,
              height: 24,
              background: '#10110f',
              color: '#f3f1ea',
            }}
            aria-hidden="true"
          >
            <GripVertical size={14} />
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: '0.12em',
              color: '#10110f',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            TIỆN ÍCH / {labels[selected]}
          </span>
          <span
            style={{
              fontSize: 9,
              fontWeight: 800,
              color: '#807e77',
              letterSpacing: '0.04em',
              textTransform: 'none',
            }}
          >
            (Kéo di chuyển)
          </span>
        </div>

        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tắt công cụ"
            className="workspace-tool-card__close-btn"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>

      {/* Segmented Tool Tabs: Easily switch back and forth between tools */}
      <div
        role="tablist"
        aria-label="Chọn công cụ tiện ích"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: 1,
          background: 'rgba(16, 17, 15, 0.16)',
          border: '1px solid rgba(16, 17, 15, 0.16)',
        }}
      >
        {([
          ['audio', Headphones],
          ['appearance', ImageIcon],
          ['notes', NotebookPen],
        ] as const).map(([tool, Icon]) => {
          const active = selected === tool
          return (
            <button
              key={tool}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onSelect(tool)}
              aria-label={labels[tool]}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                minHeight: 40,
                border: 0,
                borderRadius: 0,
                background: active ? '#10110f' : '#f3f1ea',
                color: active ? '#f3f1ea' : '#10110f',
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: '0.06em',
                cursor: 'pointer',
                transition: 'background 0.15s ease, color 0.15s ease',
              }}
            >
              <Icon size={15} />
              <span>{labels[tool]}</span>
            </button>
          )
        })}
      </div>

      {selected === 'audio' ? <AudioTool audio={audio} tracks={tracks} /> : null}
      {selected === 'appearance' ? (
        <AppearanceTool appearance={appearance} setAppearance={setAppearance} backgrounds={backgrounds} />
      ) : null}
      {selected === 'notes' ? (
        <NotesTool note={note} status={noteStatus} enabled={noteEnabled} onChange={onNoteChange} />
      ) : null}
    </section>
  )
}

function AudioTool({ audio, tracks }: Pick<WorkspaceToolsProps, 'audio' | 'tracks'>) {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {/* Now Playing Banner */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '44px minmax(0, 1fr)',
          gap: 12,
          alignItems: 'center',
          padding: 10,
          background: 'rgba(16, 17, 15, 0.04)',
          border: '1px solid rgba(16, 17, 15, 0.08)',
        }}
      >
        <div
          style={{
            display: 'grid',
            placeItems: 'center',
            width: 44,
            height: 44,
            background: '#e01920',
            color: '#f3f1ea',
          }}
        >
          <Music2 size={20} />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ margin: 0, color: '#e01920', fontSize: 10, fontWeight: 900, letterSpacing: '0.12em' }}>
            {audio.playing ? 'ĐANG PHÁT' : 'TẠM DỪNG'}
          </p>
          <strong
            style={{
              display: 'block',
              marginTop: 2,
              overflowWrap: 'anywhere',
              fontSize: 13,
              fontWeight: 800,
              lineHeight: 1.25,
            }}
          >
            {audio.track.title}
          </strong>
          <span style={{ color: '#6a6962', fontSize: 11, fontWeight: 600 }}>{audio.track.artist}</span>
        </div>
      </div>

      {/* Volume Control */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '20px minmax(0, 1fr) 36px',
          gap: 10,
          alignItems: 'center',
        }}
      >
        <Volume2 size={16} color="#10110f" />
        <Slider
          value={[audio.volume]}
          min={0}
          max={1}
          step={0.05}
          onValueChange={(value) => audio.setVolume((Array.isArray(value) ? value[0] : value) ?? 0.55)}
        />
        <span style={{ fontSize: 11, fontWeight: 800, textAlign: 'right' }}>
          {Math.round(audio.volume * 100)}%
        </span>
      </div>

      {/* Transport Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, alignItems: 'center' }}>
        <Toggle
          pressed={audio.shuffle}
          onPressedChange={audio.setShuffle}
          aria-label="Xáo trộn"
          className="workspace-ctrl-paper"
          style={{ width: 44, height: 44, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Shuffle size={16} />
        </Toggle>
        <Button
          type="button"
          onClick={audio.previous}
          aria-label="Bài trước"
          className="workspace-ctrl-paper"
          style={{ width: 44, height: 44, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <SkipBack size={16} />
        </Button>
        <Button
          type="button"
          onClick={audio.toggle}
          aria-label={audio.playing ? 'Tạm dừng nhạc' : 'Phát nhạc'}
          className="workspace-ctrl-red"
          style={{ minWidth: 52, height: 52, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          {audio.playing ? <Pause size={20} /> : <Play size={20} />}
        </Button>
        <Button
          type="button"
          onClick={audio.next}
          aria-label="Bài tiếp"
          className="workspace-ctrl-paper"
          style={{ width: 44, height: 44, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <SkipForward size={16} />
        </Button>
        <Toggle
          pressed={audio.repeat}
          onPressedChange={audio.setRepeat}
          aria-label="Lặp bài"
          className="workspace-ctrl-paper"
          style={{ width: 44, height: 44, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Repeat2 size={16} />
        </Toggle>
      </div>

      {/* Track Selection */}
      <div>
        <Label htmlFor="workspace-track" style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.06em' }}>
          DANH SÁCH BÀI HÁT
        </Label>
        <select
          id="workspace-track"
          value={audio.trackId}
          onChange={(event) => audio.setTrackId(event.target.value)}
          className="workspace-task-input"
          style={{ marginTop: 6, cursor: 'pointer' }}
        >
          {tracks.map((track) => (
            <option key={track.id} value={track.id}>
              {track.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

function AppearanceTool({
  appearance,
  setAppearance,
  backgrounds,
}: Pick<WorkspaceToolsProps, 'appearance' | 'setAppearance' | 'backgrounds'>) {
  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <div>
        <p style={{ margin: 0, color: '#e01920', fontSize: 10, fontWeight: 900, letterSpacing: '0.14em' }}>
          KHÔNG GIAN / CHỌN NỀN TOÀN TRANG
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, marginTop: 10 }}>
          {backgrounds.map((item) => {
            const active = appearance.id === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setAppearance((current) => ({ ...current, id: item.id }))}
                style={{
                  position: 'relative',
                  isolation: 'isolate',
                  minHeight: 88,
                  overflow: 'hidden',
                  border: active ? '2px solid #e01920' : '1px solid #10110f',
                  background: '#10110f',
                  color: '#f3f1ea',
                  fontSize: 10,
                  fontWeight: 900,
                  letterSpacing: '0.06em',
                  padding: 8,
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'flex-end',
                  cursor: 'pointer',
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    zIndex: -1,
                    inset: 0,
                    backgroundImage: `linear-gradient(rgba(16,17,15,.2),rgba(16,17,15,.75)), url(${item.src})`,
                    backgroundPosition: 'center',
                    backgroundSize: 'cover',
                  }}
                />
                {active ? (
                  <span
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      width: 8,
                      height: 8,
                      backgroundColor: '#e01920',
                    }}
                  />
                ) : null}
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Label htmlFor="workspace-overlay" style={{ fontSize: 11, fontWeight: 900, letterSpacing: '0.06em' }}>
            ĐỘ TỐI NỀN TOÀN TRANG
          </Label>
          <span style={{ fontSize: 11, fontWeight: 800 }}>{Math.round(appearance.overlay * 100)}%</span>
        </div>
        <Slider
          id="workspace-overlay"
          value={[appearance.overlay]}
          min={0.2}
          max={0.88}
          step={0.02}
          onValueChange={(value) =>
            setAppearance((current) => ({
              ...current,
              overlay: (Array.isArray(value) ? value[0] : value) ?? current.overlay,
            }))
          }
        />
      </div>
    </div>
  )
}

function NotesTool({
  note,
  status,
  enabled,
  onChange,
}: {
  note: string
  status: NoteStatus
  enabled: boolean
  onChange: (value: string) => void
}) {
  const message = !enabled
    ? 'Đăng nhập để lưu ghi chú trên tài khoản.'
    : status === 'saving'
      ? 'Đang tự động lưu…'
      : status === 'error'
        ? 'Lưu thất bại. Nội dung vẫn được giữ ở đây.'
        : status === 'saved'
          ? 'Đã lưu trên tài khoản'
          : `${note.length}/12000 ký tự`

  return (
    <div
      id="workspace-notes-panel"
      style={{ display: 'grid', gap: 10, width: '100%', minWidth: 0 }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ margin: 0, color: '#e01920', fontSize: 10, fontWeight: 900, letterSpacing: '0.14em' }}>
          GHI CHÚ / PHIÊN NÀY
        </p>
        <span style={{ fontSize: 10, fontWeight: 800, color: '#6a6962' }}>{message}</span>
      </div>

      <Label
        htmlFor="workspace-note"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}
      >
        Ghi chú phiên tập trung
      </Label>
      <textarea
        id="workspace-note"
        value={note}
        onChange={(event) => onChange(event.target.value)}
        disabled={!enabled}
        maxLength={12000}
        placeholder={enabled ? 'Ghi chép ý tưởng, quyết định hoặc việc cần nhớ trong phiên…' : 'Đăng nhập để lưu ghi chú.'}
        className="workspace-task-input"
        style={{
          minHeight: 220,
          resize: 'vertical',
          padding: 12,
          lineHeight: 1.5,
          fontFamily: 'inherit',
        }}
      />
    </div>
  )
}

