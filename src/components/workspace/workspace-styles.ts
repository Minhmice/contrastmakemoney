import type { CSSProperties } from 'react'

export const workspaceColor = {
  ink: '#10110f',
  paper: '#f3f1ea',
  paperMuted: '#e7e4db',
  red: '#e01920',
  line: 'rgba(16, 17, 15, 0.18)',
  lineDark: 'rgba(243, 241, 234, 0.22)',
  muted: '#6a6962',
} as const

export const workspaceControl = (tone: 'ink' | 'red' | 'paper' = 'ink'): CSSProperties => ({
  minHeight: 44,
  border: tone === 'paper' ? `1px solid ${workspaceColor.ink}` : '1px solid transparent',
  borderRadius: 0,
  background: tone === 'red' ? workspaceColor.red : tone === 'paper' ? workspaceColor.paper : workspaceColor.ink,
  color: tone === 'paper' ? workspaceColor.ink : workspaceColor.paper,
  fontSize: 11,
  fontWeight: 800,
  letterSpacing: '0.08em',
  padding: '0 14px',
})

export const eyebrow: CSSProperties = {
  margin: 0,
  color: workspaceColor.red,
  fontSize: 10,
  fontWeight: 900,
  letterSpacing: '0.15em',
}

export const fieldStyle: CSSProperties = {
  width: '100%',
  minWidth: 0,
  minHeight: 44,
  border: `1px solid ${workspaceColor.ink}`,
  borderRadius: 0,
  background: workspaceColor.paper,
  color: workspaceColor.ink,
}
