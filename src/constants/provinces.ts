export enum Region {
  MIEN_BAC = 'MIEN_BAC',
  MIEN_TRUNG = 'MIEN_TRUNG',
  MIEN_NAM = 'MIEN_NAM',
}

export interface Province {
  id: number;
  code: string;
  name: string;
  region: Region;
}

export const PROVINCES: Province[] = [
  // Miền Bắc
  { id: 1, code: 'HN', name: 'TP Hà Nội', region: Region.MIEN_BAC },
  { id: 2, code: 'HCM', name: 'TP Hồ Chí Minh', region: Region.MIEN_NAM },
  { id: 3, code: 'HP', name: 'Hải Phòng', region: Region.MIEN_BAC },
  { id: 4, code: 'ĐN', name: 'Đà Nẵng', region: Region.MIEN_TRUNG },
  { id: 5, code: 'HU', name: 'Huế', region: Region.MIEN_TRUNG },
  { id: 31, code: 'TH', name: 'Thanh Hoá', region: Region.MIEN_BAC },
  { id: 7, code: 'TQ', name: 'Tuyên Quang', region: Region.MIEN_BAC },
  { id: 8, code: 'LC', name: 'Lào Cai', region: Region.MIEN_BAC },
  { id: 9, code: 'TNG', name: 'Thái Nguyên', region: Region.MIEN_BAC },
  { id: 10, code: 'PT', name: 'Phú Thọ', region: Region.MIEN_BAC },
  { id: 11, code: 'BN', name: 'Bắc Ninh', region: Region.MIEN_BAC },
  { id: 12, code: 'HY', name: 'Hưng Yên', region: Region.MIEN_BAC },
  { id: 13, code: 'NB', name: 'Ninh Bình', region: Region.MIEN_BAC },
  { id: 26, code: 'LC2', name: 'Lai Châu', region: Region.MIEN_BAC },
  { id: 27, code: 'ĐB', name: 'Điện Biên', region: Region.MIEN_BAC },
  { id: 28, code: 'SL', name: 'Sơn La', region: Region.MIEN_BAC },
  { id: 29, code: 'LS', name: 'Lạng Sơn', region: Region.MIEN_BAC },
  { id: 30, code: 'QN', name: 'Quảng Ninh', region: Region.MIEN_BAC },
  { id: 32, code: 'NA', name: 'Nghệ An', region: Region.MIEN_BAC },
  { id: 33, code: 'HT', name: 'Hà Tĩnh', region: Region.MIEN_BAC },
  { id: 34, code: 'CB', name: 'Cao Bằng', region: Region.MIEN_BAC },

  // Miền Trung
  { id: 14, code: 'QT', name: 'Quảng Trị', region: Region.MIEN_TRUNG },
  { id: 15, code: 'QG', name: 'Quảng Ngãi', region: Region.MIEN_TRUNG },
  { id: 16, code: 'GL', name: 'Gia Lai', region: Region.MIEN_TRUNG },
  { id: 17, code: 'KH', name: 'Khánh Hoà', region: Region.MIEN_TRUNG },
  { id: 18, code: 'LD', name: 'Lâm Đồng', region: Region.MIEN_TRUNG },
  { id: 19, code: 'DL', name: 'Đắk Lắk', region: Region.MIEN_TRUNG },

  // Miền Nam
  { id: 6, code: 'CT', name: 'Cần Thơ', region: Region.MIEN_NAM },
  { id: 20, code: 'DN', name: 'Đồng Nai', region: Region.MIEN_NAM },
];

