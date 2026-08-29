'use client'
import { useAuth } from '@/app/auth-context'
import StaffCheckInPage from '@/legacy-pages/StaffCheckInPage'
export default function Page() { const user = useAuth()
  return <StaffCheckInPage user={user} /> }