import { SelectItem } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { FormProvider, useForm } from 'react-hook-form';

import Box from '~/components/Box';
import { globalLoading } from '~/components/GlobalLoading';
import CustomModal from '~/components/NextUI/CustomModal';
import { FormContextInput } from '~/components/NextUI/Form';
import FormContextSelect from '~/components/NextUI/Form/FormContextSelect';
import { QUERY_KEY } from '~/constants/queryKey';
import { Customer, CustomerStatus, CustomerType } from '~/models/customers';
import { Users } from '~/models/user';
import customerService from '~/services/customerService';
import { PATTERN } from '~/utils/regex';

export enum ModalType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  INFORMATION = 'INFORMATION',
}

export interface CustomerModalProps {
  isOpen?: boolean;
  onClose?(): void;
  onOpenChange?(): void;
  setModal?({ isEdit, customerId }: { isEdit?: boolean; customerId?: string }): void;
  onRefetch?(): Promise<any>;
  isEdit?: boolean;
  customerId?: string;
}

const CUSTOMER_STATUS_OPTIONS = [
  {
    label: 'Đang hoạt động',
    value: CustomerStatus.ACTIVE,
  },
  {
    label: 'Ngưng hoạt động',
    value: CustomerStatus.IN_ACTIVE,
  },
];

const CUSTOMER_TYPES_OPTIONS = [
  {
    label: 'Mới',
    value: CustomerType.NEW,
  },
  {
    label: 'Mua nhiều',
    value: CustomerType.BUY_THE_MOST_ORDERS,
  },
  {
    label: 'Không hoạt động',
    value: CustomerType.EXIST,
  },
  {
    label: 'Tiềm năng',
    value: CustomerType.POTENTIAL,
  },
];

const CustomerModal = ({
  isOpen,
  onClose,
  onOpenChange,
  onRefetch,
  isEdit,
  customerId,
  setModal,
}: CustomerModalProps) => {
  const { enqueueSnackbar } = useSnackbar();

  const forms = useForm<Customer>();

  const {
    formState: { isSubmitting },
    reset,
    handleSubmit,
  } = forms;

  useQuery(
    [QUERY_KEY.CUSTOMERS, customerId],
    async () => {
      globalLoading.show();
      if (customerId) {
        const response = await customerService.getCustomerByCustomerID(customerId);
        reset({
          ...response,
          status: [(response?.status as CustomerStatus) || CustomerStatus.ACTIVE],
          customerType: [(response?.customerType as CustomerType) || CustomerType.NEW],
        });
      }
      globalLoading.hide();
    },
    {
      enabled: Boolean(customerId && isEdit),
      refetchOnWindowFocus: false,
    },
  );

  const handleResetFormValue = () => {
    reset({
      birthday: '',
      fullName: '',
      phoneNumber: '',
      email: '',
      password: '',
      status: CustomerStatus.ACTIVE,
      customerType: CustomerType.NEW,
    });
  };

  const onSubmit = async (data: Customer) => {
    globalLoading.show();
    const formData = new FormData();

    formData.append('customerInfo', JSON.stringify(data));

    try {
      await customerService.updateCustomer(customerId, formData);
      handleResetFormValue();
      onClose?.();
      onRefetch?.();
      setModal?.({
        customerId: undefined,
      });
      enqueueSnackbar({
        message: `${!isEdit ? 'Thêm' : 'Cập nhật'} khách hàng thành công!`,
        autoHideDuration: 2000,
      });
    } catch (err) {
      console.log('🚀 ~ file: index.tsx:219 ~ onSubmit ~ err:', err);
      enqueueSnackbar({
        message: `${!isEdit ? 'Thêm' : 'Cập nhật'} khách hàng thất bại!`,
        variant: 'error',
        autoHideDuration: 2000,
      });
    } finally {
      globalLoading.hide();
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Cập nhật thông tin khách hàng' : 'Thêm mới khách hàng'}
      okButtonText={isEdit ? 'Lưu thay đổi' : 'Thêm'}
      className="w-full max-w-[600px]"
      onOk={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
      isDismissable={false}
      scrollBehavior="inside"
      placement="center"
      onClose={() => {
        handleResetFormValue();
        setModal?.({
          customerId: undefined,
        });
      }}
    >
      <FormProvider {...forms}>
        <Box className="space-y-4">
          <FormContextInput<Users> name="fullName" label="Họ và tên" isClearable />
          <FormContextInput<Users>
            name="phoneNumber"
            rules={{
              pattern: {
                value: PATTERN.PHONE,
                message: 'Số điện thoại không hợp lệ',
              },
              required: 'Vui lòng nhập số điện thoại',
            }}
            isRequired
            label="Số điện thoại"
            isClearable
          />
          <FormContextInput<Users>
            name="email"
            rules={{
              pattern: {
                value: PATTERN.EMAIL,
                message: 'Email không hợp lệ',
              },
              required: 'Vui lòng nhập email',
            }}
            isRequired
            type="email"
            label="E-mail"
            isClearable
          />
          <FormContextSelect name="status" label="Trạng thái hoạt động">
            {CUSTOMER_STATUS_OPTIONS.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </FormContextSelect>
          <FormContextSelect name="customerType" label="Nhóm khách hàng">
            {CUSTOMER_TYPES_OPTIONS.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </FormContextSelect>
        </Box>
      </FormProvider>
    </CustomModal>
  );
};

export default CustomerModal;
