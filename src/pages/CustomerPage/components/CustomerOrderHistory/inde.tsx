import { Chip } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import Box from '~/components/Box'

import { globalLoading } from '~/components/GlobalLoading'
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable'
import { QUERY_KEY } from '~/constants/queryKey'
import useAddress from '~/hooks/useAddress'
import usePagination from '~/hooks/usePagination'
import { CustomerAddressItem } from '~/models/customers/customerAddress'
import { Order } from '~/models/order'
import customerAddressService from '~/services/customerService/customerAddressService'
import orderService from '~/services/orderService'
import { DATE_FORMAT_DDMMYYYYHHMMSS, formatDate } from '~/utils/date.utils'

interface CustomerOrderHistoryProps {
  customerId?: string
  isActive?: boolean
}

const CustomerOrderHistory = ({
  customerId,
  isActive,
}: CustomerOrderHistoryProps) => {
  const { pageIndex, pageSize, setPage, setRowPerPage } = usePagination()

  const columns: ColumnType<Order>[] = [
    {
      name: '#',
      render: (order: Order) => (
        <Box>
          <p>#{order?._id}</p>
          {order?.createdAt && (
            <p>{formatDate(order.createdAt, DATE_FORMAT_DDMMYYYYHHMMSS)}</p>
          )}
        </Box>
      ),
    },
    {
      name: 'Tên người nhận',
      render: (order: Order) => order?.fullName,
    },
    {
      name: 'Số điện thoại',
      render: (order: Order) => order?.phoneNumber,
    },
    {
      name: 'Địa chỉ',
      render: (order: Order) => <CustomerAddressName {...order} />,
    },
    {
      name: 'Sản phẩm',
      render: (order: Order) => (
        <Box className="space-y-2">
          {order?.products?.map((productOrder, index) => (
            <Box key={index} className="flex items-center text-sm">
              <Box className="min-w-[30px]">x{productOrder?.quantity}</Box>{' '}
              <Box>{productOrder?.product?.name}</Box>
            </Box>
          ))}
        </Box>
      ),
    },
  ]

  const { data: customerOrders, isLoading: isLoadingCustomerOrders } = useQuery(
    {
      queryKey: [QUERY_KEY.CUSTOMER_ORDER, customerId, pageIndex, pageSize],
      queryFn: async () =>
        customerId
          ? await orderService.searchPagination({
              customerId,
              sortBy: 'createdAt:desc',
              pageIndex: pageIndex - 1,
              pageSize,
            })
          : null,
      enabled: Boolean(customerId && isActive),
    },
  )

  return (
    <div>
      <CustomTable
        pagination
        rowKey="_id"
        page={pageIndex}
        columns={columns}
        rowPerPage={pageSize}
        onChangePage={setPage}
        data={customerOrders?.data}
        onChangeRowPerPage={setRowPerPage}
        isLoading={isLoadingCustomerOrders}
        total={customerOrders?.totalElement}
        totalPage={customerOrders?.totalPage}
        emptyContent="Không có đơn hàng đã mua nào"
        tableName="Danh sách đơn hàng của khách hàng"
      />
    </div>
  )
}

export default CustomerOrderHistory

interface CustomerAddressNameProps extends CustomerAddressItem {}

const CustomerAddressName = ({
  cityId,
  districtId,
  wardId,
  location,
}: CustomerAddressNameProps) => {
  const { addressInfo } = useAddress({
    cityId,
    districtId,
    wardId,
    location,
  })
  return <>{addressInfo}</>
}
