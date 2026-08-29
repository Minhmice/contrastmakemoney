import assert from 'node:assert/strict'
import {
  createEmptyGuestWorkspaceState,
  GUEST_WORKSPACE_STORAGE_KEY,
  type GuestWorkspaceState,
} from './guest-storage.ts'
import {
  hasMeaningfulGuestWorkspace,
  inspectGuestWorkspace,
  migrateAndClearGuestWorkspace,
  migrateGuestWorkspace,
} from './migration.ts'
import type { WorkspaceRepository } from './repository.ts'

class MemoryStorage {
  value: string | null = null
  getItem(k: string) {
    return k === GUEST_WORKSPACE_STORAGE_KEY ? this.value : null
  }
  setItem(k: string, v: string) {
    if (k === GUEST_WORKSPACE_STORAGE_KEY) this.value = v
  }
  removeItem(k: string) {
    if (k === GUEST_WORKSPACE_STORAGE_KEY) this.value = null
  }
}
const state: GuestWorkspaceState = {
  ...createEmptyGuestWorkspaceState(),
  todos: [
    {
      id: '11111111-1111-4111-8111-111111111111',
      title: 'Trùng tên',
      done: true,
      sort_order: 0,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:01:00.000Z',
    },
  ],
  preferences: { work_minutes: 42, short_break_minutes: 7, long_break_minutes: 18 },
  focusSessions: [
    {
      id: '22222222-2222-4222-8222-222222222222',
      startedAt: '2026-01-01T00:00:00.000Z',
      completedAt: '2026-01-01T00:42:00.000Z',
      durationSeconds: 2520,
    },
  ],
}
const todos = new Map<string, unknown>(),
  sessions = new Map<string, unknown>()
let preferences = await Promise.resolve(createEmptyGuestWorkspaceState().preferences)
let failSession = true
const account: WorkspaceRepository = {
  mode: 'account',
  getTodos: async () => [],
  createTodo: async () => {
    throw Error()
  },
  updateTodo: async () => {},
  getPreferences: async () => preferences,
  savePreferences: async (p) => {
    preferences = p
  },
  saveFocusSession: async () => {},
  importTodo: async (t) => {
    todos.set(t.sourceId, t)
  },
  importSession: async (s) => {
    if (failSession) throw Error('partial')
    sessions.set(s.id, s)
  },
}
assert.equal(hasMeaningfulGuestWorkspace(createEmptyGuestWorkspaceState()), false)
const storage = new MemoryStorage()
assert.equal(inspectGuestWorkspace(storage), null)
storage.value = JSON.stringify(state)
assert.equal(inspectGuestWorkspace(storage)?.todos.length, 1)
await assert.rejects(migrateAndClearGuestWorkspace(storage, account, state))
assert.notEqual(storage.value, null)
assert.equal(todos.size, 1)
assert.equal(sessions.size, 0)
failSession = false
await migrateAndClearGuestWorkspace(storage, account, state)
assert.equal(storage.value, null)
assert.equal(todos.size, 1)
assert.equal(sessions.size, 1)
assert.equal(preferences.work_minutes, 42)
storage.value = JSON.stringify(state)
await migrateGuestWorkspace(state, account)
assert.equal(todos.size, 1)
assert.equal(sessions.size, 1)
console.log('workspace migration self-check passed')
