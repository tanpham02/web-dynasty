import { StatusOrder } from "~/models/order";
import { VoucherPromotionType, VoucherSaleScope } from "~/models/voucher";

export interface SearchParams {
  searchText?: string;
  pageIndex?: number;
  pageSize?: number;
  status?: string;
  sortBy?: string;
  createFrom?: string;
  createTo?: string;
  ascending?: boolean;
  limitProduct?: number;
  name?: string;
  code?: string;
  saleScope?: VoucherSaleScope;
  promotionType?: VoucherPromotionType;
  from?: string;
  to?: string;
  statusOrder?: StatusOrder;

  [key: string]: any;
}

export type Breakpoint = "xxl" | "xl" | "lg" | "md" | "sm" | "xs";

export interface ListResponse<T> {
  data: T[];
  pageable: {
    sort: {
      unsorted: boolean;
      sorted: boolean;
      empty: boolean;
    };
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  };
  first: boolean;
  numberOfElements?: number;
  empty: boolean;
}

export interface ListDataResponse<T> {
  data: T[];
  isLastPage: boolean;
  pageIndex: number;
  pageSize: number;
  totalElement: number;
  totalPage: number;
}

export interface DataProps {
  [key: string]: any;
}

export interface Pagination {
  totalElements?: number;
  totalPages?: number;
  last?: boolean;
  numberOfElements?: number;
  pageSize?: number;
  pageNumber?: number;
  [key: string]: any;
}

export enum LocationEnum {
  CITY = "CITY",
  DISTRICT = "DISTRICT",
  WARD = "WARD",
}

export interface SelectOptionType {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface LocationType {
  type?: number | string;
  parentId?: number | string;
}

export interface LocationItemType {
  cityId: number;
  cityLocationId: number;
  districtId: number;
  districtLocationId: number;
  id: number;
  name: string;
  parentId: number;
}

export interface LocationResponseType {
  code?: number;
  messages?: string[];
  data?: LocationItemType[];
}
