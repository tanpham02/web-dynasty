export interface Attribute {
  _id?: string;
  name: string;
  attributeList?: AttributeValue[];
}

export interface AttributeValue {
  _id?: string;
  name?: string;
  value?: string;
}
