'use client'
import { useEffect } from 'react'
import GlobalMotion from './GlobalMotion'
import { AuthProvider } from './auth-context'
export default function ClientShell({ children }: Readonly<{ children: React.ReactNode }>) { useEffect(() => { const image = new Image(); image.src = '/textures/noise.png'; image.onload = image.onerror = () => document.documentElement.classList.add('noise-ready') }, []); return <AuthProvider><GlobalMotion>{children}</GlobalMotion></AuthProvider> }
