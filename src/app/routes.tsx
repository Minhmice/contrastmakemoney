import type { ComponentType } from 'react'
import type { User } from '@supabase/supabase-js'
import AuthPage from '@/pages/AuthPage'
import HomePage from '@/pages/HomePage/HomePage'
import MenuPage from '@/pages/MenuPage'
import ProfilePage from '@/pages/ProfilePage'
import StaffCheckInPage from '@/pages/StaffCheckInPage'
import WorkspacePage from '@/pages/WorkspacePage'
import { matchesRoute } from './route-match'

type PageProps = { user: User | null }

export function getPageForPath(pathname: string): ComponentType<PageProps> {
  if (matchesRoute(pathname, '/auth')) return AuthPage
  if (matchesRoute(pathname, '/profile')) return ProfilePage
  if (matchesRoute(pathname, '/staff/check-in')) return StaffCheckInPage
  if (matchesRoute(pathname, '/menu')) return MenuPage
  if (matchesRoute(pathname, '/workspace')) return WorkspacePage
  return HomePage
}
