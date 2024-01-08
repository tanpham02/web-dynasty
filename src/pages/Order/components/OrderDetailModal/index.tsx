import { Card, CardBody, CardHeader } from '@nextui-org/react';
import Svg from 'react-inlinesvg';

import Box from '~/components/Box';
import BoxIcon from '~/assets/svg/box.svg';
import UserIcon from '~/assets/svg/user-circle.svg';
import PaymentIcon from '~/assets/svg/payment.svg';

import CustomModal from '~/components/NextUI/CustomModal';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '~/constants/queryKey';
import orderService from '~/services/orderService';
import DataRow from '../DataRow';
import { useMemo } from 'react';
import { DATE_FORMAT_DDMMYYYYHHMMSS, formatDate } from '~/utils/date.utils';
import { formatCurrencyVND } from '~/utils/number';

const OrderDetailModal = () => {
  const { data: orderDetail, isFetching: isFetchingOrderDetail } = useQuery(
    [QUERY_KEY.ORDER],
    async () => await orderService.getOrderById('65982dc1bd687e5d728fc6a3'),
  );

  const address = useMemo(() => {
    return [orderDetail?.location, orderDetail?.ward, orderDetail?.district, orderDetail?.city]
      .filter((value) => Boolean(value))
      .join(', ');
  }, [orderDetail]);

  return (
    <CustomModal
      isOpen
      controls={false}
      className="w-full max-w-[1000px]"
      title="Chi tiết đơn hàng"
      classNames={{
        body: 'pb-8',
      }}
    >
      <Box className="grid grid-cols-[3fr_2fr] gap-4">
        <Box className="space-y-4">
          <Card shadow="none" className="border border-zinc-300">
            <CardHeader>
              <Svg src={UserIcon} className="w-5 h-5 mr-2" />
              <span className="text-base font-semibold">Thông tin khách hàng</span>
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
              <span className="text-base font-semibold">Thông tin sản phẩm</span>
            </CardHeader>
            <CardBody className="px-4">
              {orderDetail?.productsFromCart?.map((product) => <Box>{product?.product?.name}</Box>)}
            </CardBody>
          </Card>
        </Box>
        <Card shadow="none" className="border border-zinc-300">
          <CardHeader>
            <Svg src={PaymentIcon} className="w-5 h-5 mr-2" />
            <span className="text-base font-semibold">Thông tin khác</span>
          </CardHeader>
          <CardBody className="px-4 space-y-2">
            <DataRow
              label="Thời gian đặt hàng"
              className="grid-cols-[5fr_5fr]"
              value={
                orderDetail?.createdAt
                  ? formatDate(orderDetail.createdAt, DATE_FORMAT_DDMMYYYYHHMMSS)
                  : ''
              }
            />
            <DataRow
              label="Thời gian nhận hàng"
              className="grid-cols-[5fr_5fr]"
              value={orderDetail?.orderReceivingTime ? 'Nhận ngay sau 30 phút' : ''}
            />
            <DataRow
              label="Phương thức thanh toán"
              className="grid-cols-[5fr_5fr]"
              value={
                orderDetail?.createdAt
                  ? formatDate(orderDetail.createdAt, DATE_FORMAT_DDMMYYYYHHMMSS)
                  : ''
              }
            />
            <DataRow
              label="Phí giao hàng"
              className="grid-cols-[5fr_5fr]"
              value={formatCurrencyVND(orderDetail?.shipFee || 0)}
            />
            <DataRow
              label="Tổng thanh toán"
              className="grid-cols-[5fr_5fr]"
              value={formatCurrencyVND(orderDetail?.totalOrder || 0)}
            />
          </CardBody>
        </Card>
      </Box>
    </CustomModal>
  );
};

export default OrderDetailModal;
