import AuthPage from '@/pages/AuthPage'
import HomePage from '@/pages/HomePage/HomePage'
import MenuPage from '@/pages/MenuPage'
import ProfilePage from '@/pages/ProfilePage'
import WorkspacePage from '@/pages/WorkspacePage'

export function getPageForPath(pathname: string) {
  if (pathname.startsWith('/auth')) return AuthPage
  if (pathname.startsWith('/profile')) return ProfilePage
  if (pathname.startsWith('/menu')) return MenuPage
  if (pathname.startsWith('/workspace')) return WorkspacePage
  return HomePage
}
