import { Button } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { FormProvider, useForm } from 'react-hook-form'

import Box from '~/components/Box'
import { globalLoading } from '~/components/GlobalLoading'
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb'
import { QUERY_KEY } from '~/constants/queryKey'
import { StoreConfigModel } from '~/models/storeSetting'
import storeSettingService from '~/services/storeSettingService'
import {
  BankConfig,
  EmailServerConfig,
  FaqsConfig,
  SellInformationConfig,
  StoreInformationConfig,
} from './components'

const SystemConfigPage = () => {
  const formMethods = useForm<StoreConfigModel>({
    defaultValues: {
      emailConfig: {
        port: 587,
        mailServer: 'SMTP',
      },
    },
  })

  const { enqueueSnackbar } = useSnackbar()

  const { handleSubmit, reset, setValue } = formMethods

  const { data: storeConfigData, refetch: refetchStoreConfigData } = useQuery({
    queryKey: [QUERY_KEY.STORE_SETTING],
    queryFn: async () => {
      try {
        globalLoading.show()
        const response = await storeSettingService.getSetting()
        reset(response)
        if (
          response.storeSetting?.reasonOrderCancel &&
          response.storeSetting.reasonOrderCancel?.length > 0
        ) {
          setValue(
            'cancelReasons',
            response.storeSetting.reasonOrderCancel.map((reason) => ({
              reason,
            })),
          )
        }
        if (response.bankAccountConfig?.bankCode) {
          setValue('bankAccountConfig.bankCode', [
            response.bankAccountConfig.bankCode,
          ] as string[])
        }
        if (response.storeInformation?.cityId) {
          setValue('storeInformation.cityId', [
            response.storeInformation.cityId,
          ] as string[])
        }
        if (response.storeInformation?.districtId) {
          setValue('storeInformation.districtId', [
            response.storeInformation.districtId,
          ] as string[])
        }
        if (response.storeInformation?.wardId) {
          setValue('storeInformation.wardId', [
            response.storeInformation.wardId,
          ] as string[])
        }
        return response
      } catch (err) {
        enqueueSnackbar({
          message: 'Có lỗi xảy ra vui lòng thử lại sau!',
          variant: 'error',
        })
      } finally {
        globalLoading.hide()
      }
    },
    refetchOnWindowFocus: false,
  })

  const updateStoreSetting = async (data: StoreConfigModel) => {
    if (!storeConfigData?._id) return

    const faqs = data?.faqs
      ? Object.keys(data.faqs).map((key: any) => data?.faqs?.[key])
      : []

    const dataSubmit: StoreConfigModel = {
      ...data,
      storeSetting: {
        ...data.storeSetting,
        reasonOrderCancel:
          data?.cancelReasons && data.cancelReasons.length > 0
            ? data.cancelReasons.map((item) => item.reason)
            : [],
      },
      bankAccountConfig: {
        ...data?.bankAccountConfig,
        bankCode: data?.bankAccountConfig?.bankCode?.[0] ?? undefined,
      },
      storeInformation: {
        ...data?.storeInformation,
        cityId: data?.storeInformation?.cityId?.[0] ?? undefined,
        districtId: data?.storeInformation?.districtId?.[0] ?? undefined,
        wardId: data?.storeInformation?.wardId?.[0] ?? undefined,
      },
    }

    const ignoreKeys = ['_id', 'createdAt', 'updatedAt']

    const parentKeys = Object.keys(dataSubmit).filter(
      (key) =>
        !ignoreKeys.includes(key) &&
        data[key] &&
        Object.keys(data[key]).length > 0,
    )

    const dataAfterFilters = parentKeys.reduce((acc: any, next) => {
      const childrenKeys = Object.keys(dataSubmit[next]).filter(
        (item) => dataSubmit[next][item],
      )

      acc[next] = childrenKeys.reduce((accChild: any, nextChild) => {
        if (dataSubmit[next][nextChild]) {
          accChild[nextChild] = dataSubmit[next][nextChild]
          return accChild
        }
      }, {})

      return acc
    }, {})

    delete dataAfterFilters?.cancelReasons
    delete dataAfterFilters?.storeConfig

    try {
      await storeSettingService.updateSetting(storeConfigData._id, {
        ...dataAfterFilters,
        faqs: faqs as any,
        _id: storeConfigData._id,
      })
      await refetchStoreConfigData()

      enqueueSnackbar({
        message: 'Cập nhật thông tin cấu hình cửa hàng thành công!',
      })
    } catch (err) {
      enqueueSnackbar({
        message: 'Có lỗi xảy ra vui lòng thử lại sau!',
        variant: 'error',
      })
    }
  }

  return (
    <Box>
      <CustomBreadcrumb
        pageName="Cấu hình hệ thống"
        routes={[
          {
            label: 'Cấu hình hệ thống',
          },
        ]}
      />
      <FormProvider {...formMethods}>
        <Box className="flex flex-col xl:grid xl:grid-cols-2 gap-4">
          <StoreInformationConfig />
          <SellInformationConfig />
          <BankConfig />
          <EmailServerConfig />
          <FaqsConfig />
        </Box>
        <Box className="mt-4 flex justify-end">
          <Button
            variant="shadow"
            color="primary"
            onClick={handleSubmit(updateStoreSetting)}
          >
            Lưu cấu hình
          </Button>
        </Box>
      </FormProvider>
    </Box>
  )
}

export default SystemConfigPage
