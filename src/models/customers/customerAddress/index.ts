export interface CustomerAddressItem {
  location?: string;
  city?: string;
  cityId?: string;
  district?: string;
  districtId?: string;
  ward?: string;
  wardId?: string;
  latitude?: string;
  longitude?: string;
  fullName?: string;
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
