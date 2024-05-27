import {
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Selection,
  useDisclosure,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { DatePicker } from 'antd'
import moment, { Moment } from 'moment'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import Svg from 'react-inlinesvg'
import { Link } from 'react-router-dom'

import ArrowDownIcon from '~/assets/svg/arrow-down.svg'
import InfoIcon from '~/assets/svg/info.svg'
import Box from '~/components/Box'
import ButtonIcon from '~/components/ButtonIcon'
import { globalLoading } from '~/components/GlobalLoading'
import ModalConfirmDelete, {
  ModalConfirmDeleteState,
} from '~/components/ModalConfirmDelete'
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb'
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable'
import { ORDER_STATUSES } from '~/constants/order'
import { QUERY_KEY } from '~/constants/queryKey'
import usePagination from '~/hooks/usePagination'
import { Order, StatusOrder } from '~/models/order'
import orderService from '~/services/orderService'
import { SearchParams } from '~/types'
import {
  DATE_FORMAT_DDMMYYYY,
  DATE_FORMAT_HHMMSS,
  DATE_FORMAT_YYYYMMDD,
  formatDate,
} from '~/utils/date.utils'
import { getLocationLinkByAddress } from '~/utils/googleMapUtil'
import { formatCurrencyVND } from '~/utils/number'
import OrderDetailModal from './components/OrderDetailModal'

const OrderPage = () => {
  const { isOpen: isOpenModal, onOpenChange: onOpenChangeModal } =
    useDisclosure()

  const {
    isOpen: isOpenModalDelete,
    // onOpen: onOpenModalDelete,
    onOpenChange: onOpenChangeModalDelete,
  } = useDisclosure()

  const [modalDelete, setModalDelete] = useState<ModalConfirmDeleteState>()
  const [orderSelectedKeys, setOrderSelectedKeys] = useState<Selection>()
  const [modalId, setModalId] = useState<string>()

  const { pageIndex, pageSize, setPage, setRowPerPage } = usePagination()
  const [filterImportDate, setFilterImportDate] = useState<Moment[]>([])

  const { enqueueSnackbar } = useSnackbar()

  const columns: ColumnType<Order>[] = [
    {
      name: '#',
      render: (order: Order, index?: number) => (
        <Box className="flex flex-col">
          <span>{(index || 0) + 1 + (pageIndex - 1) * 10}</span>
          {order?.createdAt ? (
            <>
              <span className="text-[13px]">
                {formatDate(order.createdAt, DATE_FORMAT_HHMMSS)}
              </span>
              <span className="text-[13px]">
                {formatDate(order.createdAt, DATE_FORMAT_DDMMYYYY)}
              </span>
            </>
          ) : (
            ''
          )}
        </Box>
      ),
    },
    {
      name: 'Khách hàng',
      render: (order: Order) => {
        const address = [
          order?.location,
          order?.ward,
          order?.district,
          order?.city,
        ]
          .filter((value) => Boolean(value))
          .join(', ')
        return (
          <Box className="flex flex-col">
            <span>{order?.fullName}</span>
            {order?.phoneNumber && (
              <Link to={`tel:${order.phoneNumber}`} className="text-[13px]">
                {order.phoneNumber}
              </Link>
            )}
            {address && (
              <Link
                target="_blank"
                to={getLocationLinkByAddress(address)}
                className="text-[13px]"
              >
                {address}
              </Link>
            )}
          </Box>
        )
      },
    },
    {
      name: <Box className="flex justify-center">Số lượng sản phẩm</Box>,
      render: (order: Order) => (
        <Box className="flex justify-center">
          {order?.products?.length || 0}
        </Box>
      ),
    },
    {
      name: <Box className="flex justify-center">Tổng giá trị</Box>,
      render: (order: Order) => (
        <Box className="flex justify-center">
          {formatCurrencyVND(order?.total || 0)}
        </Box>
      ),
    },
    {
      name: <Box className="flex justify-center">Trạng thái</Box>,
      render: (order: Order) => {
        return (
          <Box className="flex justify-center">
            <Dropdown>
              <DropdownTrigger>
                <Chip
                  style={{
                    backgroundColor: order?.orderStatus
                      ? ORDER_STATUSES?.[order.orderStatus]?.color
                      : '#191919',
                  }}
                  classNames={{
                    content:
                      'flex items-center space-x-2 text-white cursor-pointer',
                  }}
                >
                  <span>
                    {order?.orderStatus
                      ? ORDER_STATUSES?.[order.orderStatus]?.label
                      : 'Không có'}
                  </span>
                  <Svg src={ArrowDownIcon} className="w-5 h-5" />
                </Chip>
              </DropdownTrigger>
              <DropdownMenu aria-label="Order Status">
                {Object.keys(ORDER_STATUSES).map((key) => (
                  <DropdownItem
                    onClick={() =>
                      handleChangeOrderStatus(order?._id, key as StatusOrder)
                    }
                    key={key}
                  >
                    <Svg
                      src={ORDER_STATUSES?.[key]?.icon}
                      className="w-4 h-4 inline-block mr-2"
                    />{' '}
                    <span className="font-semibold">
                      {ORDER_STATUSES?.[key]?.label}
                    </span>
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </Box>
        )
      },
    },
    {
      name: <Box className="flex justify-center">Hành động</Box>,
      render: (order: Order) => {
        return (
          <Box className="flex justify-center space-x-2">
            <ButtonIcon
              icon={InfoIcon}
              title="Xem chi tiết đơn hàng"
              onClick={() => handleOpenModalOrderDetail(order)}
            />
            {/* {(order?.orderType === StatusCheckout.VERIFY_INFORMATION ||
              order?.statusOrder === StatusOrder.WAITING_FOR_PAYMENT) && (
              <ButtonIcon
                icon={DeleteIcon}
                title="Xóa đơn hàng này"
                status="danger"
                onClick={() => handleOpenDeleteModal(order)}
              />
            )} */}
          </Box>
        )
      },
    },
  ]

  const {
    data: orders,
    isLoading: isLoadingOrders,
    isFetching: isFetchingOrders,
    isRefetching: isRefetchingOrders,
    refetch: refetchOrders,
  } = useQuery(
    [QUERY_KEY.ORDER, pageIndex, pageSize, filterImportDate],
    async () => {
      let params: SearchParams = {
        pageSize: pageSize,
        pageIndex: pageIndex - 1,
      }

      if (filterImportDate.length > 0) {
        params = {
          ...params,
          from: moment(filterImportDate?.[0]?.toString()).format(
            DATE_FORMAT_YYYYMMDD,
          ),
          to: moment(filterImportDate?.[1]?.toString()).format(
            DATE_FORMAT_YYYYMMDD,
          ),
        }
      }
      return await orderService.searchPagination(params)
    },
    {
      refetchOnWindowFocus: false,
    },
  )

  // const handleOpenDeleteModal = (order: Order) => {
  //   setModalDelete({
  //     id: order?._id,
  //     desc: `Bạn có chắc muốn xóa đơn hàng này không?`,
  //   })
  //   onOpenModalDelete()
  // }

  const onCloseMaterialDeleteModal = () => {
    setModalDelete({})
    onOpenChangeModalDelete()
  }

  const handleDeleteOrder = async () => {
    try {
      setModalDelete((prev) => ({ ...prev, isLoading: true }))
      await orderService.delete(modalDelete?.id)
      enqueueSnackbar('Xóa đơn hàng thành công!')
    } catch (err) {
      enqueueSnackbar('Có lỗi xảy ra khi xóa đơn hàng!', {
        variant: 'error',
      })
      console.log('🚀 ~ file: index.tsx:112 ~ handleDeleteOrder ~ err:', err)
    } finally {
      await refetchOrders()
      onCloseMaterialDeleteModal()
    }
  }

  const handleOpenModalOrderDetail = (order: Order) => {
    if (order?._id) {
      setModalId(order._id)
      onOpenChangeModal()
    }
  }

  const handleChangeFilterImportDate = (range: [Moment, Moment]) => {
    if (Array.isArray(range) && range.length === 2) {
      const [start, end] = range
      setFilterImportDate([start, end])
    } else {
      setFilterImportDate([])
    }
  }

  const handleChangeOrderStatus = async (
    orderId?: string,
    status?: StatusOrder,
  ) => {
    if (orderId && status)
      try {
        globalLoading.show()
        await orderService.updateOrderStatus(orderId, status)
        enqueueSnackbar('Cập nhật trạng thái đơn hàng thành công!')
      } catch (err) {
        enqueueSnackbar('Cập nhật trạng thái đơn hàng thất bại!', {
          variant: 'error',
        })
        console.log(
          '🚀 ~ file: index.tsx:224 ~ handleChangeOrderStatus ~ err:',
          err,
        )
      } finally {
        await refetchOrders()
        globalLoading.hide()
      }
  }

  return (
    <Box>
      <CustomBreadcrumb
        pageName="Danh sách đơn hàng"
        routes={[
          {
            label: 'Danh sách đơn hàng',
          },
        ]}
      />
      <Box className="flex items-end mb-2">
        <DatePicker.RangePicker
          size="middle"
          className="max-w-[300px]"
          value={
            Array.isArray(filterImportDate) && filterImportDate.length === 2
              ? [filterImportDate[0], filterImportDate[1]]
              : undefined
          }
          onChange={(range) =>
            handleChangeFilterImportDate(range as [Moment, Moment])
          }
        />
      </Box>
      <CustomTable
        pagination
        rowKey="_id"
        selectionMode="none"
        columns={columns}
        data={orders?.data}
        tableName="Danh sách đơn hàng"
        emptyContent="Không có đơn hàng nào"
        selectedKeys={orderSelectedKeys}
        onSelectionChange={setOrderSelectedKeys}
        totalPage={orders?.totalPage || 0}
        total={orders?.totalElement}
        page={pageIndex}
        rowPerPage={pageSize}
        onChangePage={setPage}
        onChangeRowPerPage={setRowPerPage}
        isLoading={isLoadingOrders || isFetchingOrders || isRefetchingOrders}
      />
      <ModalConfirmDelete
        isOpen={isOpenModalDelete}
        onOpenChange={onOpenChangeModalDelete}
        desc={modalDelete?.desc}
        onAgree={handleDeleteOrder}
        isLoading={modalDelete?.isLoading}
      />
      <OrderDetailModal
        orderId={modalId}
        isOpen={isOpenModal}
        onOpenChange={onOpenChangeModal}
      />
    </Box>
  )
}

export default OrderPage
