import { Button } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import Box from '~/components/Box';
import CustomModal from '~/components/NextUI/CustomModal';
import { FormContextInput } from '~/components/NextUI/Form';
import { CUSTOMER_TYPES } from '~/constants/customer';
import { QUERY_KEY } from '~/constants/queryKey';
import { Customer, CustomerStatus, CustomerType } from '~/models/customers';
import customerService from '~/services/customerService';
import customerAddressService from '~/services/customerService/customerAddressService';
import { getProvinces, getDistricts, getWards } from "vietnam-provinces"

export interface CustomerModalProps {
  isOpen?: boolean;
  onClose?(): void;
  onOpenChange?(): void;
  setModal?({
    isEdit,
    customerId,
  }: {
    isEdit?: boolean;
    customerId?: string;
  }): void;
  onRefetch?(): Promise<any>;
  isEdit?: boolean;
  customerId?: string;
}

const CustomerModal = ({
  isOpen,
  onOpenChange,
  isEdit,
  customerId,
  setModal,
}: CustomerModalProps) => {
  const forms = useForm<Customer>();

  const { reset } = forms;

  useQuery(
    [QUERY_KEY.CUSTOMERS, customerId],
    async () => {
      if (customerId) {
        const response =
          await customerService.getCustomerByCustomerID(customerId);
        const customerAddress =
          await customerAddressService.getListCustomerAddressByCustomerId(
            customerId,
          );
        const defaultAddress = customerAddress?.addressList?.sort((a, b) => Number(a?.isDefault) - Number(b?.isDefault))?.[0]
        let addressName = ''

        if (defaultAddress && Object.keys(defaultAddress)) {
          const city = getProvinces().find(city => city.code == defaultAddress?.cityId)
          const district = getDistricts(defaultAddress?.districtId)?.find(district => district?.code == defaultAddress?.districtId)
          const ward = getWards(defaultAddress?.wardId)?.find(ward => ward?.code == defaultAddress?.wardId)

          addressName = [city, district, ward, defaultAddress?.location]?.filter(value => Boolean(value))?.join(", ")
        }

        reset({
          ...response,
          status:
            response?.status === CustomerStatus.ACTIVE
              ? 'Đang hoạt động'
              : 'Ngưng hoạt động',
          customerType: response?.customerType
            ? CUSTOMER_TYPES?.[response?.customerType]?.label
            : '',
          address: addressName
        });
      }
    },
    {
      enabled: Boolean(customerId && isEdit),
      refetchOnWindowFocus: false,
    },
  );

  useEffect(() => {
    if (!isOpen) handleResetFormValue();
  }, [isOpen]);

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

  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title="Thông tin khách hàng"
      okButtonText={isEdit ? 'Lưu thay đổi' : 'Thêm'}
      className="w-full max-w-[700px] pb-4"
      placement="center"
      controls={false}
      onClose={() => {
        handleResetFormValue();
        setModal?.({
          customerId: undefined,
        });
      }}
    >
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
            name="address"
            label="Địa chỉ"
            isReadOnly
          />
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
          <Button className="ml-auto block" onClick={onOpenChange}>
            Đóng
          </Button>
        </Box>
      </FormProvider>
    </CustomModal>
  );
};

export default CustomerModal;
