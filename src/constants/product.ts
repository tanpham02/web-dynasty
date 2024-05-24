import { ProductType } from '~/models/product'

export const PRODUCT_TYPES: Record<string, string> = {
  [`${ProductType.BEST_SELLER}`]: 'Bán chạy',
  [`${ProductType.DELICIOUS_MUST_TRY}`]: 'Ngon phải thử',
  [`${ProductType.NEW}`]: 'Mới',
  [`${ProductType.NORMAL}`]: 'Thường',
  [`${ProductType.SPICY}`]: 'Cay',
  [`${ProductType.UNIQUE}`]: 'Đặc biệt',
  [`${ProductType.VEGETARIAN}`]: 'Chay',
}
