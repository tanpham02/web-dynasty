import { Card, CardBody, CardHeader, Chip, Image } from '@nextui-org/react';
import Svg from 'react-inlinesvg';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useMemo } from 'react';

import Box from '~/components/Box';
import BoxIcon from '~/assets/svg/box.svg';
import UserIcon from '~/assets/svg/user-circle.svg';
import PaymentIcon from '~/assets/svg/payment.svg';

import CustomModal from '~/components/NextUI/CustomModal';
import { QUERY_KEY } from '~/constants/queryKey';
import orderService from '~/services/orderService';
import DataRow from '../DataRow';
import { DATE_FORMAT_DDMMYYYYHHMMSS, formatDate } from '~/utils/date.utils';
import { formatCurrencyVND } from '~/utils/number';
import { globalLoading } from '~/components/GlobalLoading';
import { getFullImageUrl } from '~/utils/image';
import { ORDER_PAYMENT_METHODS, ORDER_STATUSES } from '~/constants/order';
import { OrderType } from '~/models/order';

interface OrderDetailModalProps {
  isOpen?: boolean;
  onOpenChange?(): void;
  orderId?: string;
}

const OrderDetailModal = ({
  isOpen,
  onOpenChange,
  orderId,
}: OrderDetailModalProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const { data: orderDetail } = useQuery(
    [QUERY_KEY.ORDER, orderId],
    async () => {
      try {
        globalLoading.show();
        return await orderService.getOrderById(orderId);
      } catch (err) {
        enqueueSnackbar('Có lỗi xảy ra khi lấy thông tin đơn hàng!', {
          variant: 'error',
        });
        onOpenChange?.();
        console.log(
          '🚀 ~ file: index.tsx:25 ~ const{data:orderDetail}=useQuery ~ err:',
          err,
        );
      } finally {
        globalLoading.hide();
      }
    },
    { enabled: Boolean(orderId && open) },
  );

  const address = useMemo(() => {
    return [
      orderDetail?.location,
      orderDetail?.ward,
      orderDetail?.district,
      orderDetail?.city,
    ]
      .filter((value) => Boolean(value))
      .join(', ');
  }, [orderDetail]);

  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      controls={false}
      className="w-full max-w-[1000px]"
      title="Chi tiết đơn hàng"
      classNames={{
        body: 'pb-8',
      }}
    >
      <Box className="grid grid-cols-[3fr_2fr] gap-4 items-start">
        <Box className="space-y-4">
          <Card shadow="none" className="border border-zinc-300">
            <CardHeader>
              <Svg src={UserIcon} className="w-5 h-5 mr-2" />
              <span className="text-base font-semibold">
                Thông tin khách hàng
              </span>
            </CardHeader>
            <CardBody className="px-4 space-y-2">
              <DataRow label="Tên khách hàng" value={orderDetail?.fullName} />
              <DataRow label="Số điện thoại" value={orderDetail?.phoneNumber} />
              <DataRow label="Địa chỉ giao hàng" value={address} />
            </CardBody>
          </Card>
          <Card shadow="none" className="border border-zinc-300">
            <CardHeader>
              <Svg src={BoxIcon} className="w-5 h-5 mr-2" />
              <span className="text-base font-semibold">
                Thông tin sản phẩm
              </span>
            </CardHeader>
            <CardBody className="space-y-4">
              {orderDetail?.products?.map((productOrder, index) => (
                <Box key={index} className="flex justify-between">
                  <Box className="flex items-start space-x-2">
                    <Image
                      src={getFullImageUrl(productOrder?.product?.image)}
                      className="w-6 h-6"
                    />
                    <span>
                      {productOrder?.product?.name} x {productOrder?.quantity}
                    </span>
                  </Box>
                  <span className="font-semibold">
                    {formatCurrencyVND(productOrder?.product?.price || 0)}
                  </span>
                </Box>
              ))}
            </CardBody>
          </Card>
        </Box>
        <Card shadow="none" className="border border-zinc-300">
          <CardHeader>
            <Svg src={PaymentIcon} className="w-5 h-5 mr-2" />
            <span className="text-base font-semibold">Thông tin khác</span>
          </CardHeader>
          <CardBody className="px-4 space-y-3">
            <DataRow
              label="Trạng thái đơn hàng"
              className="flex justify-between"
              value={
                <Chip
                  size="sm"
                  className="text-right"
                  style={{
                    backgroundColor: orderDetail?.orderStatus
                      ? ORDER_STATUSES?.[orderDetail.orderStatus]?.color
                      : '#191919',
                  }}
                  classNames={{
                    content:
                      'flex items-center space-x-2 text-white cursor-pointer',
                  }}
                >
                  {orderDetail?.orderStatus
                    ? ORDER_STATUSES?.[orderDetail?.orderStatus]?.label
                    : 'Không có'}
                </Chip>
              }
            />
            <DataRow
              label="Thời gian đặt hàng"
              className="flex justify-between"
              value={
                <span className="text-right">
                  {orderDetail?.createdAt
                    ? formatDate(
                        orderDetail.createdAt,
                        DATE_FORMAT_DDMMYYYYHHMMSS,
                      )
                    : ''}
                </span>
              }
            />
            <DataRow
              label="Thời gian nhận hàng"
              className="flex justify-between"
              value={
                <span className="text-right">
                  {orderDetail?.orderReceivingTime
                    ? 'Nhận ngay sau 30 phút'
                    : ''}
                </span>
              }
            />
            <DataRow
              label="Phương thức thanh toán"
              className="flex justify-between"
              value={
                <span className="text-right">
                  {orderDetail?.paymentMethod
                    ? ORDER_PAYMENT_METHODS?.[orderDetail?.paymentMethod].label
                    : ''}
                </span>
              }
            />
            <DataRow
              label="Phí giao hàng"
              className="flex justify-between"
              value={
                <span>{formatCurrencyVND(orderDetail?.shipFee || 0)}</span>
              }
            />
            <DataRow
              label="Tổng thanh toán"
              className="flex justify-between"
              value={
                <span className="text-right font-bold text-base">
                  {formatCurrencyVND(orderDetail?.total || 0)}
                </span>
              }
            />
          </CardBody>
        </Card>
      </Box>
    </CustomModal>
  );
};

export default OrderDetailModal;
