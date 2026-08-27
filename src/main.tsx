import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './nav.css'
import './auth.css'
import './profile.css'
import './menu.css'
import './workspace.css'
import App from './App.tsx'
import AuthPage from './AuthPage.tsx'
import MenuPage from './MenuPage.tsx'
import ProfilePage from './ProfilePage.tsx'
import WorkspacePage from './WorkspacePage.tsx'
import GlobalMotion from './GlobalMotion.tsx'

const noiseImage = new Image()
noiseImage.src = '/textures/noise.png'
noiseImage.onload = () => {
  document.documentElement.classList.add('noise-ready')
}
noiseImage.onerror = () => {
  document.documentElement.classList.add('noise-ready')
}

const path = window.location.pathname
const Page = path.startsWith('/auth')
  ? AuthPage
  : path.startsWith('/profile')
    ? ProfilePage
    : path.startsWith('/menu')
      ? MenuPage
      : path.startsWith('/workspace')
        ? WorkspacePage
        : App

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalMotion>
      <Page />
    </GlobalMotion>
  </StrictMode>,
)
