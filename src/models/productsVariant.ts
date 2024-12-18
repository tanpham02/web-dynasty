import { BaseModel } from './base'
import { ProductMain } from './product'

export interface ProductVariants extends BaseModel {
  parentId?: string
  productItem?: ProductMain
  attributeUsing?: string[]
  variantNames?: string[]
}
