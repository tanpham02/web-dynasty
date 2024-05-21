export interface Attribute {
  _id?: string;
  name: string;
  attributeList: AttributeValue[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AttributeValue {
  _id?: string;
  label?: string;
}
