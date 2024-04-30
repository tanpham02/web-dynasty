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
  cityId?: string;
  district?: string;
  districtId?: string;
  ward?: string;
  wardId?: string;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
  image?: string | Blob;
  confirmPw?: string;
  newPassword?: string;
  oldPassword?: string;
}

export interface UsersRequestCheckMatchOldPassword {
  _id?: string;
  password?: string;
}
