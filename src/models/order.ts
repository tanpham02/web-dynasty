import { Product, ProductMain } from './product';

enum StatusOrder {
  WAITING_FOR_DELIVERING = 'WAITING_FOR_DELIVERING',
  WAITING_FOR_PAYMENT = 'WAITING_FOR_PAYMENT',
  PENDING = 'PENDING',
  DELIVERING = 'DELIVERING',
  FAIL = 'FAIL',
  CANCELED = 'CANCELED',
  SUCCESS = 'SUCCESS',
}
enum TypeOrder {
  ORDER_TO_PICK_UP = 'ORDER_TO_PICK_UP',
  ORDER_DELIVERING = 'ORDER_DELIVERING',
}

enum StatusCheckout {
  VERIFY_INFORMATION = 'VERIFY_INFORMATION',
  ORDER_CONFIRMATION = 'ORDER_CONFIRMATION',
}

enum PaymentMethod {
  PAYMENT_ON_DELIVERY = 'PAYMENT_ON_DELIVERY',
  MONO = 'MONO',
  ATM_CARD = 'ATM_CARD',
  SHOPEE_PAY = 'SHOPEE_PAY',
  ZALO_PAY = 'ZALO_PAY',
}

enum TimeOrder {
  NOW = 'NOW',
  SELECT_DATE_TIME = 'SELECT_DATE_TIME',
}

export interface Order {
  customerId?: string;
  productsFromCart?: ProductFromCart[];
  productsWhenTheCustomerIsNotLoggedIn?: string[];
  _id?: string;
  shipFee?: number;
  totalAmountBeforeUsingDiscount?: number;
  statusOrder?: StatusOrder;
  fullName?: string;
  phoneNumber?: string;
  location?: string;
  city?: string;
  cityId?: number | number[];
  district?: string;
  districtId?: number | number[];
  ward?: string;
  wardId?: number | number[];
  typeOrder?: TypeOrder;
  statusCheckout?: StatusCheckout;
  paymentMethod?: PaymentMethod;
  orderReceivingTime?: 'NOW';
  dateTimeOrderReceive?: string;
  voucherId?: string;
  orderAtStore?: string;
  reasonOrderCancel?: string;
  totalOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFromCart {
  product?: {
    createdAt?: string;
    parentId?: string;
    productItem?: ProductMain;
    updatedAt?: string;
    _id?: string;
  };
  productQuantities?: number;
  _id?: string;
}

export { StatusOrder, TypeOrder, TimeOrder, StatusCheckout, PaymentMethod };
