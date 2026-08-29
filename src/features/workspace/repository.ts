import {
  addTask,
  importFocusSession,
  importWorkspaceTodo,
  loadPomodoroPreferences,
  loadTasks,
  recordFocusSession,
  savePomodoroPreferences,
  setTaskDone,
  type PomodoroPreferences,
  type WorkspaceTask,
} from '@/features/user-data/api'
import { migrateLocalAttendance } from '@/features/user-data/migration'
import {
  GuestWorkspaceStorage,
  GUEST_FOCUS_SESSION_LIMIT,
  type StorageLike,
} from './guest-storage'
import type { WorkspaceMode } from './model'

export interface WorkspaceRepository {
  readonly mode: WorkspaceMode
  getTodos(): Promise<WorkspaceTask[]>
  createTodo(title: string, sortOrder: number): Promise<WorkspaceTask>
  updateTodo(id: string, done: boolean): Promise<void>
  getPreferences(): Promise<PomodoroPreferences>
  savePreferences(preferences: PomodoroPreferences): Promise<void>
  saveFocusSession(durationSeconds: number, startedAt: string): Promise<void>
  importTodo?(
    todo: WorkspaceTask & { sourceId: string; createdAt: string },
  ): Promise<void>
  importSession?(session: {
    id: string
    startedAt: string
    completedAt: string
    durationSeconds: number
  }): Promise<void>
}

export function createGuestWorkspaceRepository(
  storage?: StorageLike,
): WorkspaceRepository {
  const guestStorage = new GuestWorkspaceStorage(storage)

  return {
    mode: 'guest',
    async getTodos() {
      return guestStorage.read().todos
    },
    async createTodo(title, sortOrder) {
      const state = guestStorage.read()
      const now = new Date().toISOString()
      const todo = {
        id: crypto.randomUUID(),
        title,
        done: false,
        sort_order: sortOrder,
        createdAt: now,
        updatedAt: now,
      }
      guestStorage.write({ ...state, todos: [...state.todos, todo] })
      return todo
    },
    async updateTodo(id, done) {
      const state = guestStorage.read()
      const updatedAt = new Date().toISOString()
      guestStorage.write({
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === id ? { ...todo, done, updatedAt } : todo,
        ),
      })
    },
    async getPreferences() {
      return guestStorage.read().preferences
    },
    async savePreferences(preferences) {
      const state = guestStorage.read()
      guestStorage.write({ ...state, preferences })
    },
    async saveFocusSession(durationSeconds, startedAt) {
      const state = guestStorage.read()
      const session = {
        id: crypto.randomUUID(),
        startedAt,
        completedAt: new Date().toISOString(),
        durationSeconds,
      }
      guestStorage.write({
        ...state,
        focusSessions: [...state.focusSessions, session].slice(
          -GUEST_FOCUS_SESSION_LIMIT,
        ),
      })
    },
  }
}

export function createAccountWorkspaceRepository(userId: string): WorkspaceRepository {
  return {
    mode: 'account',
    async getTodos() {
      await migrateLocalAttendance()
      return loadTasks()
    },
    createTodo: (title, sortOrder) => addTask(userId, title, sortOrder),
    updateTodo: setTaskDone,
    getPreferences: loadPomodoroPreferences,
    savePreferences: (preferences) => savePomodoroPreferences(userId, preferences),
    saveFocusSession: (durationSeconds, startedAt) =>
      recordFocusSession(userId, durationSeconds, startedAt),
    importTodo: (todo) => importWorkspaceTodo(userId, todo),
    importSession: (session) => importFocusSession(userId, session),
  }
}
