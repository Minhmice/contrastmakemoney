import { matchesRoute } from '../../app/route-match'

export type AuthRouteDecision = 'allow' | '/auth' | '/workspace'

export const isProtectedRoute = (pathname: string) =>
  matchesRoute(pathname, '/profile') || matchesRoute(pathname, '/staff')

export function getAuthRouteDecision(
  pathname: string,
  isAuthenticated: boolean,
): AuthRouteDecision {
  if (isProtectedRoute(pathname) && !isAuthenticated) return '/auth'
  if (matchesRoute(pathname, '/auth') && isAuthenticated) return '/workspace'
  return 'allow'
}
