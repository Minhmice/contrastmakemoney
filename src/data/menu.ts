export type MenuItem = {
  id: string
  name: string
  english: string
  price: string
  detail: string
}

export type MenuCategory = {
  id: string
  name: string
  rail: string
  statement: string
  tone: 'paper' | 'ink'
  layout: 'four' | 'three' | 'two' | 'toppings'
  items: MenuItem[]
}

const item = (
  id: string,
  name: string,
  english: string,
  price: string,
  detail: string,
): MenuItem => ({
  id,
  name,
  english,
  price,
  detail,
})

export const MENU_CATEGORIES: MenuCategory[] = [
  {
    id: 'caffein',
    name: 'CAFFEIN',
    rail: 'CAFFEIN',
    statement: 'Cho vòng tập trung đầu tiên.',
    tone: 'paper',
    layout: 'four',
    items: [
      item('ca-phe-den', 'Cà Phê Đen', 'Black Coffee', '45 / 50', 'Pha phin, đậm và thẳng.'),
      item('americano', 'Americano', 'Americano', '50 / 55', 'Espresso loãng, sáng vị.'),
      item('ca-phe-nau', 'Cà Phê Nâu', 'Vietnamese Brown Coffee', '50 / 55', 'Cà phê sữa đặc truyền thống.'),
      item('bac-xiu', 'Bạc Xỉu', 'Vietnamese White Coffee', '55 / 60', 'Nhiều sữa, ít cà phê, mềm hơn.'),
      item('khoi', 'Khói', 'Smoky Coffee', '60 / 65', 'Hương khói nhẹ trên nền cà phê.'),
      item('latte', 'Latte', 'Latte', '60 / 65', 'Espresso và sữa nóng cân bằng.'),
      item('ca-phe-muoi', 'Cà Phê Muối', 'Salted Cream Coffee', '60 / 65', 'Kem muối trên cà phê đen.'),
    ],
  },
  {
    id: 'cold-brew',
    name: 'COLD BREW',
    rail: 'FUEL YOUR HUSTLE',
    statement: 'Lạnh, sáng, đủ để làm tiếp.',
    tone: 'paper',
    layout: 'four',
    items: [
      item('chanh', 'Chanh', 'Lemon Cold Brew', '60 / 65', 'Cold brew và chanh tươi.'),
      item('dao', 'Đào', 'Peach Cold Brew', '60 / 65', 'Đào ngọt trên nền cà phê lạnh.'),
      item('qua-mong', 'Quả Mọng', 'Berry Cold Brew', '60 / 65', 'Quả mọng chua nhẹ, tỉnh táo.'),
      item('mo', 'Mơ', 'Apricot Cold Brew', '60 / 65', 'Mơ thơm, hậu vị sáng.'),
    ],
  },
  {
    id: 'milk-tea',
    name: 'TRÀ SỮA',
    rail: 'NON-CAFFEIN',
    statement: 'Mềm hơn một nhịp. Vẫn chưa dừng.',
    tone: 'ink',
    layout: 'three',
    items: [
      item('hong-tra-shan-tuyet', 'Hồng Trà Shan Tuyết', 'Snowshan Black Tea', '60 / 65', 'Hồng trà núi, vị trà rõ.'),
      item('o-long-nhai', 'Ô Long Nhài', 'Jasmine Oolong Tea', '60 / 65', 'Hoa nhài trên nền ô long.'),
      item('gao-rang-banh-bo', 'Gạo Rang Bánh Bò', 'Honeycomb Rice Tea', '60 / 65', 'Gạo rang thơm, ngọt nhẹ.'),
      item('o-long-tu-quy', 'Ô Long Tứ Quý', 'Four Seasons Oolong', '60 / 65', 'Ô long bốn mùa, cân bằng.'),
      item('gao-rang', 'Gạo Rang', 'Roasted Rice Milktea', '60 / 65', 'Hương gạo rang đậm đà.'),
      item('hoa-vai', 'Hoa Vải', 'Floral Lychee Tea', '60 / 65', 'Vải thiều và hoa thơm.'),
    ],
  },
  {
    id: 'fresh-sips',
    name: 'NƯỚC HOA QUẢ',
    rail: 'SMOOTH BOOST',
    statement: 'Đổi vị. Giữ nhịp.',
    tone: 'paper',
    layout: 'two',
    items: [
      item('cam-dao', 'Cam Đào', 'Orange & Peach', '60 / 65', 'Cam và đào, uống lạnh.'),
      item('chanh-dua', 'Chanh Dứa', 'Passion Fruit & Pineapple', '60 / 65', 'Chanh leo và dứa tươi.'),
    ],
  },
  {
    id: 'toppings',
    name: 'TOPPING',
    rail: 'THINK CLEAR',
    statement: 'Thêm một chút. Đủ khác.',
    tone: 'paper',
    layout: 'toppings',
    items: [
      item('tran-chau-den', 'Trân Châu Đen', 'Black Pearl', '5', 'Trân châu đen dai vừa.'),
      item('tran-chau-trang', 'Trân Châu Trắng', 'White Pearl', '5', 'Trân châu trắng mềm hơn.'),
    ],
  },
  {
    id: 'fruit-tea',
    name: 'TRÀ HOA QUẢ',
    rail: 'FRUIT-BASED',
    statement: 'Trái cây, trà, và một nhịp tỉnh.',
    tone: 'ink',
    layout: 'three',
    items: [
      item('tra-quat-hong-bi', 'Trà Quất Hồng Bì', 'Wampee Tea', '60 / 65', 'Quất hồng bì chua thanh.'),
      item('tra-hoa-qua-nhiet-doi', 'Trà Hoa Quả Nhiệt Đới', 'Tropical Fruit Tea', '60 / 65', 'Trái nhiệt đới tươi.'),
      item('o-long-sen-luu', 'Ô Long Sen Lựu', 'Lotus Pomegranate Oolong Tea', '60 / 65', 'Sen và lựu trên ô long.'),
      item('o-long-cam-xoai', 'Ô Long Cam Xoài', 'Mango Oolong Tea', '60 / 65', 'Cam xoài ngọt, trà nhẹ.'),
      item('tra-coc-xanh', 'Trà Cóc Xanh', 'Ambarella Tea', '60 / 65', 'Cóc xanh chua mát.'),
    ],
  },
  {
    id: 'freeze',
    name: 'FREEZE ĐÁ XAY',
    rail: 'REFRESH YOURSELF',
    statement: 'Nạp lạnh. Làm tiếp.',
    tone: 'ink',
    layout: 'four',
    items: [
      item('coffee-freeze', 'Cà Phê', 'Coffee Freeze', '65 / 70', 'Cà phê xay đá, đậm vị.'),
      item('matcha-freeze', 'Matcha', 'Matcha Freeze', '65 / 70', 'Matcha Nhật xay mịn.'),
      item('chocomint-freeze', 'Chocomint', 'Chocomint Freeze', '65 / 70', 'Sô cô la và bạc hà lạnh.'),
      item('xoai-chanh-leo-freeze', 'Xoài Chanh Leo', 'Mango & Passion Fruit Freeze', '65 / 70', 'Xoài chanh leo tươi xay.'),
    ],
  },
  {
    id: 'matcha',
    name: 'MATCHA',
    rail: 'NON-CAFFEIN',
    statement: 'Xanh, đậm, không cần vội.',
    tone: 'paper',
    layout: 'three',
    items: [
      item('matcha-kem-muoi', 'Matcha Kem Muối', 'Salted Cream Matcha', '55 / 65', 'Matcha và lớp kem muối.'),
      item('matcha-da-xay-kem-dua', 'Matcha Đá Xay Kem Dừa', 'Freeze Coconut Matcha', '60 / 70', 'Matcha xay với kem dừa.'),
      item('matcha-latte-sua-bo', 'Matcha Latte Sữa Bò', 'Matcha Latte (Dairy Milk)', '65 / 75', 'Matcha latte sữa bò.'),
      item('matcha-latte-sua-hat', 'Matcha Latte Sữa Hạt', 'Matcha Latte (Oatmilk)', '65 / 75', 'Matcha latte sữa yến mạch.'),
      item('matcha-mo', 'Matcha Mơ', 'Apricot Matcha', '65 / 75', 'Matcha hòa vị mơ nhẹ.'),
    ],
  },
]

export const MENU_TABS = MENU_CATEGORIES.map((category) => ({
  id: category.id,
  label: category.name,
}))

export const MENU_SOURCE_STATUS = 'pending' as const
