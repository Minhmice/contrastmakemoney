import { matchesRoute } from '../../app/route-match'
import { getAuthRouteDecision, isProtectedRoute } from './route'

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message)
}

assert(getAuthRouteDecision('/', false) === 'allow', 'anonymous public route allowed')
assert(
  getAuthRouteDecision('/workspace', false) === 'allow',
  'anonymous workspace allowed',
)
assert(
  getAuthRouteDecision('/profile/settings', false) === '/auth',
  'anonymous nested profile redirected',
)
assert(
  getAuthRouteDecision('/auth', true) === '/workspace',
  'authenticated auth route redirected',
)
assert(
  getAuthRouteDecision('/workspace', true) === 'allow',
  'authenticated workspace allowed',
)
assert(
  !isProtectedRoute('/workspace-preview'),
  'similarly named public route stays public',
)
assert(
  getAuthRouteDecision('/authenticate', true) === 'allow',
  'similarly named auth route stays public',
)
assert(
  matchesRoute('/menu/drinks', '/menu') && !matchesRoute('/menu-preview', '/menu'),
  'page routes use exact boundaries',
)
