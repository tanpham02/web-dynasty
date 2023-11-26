export enum BannerType {
  NEWS = 'NEWS',
  CATEGORY = 'CATEGORY',
  PRODUCT = 'PRODUCT',
}

export interface Banner {
  id?: number;
  createdDate?: Date | string | null;
  generatedName?: string;
  mimeType?: string;
  originalName?: string;
  size?: number;
  thumbnail?: string;
  thumbnailSize?: number;
  path?: string;
  thumbnailPath?: string;
  bannerType?: BannerType | string;
  redirectId?: number | string | null;
  link?: string | null;
}
