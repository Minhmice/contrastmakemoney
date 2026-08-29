import {
  createEmptyGuestWorkspaceState,
  GuestWorkspaceStorage,
  type GuestWorkspaceState,
  type StorageLike,
} from './guest-storage.ts'
import type { WorkspaceRepository } from './repository.ts'

export type WorkspaceMigrationStatus =
  'idle' | 'detecting' | 'ready' | 'migrating' | 'success' | 'error'

export const hasMeaningfulGuestWorkspace = (state: GuestWorkspaceState) =>
  state.todos.length > 0 ||
  state.focusSessions.length > 0 ||
  JSON.stringify(state.preferences) !==
    JSON.stringify(createEmptyGuestWorkspaceState().preferences)

export function inspectGuestWorkspace(storage: StorageLike) {
  const state = new GuestWorkspaceStorage(storage).read()
  return hasMeaningfulGuestWorkspace(state) ? state : null
}

export async function migrateGuestWorkspace(
  state: GuestWorkspaceState,
  account: WorkspaceRepository,
) {
  if (!account.importTodo || !account.importSession)
    throw new Error('Account import unavailable')
  for (const todo of state.todos) await account.importTodo({ ...todo, sourceId: todo.id })
  for (const session of state.focusSessions) await account.importSession(session)
  await account.savePreferences(state.preferences)
}

export async function migrateAndClearGuestWorkspace(
  storage: StorageLike,
  account: WorkspaceRepository,
  state: GuestWorkspaceState,
) {
  await migrateGuestWorkspace(state, account)
  new GuestWorkspaceStorage(storage).clear()
}
