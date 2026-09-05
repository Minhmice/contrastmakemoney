import { ArrowLeft, ArrowUpRight, Cloud, HardDrive, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getAccountAuthHref } from '@/features/workspace/model'

type WorkspaceHeaderProps = {
  mode: 'guest' | 'account'
  status: 'idle' | 'saving' | 'saved' | 'error'
  completedWork: number
}

export function WorkspaceHeader({ mode, status, completedWork }: WorkspaceHeaderProps) {
  const guest = mode === 'guest'
  const message = guest
    ? 'LƯU TRÊN THIẾT BỊ'
    : status === 'error'
      ? 'CHƯA ĐỒNG BỘ'
      : status === 'saving'
        ? 'ĐANG LƯU'
        : 'ĐÃ ĐỒNG BỘ'
  const Icon = guest ? HardDrive : status === 'saving' ? LoaderCircle : Cloud

  return (
    <header className="workspace-header">
      <Button
        render={<a href="/" aria-label="Về trang chủ" />}
        nativeButton={false}
        className="workspace-ctrl-paper"
        style={{ width: 44, height: 44, padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <ArrowLeft size={18} />
      </Button>

      <div className="workspace-header__brand">
        <strong className="workspace-header__logo">CONTRAST</strong>
        <span className="workspace-header__sub">FOCUS DESK</span>
      </div>

      <div className="workspace-header__status" aria-live="polite">
        <span style={{ display: 'inline-flex', gap: 6, alignItems: 'center', color: '#f3f1ea' }}>
          <Icon size={13} className={status === 'saving' ? 'animate-spin' : undefined} />
          {message}
        </span>
        <span style={{ color: 'rgba(243,241,234,.65)' }}>
          {completedWork} PHIÊN XONG
        </span>
        {guest ? (
          <Button
            render={<a href={getAccountAuthHref('sync')} />}
            nativeButton={false}
            className="workspace-ctrl-red"
            style={{
              minHeight: 28,
              marginTop: 2,
              fontSize: 10,
              padding: '0 8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            ĐỒNG BỘ <ArrowUpRight size={12} />
          </Button>
        ) : null}
      </div>
    </header>
  )
}

