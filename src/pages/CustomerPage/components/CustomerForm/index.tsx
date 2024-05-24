import { useQuery } from '@tanstack/react-query';
import { FormProvider, useForm } from 'react-hook-form';

import Box from '~/components/Box';
import { FormContextInput } from '~/components/NextUI/Form';
import { CUSTOMER_TYPES } from '~/constants/customer';

import { QUERY_KEY } from '~/constants/queryKey';
import { Customer, CustomerStatus } from '~/models/customers';
import customerService from '~/services/customerService';

interface CustomerFormProps {
  customerId?: string;
}

const CustomerForm = ({ customerId }: CustomerFormProps) => {
  const forms = useForm<Customer>();

  const { reset } = forms;

  useQuery(
    [QUERY_KEY.CUSTOMERS, customerId],
    async () => {
      if (customerId) {
        const response =
          await customerService.getCustomerByCustomerID(customerId);

        reset({
          ...response,
          status:
            response?.status === CustomerStatus.ACTIVE
              ? 'Đang hoạt động'
              : 'Ngưng hoạt động',
          customerType: response?.customerType
            ? CUSTOMER_TYPES?.[response?.customerType]?.label
            : '',
        });
      }
    },
    {
      enabled: Boolean(customerId),
      refetchOnWindowFocus: false,
    },
  );

  return (
    <FormProvider {...forms}>
      <Box className="space-y-4">
        <FormContextInput<Customer>
          name="fullName"
          label="Họ và tên"
          isReadOnly
        />
        <FormContextInput<Customer>
          name="phoneNumber"
          label="Số điện thoại"
          isReadOnly
        />
        <FormContextInput<Customer> name="email" label="Email" isReadOnly />
        <FormContextInput<Customer>
          name="status"
          label="Trạng thái hoạt động"
          isReadOnly
        />
        <FormContextInput<Customer>
          name="customerType"
          label="Nhóm khách hàng"
          isReadOnly
        />
      </Box>
    </FormProvider>
  );
};

export default CustomerForm;
