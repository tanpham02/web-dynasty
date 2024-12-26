import { OrderPaymentMethod, StatusOrder } from '~/models/order'

import WaitingIcon from '~/assets/svg/hourglass.svg'
import NewIcon from '~/assets/svg/new.svg'
import OrderSuccessIcon from '~/assets/svg/order-success.svg'
import ShippingIcon from '~/assets/svg/shipping.svg'
import WaitingPickupIcon from '~/assets/svg/waiting-pickup.svg'

export const ORDER_STATUSES: {
  [key: string]: { color: string; label: string; icon: string }
} = {
  [`${StatusOrder.WAITING_FOR_PAYMENT}`]: {
    color: '#7D7C7C',
    label: 'Chờ thanh toán',
    icon: NewIcon,
  },
  [`${StatusOrder.PENDING}`]: {
    color: '#FFB534',
    label: 'Chờ xác nhận',
    icon: WaitingIcon,
  },
  [`${StatusOrder.WAITING_FOR_DELIVERING}`]: {
    color: '#820300',
    label: 'Chờ lấy hàng',
    icon: WaitingPickupIcon,
  },
  [`${StatusOrder.DELIVERING}`]: {
    color: '#4CB9E7',
    label: 'Đang giao hàng',
    icon: ShippingIcon,
  },
  [`${StatusOrder.SUCCESS}`]: {
    color: '#65B741',
    label: 'Hoàn thành',
    icon: OrderSuccessIcon,
  },
  // [`${StatusOrder.CANCELED}`]: {
  //   color: '#22092C',
  //   label: 'Hoàn trả',
  //   icon: OrderReturnIcon,
  // },
}

export const ORDER_PAYMENT_METHODS: {
  [key: string]: { label: string }
} = {
  [`${OrderPaymentMethod.ATM_CARD}`]: {
    label: 'Thẻ ATM',
  },
  [`${OrderPaymentMethod.CASH}`]: {
    label: 'Tiền mặt',
  },
  [`${OrderPaymentMethod.MOMO}`]: {
    label: 'Ví Momo',
  },
  [`${OrderPaymentMethod.SHOPEE_PAY}`]: {
    label: 'Ví ShopeePay',
  },
  [`${OrderPaymentMethod.ZALO_PAY}`]: {
    label: 'Ví ZaloPay',
  },
}
