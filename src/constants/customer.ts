import { CustomerType } from '~/models/customers';

export const CUSTOMER_TYPES: {
  [key: string]: { label: string; color: string };
} = {
  [`${CustomerType.NEW}`]: { label: 'Mới', color: 'bg-green-500' },
  [`${CustomerType.BUY_THE_MOST_ORDERS}`]: { label: 'Mua nhiều', color: 'bg-sky-500' },
  [`${CustomerType.EXIST}`]: { label: 'Không hoạt động', color: 'bg-red-500' },
  [`${CustomerType.POTENTIAL}`]: { label: 'Tiềm năng', color: 'bg-orange-500' },
};
