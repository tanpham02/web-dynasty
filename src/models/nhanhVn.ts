export interface NhanhVn {
  id?: number;
  appId?: string;
  businessId?: string;
  secretKey?: string;
  version?: string;
  accessToken?: string;
  expiredDate?: string | Date;
  priority?: number;
  status?: NhanhVnStatus;
}

export enum NhanhVnStatus {
  ACTIVE = "ACTIVE",
  IN_ACTIVE = "IN_ACTIVE",
  DELETED = "DELETED",
  IN_COMING = "IN_COMING",
}
