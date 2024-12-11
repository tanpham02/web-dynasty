import { Button } from '@nextui-org/button'
import { Chip, Input, useDisclosure } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useState } from 'react'

import EyeIcon from '~/assets/svg/eye.svg'
import Box from '~/components/Box'
import ButtonIcon from '~/components/ButtonIcon'
import { globalLoading } from '~/components/GlobalLoading'
import ModalConfirmDelete, {
  ModalConfirmDeleteState,
} from '~/components/ModalConfirmDelete'
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb'
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable'
import { CUSTOMER_TYPES } from '~/constants/customer'
import { QUERY_KEY } from '~/constants/queryKey'
import useDebounce from '~/hooks/useDebounce'
import usePagination from '~/hooks/usePagination'
import { Customer, CustomerStatus, CustomerType } from '~/models/customers'
import customerService from '~/services/customerService'
import { DATE_FORMAT_DDMMYYYY, formatDate } from '~/utils/date.utils'
import UserModal from './components/CustomerModal'

export interface ModalKey {
  visible?: boolean
  user?: Customer
}

const CustomerPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState(new Set([]))
  const [searchText, setSearchText] = useState<string>('')
  const [modal, setModal] = useState<{
    isEdit?: boolean
    customerId?: string
  }>({ isEdit: false })
  const [modalConfirmDelete, setModalConfirmDelete] =
    useState<ModalConfirmDeleteState>()

  const { enqueueSnackbar } = useSnackbar()

  const { pageIndex, pageSize, setPage, setRowPerPage } = usePagination()

  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onOpenChange: onOpenChangeModal,
    onClose,
  } = useDisclosure()

  const {
    isOpen: isOpenModalConfirmDeleteUser,
    onOpenChange: onOpenChangeModalConfirmDeleteCustomer,
  } = useDisclosure()

  const search = useDebounce(searchText, 500)

  const columns: ColumnType<Customer>[] = [
    {
      name: 'STT',
      render: (_customer: Customer, index?: number) => index! + 1,
    },
    {
      name: 'Hình ảnh',
      render: (customer: Customer) => (
        <Box className="rounded-2xl !h-[60px] !w-[60px] flex items-center justify-center bg-primary text-white font-semibold text-xl">
          {customer?.fullName
            ? customer.fullName.charAt(0)
            : customer?.email!.charAt(0).toUpperCase()}
        </Box>
      ),
    },
    {
      name: 'Họ tên',
      render: (customer: Customer) => customer?.fullName || '',
    },
    {
      name: 'Số điện thoại',
      render: (customer: Customer) => customer?.phoneNumber || '',
    },
    {
      name: 'Ngày đăng ký',
      render: (customer: Customer) =>
        customer?.createdAt
          ? formatDate(customer?.createdAt, DATE_FORMAT_DDMMYYYY)
          : '',
    },
    {
      name: 'Trạng thái',
      render: (customer: Customer) => (
        <Chip
          color={
            customer?.status === CustomerStatus.ACTIVE ? 'success' : 'danger'
          }
          variant="flat"
          classNames={{
            content: 'font-semibold',
          }}
        >
          {customer?.status === CustomerStatus.ACTIVE
            ? 'Đang hoạt động'
            : 'Ngừng hoạt động'}
        </Chip>
      ),
    },
    {
      name: 'Nhóm khách hàng',
      render: (customer: Customer) => (
        <Chip
          variant="dot"
          classNames={{
            content: 'font-semibold',
            dot: customer?.customerType
              ? CUSTOMER_TYPES?.[customer?.customerType as CustomerType]?.color
              : '',
          }}
        >
          {customer?.customerType
            ? CUSTOMER_TYPES?.[customer?.customerType as CustomerType]?.label
            : 'Không rõ'}
        </Chip>
      ),
    },
    {
      name: 'Hành động',
      render: (customer: Customer) => (
        <div className="flex items-center justify-center gap-2 text-green-500">
          <ButtonIcon
            title="Xem thông tin khách hàng"
            icon={EyeIcon}
            showArrow
            onClick={() => {
              setModal({
                isEdit: true,
                customerId: customer._id,
              })
              onOpenModal()
            }}
          />
        </div>
      ),
    },
  ]

  const {
    data: Customer,
    refetch: refetchUser,
    isLoading: isLoadingUser,
  } = useQuery(
    [QUERY_KEY.CUSTOMERS, search, pageIndex, pageSize],
    async () => {
      const params = {
        pageIndex: pageIndex - 1,
        pageSize: pageSize,
        fullName: search,
      }
      return await customerService.searchCustomerByCriteria(params)
    },
    {
      refetchOnWindowFocus: false,
    },
  )

  const handleDeleteUser = async () => {
    globalLoading.show()
    setModalConfirmDelete((prev) => ({
      ...prev,
      isLoading: true,
    }))
    let ids: string[] = []
    if (modalConfirmDelete?.id) {
      ids.push(modalConfirmDelete.id)
    }

    try {
      await customerService.deleteCustomer(ids)
      refetchUser()
      enqueueSnackbar({
        message: 'Xoá khách hàng thành công!',
      })
      setSelectedRowKeys(new Set([]))
    } catch (err) {
      console.log(err)
      enqueueSnackbar({
        message: 'Xoá nhân khách hàng bại!',
        variant: 'error',
      })
    } finally {
      onOpenChangeModalConfirmDeleteCustomer()
      setModalConfirmDelete((prev) => ({
        ...prev,
        isLoading: false,
      }))
      globalLoading.hide()
    }
  }

  return (
    <div>
      <CustomBreadcrumb
        pageName="Danh sách khách hàng"
        routes={[
          {
            label: 'Danh sách khách hàng',
          },
        ]}
      />
      <div>
        <div className="flex items-center mb-2 gap-2 flex-wrap">
          <div className="flex flex-1 items-center flex-wrap gap-2 min-w-fit">
            <Input
              size="md"
              variant="faded"
              className="w-full max-w-[300px] text-md"
              label="Tìm kiếm tên khách hàng..."
              classNames={{
                inputWrapper: 'bg-white',
                label: 'font-semibold',
                input: 'text-primary-text-color text-md',
              }}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              isClearable
              onClear={() => setSearchText('')}
            />
          </div>

          <div className="space-x-2 space-y-2 w-fit ml-auto">
            {selectedRowKeys && Array.from(selectedRowKeys).length ? (
              <Button
                color="danger"
                variant="shadow"
                onClick={() => {
                  setModalConfirmDelete({
                    desc: 'Bạn có chắc chắn muốn xoá danh sách khách hàng đã chọn không?',
                  })
                  onOpenChangeModalConfirmDeleteCustomer()
                }}
              >
                Xóa khách hàng đã chọn
              </Button>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>

      <CustomTable
        rowKey="_id"
        columns={columns}
        isLoading={isLoadingUser}
        data={Customer?.data}
        pagination
        tableName="Danh sách khách hàng"
        emptyContent="Không có khách hàng nào"
        selectedKeys={selectedRowKeys}
        onSelectionChange={(keys) => setSelectedRowKeys(keys as any)}
        page={pageIndex}
        totalPage={Customer?.totalPage}
        total={Customer?.totalElement}
        rowPerPage={pageSize}
        onChangePage={setPage}
        onChangeRowPerPage={setRowPerPage}
      />

      <UserModal
        isOpen={isOpenModal}
        onClose={onClose}
        onRefetch={refetchUser}
        onOpenChange={onOpenChangeModal}
        setModal={setModal}
        {...modal}
      />

      <ModalConfirmDelete
        {...modalConfirmDelete}
        onAgree={handleDeleteUser}
        isOpen={isOpenModalConfirmDeleteUser}
        onOpenChange={onOpenChangeModalConfirmDeleteCustomer}
      />
    </div>
  )
}

export default CustomerPage
