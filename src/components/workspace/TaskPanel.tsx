import { GripVertical, Plus, X } from 'lucide-react'
import type { HTMLAttributes } from 'react'
import type { WorkspaceTask } from '@/features/user-data/api'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

type TaskPanelProps = {
  tasks: WorkspaceTask[]
  draft: string
  loading: boolean
  activeId: string | null
  compact?: boolean
  onClose?: () => void
  dragHandleProps?: HTMLAttributes<HTMLDivElement>
  onDraftChange: (value: string) => void
  onAdd: () => void
  onSelect: (id: string) => void
  onToggle: (task: WorkspaceTask) => void
}

export function TaskPanel({
  tasks,
  draft,
  loading,
  activeId,
  compact = false,
  onClose,
  dragHandleProps,
  onDraftChange,
  onAdd,
  onSelect,
  onToggle,
}: TaskPanelProps) {
  const remaining = tasks.filter((task) => !task.done).length

  return (
    <section
      id="workspace-task-panel"
      aria-labelledby="workspace-task-title"
      style={{ display: 'grid', gap: compact ? 12 : 14, minWidth: 0 }}
    >
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
            VIỆC CẦN LÀM / {String(remaining).padStart(2, '0')} MỞ
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
            aria-label="Tắt danh sách việc"
            className="workspace-tool-card__close-btn"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}>
        <h2
          id="workspace-task-title"
          style={{
            margin: 0,
            color: '#10110f',
            fontSize: compact ? 18 : 22,
            lineHeight: 1.05,
            fontWeight: 900,
            letterSpacing: '-0.04em',
          }}
        >
          TASK LEDGER
        </h2>
        <span style={{ fontSize: 10, fontWeight: 900, color: '#e01920', letterSpacing: '0.1em' }}>
          {remaining > 0 ? `${remaining} VIỆC ĐANG CHỜ` : 'ĐÃ HOÀN TẤT'}
        </span>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          onAdd()
        }}
        style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 44px', gap: 8 }}
      >
        <Label
          htmlFor="workspace-task"
          style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clipPath: 'inset(50%)' }}
        >
          Việc cần hoàn thành
        </Label>
        <Input
          id="workspace-task"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          placeholder="Viết việc cần tập trung..."
          maxLength={140}
          className="workspace-task-input"
        />
        <Button
          type="submit"
          aria-label="Thêm công việc"
          className="workspace-ctrl-red"
          style={{ width: 44, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Plus size={18} />
        </Button>
      </form>

      <div style={{ borderTop: '1px solid rgba(16, 17, 15, 0.14)' }}>
        {loading ? <p style={{ color: '#6a6962', fontSize: 13, padding: '12px 0' }}>Đang tải công việc…</p> : null}
        {!loading && tasks.length === 0 ? (
          <p style={{ margin: '14px 0 0', color: '#6a6962', lineHeight: 1.5, fontSize: 13 }}>
            Chọn một việc. Bấm bắt đầu. Làm đến xong.
          </p>
        ) : null}
        {tasks.map((task, index) => {
          const active = task.id === activeId
          return (
            <div
              key={task.id}
              className={`workspace-task-item ${active ? 'workspace-task-item--active' : ''}`}
              data-active={active || undefined}
              data-done={task.done || undefined}
            >
              <Checkbox
                checked={task.done}
                onCheckedChange={() => onToggle(task)}
                aria-label={task.done ? `Mở lại ${task.title}` : `Hoàn thành ${task.title}`}
                style={{
                  width: 28,
                  height: 28,
                  border: '1.5px solid #10110f',
                  borderRadius: 0,
                  background: task.done ? '#10110f' : 'transparent',
                  color: '#f3f1ea',
                }}
              />
              <button
                type="button"
                onClick={() => onSelect(task.id)}
                style={{
                  minWidth: 0,
                  border: 0,
                  background: 'transparent',
                  color: '#10110f',
                  textAlign: 'left',
                  padding: 0,
                  cursor: 'pointer',
                }}
              >
                <strong
                  style={{
                    display: 'block',
                    overflowWrap: 'anywhere',
                    lineHeight: 1.35,
                    fontSize: 13,
                    fontWeight: 800,
                    textDecoration: task.done ? 'line-through' : 'none',
                    color: task.done ? '#8b8a82' : '#10110f',
                  }}
                >
                  {task.title}
                </strong>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    marginTop: 3,
                    color: active ? '#e01920' : '#6a6962',
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                  }}
                >
                  {active ? (
                    <>
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          backgroundColor: '#e01920',
                          display: 'inline-block',
                        }}
                      />
                      ĐANG TẬP TRUNG
                    </>
                  ) : task.done ? (
                    'ĐÃ XONG'
                  ) : (
                    'CHỌN VIỆC'
                  )}
                </span>
              </button>
              <span
                aria-hidden="true"
                style={{ color: '#8b8a82', fontSize: 10, fontWeight: 900, letterSpacing: '0.06em' }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

