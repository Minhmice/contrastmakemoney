import { MENU_CATEGORIES } from '@/data/menu'

export type HomeMenuItem = {
  name: string
  detail: string
  price: string
  image?: string
}

const FEATURED_PRODUCT_IDS = [
  'matcha-kem-muoi',
  'tra-quat-hong-bi',
  'coffee-freeze',
] as const

export const HOME_MENU_FEATURES: HomeMenuItem[] = FEATURED_PRODUCT_IDS.flatMap((id) => {
  const product = MENU_CATEGORIES.flatMap((category) => category.products).find((item) => item.id === id)
  if (!product) return []

  return [{
    name: product.nameVi.toUpperCase(),
    detail: product.description,
    price: Object.entries(product.prices).map(([size, price]) => `${size} ${price}K`).join(' / '),
    image: product.image,
  }]
})
