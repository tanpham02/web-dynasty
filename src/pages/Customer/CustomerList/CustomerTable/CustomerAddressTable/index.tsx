import React from 'react';
import { CustomerAddressItem } from '~/models/customers/customerAddress';
import { Breakpoint } from '~/types';
import { CustomerAddressProps } from '..';
import { Modal, Table, Typography } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import './index.scss';

interface TableColumn {
  title: string;
  dataIndex?: keyof CustomerAddressItem;
  key?: keyof CustomerAddressItem;
  sorter?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: CustomerAddressItem, index: number) => React.ReactNode;
  responsive?: Breakpoint[];
}

interface CustomerAddressTableProps {
  data: CustomerAddressProps;
  onClose: () => void;
}

const CustomerAddressTable = ({ data, onClose }: CustomerAddressTableProps) => {
  const COLUMNS: TableColumn[] = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'districtId',
      align: 'center',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      align: 'center',
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
      render: (_, record, _index) => <Typography.Text>{handleGenerateAddress(record)}</Typography.Text>,
    },
    {
      title: 'Địa chỉ mặc định',
      dataIndex: 'isDefault',
      key: 'isDefault',
      render: (__index, record) => (
        <>
          {record.isDefault && (
            <CheckCircleOutlined
              style={{
                fontSize: 20,
                color: '#006a31',
              }}
            />
          )}
        </>
      ),
      align: 'center',
    },
  ];

  const handleGenerateAddress = (record: CustomerAddressItem) => {
    return `${record?.address}, ${record?.ward}, ${record?.district}, ${record?.city}`;
  };
  return (
    <Modal
      open={data.visible}
      title='Sổ địa chỉ'
      className='modal-list-customer-address'
      footer={null}
      onCancel={onClose}
    >
      <Table
        rowKey='_id'
        dataSource={data?.dataCustomerAddress?.addressList}
        columns={COLUMNS}
        className='rounded-sm border border-stroke w-full max-w-full bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'
        rowClassName='text-black dark:text-white '
      />
    </Modal>
  );
};

export default CustomerAddressTable;
