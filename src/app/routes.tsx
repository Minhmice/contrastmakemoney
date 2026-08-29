import type { ComponentType } from 'react'
import type { User } from '@supabase/supabase-js'
import AuthPage from '@/legacy-pages/AuthPage'
import HomePage from '@/legacy-pages/HomePage/HomePage'
import MenuPage from '@/legacy-pages/MenuPage'
import ProfilePage from '@/legacy-pages/ProfilePage'
import StaffCheckInPage from '@/legacy-pages/StaffCheckInPage'
import SpacePage from '@/legacy-pages/SpacePage'
import WorkspacePage from '@/legacy-pages/WorkspacePage'
import { matchesRoute } from './route-match'

type PageProps = { user: User | null }

export function getPageForPath(pathname: string): ComponentType<PageProps> {
  if (matchesRoute(pathname, '/auth')) return AuthPage
  if (matchesRoute(pathname, '/profile')) return ProfilePage
  if (matchesRoute(pathname, '/staff/check-in')) return StaffCheckInPage
  if (matchesRoute(pathname, '/menu')) return MenuPage
  if (matchesRoute(pathname, '/space')) return SpacePage
  if (matchesRoute(pathname, '/workspace')) return WorkspacePage
  return HomePage
}