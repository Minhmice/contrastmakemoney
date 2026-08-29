'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type AuthState = {
  user: User | null
  isLoading: boolean
}

const AuthContext = createContext<AuthState>({ user: null, isLoading: true })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    const updateUser = (nextUser: User | null) => {
      if (!isMounted) return
      setUser(nextUser)
      setIsLoading(false)
    }

    const fallback = window.setTimeout(() => updateUser(null), 1200)
    void supabase.auth
      .getUser()
      .then(({ data }) => updateUser(data.user))
      .catch(() => updateUser(null))
    const { data } = supabase.auth.onAuthStateChange((_, session) =>
      updateUser(session?.user ?? null),
    )

    return () => {
      isMounted = false
      window.clearTimeout(fallback)
      data.subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext).user
export const useAuthLoading = () => useContext(AuthContext).isLoading
