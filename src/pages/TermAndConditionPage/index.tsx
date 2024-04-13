import { Button, Card, CardBody, Tab, Tabs } from '@nextui-org/react';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { globalLoading } from '~/components/GlobalLoading';
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';
import FormContextCKEditor from '~/components/NextUI/Form/FormContextCKEditor';
import { QUERY_KEY } from '~/constants/queryKey';
import { TermAndConditionModel } from '~/models/termAndCondition';
import { termAndConditionService } from '~/services/termAndConditionService';

const enum TabKey {
  DELIVERY_POLICY,
  PRIVATE_POLICY,
  TERM_AND_CONDITION,
}

const TermAndConditionPage = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [selected, setSelected] = useState<TabKey>(TabKey.DELIVERY_POLICY);

  const formMethods = useForm<TermAndConditionModel>({
    defaultValues: {
      deliveryPolicy: '',
      termAndCondition: '',
      privatePolicy: '',
    },
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = formMethods;

  const { data: termAndCondition } = useQuery({
    queryKey: [QUERY_KEY.TERM_AND_CONDITION],
    queryFn: async () => {
      try {
        globalLoading.show();
        const response = await termAndConditionService.getOne();

        reset({
          deliveryPolicy: response?.deliveryPolicy || '',
          termAndCondition: response?.termAndCondition || '',
          privatePolicy: response?.privatePolicy || '',
        });
        return response;
      } catch (err) {
        console.log('🚀 ~ queryFn: ~ err:', err);
        enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau!', {
          variant: 'error',
        });
      } finally {
        globalLoading.hide();
      }
    },
    refetchOnWindowFocus: false,
  });

  const createOrUpdateTermAndCondition = async (
    data: TermAndConditionModel,
  ) => {
    try {
      const formData = new FormData();
      formData.append('termAndPolicyInfo', JSON.stringify(data));

      if (termAndCondition?._id)
        await termAndConditionService.update(termAndCondition._id, formData);
      else await termAndConditionService.createNew(formData);

      enqueueSnackbar('Cập nhật chính sách và điều khoản thành công');
    } catch (err) {
      console.log('🚀 ~ createOrUpdateTermAndCondition ~ err:', err);
      enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau!', {
        variant: 'error',
      });
    }
  };

  return (
    <div>
      <CustomBreadcrumb
        pageName="Cấu hình chính sách và điều khoản"
        routes={[
          {
            label: 'Cấu hình chính sách và điều khoản',
          },
        ]}
      />

      <Card>
        <FormProvider {...formMethods}>
          <CardBody className="p-4">
            <Tabs
              variant="bordered"
              color="primary"
              aria-label="Options"
              selectedKey={selected}
              onSelectionChange={setSelected as any}
            >
              <Tab key="photos" title="Chính sách vận chuyển">
                <FormContextCKEditor name="deliveryPolicy" />
              </Tab>
              <Tab key="music" title="Điều khoản riêng tư">
                <FormContextCKEditor name="privatePolicy" />
              </Tab>
              <Tab key="videos" title="Điều khoản & điều kiện">
                <FormContextCKEditor name="termAndCondition" />
              </Tab>
            </Tabs>
            <Button
              color="primary"
              variant="shadow"
              className="ml-auto"
              isLoading={isSubmitting}
              onClick={handleSubmit(createOrUpdateTermAndCondition)}
            >
              Lưu thay đổi
            </Button>
          </CardBody>
        </FormProvider>
      </Card>
    </div>
  );
};

export default TermAndConditionPage;
