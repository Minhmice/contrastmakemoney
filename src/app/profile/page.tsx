'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, useAuthLoading } from '@/app/auth-context'
import ProfilePage from '@/legacy-pages/ProfilePage'

export default function Page() {
  const user = useAuth()
  const isLoading = useAuthLoading()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) router.replace('/auth')
  }, [isLoading, router, user])

  if (isLoading || !user) return null

  return <ProfilePage user={user} />
}