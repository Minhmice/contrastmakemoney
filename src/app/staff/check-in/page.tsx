'use client'
import { useAuth } from '@/app/auth-context'
import StaffCheckInPage from '@/components/pages/StaffCheckInPage'
export default function Page() { const user = useAuth()
  return <StaffCheckInPage user={user} /> }