import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { BrandLink } from '@/components/shared/BrandLink'
import {
  HOME_MENU_GROUPS,
  HOME_MENU_TABS,
  type HomeMenuItem,
} from '@/pages/HomePage/data'

type MenuPreviewSectionProps = {
  menuGroups?: Record<string, HomeMenuItem[]>
  menuTabs?: string[]
}

export function MenuPreviewSection({
  menuGroups = HOME_MENU_GROUPS,
  menuTabs = HOME_MENU_TABS,
}: MenuPreviewSectionProps) {
  const [selectedTab, setSelectedTab] = useState(menuTabs[0] ?? '')
  const currentItems = menuGroups[selectedTab] ?? []
  const selectedIndex = Math.max(menuTabs.indexOf(selectedTab), 0)

  return (
    <section className="menu-section" id="menu">
      <div className="menu-section__heading">
        <h2>
          COFFEE
          <br />
          <span>FOR THE</span>
          <br />
          NEXT ROUND.
        </h2>
        <div>
          <p>Một buổi làm việc dài vẫn cần những khoảng nghỉ.</p>
          <p>
            Chọn món. Nghỉ một chút.
            <br />
            Rồi quay lại việc đang làm.
          </p>
        </div>
      </div>
      <div className="menu-tabs" role="tablist" aria-label="Danh mục menu">
        {menuTabs.map((item, index) => (
          <button
            type="button"
            key={item}
            role="tab"
            aria-selected={selectedTab === item}
            aria-controls={`menu-panel-${index}`}
            id={`menu-tab-${index}`}
            className={selectedTab === item ? 'is-selected' : ''}
            onClick={() => setSelectedTab(item)}
          >
            {String(index + 1).padStart(2, '0')} / {item}
          </button>
        ))}
      </div>
      <div
        className="menu-list"
        id={`menu-panel-${selectedIndex}`}
        role="tabpanel"
        aria-labelledby={`menu-tab-${selectedIndex}`}
        aria-live="polite"
      >
        {currentItems.map((item, index) => (
          <div className="menu-item" key={item.name}>
            <span className="menu-item__number">0{index + 1}</span>
            <span>
              <strong>{item.name}</strong>
              <small>{item.detail}</small>
            </span>
            <span className="menu-item__price">{item.price}</span>
            <ArrowUpRight size={18} strokeWidth={1.6} aria-hidden="true" />
          </div>
        ))}
      </div>
      <BrandLink className="menu-preview-link" href="/menu">
        XEM FULL MENU
      </BrandLink>
      <span className="menu-placeholder">FULL MENU / PRICES VERIFIED SOON</span>
    </section>
  )
}
