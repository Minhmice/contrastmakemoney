import { useEffect, useState } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import type { GuestWorkspaceState } from '@/features/workspace/guest-storage'
import {
  inspectGuestWorkspace,
  migrateAndClearGuestWorkspace,
  type WorkspaceMigrationStatus,
} from '@/features/workspace/migration'
import type { WorkspaceRepository } from '@/features/workspace/repository'

const DISMISSED_KEY = 'contrast.workspace.import-dismissed'

export function WorkspaceMigrationPrompt({
  account,
  onImported,
}: {
  account: WorkspaceRepository
  onImported: () => void
}) {
  const [state, setState] = useState<GuestWorkspaceState | null>(null)
  const [status, setStatus] = useState<WorkspaceMigrationStatus>('detecting')
  const [open, setOpen] = useState(false)

  const inspect = () => {
    const guest = inspectGuestWorkspace(window.localStorage)
    setState(guest)
    setStatus(guest ? 'ready' : 'idle')
    setOpen(Boolean(guest))
  }

  useEffect(() => {
    const guest = inspectGuestWorkspace(window.localStorage)
    setState(guest)
    setStatus(guest ? 'ready' : 'idle')
    setOpen(Boolean(guest) && sessionStorage.getItem(DISMISSED_KEY) !== '1')
  }, [])

  const keepSeparate = () => {
    sessionStorage.setItem(DISMISSED_KEY, '1')
    setOpen(false)
  }

  const migrate = async () => {
    if (!state || status === 'migrating') return
    setStatus('migrating')
    try {
      await migrateAndClearGuestWorkspace(window.localStorage, account, state)
      sessionStorage.removeItem(DISMISSED_KEY)
      setStatus('success')
      setState(null)
      setOpen(false)
      onImported()
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      {state && !open ? (
        <button className="workspace-import-entry" type="button" onClick={inspect}>
          NHẬP DỮ LIỆU TRÊN THIẾT BỊ <ArrowUpRight size={13} />
        </button>
      ) : null}
      {open && state ? (
        <div className="workspace-import-backdrop" role="presentation">
          <section
            className="workspace-import-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="workspace-import-title"
          >
            <button
              className="workspace-import-close"
              type="button"
              onClick={keepSeparate}
              aria-label="Đóng"
            >
              <X size={18} />
            </button>
            <p>WORKSPACE / IMPORT</p>
            <h2 id="workspace-import-title">TIẾP TỤC WORKSPACE NÀY?</h2>
            <p>Bạn đang có dữ liệu được lưu trên thiết bị này.</p>
            <ul>
              <li>{state.todos.length} công việc</li>
              <li>{state.focusSessions.length} phiên tập trung</li>
              <li>Cài đặt Pomodoro</li>
            </ul>
            {status === 'error' ? (
              <p className="workspace-import-error" role="alert">
                Chưa thể nhập đủ dữ liệu. Dữ liệu trên thiết bị vẫn an toàn. Thử lại.
              </p>
            ) : null}
            <div>
              <button
                type="button"
                disabled={status === 'migrating'}
                onClick={() => void migrate()}
              >
                {status === 'migrating' ? 'ĐANG NHẬP...' : 'NHẬP VÀO TÀI KHOẢN'}
              </button>
              <button
                type="button"
                disabled={status === 'migrating'}
                onClick={keepSeparate}
              >
                GIỮ RIÊNG
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  )
}
