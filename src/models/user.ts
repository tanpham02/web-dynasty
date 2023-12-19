export enum UserStatus {
  ACTIVE = "ACTIVE",
  IN_ACTIVE = "IN_ACTIVE",
  DELETED = "DELETED",
}

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
  ALL = "ALL",
}

export interface User {
  [x: string]: any;
  _id?: string;
  birthday?: string | Date;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  city?: string;
  cityId?: number;
  district?: string;
  districtId?: number;
  ward?: string;
  wardId?: number;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
  image?: string;
}
