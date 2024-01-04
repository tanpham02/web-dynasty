import { Attribute } from './attribute';
export interface PercentSale {
  type: 'percent';
  percent: number;
}

export interface FixedSale {
  amount: number;
  type: 'fixed';
}

export type Sale = PercentSale | FixedSale;

export interface Option {
  key: string;
  label?: string;
  priceChange?: Sale;
}

export interface BaseVariant {
  key: string;
  label?: string;
  options: Option[];
}

export interface SingleOptionVariant extends BaseVariant {
  type: 'single';
  default?: string;
}

export interface MultipleOptionVariant extends BaseVariant {
  type: 'multiple';
  default?: string[];
}

export type Variant = SingleOptionVariant | MultipleOptionVariant;

export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  IN_ACTIVE = 'IN_ACTIVE',
}

export interface ProductConfigAttribute extends AttributeValue {
  id?: number;
  attributeId?: string;
  attributeName?: string;
}

export interface AttributeValue {
  nhanhVnId?: string;
  name?: string;
}

export interface AttributeResponse {
  attributeId?: string;
  attributeName?: string;
  attributeValues?: AttributeValue[];
}

export interface Product {
  id?: number;
  name?: string;
  price?: number;
  oldPrice?: number;
  importPrice?: number;
  image?: string;
  images?: string[];
  nhanhVnId?: string;
  nhanhVnCategoryId?: string;
  status?: ProductStatus;
  parentId?: string;
  existInDatabase?: boolean;
  orderQuantity?: number;
  description?: string;
  freeShipDescription?: string;
  attributeDTOs?: ProductConfigAttribute[];
  attributeResponses?: AttributeResponse[];
  childProductDTOs?: Product[];
  newProduct?: boolean;
  types?: ProductTypes[];
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
  _id?: string;
  name: string;
  description?: string;
  information?: string;
  categoryId?: string | string[];
  price: number;
  oldPrice?: number;
  image?: string;
  types?: ProductType[];
  orderQuantity?: number;
  productVariantId?: string;
  attribute?: string[];
  productAttributeList?: ProductChildrenAttribute[];
  attributeMapping?: Attribute[];
  attributeIds?: string[];
}

export interface ProductChildrenAttribute {
  extendedName?: string; // VD: Nhỏ - Dày => Pizza Hải Sản Pesto Xanh - Nhỏ - Dày
  extendedValue?: string; // Còn này là cắp value SMALL - PAN, gửi này lên để t query
  productAttributeItem?: ProductChildrenAttributeItem[]; // này là những attribute item, mỗi item là một product con
}

export interface ProductChildrenAttributeItem {
  _id?: string;
  attributeId?: string;
  name?: string; // Nhỏ
  priceAdjustmentValue?: number; // 80000   => 2 cai này là biến thế nếu giá thay đổi thì có, còn không thôi
}

export enum ProductTypes {
  NEW = 'NEW',
  HOT = 'HOT',
  INSTALLMENT = 'INSTALLMENT',
}

export interface ProductStatusOption {
  label: string;
  value: number | string;
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
];
