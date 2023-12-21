import { UserRole, UserStatus } from "../user";

export interface UpdateUserForm {
  id: number;
  username: string;
  phoneNumber: string;
  fullName: string;
  address: string;
  status: UserStatus;
  role: UserRole;
  avatarFile: string;
  birthday: string;
  createdDate: string;
  modifiedDate: string;
}
