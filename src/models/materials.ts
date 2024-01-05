import { Moment } from 'moment';

export interface MaterialInformation {
  name?: string;
  price?: number;
  quantity?: number;
  unit?: string;
}
export interface Material {
  _id?: string;
  importDate?: string | Moment;
  materialInfo?: MaterialInformation[];
  totalPrice?: number;
  updatedAt?: string;
}
