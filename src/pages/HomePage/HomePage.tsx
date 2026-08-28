import { useRef, useState } from 'react'
import { SiteNav } from '@/components/nav/SiteNav'
import { AttendanceTeaserSection } from './sections/AttendanceTeaserSection'
import { CampaignSection } from './sections/CampaignSection'
import { CultureSection } from './sections/CultureSection'
import { FinalCtaSection } from './sections/FinalCtaSection'
import { FocusInterludeSection } from './sections/FocusInterludeSection'
import { HeroSection } from './sections/HeroSection'
import { LocationsSection } from './sections/LocationsSection'
import { ManifestoSection } from './sections/ManifestoSection'
import { MenuPreviewSection } from './sections/MenuPreviewSection'
import { SiteFooter } from './sections/SiteFooter'
import { SpaceSection } from './sections/SpaceSection'
import { TimeSection } from './sections/TimeSection'

export default function HomePage() {
  const [activeLocation, setActiveLocation] = useState(0)
  const [attendanceOpen, setAttendanceOpen] = useState(false)
  const locationsRef = useRef<HTMLElement>(null)

  const scrollToLocations = () => {
    locationsRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="app-shell home-page">
      <a className="skip-link" href="#main-content">
        Bỏ qua đến nội dung chính
      </a>
      <SiteNav spy />

      <main id="main-content">
        <HeroSection onFindLocations={scrollToLocations} />
        <ManifestoSection />
        <TimeSection />
        <SpaceSection />
        <CultureSection />
        <MenuPreviewSection />
        <FocusInterludeSection />
        <LocationsSection
          locationsRef={locationsRef}
          activeLocation={activeLocation}
          onSelectLocation={setActiveLocation}
          onViewAll={scrollToLocations}
        />
        <CampaignSection />
        <FinalCtaSection onFindLocations={scrollToLocations} />
        <AttendanceTeaserSection
          open={attendanceOpen}
          onToggle={() => setAttendanceOpen((open) => !open)}
        />
      </main>

      <SiteFooter />
    </div>
  )
}
