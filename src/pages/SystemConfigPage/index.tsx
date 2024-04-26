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

const SystemConfigPage = () => {
  const formMethods = useForm<StoreSettingModel>();

  const { handleSubmit } = formMethods;

  const updateStoreSetting = (data: StoreSettingModel) => {
    console.log('🚀 ~ updateStoreSetting ~ data:', data);
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
