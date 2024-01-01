export enum UserStatus {
  ACTIVE = 'ACTIVE',
  IN_ACTIVE = 'IN_ACTIVE',
  DELETED = 'DELETED',
}

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  ALL = 'ALL',
}

export interface Users {
  _id?: string;
  birthday?: any;
  username?: string;
  fullName?: string;
  phoneNumber?: string;
  email?: string;
  location?: string;
  city?: string;
  cityId?: number | string;
  district?: string;
  districtId?: number | string;
  ward?: string;
  wardId?: number | string;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
  image?: string;
  confirmPw?: string;
}
