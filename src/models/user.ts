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
  city?: string | null;
  cityId?: number | string | null;
  district?: string | null;
  districtId?: number | string | null;
  ward?: string | null;
  wardId?: number | string | null;
  password?: string;
  role?: UserRole | UserRole[];
  status?: UserStatus;
  image?: string | Blob | null;
  confirmPw?: string;
  newPassword?: string;
  oldPassword?: string;
}

export interface UsersRequestCheckMatchOldPassword {
  _id?: string;
  password?: string;
}
