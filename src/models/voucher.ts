import { ProductMain } from './product'

export enum VoucherStatus {
  ACTIVE = 'ACTIVE',
  IN_ACTIVE = 'IN_ACTIVE',
  DELETED = 'DELETED',
  IN_COMING = 'IN_COMING',
}

export enum DiscountBy {
  DISCOUNT = 'DISCOUNT',
  DISCOUNT_PERCENT = 'DISCOUNT_PERCENT',
}

export enum ReceiveMoneyBy {
  RECEIVE_MONEY = 'RECEIVE_MONEY',
  RECEIVE_PERCENT = 'RECEIVE_PERCENT',
}

export enum VoucherType {
  FLASH_SALE = 'FLASH_SALE',
  VOUCHER = 'VOUCHER',
  SALE_CAMPAIGN = 'SALE_CAMPAIGN',
}

export enum VoucherSaleScope {
  ALL = 'ALL',
  PRODUCT = 'PRODUCT',
  INTRODUCE = 'INTRODUCE',
}

export enum VoucherPromotionType {
  SALE = 'SALE',
  RECEIVE_MONEY = 'RECEIVE_MONEY',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum VoucherTypes {
  NORMAL = 'NORMAL',
  REFERRED_PERSON = 'REFERRED_PERSON',
  REFERRER = 'REFERRER',
  NEW_CUSTOMER = 'NEW_CUSTOMER',
  FOLLOW_OA = 'FOLLOW_OA',
}

export interface Voucher {
  id?: number
  name?: string
  code?: string
  description?: string
  createdDate?: Date | string
  modifiedDate?: Date | string
  status?: VoucherStatus | ''
  startDate?: Date | string
  endDate?: Date | string
  type?: VoucherType | ''
  saleScope?: VoucherSaleScope | ''
  promotionType?: VoucherPromotionType | ''
  minimumOrderPrice?: number
  totalQuantity?: number
  maxQuantityUseInUser?: number
  totalQuantityUsed?: number
  maxPromotion?: number
  discount?: number | null
  discountPercent?: number | null
  receivePointPercent?: number | null
  receivePoint?: number | null
  totalQuantityProduct?: number
  canUse?: boolean
  saleDetailDTOs?: VoucherDetail[]
  voucherType?: VoucherTypes
}

export interface VoucherDetail {
  id?: number
  discount?: number
  discountPercent?: number
  totalQuantity?: number
  totalQuantityUsed?: number
  maxQuantityInOrder?: number
  productId?: number
  productDTO?: ProductMain
}

export enum SaleScope {
  ALL = 'ALL',
  BY_PRODUCT = 'BY_PRODUCT',
}
export enum PromotionsType {
  DISCOUNT_BY_MONEY = 'DISCOUNT_BY_MONEY',
  DISCOUNT_BY_PERCENT = 'DISCOUNT_BY_PERCENT',
}

export enum StatusVoucher {
  ACTIVE = 'ACTIVE',
  IN_ACTIVE = 'IN_ACTIVE',
  DELETED = 'DELETED',
  IN_COMING = 'IN_COMING',
}

export interface VoucherOverriding {
  _id?: string
  name?: string
  description?: string
  code?: string
  startDate?: string | Date
  endDate?: string | Date
  saleScope?: SaleScope
  promotionType?: PromotionsType
  discount?: number | null
  discountPercent?: number | null
  maximumReducedAmountMoney?: number
  totalQuantityVoucher?: number
  minimumOrderValue?: number
  listProductUsedVoucher?: string[]
  customerIdsUsedVoucher?: string[]
  status?: StatusVoucher
}
