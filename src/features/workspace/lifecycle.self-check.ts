import assert from 'node:assert/strict'

type Auth = 'loading' | 'guest' | 'account'
type Todo = { id: string; title: string }
type Store = { mode: Auth; todos: Todo[]; guestWrites: number; accountWrites: number; status: 'idle' | 'saving' | 'saved' | 'error' }
const modeFor = (loading: boolean, userId: string | null): Auth => loading ? 'loading' : userId ? 'account' : 'guest'
const createStore = (mode: Auth, todos: Todo[] = []): Store => ({ mode, todos, guestWrites: 0, accountWrites: 0, status: 'idle' })
const switchMode = (store: Store, mode: Auth, todos: Todo[]): Store => ({ ...store, mode, todos, status: mode === 'account' ? 'saved' : 'idle' })
const saveAccount = async (store: Store, fail = false) => { store.status = 'saving'; if (fail) { store.status = 'error'; throw new Error('save failed') }; store.accountWrites++; store.status = 'saved' }

assert.equal(modeFor(true, null), 'loading')
assert.equal(modeFor(false, null), 'guest')
assert.equal(modeFor(false, 'account-id'), 'account')
let workspace = createStore(modeFor(true, null))
assert.deepEqual(workspace.todos, [])
workspace = switchMode(workspace, 'guest', [{ id: 'guest', title: 'Guest' }])
assert.equal(workspace.guestWrites, 0)
workspace = switchMode(workspace, 'account', [{ id: 'account', title: 'Account' }])
assert.deepEqual(workspace.todos, [{ id: 'account', title: 'Account' }])
await saveAccount(workspace)
assert.equal(workspace.accountWrites, 1)
assert.equal(workspace.guestWrites, 0)
workspace = switchMode(workspace, 'account', [{ id: 'account', title: 'Account' }, { id: 'imported', title: 'Imported' }])
assert.equal(workspace.todos[1]?.id, 'imported')
await assert.rejects(saveAccount(workspace, true))
assert.equal(workspace.status, 'error')
workspace = switchMode(workspace, 'guest', [{ id: 'guest', title: 'Guest' }])
assert.deepEqual(workspace.todos, [{ id: 'guest', title: 'Guest' }])
assert.equal(workspace.accountWrites, 1)
console.log('workspace lifecycle self-check passed')
