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

const noiseImage = new Image()
noiseImage.src = '/textures/noise.png'
noiseImage.onload = () => {
  document.documentElement.classList.add('noise-ready')
}
noiseImage.onerror = () => {
  document.documentElement.classList.add('noise-ready')
}

const Page = getPageForPath(window.location.pathname)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalMotion>
      <Page />
    </GlobalMotion>
  </StrictMode>,
)
