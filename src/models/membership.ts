import { Customer } from "./customers";

export enum MembershipStatus {
  ACTIVE = "ACTIVE",
  IN_ACTIVE = "IN_ACTIVE",
}

export interface Membership {
  id?: number;
  name?: string;
  existingCustomer?: boolean;
  conditionLabel?: string;
  conditionPrice?: number;
  percentDiscount?: number;
  status?: MembershipStatus;
  color?: string;
  customerDTOs?: Customer[];
  backgroundImage?: string;
}
