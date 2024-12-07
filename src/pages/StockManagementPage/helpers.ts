import { StockManagementTypes } from '~/models/stockManagements'

export const stockManagementOptions = [
  {
    label: 'Nhập kho',
    value: StockManagementTypes.IMPORT,
  },
  {
    label: 'Xuất kho',
    value: StockManagementTypes.EXPORT,
  },
]
