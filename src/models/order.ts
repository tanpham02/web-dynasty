enum StatusOrder {
  WAITING_FOR_DELIVERING = 'WAITING_FOR_DELIVERING',
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

enum TimeOrder {
  NOW = 'NOW',
  SELECT_DATE_TIME = 'SELECT_DATE_TIME',
}

export interface Order {
  _id?: string;
  customerId?: string;
  shipFee?: number;
  statusOrder?: StatusOrder;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  city?: string;
  district?: string;
  ward?: string;
  totalOrder?: number;
  typeOrder?: TypeOrder;
  timeOrder: TimeOrder;
  dateSelect?: Date | string;
  timeSelect?: Date | string;
  voucherId?: string;
  systemStoreId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  reasonCancelOrder?: string;
}

export { StatusOrder, TypeOrder, TimeOrder };
