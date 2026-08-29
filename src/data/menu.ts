export type MenuSize = 'M' | 'L'

export type MenuTopping = {
  id: string
  name: string
  price: number
}

export type MenuOptions = {
  sweetness?: readonly number[]
  ice?: readonly ('Less' | 'Normal')[]
  toppings?: readonly MenuTopping[]
}

export type MenuProduct = {
  id: string
  category: string
  nameVi: string
  nameEn: string
  description: string
  image?: string
  imageHover?: string
  characteristics: readonly string[]
  prices: Partial<Record<MenuSize, number>>
  options: MenuOptions
  tags: readonly string[]
}

export type MenuCategory = {
  id: string
  name: string
  sideLabel: string
  theme: 'light' | 'dark'
  products: readonly MenuProduct[]
}

const blackPearl: MenuTopping = { id: 'black-pearl', name: 'Black Pearl', price: 5 }
const whitePearl: MenuTopping = { id: 'white-pearl', name: 'White Pearl', price: 5 }

const standardTeaOptions: MenuOptions = {
  sweetness: [0, 30, 50, 70, 100],
  ice: ['Less', 'Normal'],
  toppings: [blackPearl, whitePearl],
}


const productImages: Record<string, readonly [string, string]> = {
  'matcha-kem-muoi': ['/images/Matcha Kem Muối/Iced Salted Cream Matcha.webp', '/images/Matcha Kem Muối/Salted Cream Matcha Study Desk.webp'],
  'matcha-da-xay-kem-dua': ['/images/Matcha Đá Xay Kem Dừa/Freeze Coconut Matcha Drink Cutout.webp', '/images/Matcha Đá Xay Kem Dừa/Freeze Coconut Matcha on a Study Desk.webp'],
  'tra-quat-hong-bi': ['/images/Trà Quất Hồng Bì/0041.webp', '/images/Trà Quất Hồng Bì/0040.webp'],
  'tra-hoa-qua-nhiet-doi': ['/images/Trà Hoa Quả Nhiệt Đới/0038.webp', '/images/Trà Hoa Quả Nhiệt Đới/0037.webp'],
  'o-long-sen-luu': ['/images/Ô Long Sen Lựu/0035.webp', '/images/Ô Long Sen Lựu/0034.webp'],
  'o-long-cam-xoai': ['/images/Ô Long Cam Xoài/0032.webp', '/images/Ô Long Cam Xoài/0031.webp'],
  'hong-tra-shan-tuyet': ['/images/Hồng Trà Shan Tuyết/0014.webp', '/images/Hồng Trà Shan Tuyết/0013.webp'],
  'hoa-vai': ['/images/Hoa Vải/0016.webp', '/images/Hoa Vải/0012.webp'],
  'coffee-freeze': ['/images/Coffee Freeze/0026.webp', '/images/Coffee Freeze/0025.webp'],
  'matcha-freeze': ['/images/Matcha Freeze/Matcha Freeze Product Cutout.webp', '/images/Matcha Freeze/Matcha Freeze on a Warm Study Desk.webp'],
  'chocomint-freeze': ['/images/Chocomint/Chocomint Freeze Product Cutout.webp', '/images/Chocomint/Chocomint freeze on a modern study desk.webp'],
  'xoai-chanh-leo-freeze': ['/images/Xoài Chanh Leo/Mango passion fruit freeze cutout.webp', '/images/Xoài Chanh Leo/Mango Passion Fruit Freeze on a Desk.webp'],
  'cam-dao': ['/images/Cam Đào/0011.webp', '/images/Cam Đào/0015.webp'],
  'chanh-dua': ['/images/Chanh Dứa/0010.webp', '/images/Chanh Dứa/0001.webp'],
  'tran-chau-den': ['/images/Trân Châu Đen/0048.webp', '/images/Trân Châu Đen/0047.webp'],
  'tran-chau-trang': ['/images/Trân Châu Trắng/0045.webp', '/images/Trân Châu Trắng/0044.webp'],
}

const icedOptions: MenuOptions = {
  ice: ['Less', 'Normal'],
}

function product(
  category: string,
  id: string,
  nameVi: string,
  nameEn: string,
  description: string,
  prices: Partial<Record<MenuSize, number>>,
  options: MenuOptions = {},
  tags: readonly string[] = [],
): MenuProduct {
  const images = productImages[id]
  return { id, category, nameVi, nameEn, description, image: images?.[0], imageHover: images?.[1], characteristics: tags.length ? tags : description.split(/[,.]/).filter(Boolean).slice(0, 3), prices, options, tags }
}

export const MENU_CATEGORIES: readonly MenuCategory[] = [
  {
    id: 'matcha',
    name: 'MATCHA',
    sideLabel: 'THINK CLEAR',
    theme: 'light',
    products: [
      product('matcha', 'matcha-kem-muoi', 'Matcha Kem Muối', 'Salted Cream Matcha', 'Matcha đậm vị với lớp kem sữa muối nhẹ.', { M: 55, L: 65 }, standardTeaOptions),
      product('matcha', 'matcha-da-xay-kem-dua', 'Matcha Đá Xay Kem Dừa', 'Freeze Coconut Matcha', 'Matcha xay mịn, kem dừa mát lạnh.', { M: 60, L: 70 }, icedOptions),
      product('matcha', 'matcha-latte-sua-bo', 'Matcha Latte Sữa Bò', 'Matcha Latte Dairy Milk', 'Matcha latte cân bằng cùng sữa bò.', { M: 65, L: 75 }, standardTeaOptions),
      product('matcha', 'matcha-latte-sua-hat', 'Matcha Latte Oatmilk', 'Matcha Latte Oatmilk', 'Matcha latte cùng sữa hạt dịu vị.', { M: 65, L: 75 }, standardTeaOptions),
      product('matcha', 'matcha-mo', 'Matcha Mơ', 'Apricot Matcha', 'Matcha tươi cùng vị mơ sáng.', { M: 65, L: 75 }, standardTeaOptions),
    ],
  },
  {
    id: 'fruit-tea',
    name: 'TRÀ HOA QUẢ',
    sideLabel: 'REFRESH YOURSELF',
    theme: 'dark',
    products: [
      product('fruit-tea', 'tra-quat-hong-bi', 'Trà Quất Hồng Bì', 'Wampee Tea', 'Trà thanh, quất hồng bì chua nhẹ.', { M: 60, L: 65 }, standardTeaOptions),
      product('fruit-tea', 'tra-hoa-qua-nhiet-doi', 'Trà Hoa Quả Nhiệt Đới', 'Tropical Fruit Tea', 'Trái cây nhiệt đới trên nền trà sáng.', { M: 60, L: 65 }, standardTeaOptions),
      product('fruit-tea', 'o-long-sen-luu', 'Ô Long Sen Lựu', 'Lotus Pomegranate Oolong Tea', 'Ô long, sen và lựu tươi.', { M: 60, L: 65 }, standardTeaOptions),
      product('fruit-tea', 'o-long-cam-xoai', 'Ô Long Cam Xoài', 'Mango Oolong Tea', 'Ô long cùng cam xoài mát lạnh.', { M: 60, L: 65 }, standardTeaOptions),
    ],
  },
  {
    id: 'milk-tea',
    name: 'TRÀ SỮA',
    sideLabel: 'SMOOTH BOOST',
    theme: 'light',
    products: [
      product('milk-tea', 'hong-tra-shan-tuyet', 'Hồng Trà Shan Tuyết', 'Snowshan Black Tea', 'Hồng trà núi, vị trà rõ và sâu.', { M: 60, L: 65 }, standardTeaOptions),
      product('milk-tea', 'o-long-nhai', 'Ô Long Nhài', 'Jasmine Oolong Tea', 'Ô long cùng hương nhài thanh.', { M: 60, L: 65 }, standardTeaOptions),
      product('milk-tea', 'gao-rang-banh-bo', 'Gạo Rang Bánh Bò', 'Honeycomb Rice Tea', 'Gạo rang thơm, ngọt nhẹ.', { M: 60, L: 65 }, standardTeaOptions),
      product('milk-tea', 'o-long-tu-quy', 'Ô Long Tứ Quý', 'Four Seasons Oolong', 'Ô long bốn mùa cân bằng.', { M: 60, L: 65 }, standardTeaOptions),
      product('milk-tea', 'gao-rang', 'Gạo Rang', 'Roasted Rice Milk Tea', 'Gạo rang ấm, trà sữa dịu.', { M: 60, L: 65 }, standardTeaOptions),
      product('milk-tea', 'hoa-vai', 'Hoa Vải', 'Floral Lychee Tea', 'Vải thiều và hương hoa nhẹ.', { M: 60, L: 65 }, standardTeaOptions),
    ],
  },
  {
    id: 'coffee',
    name: 'CÀ PHÊ',
    sideLabel: 'BOLD KICK',
    theme: 'dark',
    products: [
      product('coffee', 'ca-phe-den', 'Cà Phê Đen', 'Black Coffee', 'Pha phin, đậm và thẳng.', { M: 45, L: 50 }, icedOptions),
      product('coffee', 'americano', 'Americano', 'Americano', 'Espresso loãng, sáng vị.', { M: 50, L: 55 }, icedOptions),
      product('coffee', 'ca-phe-nau', 'Cà Phê Nâu', 'Vietnamese Brown Coffee', 'Cà phê cùng sữa đặc truyền thống.', { M: 50, L: 55 }, icedOptions),
      product('coffee', 'bac-xiu', 'Bạc Xỉu', 'Vietnamese White Coffee', 'Nhiều sữa, ít cà phê.', { M: 55, L: 60 }, icedOptions),
      product('coffee', 'khoi', 'Khói', 'Smoky Coffee', 'Hương khói nhẹ trên nền cà phê.', { M: 60, L: 65 }, icedOptions),
      product('coffee', 'latte', 'Latte', 'Latte', 'Espresso và sữa cân bằng.', { M: 60, L: 65 }, icedOptions),
      product('coffee', 'ca-phe-muoi', 'Cà Phê Muối', 'Salted Cream Coffee', 'Kem muối trên cà phê đen.', { M: 60, L: 65 }, icedOptions),
    ],
  },
  {
    id: 'coldbrew',
    name: 'COLDBREW',
    sideLabel: 'FUEL YOUR HUSTLE',
    theme: 'light',
    products: [
      product('coldbrew', 'coldbrew-chanh', 'Cold Brew Chanh', 'Lemon Cold Brew', 'Cold brew cùng chanh tươi.', { M: 60, L: 65 }, icedOptions),
      product('coldbrew', 'coldbrew-dao', 'Cold Brew Đào', 'Peach Cold Brew', 'Cold brew cùng đào thanh.', { M: 60, L: 65 }, icedOptions),
      product('coldbrew', 'coldbrew-qua-mong', 'Cold Brew Quả Mọng', 'Berry Cold Brew', 'Quả mọng trên nền cà phê lạnh.', { M: 60, L: 65 }, icedOptions),
      product('coldbrew', 'coldbrew-mo', 'Cold Brew Mơ', 'Apricot Cold Brew', 'Mơ thơm, hậu vị sáng.', { M: 60, L: 65 }, icedOptions),
    ],
  },
  {
    id: 'freeze',
    name: 'FREEZE',
    sideLabel: 'COOL DOWN',
    theme: 'dark',
    products: [
      product('freeze', 'coffee-freeze', 'Cà Phê Đá Xay', 'Coffee Freeze', 'Cà phê xay đá, đậm vị.', { M: 65, L: 70 }, icedOptions),
      product('freeze', 'matcha-freeze', 'Matcha Đá Xay', 'Matcha Freeze', 'Matcha xay mịn và lạnh.', { M: 65, L: 70 }, icedOptions),
      product('freeze', 'chocomint-freeze', 'Chocomint Đá Xay', 'Chocomint Freeze', 'Sô cô la cùng bạc hà lạnh.', { M: 65, L: 70 }, icedOptions),
      product('freeze', 'xoai-chanh-leo-freeze', 'Xoài Chanh Leo Đá Xay', 'Mango Passion Fruit Freeze', 'Xoài chanh leo tươi xay.', { M: 65, L: 70 }, icedOptions),
    ],
  },
  {
    id: 'fruit-water',
    name: 'NƯỚC HOA QUẢ',
    sideLabel: 'BRIGHT BREAK',
    theme: 'light',
    products: [
      product('fruit-water', 'cam-dao', 'Cam Đào', 'Orange Peach', 'Cam và đào, uống lạnh.', { M: 60, L: 65 }, standardTeaOptions),
      product('fruit-water', 'chanh-dua', 'Chanh Dứa', 'Passion Fruit Pineapple', 'Chanh leo và dứa tươi.', { M: 60, L: 65 }, standardTeaOptions),
      product('fruit-water', 'dao-oi-hong', 'Đào Ổi Hồng', 'Peach Pink Guava', 'Đào cùng ổi hồng tươi.', { M: 60, L: 65 }, standardTeaOptions),
    ],
  },
  {
    id: 'topping',
    name: 'TOPPING',
    sideLabel: 'MAKE IT YOURS',
    theme: 'dark',
    products: [
      product('topping', 'tran-chau-den', 'Trân Châu Đen', 'Black Pearl', 'Trân châu đen dai vừa.', { M: 5 }, {}, ['topping']),
      product('topping', 'tran-chau-trang', 'Trân Châu Trắng', 'White Pearl', 'Trân châu trắng mềm hơn.', { M: 5 }, {}, ['topping']),
      product('topping', 'thach-dao', 'Thạch Đào', 'Peach Jelly', 'Thạch đào mềm, nhẹ vị.', { M: 5 }, {}, ['topping']),
    ],
  },
]

export const MENU_TABS = MENU_CATEGORIES.map((category) => ({ id: category.id, label: category.name }))
export const MENU_SOURCE_STATUS = 'pending' as const