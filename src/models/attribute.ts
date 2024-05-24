export interface Attribute {
  _id?: string;
  name: string;
  attributeList: AttributeValue[];
  createdAt?: string;
  updatedAt?: string;
  categoryId?: string | string[];
}

export interface AttributeValue {
  _id?: string;
  label?: string;
  priceAdjustmentValue?: number;
}
