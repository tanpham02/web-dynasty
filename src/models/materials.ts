export interface MaterialInformation {
  name?: string;
  price?: number;
  quantity?: string;
}
export interface Material {
  importDate?: string | Date | null;
  materialInfo?: MaterialInformation[];
  totalPrice?: number;
  _id?: string;
  updatedAt?: string;
}
