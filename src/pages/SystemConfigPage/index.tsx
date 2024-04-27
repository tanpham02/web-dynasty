import Box from '~/components/Box';
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';
import {
  BankConfig,
  EmailServerConfig,
  SellInformationConfig,
  FaqsConfig,
  StoreInformationConfig,
} from './components';
import { FormProvider, useForm } from 'react-hook-form';
import { StoreSettingModel } from '~/models/storeSetting';
import { Button } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '~/constants/queryKey';
import storeSettingService from '~/services/storeSettingService';
import { useSnackbar } from 'notistack';
import { globalLoading } from '~/components/GlobalLoading';

const SystemConfigPage = () => {
  const formMethods = useForm<StoreSettingModel>();

  const { enqueueSnackbar } = useSnackbar()

  const { handleSubmit } = formMethods;

  const { data: storeConfigData, refetch: refetchStoreConfigData } = useQuery({
    queryKey: [QUERY_KEY.STORE_SETTING],
    queryFn: async () => {
      try {
        globalLoading.show()
        const response = await storeSettingService.getSetting()
        formMethods.reset({ ...response })
        return response
      } catch (err) {
        enqueueSnackbar({
          message: "Có lỗi xảy ra vui lòng thử lại sau!",
          variant: "error"
        })
      } finally {
        globalLoading.hide()
      }
    },
    refetchOnWindowFocus: false,
  })

  const updateStoreSetting = async (data: StoreSettingModel) => {
    if (!storeConfigData?._id) return

    try {
      await storeSettingService.updateSetting(storeConfigData._id, {
        ...data,
        bankAccountConfig: {
          ...data?.bankAccountConfig,
          bankCode: data?.bankAccountConfig?.bankCode?.[0] ?? ''
        },
        storeInformation: {
          cityId: data?.storeInformation?.cityId?.[0] ?? '',
          districtId: data?.storeInformation?.districtId?.[0] ?? '',
          wardId: data?.storeInformation?.wardId?.[0] ?? '',
        }
      })
      await refetchStoreConfigData()


      enqueueSnackbar({
        message: "Cập nhật thông tin cấu hình cửa hàng thành công!"
      })
    } catch (err) {
      enqueueSnackbar({
        message: "Có lỗi xảy ra vui lòng thử lại sau!",
        variant: "error"
      })
    }
  };

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
        <Box className="grid gap-4 lg:grid-cols-2">
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
  );
};

export default SystemConfigPage;
