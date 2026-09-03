'use client'
import GlobalMotion from './GlobalMotion'
import { AuthProvider } from './auth-context'
export default function ClientShell({ children }: Readonly<{ children: React.ReactNode }>) { return <AuthProvider><GlobalMotion>{children}</GlobalMotion></AuthProvider> }
