export enum CustomerStatus {
  ACTIVE = 'ACTIVE',
  IN_ACTIVE = 'IN_ACTIVE',
}

export enum CustomerRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export enum CustomerType {
  NEW = 'NEW',
  EXIST = 'EXIST',
  POTENTIAL = 'POTENTIAL',
  BUY_THE_MOST_ORDERS = 'BUY_THE_MOST_ORDERS',
}

export interface Customer {
  _id?: string;
  phoneNumber?: string;
  fullName?: string;
  email?: string;
  password?: string;
  birthday?: string;
  customerAddressId?: string;
  orderIds?: string[];
  status?: CustomerStatus | CustomerStatus[];
  customerType?: CustomerType | CustomerType[];
  createdAt?: string;
  updatedAt?: string;
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
