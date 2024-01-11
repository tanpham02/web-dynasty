export interface CustomerAddressItem {
  city?: string;
  cityId?: number;
  district?: string;
  districtId?: number;
  ward?: string;
  wardId?: number;
  fullName?: string;
  address?: string;
  phoneNumber?: string;
  isDefault?: boolean;
}

export interface CustomerAddressList {
  _id?: string;
  customerId?: string;
  addressList?: CustomerAddressItem[];
  createdAt?: string;
  updatedAt?: string;
}
