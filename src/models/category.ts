export enum CategoryStatus {
  ACTIVE = 'ACTIVE',
  IN_ACTIVE = 'IN_ACTIVE',
}

export interface Category {
  _id?: string;
  name?: string;
  status?: CategoryStatus;
  products?: string[];
  slug?: string;
  priority?: number;
  visible?: boolean;
  isShowHomePage?: boolean;
  childrenCategory?: {
    parentId?: string;
    category?: Category[];
  };
  file?: Blob | string
  avatar?: string
}
