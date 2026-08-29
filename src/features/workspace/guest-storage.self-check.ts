import assert from 'node:assert/strict'
import {
  GuestWorkspaceStorage,
  GUEST_FOCUS_SESSION_LIMIT,
  GUEST_WORKSPACE_STORAGE_KEY,
  createEmptyGuestWorkspaceState,
  normalizeGuestWorkspaceState,
} from './guest-storage.ts'

class MemoryStorage {
  value: string | null = null
  getItem(key: string) {
    return key === GUEST_WORKSPACE_STORAGE_KEY ? this.value : null
  }
  setItem(key: string, value: string) {
    if (key === GUEST_WORKSPACE_STORAGE_KEY) this.value = value
  }
  removeItem(key: string) {
    if (key === GUEST_WORKSPACE_STORAGE_KEY) this.value = null
  }
}
const storage = new MemoryStorage()
const state = createEmptyGuestWorkspaceState()
state.todos.push({
  id: 'todo',
  title: 'Persisted',
  done: true,
  sort_order: 0,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
})
new GuestWorkspaceStorage(storage).write(state)
assert.equal(new GuestWorkspaceStorage(storage).read().todos[0]?.done, true)
storage.value = '{broken'
assert.deepEqual(new GuestWorkspaceStorage(storage).read().todos, [])
assert.equal(
  normalizeGuestWorkspaceState({
    version: 1,
    focusSessions: Array.from({ length: 300 }, (_, id) => ({
      id: String(id),
      startedAt: '2026-01-01T00:00:00.000Z',
      completedAt: '2026-01-01T00:01:00.000Z',
      durationSeconds: 60,
    })),
  }).focusSessions.length,
  GUEST_FOCUS_SESSION_LIMIT,
)
console.log('guest workspace storage self-check passed')
