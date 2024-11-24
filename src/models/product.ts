import { Attribute, AttributeValue } from './attribute'
import { Category } from './category'

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  IN_ACTIVE = 'IN_ACTIVE',
}

export interface ProductConfigAttribute extends AttributeValue {
  id?: number
  attributeId?: string
  attributeName?: string
}

export interface AttributeResponse {
  attributeId?: string
  attributeName?: string
  attributeValues?: AttributeValue[]
}

export enum ProductType {
  NORMAL = 'NORMAL', // bình thường
  NEW = 'NEW', // mới
  BEST_SELLER = 'BEST_SELLER', // bán chạy
  DELICIOUS_MUST_TRY = 'DELICIOUS_MUST_TRY', // ngon phải thử
  VEGETARIAN = 'VEGETARIAN', // chay
  SPICY = 'SPICY', // cay
  UNIQUE = 'UNIQUE', // dộc đáo
}

export interface ProductMain {
  _id?: string
  name: string
  description?: string
  information?: string
  categoryId?: Category | string[] | string
  price: number
  oldPrice?: number
  image?: string
  types?: ProductType[]
  orderQuantity?: number
  productVariantId?: string
  attribute?: string[]
  productAttributeList?: ProductChildrenAttribute[]
  attributeMapping?: Attribute[]
  attributeIds?: string[]
  files?: Blob | string
}

export interface ProductChildrenAttribute {
  _id?: string
  extendedIds?: string[]
  label?: string
  extendedNames?: string[]
  priceAdjustmentValues?: number[]
  productAttributeItem?: AttributeValue[]
}

export enum ProductTypes {
  NEW = 'NEW',
  HOT = 'HOT',
  INSTALLMENT = 'INSTALLMENT',
}

export interface ProductStatusOption {
  label: string
  value: number | string
}

export const ProductStatusOptions: ProductStatusOption[] = [
  {
    label: 'Mới',
    value: ProductType.NEW,
  },
  {
    label: 'Bình thường',
    value: ProductType.NORMAL,
  },
  {
    label: 'Bán chạy',
    value: ProductType.BEST_SELLER,
  },
  {
    label: 'Ngon phải thử',
    value: ProductType.DELICIOUS_MUST_TRY,
  },
  {
    label: 'Chay',
    value: ProductType.VEGETARIAN,
  },
  {
    label: 'Cay',
    value: ProductType.SPICY,
  },
  {
    label: 'Độc đáo',
    value: ProductType.UNIQUE,
  },
]
