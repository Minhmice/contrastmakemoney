import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/global.css'
import '@/styles/home.css'
import '@/styles/noise.css'
import '@/styles/nav.css'
import '@/styles/auth.css'
import '@/styles/profile.css'
import '@/styles/menu.css'
import '@/styles/workspace.css'
import GlobalMotion from './GlobalMotion'
import { getPageForPath } from './routes'
import { getAuthRouteDecision, isProtectedRoute } from '@/features/auth/route'
import { supabase } from '@/lib/supabase'
import { isCurrentUserStaff } from '@/features/user-data/api'

const noiseImage = new Image()
noiseImage.src = '/textures/noise.png'
noiseImage.onload = () => {
  document.documentElement.classList.add('noise-ready')
}
noiseImage.onerror = () => {
  document.documentElement.classList.add('noise-ready')
}

async function start() {
  const { data, error } = await supabase.auth.getUser()
  if (error && isProtectedRoute(window.location.pathname)) {
    window.location.replace('/auth')
    return
  }

  const user = data.user
  if (user) { const staff = await isCurrentUserStaff(); if (staff && !window.location.pathname.startsWith('/staff')) { window.location.replace('/staff/check-in'); return } if (!staff && window.location.pathname.startsWith('/staff')) { window.location.replace('/workspace'); return } }

  const decision = getAuthRouteDecision(window.location.pathname, Boolean(user))
  if (decision !== 'allow') {
    window.location.replace(decision)
    return
  }

  const Page = getPageForPath(window.location.pathname)
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <GlobalMotion>
        <Page user={user} />
      </GlobalMotion>
    </StrictMode>,
  )

  supabase.auth.onAuthStateChange((event, session) => {
    const nextDecision = getAuthRouteDecision(window.location.pathname, Boolean(session?.user))
    if (nextDecision !== 'allow' && (event === 'SIGNED_IN' || event === 'SIGNED_OUT')) {
      window.location.replace(nextDecision)
    }
  })
}

void start()
