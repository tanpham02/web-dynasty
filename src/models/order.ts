import { ProductMain } from './product'

export enum StatusOrder {
  PENDING = 'PENDING',
  DELIVERING = 'DELIVERING',
  SUCCESS = 'SUCCESS',
  CANCELED = 'CANCELED',
  WAITING_FOR_DELIVERING = 'WAITING_FOR_DELIVERING',
  WAITING_FOR_PAYMENT = 'WAITING_FOR_PAYMENT',
  FAIL = 'FAIL',
}

export enum OrderType {
  PICK_UP = 'PICK_UP',
  DELIVERY = 'DELIVERY',
}

export enum OrderPaymentMethod {
  CASH = 'CASH',
  MOMO = 'MOMO',
  ATM_CARD = 'ATM_CARD',
  SHOPEE_PAY = 'SHOPEE_PAY',
  ZALO_PAY = 'ZALO_PAY',
}

export enum OrderReceivingTime {
  NOW = 'NOW',
  SELECT_DATE_TIME = 'SELECT_DATE_TIME',
}

export interface Order {
  _id?: string
  customerId?: string
  products?: ProductOrder[]
  shipFee?: number
  orderStatus?: StatusOrder
  fullName?: string
  phoneNumber?: string
  location?: string
  city?: string
  cityId?: string
  district?: string
  districtId?: string
  ward?: string
  wardId?: string
  orderType?: OrderType
  paymentMethod?: OrderPaymentMethod
  orderReceivingTime?: OrderReceivingTime
  orderReceivingTimeAt?: string
  voucherId?: string
  storeId?: string
  shipperId?: string
  reasonCancel?: string
  note?: string
  subTotal?: number
  total?: number
  createdAt?: string
  updatedAt?: string
}

export interface ProductOrder {
  product?: ProductMain
  note?: string
  quantity?: number
}
