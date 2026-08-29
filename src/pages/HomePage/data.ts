import { MENU_CATEGORIES, MENU_SOURCE_STATUS } from '@/data/menu'

export type HomeMenuItem = {
  name: string
  detail: string
  price: string
}

export const HOME_MENU_TABS = MENU_CATEGORIES.map((category) => category.name)

export const HOME_MENU_GROUPS: Record<string, HomeMenuItem[]> = Object.fromEntries(
  MENU_CATEGORIES.filter((category) => category.name !== 'TOPPING').map((category) => [
    category.name,
    category.products.slice(0, 3).map((product) => ({
      name: product.nameVi.toUpperCase(),
      detail: product.description,
      price: MENU_SOURCE_STATUS === 'pending' ? '[GIÁ MINH HOẠ]' : `${product.prices.M ?? product.prices.L ?? 0}K`,
    })),
  ]),
)