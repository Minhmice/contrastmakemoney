import { ListChecks, Plus } from 'lucide-react'
import type { WorkspaceTask } from '@/features/user-data/api'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { eyebrow, fieldStyle, workspaceColor, workspaceControl } from './workspace-styles'

type TaskPanelProps = {
  tasks: WorkspaceTask[]
  draft: string
  loading: boolean
  activeId: string | null
  compact?: boolean
  onDraftChange: (value: string) => void
  onAdd: () => void
  onSelect: (id: string) => void
  onToggle: (task: WorkspaceTask) => void
}

export function TaskPanel({ tasks, draft, loading, activeId, compact = false, onDraftChange, onAdd, onSelect, onToggle }: TaskPanelProps) {
  const remaining = tasks.filter((task) => !task.done).length

  return (
    <section id="workspace-task-panel" aria-labelledby="workspace-task-title" style={{ display: 'grid', gap: compact ? 14 : 20, minWidth: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'start' }}>
        <div style={{ minWidth: 0 }}>
          <p style={eyebrow}>TASK LEDGER / {String(remaining).padStart(2, '0')} MỞ</p>
          <h2 id="workspace-task-title" style={{ margin: '7px 0 0', color: workspaceColor.ink, fontSize: compact ? 22 : 30, lineHeight: 1.04, letterSpacing: '-0.04em' }}>VIỆC ĐANG LÀM</h2>
        </div>
        <ListChecks color={workspaceColor.red} size={22} aria-hidden="true" />
      </div>

      <form onSubmit={(event) => { event.preventDefault(); onAdd() }} style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 44px', gap: 8 }}>
        <Label htmlFor="workspace-task" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}>Việc cần hoàn thành</Label>
        <Input id="workspace-task" value={draft} onChange={(event) => onDraftChange(event.target.value)} placeholder="Viết việc cần làm" maxLength={140} style={{ ...fieldStyle, padding: '0 12px' }} />
        <Button type="submit" aria-label="Thêm công việc" style={{ ...workspaceControl('red'), width: 44, padding: 0 }}><Plus size={18} /></Button>
      </form>

      <div style={{ borderTop: `1px solid ${workspaceColor.line}` }}>
        {loading ? <p style={{ color: workspaceColor.muted }}>Đang tải công việc…</p> : null}
        {!loading && tasks.length === 0 ? <p style={{ margin: '14px 0 0', color: workspaceColor.muted, lineHeight: 1.5 }}>Chọn một việc. Bấm bắt đầu. Làm đến xong.</p> : null}
        {tasks.map((task, index) => {
          const active = task.id === activeId
          return <div key={task.id} style={{ display: 'grid', gridTemplateColumns: '36px minmax(0, 1fr) auto', gap: 9, alignItems: 'center', minWidth: 0, padding: '11px 0', borderBottom: `1px solid ${workspaceColor.line}`, background: active ? workspaceColor.paperMuted : 'transparent' }}>
            <Checkbox checked={task.done} onCheckedChange={() => onToggle(task)} aria-label={task.done ? `Mở lại ${task.title}` : `Hoàn thành ${task.title}`} style={{ width: 36, height: 36, border: `1px solid ${workspaceColor.ink}`, borderRadius: 0, background: task.done ? workspaceColor.ink : 'transparent', color: workspaceColor.paper }} />
            <button type="button" onClick={() => onSelect(task.id)} style={{ minWidth: 0, border: 0, background: 'transparent', color: workspaceColor.ink, textAlign: 'left', padding: 0 }}>
              <strong style={{ display: 'block', overflowWrap: 'anywhere', lineHeight: 1.35, textDecoration: task.done ? 'line-through' : 'none' }}>{task.title}</strong>
              <span style={{ display: 'block', marginTop: 3, color: active ? workspaceColor.red : workspaceColor.muted, fontSize: 10, fontWeight: 800, letterSpacing: '0.08em' }}>{active ? 'ĐANG TẬP TRUNG' : task.done ? 'ĐÃ XONG' : 'CHỌN VIỆC'}</span>
            </button>
            <span aria-hidden="true" style={{ color: workspaceColor.muted, fontSize: 10, fontWeight: 800 }}>{String(index + 1).padStart(2, '0')}</span>
          </div>
        })}
      </div>
    </section>
  )
}
