export type Location = {
  name: string
  address: string
  phone: string
  note: string
  mapsUrl: string
  embedUrl: string
}

export const LOCATIONS: Location[] = [
  {
    name: 'TÔ HIỆU',
    address: '217 Tô Hiệu, Hà Nội',
    phone: '0378 401 441',
    note: 'Một nhịp ngồi sâu. Hợp cho buổi học dài.',
    mapsUrl: 'https://maps.app.goo.gl/LueyWJwsSCbGLJAu8',
    embedUrl: 'https://www.google.com/maps?q=21.0415003,105.793101&z=16&output=embed',
  },
  {
    name: 'VŨ TÔNG PHAN',
    address: '37/645 Vũ Tông Phan, Hà Nội',
    phone: '0969 592 353',
    note: 'Không gian mở. Đến, đặt laptop, vào việc.',
    mapsUrl: 'https://maps.app.goo.gl/bmz36C29rECWDhhG7',
    embedUrl: 'https://www.google.com/maps?q=20.9825409,105.8170376&z=16&output=embed',
  },
  {
    name: 'TRƯỜNG CHINH',
    address: 'Ngõ 109 Trường Chinh, Hà Nội',
    phone: '0355 441 306',
    note: 'Nhiều ánh sáng. Hợp cho một ngày cần bắt đầu lại.',
    mapsUrl: 'https://maps.app.goo.gl/hEAzkTtRBDuucWdm9',
    embedUrl: 'https://www.google.com/maps?q=20.9968193,105.8373457&z=16&output=embed',
  },
]
