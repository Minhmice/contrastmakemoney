'use client'
import { useAuth } from '@/app/auth-context'
import MenuPage from '@/components/pages/MenuPage'
export default function Page() { const user = useAuth()
  return <MenuPage user={user} /> }