import Box from '~/components/Box';
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';
import { BankConfig } from './components';
import { FormProvider, useForm } from 'react-hook-form';
import EmailServerConfig from './components/EmailServerConfig';

const SystemConfigPage = () => {
  const formMethods = useForm();

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
          <BankConfig />
          <EmailServerConfig />
        </Box>
      </FormProvider>
    </Box>
  );
};

export default SystemConfigPage;
