import { SiteNav } from '@/components/nav/SiteNav'
import { HomeLoadingScreen } from '@/components/loading/HomeLoadingScreen'
import { FocusInterludeSection } from './sections/FocusInterludeSection'
import { HeroSection } from './sections/HeroSection'
import { ManifestoSection } from './sections/ManifestoSection'
import { MenuPreviewSection } from './sections/MenuPreviewSection'
import { SiteFooter } from './sections/SiteFooter'
import { SpaceSection } from './sections/SpaceSection'
import { TimeSection } from './sections/TimeSection'

export default function HomePage({ user: _user }: { user: import('@supabase/supabase-js').User | null }) {
  return (
    <div className="app-shell home-page">
      <HomeLoadingScreen />
      <a className="skip-link" href="#main-content">
        Bỏ qua đến nội dung chính
      </a>
      <SiteNav spy />

      <main id="main-content">
        <HeroSection onFindLocations={() => window.location.assign('/space')} />
        <ManifestoSection />
        <TimeSection />
        <SpaceSection />
        <MenuPreviewSection />
        <FocusInterludeSection />
      </main>

      <SiteFooter />
    </div>
  )
}
