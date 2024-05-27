import { StatusOrder } from '~/models/order'

export interface OrderStatusConvertType {
  label?: string
  color?: string
}

export const convertOrderStatus = (
  status?: StatusOrder,
): OrderStatusConvertType => {
  switch (status) {
    case StatusOrder.SUCCESS:
      return {
        color: '#4F6F52',
        label: 'Thành công',
      }
    case StatusOrder.CANCELED:
      return {
        color: '#FF9843',
        label: 'Hoàn trả hàng',
      }
    case StatusOrder.DELIVERING:
      return {
        color: '#86B6F6',
        label: 'Đang giao hàng',
      }
    case StatusOrder.FAIL:
      return {
        color: '#BF3131',
        label: 'Thất bại',
      }
    case StatusOrder.PENDING:
      return {
        color: '#EEC759',
        label: 'Chờ Xác nhận',
      }
    case StatusOrder.WAITING_FOR_DELIVERING:
      return {
        color: '#A367B1',
        label: 'Chờ giao hàng',
      }
    default:
      return {
        label: 'Không có',
        color: '#161A30',
      }
  }
}
