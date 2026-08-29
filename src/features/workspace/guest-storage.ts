import type { PomodoroPreferences, WorkspaceTask } from '@/features/user-data/api'

export const GUEST_WORKSPACE_STORAGE_KEY = 'contrast.workspace.guest.v1'
export const GUEST_WORKSPACE_STORAGE_VERSION = 1 as const
export const GUEST_FOCUS_SESSION_LIMIT = 250

export type GuestWorkspaceTodo = WorkspaceTask & {
  createdAt: string
  updatedAt: string
}

export type GuestFocusSession = {
  id: string
  startedAt: string
  completedAt: string
  durationSeconds: number
}

export type GuestWorkspaceState = {
  version: typeof GUEST_WORKSPACE_STORAGE_VERSION
  todos: GuestWorkspaceTodo[]
  preferences: PomodoroPreferences
  focusSessions: GuestFocusSession[]
}

const DEFAULT_PREFERENCES: PomodoroPreferences = {
  work_minutes: 25,
  short_break_minutes: 5,
  long_break_minutes: 15,
}

export const createEmptyGuestWorkspaceState = (): GuestWorkspaceState => ({
  version: GUEST_WORKSPACE_STORAGE_VERSION,
  todos: [],
  preferences: { ...DEFAULT_PREFERENCES },
  focusSessions: [],
})

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)
const isDateString = (value: unknown): value is string =>
  typeof value === 'string' && !Number.isNaN(Date.parse(value))

export function normalizeGuestWorkspaceState(value: unknown): GuestWorkspaceState {
  if (!isRecord(value) || value.version !== GUEST_WORKSPACE_STORAGE_VERSION) {
    return createEmptyGuestWorkspaceState()
  }

  const preferences = isRecord(value.preferences) ? value.preferences : {}
  const todos = Array.isArray(value.todos)
    ? value.todos.flatMap((todo, index): GuestWorkspaceTodo[] => {
        if (
          !isRecord(todo) ||
          typeof todo.id !== 'string' ||
          typeof todo.title !== 'string'
        )
          return []
        const createdAt = isDateString(todo.createdAt)
          ? todo.createdAt
          : new Date(0).toISOString()
        return [
          {
            id: todo.id,
            title: todo.title,
            done: typeof todo.done === 'boolean' ? todo.done : false,
            sort_order: isFiniteNumber(todo.sort_order) ? todo.sort_order : index,
            createdAt,
            updatedAt: isDateString(todo.updatedAt) ? todo.updatedAt : createdAt,
          },
        ]
      })
    : []
  const focusSessions = Array.isArray(value.focusSessions)
    ? value.focusSessions
        .flatMap((session): GuestFocusSession[] => {
          if (
            !isRecord(session) ||
            typeof session.id !== 'string' ||
            !isDateString(session.startedAt) ||
            !isDateString(session.completedAt) ||
            !isFiniteNumber(session.durationSeconds)
          )
            return []
          return [
            {
              id: session.id,
              startedAt: session.startedAt,
              completedAt: session.completedAt,
              durationSeconds: session.durationSeconds,
            },
          ]
        })
        .slice(-GUEST_FOCUS_SESSION_LIMIT)
    : []

  return {
    version: GUEST_WORKSPACE_STORAGE_VERSION,
    todos,
    preferences: {
      work_minutes: isFiniteNumber(preferences.work_minutes)
        ? preferences.work_minutes
        : DEFAULT_PREFERENCES.work_minutes,
      short_break_minutes: isFiniteNumber(preferences.short_break_minutes)
        ? preferences.short_break_minutes
        : DEFAULT_PREFERENCES.short_break_minutes,
      long_break_minutes: isFiniteNumber(preferences.long_break_minutes)
        ? preferences.long_break_minutes
        : DEFAULT_PREFERENCES.long_break_minutes,
    },
    focusSessions,
  }
}

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

export class GuestWorkspaceStorage {
  private memory = createEmptyGuestWorkspaceState()
  private loaded = false

  private readonly storage?: StorageLike

  constructor(storage?: StorageLike) {
    this.storage = storage
  }

  read(): GuestWorkspaceState {
    if (this.loaded) return this.memory
    this.loaded = true
    if (!this.storage) return this.memory
    try {
      const raw = this.storage.getItem(GUEST_WORKSPACE_STORAGE_KEY)
      this.memory = raw ? normalizeGuestWorkspaceState(JSON.parse(raw)) : this.memory
    } catch (error) {
      if (process.env.NODE_ENV !== 'production')
        console.warn('Guest Workspace storage unavailable; using memory.', error)
    }
    return this.memory
  }

  clear() {
    this.memory = createEmptyGuestWorkspaceState()
    this.loaded = true
    try {
      this.storage?.removeItem(GUEST_WORKSPACE_STORAGE_KEY)
    } catch (error) {
      if (process.env.NODE_ENV !== 'production')
        console.warn('Guest Workspace storage clear failed.', error)
    }
  }

  write(state: GuestWorkspaceState) {
    this.memory = normalizeGuestWorkspaceState(state)
    this.loaded = true
    try {
      this.storage?.setItem(GUEST_WORKSPACE_STORAGE_KEY, JSON.stringify(this.memory))
    } catch (error) {
      if (process.env.NODE_ENV !== 'production')
        console.warn('Guest Workspace storage write failed; using memory.', error)
    }
  }
}
