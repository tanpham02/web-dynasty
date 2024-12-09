import { Button, Selection, SelectItem, useDisclosure } from '@nextui-org/react'
import { pdf } from '@react-pdf/renderer'
import { useQuery } from '@tanstack/react-query'
import { DatePicker } from 'antd'
import moment, { Moment } from 'moment'
import { useSnackbar } from 'notistack'
import { useId, useMemo, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import DeleteIcon from '~/assets/svg/delete.svg'
import DownloadIcon from '~/assets/svg/download.svg'
import EditIcon from '~/assets/svg/edit.svg'
import { FormContextSelect, Text } from '~/components'
import Box from '~/components/Box'
import ButtonIcon from '~/components/ButtonIcon'
import { globalLoading } from '~/components/GlobalLoading'
import ModalConfirmDelete, {
  ModalConfirmDeleteState,
} from '~/components/ModalConfirmDelete'
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb'
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable'
import { QUERY_KEY } from '~/constants/queryKey'
import usePagination from '~/hooks/usePagination'
import {
  StockManagementInformation,
  StockManagementTypes,
} from '~/models/stockManagements'
import ingredientService from '~/services/ingredientService'
import stockManagementService from '~/services/stockManagementService'
import { SearchParams } from '~/types'
import {
  DATE_FORMAT_DDMMYYYY,
  DATE_FORMAT_YYYYMMDD,
  formatDate,
} from '~/utils/date.utils'
import { formatCurrencyVND } from '~/utils/number'
import { stockManagementOptions } from './helpers'
import Ingredients from './Ingredients'
import StockManagementBillDetail from './StockManagementBillDetail'
import StockManagementModal from './StockManagementModal'

const StockManagementPage = () => {
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onOpenChange: onOpenChangeModal,
  } = useDisclosure()

  const {
    isOpen: isOpenModalDelete,
    onOpen: onOpenModalDelete,
    onOpenChange: onOpenChangeModalDelete,
  } = useDisclosure()

  const [modalDelete, setModalDelete] = useState<ModalConfirmDeleteState>()
  const [stockManagementSelectedKeys, setStockManagementSelectedKeys] =
    useState<Selection>()
  const [modal, setModal] = useState<{
    isEdit?: boolean
    stockId?: string
  }>()

  const { pageIndex, pageSize, setPage, setRowPerPage } = usePagination()
  const ingredientPagination = usePagination()

  const [filterImportDate, setFilterImportDate] = useState<Moment[]>([])

  const { enqueueSnackbar } = useSnackbar()

  const containerRef = useRef<HTMLDivElement>(null)

  const containerId = useId()

  const form = useForm({
    defaultValues: {
      stockManagementType: [StockManagementTypes.IMPORT],
    },
  })
  const { watch } = form

  const stockManagementType = watch('stockManagementType')
  const isImport = stockManagementType.includes(StockManagementTypes.IMPORT)

  const columns: ColumnType<StockManagementInformation>[] = [
    {
      name: 'STT',
      render: (_category: StockManagementInformation, index?: number) =>
        (index || 0) + 1 + (pageIndex - 1) * 10,
      hide: false,
    },
    {
      name: `Ngày ${isImport ? 'Nhập' : 'Xuất'}`,
      render: (stockManagement: StockManagementInformation) =>
        stockManagement?.date
          ? formatDate(stockManagement.date as string, DATE_FORMAT_DDMMYYYY)
          : '',
      hide: false,
    },
    {
      name: (
        <Box className="flex justify-center">Số lượng loại nguyên liệu</Box>
      ),
      render: (stockManagement: StockManagementInformation) => (
        <Box className="flex justify-center">
          {stockManagement?.stockManagementInfo?.length || 0}
        </Box>
      ),
      hide: false,
    },
    {
      name: <Box className="flex justify-end">Tổng giá trị</Box>,
      render: (stockManagement: StockManagementInformation) => (
        <Box className="flex justify-end">
          {`${formatCurrencyVND(stockManagement?.totalPrice || 0)} đ`}
        </Box>
      ),
      hide: !isImport,
    },
    {
      name: <Box className="flex justify-center">Ghi chú</Box>,
      render: (stockManagement: StockManagementInformation) => (
        <Text className="text-center line-clamp-2">
          {stockManagement?.note || '-'}
        </Text>
      ),
      width: 500,
      hide: !!isImport,
    },
    {
      name: <Box className="flex justify-end mr-4">Hành động</Box>,
      render: (stockManagement: StockManagementInformation) => {
        const isDisableEdit = !(
          moment().month() == moment(stockManagement?.date).month()
        )

        return (
          <div className="flex justify-end space-x-2">
            <ButtonIcon
              disable={isDisableEdit || stockManagement?.isExported}
              icon={EditIcon}
              title={
                isDisableEdit
                  ? 'Bạn chỉ có thể sửa hóa đơn tháng hiện tại'
                  : 'Chỉnh sửa hóa đơn'
              }
              onClick={() => handleOpenModalEdit(stockManagement)}
            />
            <ButtonIcon
              icon={DownloadIcon}
              title="Xuất hóa đơn"
              onClick={() => handleDownload(stockManagement)}
            />
            <ButtonIcon
              icon={DeleteIcon}
              disable={isDisableEdit || stockManagement?.isExported}
              title={
                isDisableEdit
                  ? 'Bạn chỉ có thể xóa hóa đơn tháng hiện tại'
                  : 'Xóa hóa đơn này'
              }
              onClick={() => handleOpenDeleteModal(stockManagement)}
              status="danger"
            />
          </div>
        )
      },
      hide: false,
    },
  ]?.filter((item) => !item.hide)

  const stockManagementResponse = useQuery(
    [
      QUERY_KEY.STOCK_MANAGEMENTS,
      pageIndex,
      pageSize,
      filterImportDate,
      stockManagementType,
    ],
    async () => {
      let params: SearchParams = {
        pageSize: 20,
        pageIndex: pageIndex - 1,
        stockType: stockManagementType[0],
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

      return await stockManagementService.searchPagination(params)
    },
    {
      refetchOnWindowFocus: false,
    },
  )

  const ingredientsResponse = useQuery(
    [QUERY_KEY.INGREDIENTS, pageIndex, pageSize, filterImportDate],
    async () => {
      let params: SearchParams = {
        pageSize: 20,
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

      return await ingredientService.searchPagination(params)
    },
    {
      refetchOnWindowFocus: false,
    },
  )

  const {
    data: stockManagements,
    isLoading: isLoadingStocks,
    isFetching: isFetchingStocks,
    isRefetching: isRefetchingStocks,
    refetch: refetchStocks,
  } = stockManagementResponse

  const isExistingBillInMonth = useMemo(() => {
    if (
      Array.isArray(stockManagements?.data) &&
      stockManagements.data.length > 0
    ) {
      const currentMonth = moment().month()

      return stockManagements?.data?.some(
        (stockManagement) =>
          moment(stockManagement?.date).month() == currentMonth,
      )
    }

    return false
  }, [stockManagements])

  const handleOpenModalEdit = (stockManagement: StockManagementInformation) => {
    setModal({ isEdit: true, stockId: stockManagement?._id })
    onOpenModal()
  }

  const handleOpenDeleteModal = (
    stockManagement: StockManagementInformation,
  ) => {
    setModalDelete({
      id: stockManagement?._id,
      desc: `Bạn có chắc muốn xóa hóa đơn ${
        isImport ? 'nhập' : 'xuất'
      } hàng này không?`,
    })
    onOpenModalDelete()
  }

  const onOpenAddStockModal = () => {
    setModal({})
    onOpenModal()
  }

  const onCloseStockDeleteModal = () => {
    setModalDelete({})
    onOpenChangeModalDelete()
  }

  const handleDeleteStock = async () => {
    try {
      setModalDelete((prev) => ({ ...prev, isLoading: true }))
      await stockManagementService.delete(modalDelete?.id)
      enqueueSnackbar('Xóa hóa đơn nhập nguyên liệu thành công!')
    } catch (err) {
      enqueueSnackbar('Có lỗi xảy ra khi xóa hóa đơn nhập nguyên liệu!', {
        variant: 'error',
      })
    } finally {
      await refetchStocks()
      onCloseStockDeleteModal()
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

  const handleDownload = async (billData?: StockManagementInformation) => {
    if (billData && Object.keys(billData).length > 0)
      if (isImport) {
        billData?.stockManagementInfo?.map((item) => {
          if (item?.originQuantity && item.originQuantity > item.quantity!) {
            item.quantity = item.originQuantity
            return item
          }
          return item
        })
      }
    try {
      globalLoading.show()
      if (billData?.stockManagementInfo) {
        if (!isImport) {
          await stockManagementService.invoice(billData)
        }
        const blob = await pdf(
          <StockManagementBillDetail data={billData} isImport={isImport} />,
        ).toBlob()
        var data = new Blob([blob], { type: 'pdf' })
        var pdfURL = window.URL.createObjectURL(data)
        const tempLink = document.createElement('a')
        tempLink.href = pdfURL
        tempLink.setAttribute(
          'download',
          `hoa-don-${isImport ? 'nhap' : 'xuat'}-hang-thang-${
            moment(billData?.date).month() + 1
          }.pdf`,
        )
        tempLink.click()
        ;('filename.pdf')
        await refetchStocks()
        await ingredientsResponse?.refetch()
      }
    } catch (err) {
      enqueueSnackbar(
        `Oops! Có lỗi xảy ra khi xuất hóa đơn ${
          isImport ? 'nhập' : 'xuất'
        } hàng!`,
        {
          variant: 'error',
        },
      )
    } finally {
      setTimeout(() => {
        globalLoading.hide()
      }, 1500)
    }
  }

  const onRefetch = () => {
    refetchStocks()
    ingredientsResponse?.refetch()
  }

  return (
    <Box ref={containerRef} id={containerId} className="p-4">
      <CustomBreadcrumb
        pageName="Quản lý kho hàng"
        routes={[
          {
            label: 'Quản lý kho hàng',
          },
        ]}
      />
      <Box className="flex justify-between items-end mb-2">
        <DatePicker.RangePicker
          size="middle"
          className="max-w-[300px] !h-[56px]"
          value={
            Array.isArray(filterImportDate) && filterImportDate.length === 2
              ? [filterImportDate[0], filterImportDate[1]]
              : undefined
          }
          onChange={(range) =>
            handleChangeFilterImportDate(range as [Moment, Moment])
          }
        />
        {!isExistingBillInMonth && (
          <Button
            color="primary"
            variant="shadow"
            onClick={onOpenAddStockModal}
          >
            Thêm hoá đơn {isImport ? 'nhập' : 'xuất'} hàng
          </Button>
        )}
      </Box>

      <FormProvider {...form}>
        <Box className="min-w-fit my-3">
          <FormContextSelect
            label="Nhập/Xuất kho"
            className="max-w-xs bg-white rounded-xl"
            name="stockManagementType"
            size="md"
          >
            {stockManagementOptions.map((item) => (
              <SelectItem key={item.value} value={item.label}>
                {item.label}
              </SelectItem>
            ))}
          </FormContextSelect>
        </Box>
      </FormProvider>

      <CustomTable
        rowKey="_id"
        columns={columns}
        data={stockManagements?.data}
        tableName={`Danh sách hóa đơn ${isImport ? 'nhập' : 'xuất'} hàng`}
        emptyContent={`Không có hóa đơn ${isImport ? 'nhập' : 'xuất'} hàng nào`}
        selectedKeys={stockManagementSelectedKeys}
        onSelectionChange={setStockManagementSelectedKeys}
        totalPage={stockManagements?.totalPage || 0}
        page={pageIndex}
        rowPerPage={pageSize}
        onChangePage={setPage}
        onChangeRowPerPage={setRowPerPage}
        isLoading={isLoadingStocks || isFetchingStocks || isRefetchingStocks}
      />

      <Ingredients
        ingredientsResponse={ingredientsResponse}
        ingredientPagination={ingredientPagination}
      />

      <StockManagementModal
        isOpen={isOpenModal}
        onOpenChange={onOpenChangeModal}
        {...modal}
        onRefetch={onRefetch}
        stockManagementType={stockManagementType[0]}
        isImportMode={isImport}
        ingredientsResponse={ingredientsResponse}
      />
      <ModalConfirmDelete
        isOpen={isOpenModalDelete}
        onOpenChange={onOpenChangeModalDelete}
        desc={modalDelete?.desc}
        onAgree={handleDeleteStock}
        isLoading={modalDelete?.isLoading}
      />
    </Box>
  )
}

export default StockManagementPage
