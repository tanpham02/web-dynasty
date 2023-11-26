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
  customerId?: string;
  addressList?: CustomerAddressItem[];
}
