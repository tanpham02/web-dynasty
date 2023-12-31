export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  IN_ACTIVE = 'IN_ACTIVE',
}

export enum CustomerRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface Customer {
  id?: number;
  _id?: string;
  email?: string;
  customerAddressId?: string;
  nhanhVnId?: number | string;
  username?: string;
  phoneNumber?: string;
  fullName?: string;
  childName?: string;
  childBirthday?: string | Date;
  childGender?: boolean;
  status?: CustomerStatus;
  avatar?: string;
  birthday?: string | Date;
  createdDate?: string;
  modifiedDate?: string;
  city?: string;
  cityId?: number | string;
  district?: string;
  districtId?: number | string;
  ward?: string;
  wardId?: number | string;
  address?: string;
  referrerCode?: string;
  affiliateCode?: string;
  membershipDTO?: {
    id?: number;
    name?: string;
    conditionLable?: string;
    conditionPrice?: number;
    percentDiscount?: number;
    status?: CustomerStatus;
    color?: string;
    customerDTOs?: [string];
  };
  nextMembershipDTO?: {
    id?: number;
    name?: string;
    conditionLable?: string;
    conditionPrice?: number;
    percentDiscount?: number;
    status?: CustomerStatus;
    color?: string;
    customerDTOs?: [string];
  };
  totalAmountPurchased?: number;
  followOA?: boolean;
  point?: number;
}

export interface CustomerHistory {
  customerId?: number;
  createdDate?: string | Date;
  type?: CalculatorPoint | string;
  nhanhVnOrderId?: string;
  point?: number;
  money?: number;
  reason?: string;
  customerDTO?: Customer[];
}

export enum CalculatorPoint {
  ADDITION = 'ADDITION',
  SUBTRACTION = 'SUBTRACTION',
}
