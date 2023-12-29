import { Product } from './product';

export enum CategoryStatus {
  ACTIVE = 'ACTIVE',
  IN_ACTIVE = 'IN_ACTIVE',
}

export interface ProductCategory {
  [x: string]: any;
  id?: number;
  name?: string;
  image?: string;
  nhanhVnId?: string;
  content?: string;
  status?: CategoryStatus;
  banner?: string;
  products?: Product[];
  existInDatabase?: boolean;
  code?: string;
  parentId?: string;
  nhanhVnParentId?: string;
  childCategoryDTOs?: ProductCategory[];
  children?: ProductCategory[];
}
