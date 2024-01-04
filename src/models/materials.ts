export interface MaterialInformation {
  name?: string;
  price?: number;
  quantity?: number;
  unit?: string;
}
export interface Material {
  _id?: string;
  importDate?: string | Date | null;
  materialInfo?: MaterialInformation[];
  totalPrice?: number;
  updatedAt?: string;
}
