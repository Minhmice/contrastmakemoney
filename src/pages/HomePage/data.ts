import { MENU_CATEGORIES, MENU_SOURCE_STATUS } from '@/data/menu'

export type HomeMenuItem = {
  name: string
  detail: string
  price: string
}

export const HOME_MENU_TABS = MENU_CATEGORIES.map((category) => category.name)

export const HOME_MENU_GROUPS: Record<string, HomeMenuItem[]> = Object.fromEntries(
  MENU_CATEGORIES.map((category) => [
    category.name,
    category.items.slice(0, 3).map((item) => ({
      name: item.name.toUpperCase(),
      detail: item.detail,
      price: MENU_SOURCE_STATUS === 'pending' ? '[GIÁ MINH HOẠ]' : `${item.price}k`,
    })),
  ]),
)
