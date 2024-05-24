import { Chip } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';

import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable';
import { QUERY_KEY } from '~/constants/queryKey';
import { CustomerAddressItem } from '~/models/customers/customerAddress';
import customerAddressService from '~/services/customerService/customerAddressService';

interface CustomerDeliveryAddressProps {
  customerId?: string;
}

const CustomerDeliveryAddress = ({
  customerId,
}: CustomerDeliveryAddressProps) => {
  const columns: ColumnType<CustomerAddressItem>[] = [
    {
      name: 'STT',
      render: (_customerAddress: CustomerAddressItem, index?: number) =>
        index! + 1,
    },
    {
      name: 'Tên người nhận',

      render: (customerAddress: CustomerAddressItem) =>
        customerAddress?.fullName,
    },
    {
      name: 'Số điện thoại',
      render: (customerAddress: CustomerAddressItem) =>
        customerAddress?.phoneNumber,
    },
    {
      name: 'Địa chỉ',
      render: (customerAddress: CustomerAddressItem) => {
        return '';
      },
    },
    {
      name: 'Loại',
      render: (customerAddress: CustomerAddressItem) =>
        customerAddress?.isDefault ? (
          <Chip color="primary" variant="shadow">
            Mặc định
          </Chip>
        ) : (
          <Chip>Khác</Chip>
        ),
    },
  ];

  const {
    data: customerDeliveryAddresses,
    isLoading: isLoadingCustomerDeliveryAddresses,
  } = useQuery({
    queryKey: [QUERY_KEY.CUSTOMER_DELIVERY_ADDRESS, customerId],
    queryFn: async () =>
      customerId
        ? await customerAddressService.getListDeliveryAddressById(customerId)
        : null,
    enabled: Boolean(customerId),
  });

  return (
    <div>
      <CustomTable
        rowKey="_id"
        columns={columns}
        isLoading={isLoadingCustomerDeliveryAddresses}
        data={customerDeliveryAddresses?.addressList}
        tableName="Danh sách địa chỉ giao hàng của khách hàng"
        emptyContent="Không có địa chỉ giao hàng nào"
      />
    </div>
  );
};

export default CustomerDeliveryAddress;
