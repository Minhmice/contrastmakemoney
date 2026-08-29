'use client'
import { useAuth } from '@/app/auth-context'
import HomePage from '@/legacy-pages/HomePage/HomePage'
export default function Page() { const user = useAuth()
  return <HomePage user={user} /> }