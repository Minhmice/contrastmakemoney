export type WorkspaceMode = 'guest' | 'account'

export type WorkspaceCapabilities = {
  pomodoro: true
  todo: true
  focusSession: true
  cloudSync: boolean
  checkIn: boolean
  accountHistory: boolean
}

export const getWorkspaceMode = (hasUser: boolean): WorkspaceMode =>
  hasUser ? 'account' : 'guest'

export const getWorkspaceCapabilities = (mode: WorkspaceMode): WorkspaceCapabilities => ({
  pomodoro: true,
  todo: true,
  focusSession: true,
  cloudSync: mode === 'account',
  checkIn: mode === 'account',
  accountHistory: mode === 'account',
})

export type AccountIntent = 'sync' | 'check-in' | 'history'

export function getAccountAuthHref(intent: AccountIntent) {
  const params = new URLSearchParams({ returnTo: '/workspace', intent })
  return `/auth?${params.toString()}`
}
