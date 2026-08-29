'use client'
import { useAuth } from '@/app/auth-context'
import SpacePage from '@/legacy-pages/SpacePage'
export default function Page() { const user = useAuth()
  return <SpacePage user={user} /> }
