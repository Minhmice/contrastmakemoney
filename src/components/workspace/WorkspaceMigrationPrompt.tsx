'use client'

import { useEffect, useState } from 'react'
import { ArrowUpRight, Database } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
        <Button type="button" variant="outline" onClick={inspect} className="fixed right-4 bottom-20 z-20 h-11 max-w-[calc(100vw-2rem)] border-white/22 bg-[#11110f]/85 text-[10px] font-bold tracking-[0.08em] text-white backdrop-blur hover:bg-white hover:text-black">
          NHẬP DỮ LIỆU <ArrowUpRight />
        </Button>
      ) : null}
      <Dialog open={open} onOpenChange={(next) => { if (!next) keepSeparate() }}>
        <DialogContent className="border border-white/14 bg-[#171714] p-0 text-white sm:max-w-md">
          <DialogHeader className="p-6 pr-12">
            <div className="mb-4 grid size-11 place-items-center rounded-lg bg-[#d71920] text-white"><Database className="size-5" /></div>
            <p className="mb-2 text-[10px] font-bold tracking-[0.14em] text-red-300">WORKSPACE / IMPORT</p>
            <DialogTitle className="font-[family-name:var(--display)] text-3xl font-black leading-[1.02] tracking-[-0.04em]">TIẾP TỤC WORKSPACE NÀY?</DialogTitle>
            <DialogDescription className="mt-3 leading-6 text-white/62">Bạn đang có dữ liệu được lưu trên thiết bị này.</DialogDescription>
          </DialogHeader>
          <div className="border-y border-white/12 bg-white/5 px-6 py-4 text-sm text-white/78"><ul className="space-y-2"><li>{state?.todos.length ?? 0} công việc</li><li>{state?.focusSessions.length ?? 0} phiên tập trung</li><li>Cài đặt Pomodoro</li></ul>{status === 'error' ? <p className="mt-4 text-sm leading-6 text-red-200" role="alert">Chưa thể nhập đủ dữ liệu. Dữ liệu trên thiết bị vẫn an toàn. Thử lại.</p> : null}</div>
          <DialogFooter className="m-0 border-0 bg-transparent p-6"><Button type="button" variant="outline" disabled={status === 'migrating'} onClick={keepSeparate} className="h-11 border-white/18 bg-transparent text-white hover:bg-white hover:text-black">GIỮ RIÊNG</Button><Button type="button" disabled={status === 'migrating'} onClick={() => void migrate()} className="h-11 bg-[#d71920] text-white hover:bg-[#ed252c]">{status === 'migrating' ? 'ĐANG NHẬP...' : 'NHẬP VÀO TÀI KHOẢN'}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}