import type { RefObject } from 'react'
import { ArrowUpRight, MapPin, MoveUpRight } from 'lucide-react'
import { LOCATIONS, type Location } from '@/data/locations'

type LocationsSectionProps = {
  locationsRef: RefObject<HTMLElement | null>
  locations?: Location[]
  activeLocation: number
  onSelectLocation: (index: number) => void
  onViewAll: () => void
}

export function LocationsSection({
  locationsRef,
  locations = LOCATIONS,
  activeLocation,
  onSelectLocation,
  onViewAll,
}: LocationsSectionProps) {
  const selectedLocation = locations[activeLocation] ?? locations[0]
  if (!selectedLocation) return null

  return (
    <section className="locations-section" id="locations" ref={locationsRef}>
      <div className="locations-section__heading">
        <h2>
          HÔM NAY
          <br />
          <span>NGỒI ĐÂU?</span>
        </h2>
        <p>
          Mỗi cơ sở có một nhịp riêng để bạn tập trung.
          <br />
          Chọn nơi hợp với việc cần làm hôm nay.
        </p>
      </div>
      <div className="locations-layout">
        <div className="location-list" role="tablist" aria-label="Chọn cơ sở Contrast">
          {locations.map((location, index) => (
            <button
              type="button"
              className={`location-tab${activeLocation === index ? ' is-active' : ''}`}
              key={location.name}
              onClick={() => onSelectLocation(index)}
              role="tab"
              aria-selected={activeLocation === index}
              aria-controls={`location-panel-${index}`}
              id={`location-tab-${index}`}
            >
              <span>0{index + 1}</span>
              <strong>CONTRAST — {location.name}</strong>
              <MoveUpRight size={19} strokeWidth={1.5} aria-hidden="true" />
            </button>
          ))}
        </div>
        <article
          className="location-detail"
          id={`location-panel-${activeLocation}`}
          aria-labelledby={`location-tab-${activeLocation}`}
          aria-live="polite"
        >
          <div className="location-detail__map">
            <div className="map-grid" aria-hidden="true" />
            <MapPin size={31} strokeWidth={1.3} aria-hidden="true" />
            <span>
              CONTRAST
              <br />
              {selectedLocation.name}
            </span>
            <div className="map-coordinates">
              MAP / DIRECTIONS
              <br />
              VERIFIED SOON
            </div>
          </div>
          <div className="location-detail__info">
            <span className="location-detail__eyebrow">
              SELECTED LOCATION / 0{activeLocation + 1}
            </span>
            <h3>{selectedLocation.name}</h3>
            <p>{selectedLocation.note}</p>
            <dl>
              <div>
                <dt>ĐỊA CHỈ</dt>
                <dd>[VERIFIED SOON]</dd>
              </div>
              <div>
                <dt>HÔM NAY</dt>
                <dd>[HOURS VERIFIED SOON]</dd>
              </div>
            </dl>
            <div className="location-detail__actions">
              <span className="location-placeholder">MAP / DIRECTIONS VERIFIED SOON</span>
            </div>
          </div>
        </article>
      </div>
      <button type="button" className="location-all" onClick={onViewAll}>
        XEM TẤT CẢ CƠ SỞ <ArrowUpRight size={16} strokeWidth={1.7} aria-hidden="true" />
      </button>
    </section>
  )
}
