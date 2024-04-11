export enum BannerType {
  NEWS = 'NEWS',
  CATEGORY = 'CATEGORY',
  PRODUCT = 'PRODUCT',
}

export interface Banner {
  _id?: string,
  name?: string,
  priority?: number,
  url?: string,
  redirect?: string,
  createdAt?: string,
  updatedAt?: string
  banner?: Blob | string
}
