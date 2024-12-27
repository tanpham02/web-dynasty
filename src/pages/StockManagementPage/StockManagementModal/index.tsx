import { Button, SelectItem } from '@nextui-org/react'
import { useQuery, UseQueryResult } from '@tanstack/react-query'
import { DatePicker } from 'antd'
import { isEmpty } from 'lodash'
import moment from 'moment'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from 'react-hook-form'

import DeleteIcon from '~/assets/svg/delete.svg'
import EditIcon from '~/assets/svg/edit.svg'
import Box from '~/components/Box'
import ButtonIcon from '~/components/ButtonIcon'
import { globalLoading } from '~/components/GlobalLoading'
import CustomModal from '~/components/NextUI/CustomModal'
import {
  FormContextInput,
  FormContextSelect,
  FormContextTextArea,
} from '~/components/NextUI/Form'
import { QUERY_KEY } from '~/constants/queryKey'
import { Ingredients } from '~/models/ingredients'
import {
  StockManagementInformation,
  StockManagementTypes,
} from '~/models/stockManagements'
import stockManagementService from '~/services/stockManagementService'
import { ListDataResponse } from '~/types'
import { addDays, DATE_FORMAT_DDMMYYYY, subtractDays } from '~/utils/date.utils'

interface StockManagementModalProps {
  isOpen?: boolean
  onOpenChange?(): void
  onRefetch?(): void
  isEdit?: boolean
  isImportMode?: boolean
  stockId?: string
  stockManagementType: StockManagementTypes
  ingredientsResponse: UseQueryResult<ListDataResponse<Ingredients>, unknown>
}
const StockManagementModal = ({
  isOpen,
  onOpenChange,
  onRefetch,
  isEdit,
  stockId,
  stockManagementType,
  isImportMode,
  ingredientsResponse,
}: StockManagementModalProps) => {
  const forms = useForm<StockManagementInformation>({})
  const [indexEditing, setIndexEditing] = useState<number>(-1)

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    reset: resetFormValue,
    control,
    setValue,
    watch,
    reset,
    trigger,
  } = forms

  const {
    fields: stockManagements,
    remove: removeStockManagement,
    append: appendStockManagement,
  } = useFieldArray({
    control,
    name: 'stockManagementInfo',
  })

  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (!(stockId && isEdit && isOpen)) {
      resetFormValue({ stockManagementInfo: [], date: undefined })
    }
  }, [isEdit, stockId, isOpen])

  useEffect(() => {
    if (isOpen) {
      setValue('date', moment(new Date()))
    }
  }, [isOpen])

  useQuery(
    [QUERY_KEY.STOCK_MANAGEMENTS, stockId],
    async () => {
      try {
        globalLoading.show()
        if (stockId) {
          const response = await stockManagementService.getById(stockId)
          if (response && Object.keys(response).length > 0) {
            resetFormValue(response)
          }
        }
        return null
      } catch (err) {
        enqueueSnackbar(
          'Có lỗi xảy ra khi lấy dữ liệu hóa đơn nhập nguyên liệu!',
          {
            variant: 'error',
          },
        )
        onOpenChange?.()
        console.log(
          '🚀 ~ file: index.tsx:125 ~ getStockManagementDetail ~ err:',
          err,
        )
      } finally {
        setTimeout(() => {
          globalLoading.hide()
        }, 1000)
      }
    },
    {
      enabled: Boolean(stockId && isOpen && isEdit),
      refetchOnWindowFocus: false,
    },
  )

  useEffect(() => {
    setValue('type', stockManagementType)
  }, [stockManagementType])

  const onSubmit = async (data: StockManagementInformation) => {
    if (!data?.stockManagementInfo?.length) {
      enqueueSnackbar(
        `Vui lòng thêm ít nhất một nguyên liệu ${
          isImportMode ? 'nhập' : 'xuất'
        }!`,
        {
          variant: 'error',
        },
      )
      return
    }

    data.type = stockManagementType
    data.date = moment.utc(data.date).format()

    try {
      if (isEdit) {
        await stockManagementService.update(stockId, data)
      } else {
        await stockManagementService.create(data)
      }

      enqueueSnackbar(
        `${isEdit ? 'Chỉnh sửa' : 'Thêm'} hóa đơn ${
          isImportMode ? 'nhập' : 'xuất'
        } hàng thành công!`,
      )
    } catch (err) {
      enqueueSnackbar(
        `Có lỗi xảy ra khi ${isEdit ? 'chỉnh sửa' : 'thêm'} hóa đơn ${
          isImportMode ? 'nhập' : 'xuất'
        } hàng!`,
        {
          variant: 'error',
        },
      )
      console.log('🚀 ~ file: index.tsx:69 ~ onSubmit ~ err:', err)
    } finally {
      onRefetch?.()
      onOpenChange?.()
    }
  }

  const ingredientExportOptions = useMemo(() => {
    if (!ingredientsResponse) return []

    return ingredientsResponse?.data?.data?.map((item) => ({
      label: item.name,
      value: item._id,
    }))
  }, [JSON.stringify([ingredientsResponse])])

  const exportId = watch('exportId')
  const exportQuantity = watch('exportQuantity')

  const ingredientSelected = useMemo(() => {
    if (isEmpty(exportId) || isEmpty(ingredientsResponse)) return undefined
    const output = ingredientsResponse?.data?.data?.find(
      (item) => exportId?.includes(item?._id!.toString()),
    )
    const p = stockManagements?.map((item) => {
      if (!exportId?.includes(item?._id!.toString())) return item
      return {
        ...item,
        exportQuantity: output?.quantity,
      }
    })

    reset((prev) => ({
      ...prev,
      stockManagementInfo: p,
      exportQuantity: output?.quantity ?? 0,
    }))
    // setValue('stockManagementInfo', p)
    // setValue('exportQuantity', output?.quantity ?? 0)
    return output
  }, [JSON.stringify([ingredientsResponse, exportId])])

  const handleEditExportItem = (index: number) => {
    setIndexEditing(index)
  }

  const handleAppend = useCallback(() => {
    if (isImportMode) {
      appendStockManagement({
        name: '',
        price: 0,
        quantity: 0,
        unit: '',
      })
    } else {
      if (
        exportQuantity &&
        ingredientSelected?.quantity &&
        Number(exportQuantity) <= Number(ingredientSelected.quantity)
      ) {
        appendStockManagement({
          ...ingredientSelected,
          quantity: exportQuantity as any,
        })
        resetFormValue((prevValue) => ({
          ...prevValue,
          exportQuantity: '',
          exportId: undefined,
        }))
      } else {
        trigger('exportQuantity', { shouldFocus: true })
      }
    }
  }, [ingredientSelected, exportQuantity, errors, isImportMode])

  const handleCompleteEditExportQuantity = () => {
    setIndexEditing(-1)
  }

  const handleRemoveStockManagement = (index: number) => {
    removeStockManagement(index)
    setValue(
      'stockManagementInfo',
      stockManagements?.map((item, idx) => {
        if (index !== idx) return item
        return {
          ...item,
          shouldDelete: true,
        }
      }),
    )
  }

  const nameOfQuantityField = useCallback(
    (index: number) => {
      const originQuantity = watch(
        `stockManagementInfo.${index}.originQuantity`,
      )
      const quantity = watch(`stockManagementInfo.${index}.quantity`)
      const currentQuantityName =
        originQuantity && quantity && originQuantity > quantity
          ? 'originQuantity'
          : 'quantity'

      return isImportMode
        ? `stockManagementInfo.${index}.${currentQuantityName}`
        : `stockManagementInfo.${index}.quantity`
    },
    [isImportMode],
  )

  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={
        isEdit
          ? `Cập nhật hóa đơn ${isImportMode ? 'nhập' : 'xuất'} hàng`
          : `Thêm hóa đơn ${isImportMode ? 'nhập' : 'xuất'} hàng`
      }
      okButtonText={isEdit ? 'Lưu thay đổi' : 'Thêm'}
      className="w-full max-w-[1200px]"
      isDismissable={false}
      onOk={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
    >
      <FormProvider {...forms}>
        <Box className="space-y-4">
          <Controller
            control={control}
            name="date"
            rules={{
              required: 'Vui lòng chọn ngày nhập hàng!',
            }}
            render={({
              field: { value, onChange, ref },
              fieldState: { error },
            }) => (
              <Box>
                <DatePicker
                  allowClear
                  ref={ref}
                  value={value ? moment(value) : undefined}
                  format={DATE_FORMAT_DDMMYYYY}
                  placeholder="Ngày nhập hàng"
                  onChange={(date) => (date ? onChange(moment(date)) : '')}
                  disabledDate={(value) => {
                    const date = new Date()
                    return !value.isBetween(
                      subtractDays(date, 1),
                      addDays(date, 0),
                    )
                  }}
                />
                <span className="text-xs text-danger">{error?.message}</span>
              </Box>
            )}
          />

          {!isImportMode && (
            <Box className="grid grid-cols-[7fr_3fr] gap-4">
              <FormContextSelect
                label="Tên nguyên liệu"
                className="w-full bg-white rounded-xl"
                name="exportId"
                size="md"
                isLoading={ingredientsResponse?.isFetching}
              >
                {ingredientExportOptions?.map((item) => (
                  <SelectItem key={item.value!} value={item.label}>
                    {item.label}
                  </SelectItem>
                )) ?? []}
              </FormContextSelect>
              <FormContextInput
                label="Số lượng"
                className="w-full bg-white rounded-xl"
                name="exportQuantity"
                size="md"
                type="number"
                rules={{
                  max: {
                    value: !isImportMode
                      ? Number(ingredientSelected?.quantity)
                      : Infinity,
                    message: 'Vượt quá sô lượng trong kho',
                  },
                  min: {
                    value: 0.01,
                    message: 'Giá trị phải lớn hơn hoặc bằng 0.01',
                  },
                }}
                endContent={ingredientSelected?.unit ?? ''}
              />
            </Box>
          )}

          <Box className="flex justify-between items-end mb-2">
            <span className="font-bold text-base">Danh sách nguyên liệu</span>
            <Box className="space-x-2">
              {isImportMode && (
                <Button
                  color="danger"
                  size="sm"
                  variant="flat"
                  className="font-bold"
                  onClick={() => removeStockManagement(undefined)}
                >
                  Xóa tất cả
                </Button>
              )}
              <Button
                color="default"
                size="sm"
                className="bg-sky-100 text-sky-500 font-bold"
                onClick={handleAppend}
              >
                {`Thêm nguyên liệu ${isImportMode ? 'nhập' : 'xuất'}`}
              </Button>
            </Box>
          </Box>
          <Box className="border border-zinc-200 rounded-xl p-4 shadow">
            <Box className="bg-zinc-200 shadow rounded-lg px-3 py-2 flex gap-2 mb-2">
              <Box className="font-bold flex-[3] text-center">
                Tên nguyên liệu
              </Box>
              <Box className="font-bold flex-[3] text-center">Giá nhập</Box>
              <Box className="font-bold flex-[2] text-center">Số lượng</Box>
              <Box className="font-bold flex-[2] text-center">Đơn vị tính</Box>
              <Box className="font-bold flex-1 text-center">Hành động</Box>
            </Box>
            <Box>
              {stockManagements
                ?.filter((item) => !item?.shouldDelete)
                ?.map((stockManagement, index) => (
                  <Box
                    key={stockManagement?.id}
                    className="px-3 py-2 flex items-center gap-2"
                  >
                    <Box className="font-bold flex-[3] text-center">
                      <FormContextInput
                        name={`stockManagementInfo.${index}.name`}
                        rules={{
                          required: 'Vui lòng nhập tên nguyên liệu!',
                        }}
                        isDisabled={!isImportMode}
                      />
                    </Box>
                    <Box className="font-bold flex-[3] text-center">
                      <FormContextInput
                        name={`stockManagementInfo.${index}.price`}
                        type="number"
                        rules={{
                          required: 'Vui lòng nhập giá nguyên liệu!',
                        }}
                        endContent="đ"
                        isDisabled={!isImportMode}
                      />
                    </Box>
                    <Box className="font-bold flex-[2] text-center">
                      <FormContextInput
                        name={nameOfQuantityField(index)}
                        type="number"
                        rules={{
                          required: 'Vui lòng nhập số lượng nguyên liệu!',
                          max: {
                            value: !isImportMode
                              ? Number(ingredientSelected?.quantity)
                              : Infinity,
                            message: 'Vượt quá sô lượng trong kho',
                          },
                          min: {
                            value: 0.01,
                            message:
                              'Số lượng nguyên liệu nhập không được nhỏ hơn 0!',
                          },
                        }}
                        onBlur={handleCompleteEditExportQuantity}
                        isDisabled={!isImportMode && index !== indexEditing}
                      />
                    </Box>
                    <Box className="font-bold flex-[2] text-center">
                      <FormContextInput
                        name={`stockManagementInfo.${index}.unit`}
                        rules={{
                          required: 'Vui lòng nhập đơn vị tính nguyên liệu!',
                        }}
                        isDisabled={!isImportMode}
                      />
                    </Box>
                    <Box className="font-bold flex-1 text-center">
                      {!isImportMode && (
                        <ButtonIcon
                          icon={EditIcon}
                          title="Chỉnh sửa nguyên liệu nhập này"
                          status="warning"
                          onClick={() => handleEditExportItem(index)}
                        />
                      )}
                      <ButtonIcon
                        icon={DeleteIcon}
                        title="Xóa nguyên liệu nhập này"
                        status="danger"
                        onClick={() => handleRemoveStockManagement(index)}
                      />
                    </Box>
                  </Box>
                ))}
            </Box>
          </Box>

          {!isImportMode && (
            <Box className="font-bold flex-[2] text-center">
              <FormContextTextArea name="note" label="Ghi chú" />
            </Box>
          )}
        </Box>
      </FormProvider>
    </CustomModal>
  )
}

export default StockManagementModal
