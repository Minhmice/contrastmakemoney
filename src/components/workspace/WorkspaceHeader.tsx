import { ArrowLeft, ArrowUpRight, Cloud, HardDrive, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getAccountAuthHref } from '@/features/workspace/model'
import { workspaceColor, workspaceControl } from './workspace-styles'

type WorkspaceHeaderProps = {
  mode: 'guest' | 'account'
  status: 'idle' | 'saving' | 'saved' | 'error'
  completedWork: number
}

export function WorkspaceHeader({ mode, status, completedWork }: WorkspaceHeaderProps) {
  const guest = mode === 'guest'
  const message = guest ? 'LƯU TRÊN THIẾT BỊ' : status === 'error' ? 'CHƯA ĐỒNG BỘ' : status === 'saving' ? 'ĐANG LƯU' : 'ĐÃ ĐỒNG BỘ'
  const Icon = guest ? HardDrive : status === 'saving' ? LoaderCircle : Cloud

  return <header style={{ display: 'grid', gridTemplateColumns: '44px minmax(0, 1fr) auto', gap: 12, alignItems: 'center', minHeight: 72, padding: '12px clamp(16px, 4vw, 48px)', borderBottom: `1px solid ${workspaceColor.lineDark}`, background: workspaceColor.ink, color: workspaceColor.paper }}>
    <Button render={<a href="/" aria-label="Về trang chủ" />} nativeButton={false} style={{ ...workspaceControl('paper'), width: 44, padding: 0 }}><ArrowLeft size={19} /></Button>
    <div style={{ minWidth: 0 }}><strong style={{ display: 'block', fontSize: 18, letterSpacing: '-0.04em' }}>CONTRAST</strong><span style={{ display: 'block', color: 'rgba(243,241,234,.72)', fontSize: 10, fontWeight: 800, letterSpacing: '0.14em' }}>FOCUS DESK</span></div>
    <div aria-live="polite" style={{ display: 'grid', justifyItems: 'end', gap: 3, minWidth: 0, textAlign: 'right' }}><span style={{ display: 'inline-flex', gap: 5, alignItems: 'center', fontSize: 10, fontWeight: 800, letterSpacing: '0.08em' }}><Icon size={13} className={status === 'saving' ? 'animate-spin' : undefined} />{message}</span><span style={{ color: 'rgba(243,241,234,.72)', fontSize: 10, fontWeight: 700 }}>{completedWork} PHIÊN XONG</span>{guest ? <Button render={<a href={getAccountAuthHref('sync')} />} nativeButton={false} style={{ ...workspaceControl('red'), minHeight: 30, marginTop: 3, fontSize: 9, padding: '0 9px' }}>ĐỒNG BỘ <ArrowUpRight size={13} /></Button> : null}</div>
  </header>
}
