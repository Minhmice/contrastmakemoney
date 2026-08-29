export type PanelKind = 'tasks' | 'audio' | 'appearance' | 'notes'

export type PanelLayout = {
  x: number
  y: number
  width: number
  height: number
  open: boolean
}

export const PANEL_STORAGE_KEY = 'contrast:workspace-panels:v2'
export const APPEARANCE_STORAGE_KEY = 'contrast:workspace-appearance:v1'

export const DEFAULT_TASK_PANEL: PanelLayout = {
  x: 24,
  y: 96,
  width: 360,
  height: 520,
  open: true,
}

export const DEFAULT_TOOL_PANELS: Record<Exclude<PanelKind, 'tasks'>, PanelLayout> = {
  audio: { x: 24, y: 132, width: 360, height: 220, open: false },
  appearance: { x: 408, y: 96, width: 350, height: 470, open: false },
  notes: { x: 782, y: 96, width: 350, height: 470, open: false },
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

export function clampPanel(layout: PanelLayout, viewportWidth: number, viewportHeight: number): PanelLayout {
  const width = clamp(layout.width, 300, Math.min(560, viewportWidth - 24))
  const height = clamp(layout.height, 300, Math.min(720, viewportHeight - 24))
  return {
    ...layout,
    width,
    height,
    x: clamp(layout.x, 12, viewportWidth - width - 12),
    y: clamp(layout.y, 12, viewportHeight - height - 12),
  }
}

export function readStoredValue<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback
  } catch {
    return fallback
  }
}

export function writeStoredValue(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}
