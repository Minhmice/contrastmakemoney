import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { X } from 'lucide-react'
import { createDrinkOrder } from '@/features/user-data/api'
import { NoiseBg } from '@/components/visual/NoiseBg'
import { SiteNav } from '@/components/nav/SiteNav'
import { Card, CardContent } from '@/components/ui/card'
import { MENU_CATEGORIES, type MenuCategory, type MenuProduct, type MenuSize } from '@/data/menu'

gsap.registerPlugin(ScrollTrigger)

const money = new Intl.NumberFormat('vi-VN')
const price = (value: number) => money.format(value) + 'K'
const sizes = (product: MenuProduct) => (Object.keys(product.prices) as MenuSize[]).filter((size) => product.prices[size] !== undefined)

function ProductImage({ product }: { product: MenuProduct }) {
  if (!product.image) return null
  return <span className="menu-product-image"><img src={product.image} alt="" loading="lazy" />{product.imageHover ? <img className="menu-product-image__hover" src={product.imageHover} alt="" loading="lazy" /> : null}</span>
}

function ProductCard({ product, selected, onToggle }: { product: MenuProduct; selected: boolean; onToggle: (product: MenuProduct) => void }) {
  const detailId = 'menu-detail-' + product.id
  return <Card className="menu-product-shell" data-product-id={product.id} data-selected={selected || undefined}><button type="button" className="menu-product-card" onClick={() => onToggle(product)} aria-expanded={selected} aria-controls={detailId}><span className="menu-product-card__indicator" aria-hidden="true" /><span className="menu-product-card__visual"><ProductImage product={product} /></span><CardContent className="menu-product-card__body"><span className="menu-product-card__name">{product.nameVi}</span><span className="menu-product-card__english">{product.nameEn}</span><span className="menu-product-card__price">{sizes(product).map((size) => price(product.prices[size] ?? 0)).join(' / ')}</span><span className="menu-product-card__detail">XEM CHI TIẾT →</span></CardContent></button></Card>
}

function InlineDetail({ product, selectedSize, onSize, onClose, onOrder, pending }: { product: MenuProduct; selectedSize: MenuSize; onSize: (size: MenuSize) => void; onClose: () => void; onOrder: () => void; pending: boolean }) {
  const detailRef = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    if (!detailRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const content = detailRef.current.querySelector('.menu-inline-detail__content')
    const timeline = gsap.timeline({ onComplete: () => ScrollTrigger.refresh() })
    timeline.fromTo(detailRef.current, { width: 0, opacity: 0, clipPath: 'inset(0 100% 0 0)' }, { width: 'clamp(21rem, 30vw, 24rem)', opacity: 1, clipPath: 'inset(0 0 0 0)', duration: .42, ease: 'power3.out' })
    if (content) timeline.fromTo(content, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: .18, ease: 'power3.out' }, '-=.18')
    return () => { timeline.kill() }
  }, [])
  return <article ref={detailRef} id={'menu-detail-' + product.id} className="menu-inline-detail" data-detail-for={product.id}><button type="button" className="menu-inline-detail__close" onClick={onClose} aria-label="Close product details"><X size={18} /></button><div className="menu-inline-detail__content"><header><h3>{product.nameVi}</h3><p className="menu-inline-detail__english">{product.nameEn}</p><p className="menu-inline-detail__notes">{product.characteristics.join(' · ')}</p><p className="menu-inline-detail__description">{product.description}</p></header><fieldset className="menu-size-selector"><legend>SIZE</legend><div>{sizes(product).map((size) => <button type="button" key={size} data-selected={size === selectedSize || undefined} aria-pressed={size === selectedSize} onClick={() => onSize(size)}><span>{size}</span><strong>{price(product.prices[size] ?? 0)}</strong></button>)}</div></fieldset><button type="button" className="menu-inline-detail__order" onClick={onOrder} disabled={pending}>{pending ? 'ĐANG LƯU...' : 'ORDER - ' + price(product.prices[selectedSize] ?? 0)} <span>→</span></button></div></article>
}

function CategoryChapter({ category, selectedProductId, selectedSize, onToggle, onSize, onClose, onOrder, pending }: { category: MenuCategory; selectedProductId: string | null; selectedSize: MenuSize | null; onToggle: (product: MenuProduct) => void; onSize: (size: MenuSize) => void; onClose: () => void; onOrder: () => void; pending: boolean }) {
  return <section className="menu-chapter" data-category={category.id} data-theme={category.theme}><div className="menu-chapter__rail">{category.sideLabel}</div><div className="menu-chapter__main"><header className="menu-chapter__head"><span aria-hidden="true" /><h2>{category.name}</h2><i aria-hidden="true" /></header><div className="menu-chapter__products">{category.products.map((product) => <div className="menu-product-pair" key={product.id}><ProductCard product={product} selected={selectedProductId === product.id} onToggle={onToggle} />{selectedProductId === product.id && selectedSize ? <InlineDetail product={product} selectedSize={selectedSize} onSize={onSize} onClose={onClose} onOrder={onOrder} pending={pending} /> : null}</div>)}</div></div></section>
}

export default function MenuPage({ user }: { user: User | null }) {
  const sceneRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<ScrollTrigger | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<MenuSize | null>(null)
  const [activeCategory, setActiveCategory] = useState(MENU_CATEGORIES[0]?.id ?? '')
  const [orderPending, setOrderPending] = useState(false)
  const [orderMessage, setOrderMessage] = useState('')
  useEffect(() => { document.documentElement.classList.add('menu-route'); return () => document.documentElement.classList.remove('menu-route') }, [])
  useLayoutEffect(() => {
    const scene = sceneRef.current
    const track = trackRef.current
    if (!scene || !track || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth)
      const tween = gsap.to(track, { x: () => -getDistance(), ease: 'none', scrollTrigger: { trigger: scene, start: 'top top', end: () => '+=' + getDistance(), pin: true, scrub: .8, anticipatePin: 1, invalidateOnRefresh: true, onUpdate: () => { const center = -gsap.getProperty(track, 'x') + window.innerWidth / 2; const chapters = [...track.querySelectorAll<HTMLElement>('[data-category]')]; const nearest = chapters.reduce((best, chapter) => Math.abs(chapter.offsetLeft + chapter.offsetWidth / 2 - center) < Math.abs(best.offsetLeft + best.offsetWidth / 2 - center) ? chapter : best, chapters[0]); const id = nearest?.dataset.category; if (id) setActiveCategory((current) => current === id ? current : id) } } })
      triggerRef.current = tween.scrollTrigger ?? null
    }, scene)
    return () => { triggerRef.current = null; ctx.revert() }
  }, [selected])
  const toggle = (product: MenuProduct) => { if (selected === product.id) { setSelected(null); setSelectedSize(null) } else { setSelected(product.id); setSelectedSize(sizes(product)[0] ?? 'M') } }
  const goToCategory = (id: string) => { const trigger = triggerRef.current; const chapter = trackRef.current?.querySelector<HTMLElement>('[data-category="' + id + '"]'); if (!trigger || !chapter) return; const distance = Math.max(1, (trackRef.current?.scrollWidth ?? 0) - window.innerWidth); const progress = Math.min(1, chapter.offsetLeft / distance); window.scrollTo({ top: trigger.start + (trigger.end - trigger.start) * progress, behavior: 'smooth' }) }
  const order = async () => { if (!user) { window.location.assign('/auth'); return } const product = MENU_CATEGORIES.flatMap((category) => category.products).find((item) => item.id === selected); if (!product || !selectedSize || orderPending) return; setOrderPending(true); setOrderMessage(''); try { await createDrinkOrder(user.id, { id: product.id, name: product.nameVi, size: selectedSize, price: product.prices[selectedSize] ?? 0 }); setOrderMessage('ĐÃ LƯU ORDER.'); setSelected(null); setSelectedSize(null) } catch { setOrderMessage('KHÔNG THỂ LƯU ORDER. THỬ LẠI.') } finally { setOrderPending(false) } }
  return <div className="menu-experience"><NoiseBg /><a className="menu-skip" href="#menu-scene">Nhảy tới thực đơn</a><SiteNav current="menu" /><main className="menu-stage">{orderMessage ? <p className="menu-order-message" role="status">{orderMessage}</p> : null}<nav className="menu-journey-nav" aria-label="Danh mục menu">{MENU_CATEGORIES.map((category) => <button type="button" key={category.id} data-active={activeCategory === category.id || undefined} onClick={() => goToCategory(category.id)}>{category.name}</button>)}</nav><section ref={sceneRef} id="menu-scene" className="menu-horizontal-scene"><div className="menu-horizontal-viewport"><div ref={trackRef} className="menu-horizontal-track">{MENU_CATEGORIES.map((category) => <CategoryChapter key={category.id} category={category} selectedProductId={selected} selectedSize={selectedSize} onToggle={toggle} onSize={setSelectedSize} onClose={() => { setSelected(null); setSelectedSize(null) }} onOrder={order} pending={orderPending} />)}</div></div></section></main></div>
}