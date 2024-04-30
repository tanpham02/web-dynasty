export interface StoreModel {
  _id?: string;
  name?: string;
  location?: string;
  phoneNumber?: string;
  cityId?: string | string[];
  city?: string;
  districtId?: string | string[];
  district?: string;
  wardId?: string | string[];
  ward?: string;
  longitude?: string;
  latitude?: string;
  createAt?: string;
  updatedAt?: string;
}
