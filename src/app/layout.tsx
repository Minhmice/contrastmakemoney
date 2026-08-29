import type { Metadata } from 'next'
import ClientShell from './client-shell'
import './globals.css'
export const metadata: Metadata = { title: 'Contrast', description: 'Contrast workspace' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="vi"><body><ClientShell>{children}</ClientShell></body></html> }
