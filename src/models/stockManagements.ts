import { Moment } from 'moment'
import { Ingredients } from './ingredients'

export enum StockManagementTypes {
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
}

export interface StockManagementInformation {
  _id?: string
  date?: string | Date | Moment
  type?: StockManagementTypes
  createdAt?: string | Date
  updatedAt?: string | Date
  stockManagementInfo?: Ingredients[]
  totalPrice?: number
  note?: string
  exportId?: string[]
  exportQuantity?: number | string
  isExported: boolean
}
