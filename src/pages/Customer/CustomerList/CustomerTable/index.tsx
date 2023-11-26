import { CalculatorOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { InfiniteData } from '@tanstack/react-query';
import { Avatar, Button, Select, Table, TablePaginationConfig } from 'antd';
import { useMemo, useState } from 'react';
import { Customer } from '~/models/customers';
import { Breakpoint, ListDataResponse, ListResponse } from '~/types';
import CreateOrUpdateCustomerModal from '../CreateOrUpdateCustomerModal';
import moment from 'moment';
import { DATE_FORMAT_DDMMYYYY } from '~/utils/date.utils';
import UpdateCustomerPointModal from '../UpdateCustomerPoint';
import customerAddressService from '~/services/customerService/customerAddressService';
import { CustomerAddressList } from '~/models/customers/customerAddress';
import CustomerAddressTable from './CustomerAddressTable';

interface TableColumn {
  title: string;
  dataIndex?: keyof Customer;
  key?: keyof Customer;
  sorter?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: Customer, index: number) => React.ReactNode;
  responsive?: Breakpoint[];
}

const CUSTOMER_ID_WHEN_EMPTY = -100;

interface CustomerTableProps {
  data: ListDataResponse<Customer> | undefined;
  refreshData: () => void;
  handleTableChange: (paginationFromTable: TablePaginationConfig) => void;
}

export interface CustomerAddressProps {
  visible?: boolean;
  dataCustomerAddress?: CustomerAddressList;
}

const CustomerTable = ({ data, refreshData, handleTableChange }: CustomerTableProps) => {
  const [showCreateOrUpdateCustomerModal, setShowCreateOrUpdateCustomerModal] = useState<{
    isShowCreateOrUpdateCustomerModal?: boolean;
    isShowUpdateCustomerPointModal?: boolean;
    customerID: number;
    type?: 'UPDATE' | 'CREATE' | 'DETAIL';
  }>({
    isShowCreateOrUpdateCustomerModal: false,
    isShowUpdateCustomerPointModal: false,
    customerID: CUSTOMER_ID_WHEN_EMPTY,
    type: 'CREATE',
  });
  const [dataCustomerAddress, setDataCustomerAddress] = useState<CustomerAddressProps>({});

  const pagination = useMemo(() => {
    const current = data?.pageIndex;
    const total = data?.totalElement;
    const pageSize = data?.pageSize;
    return {
      pageCurrent: current ? current + 1 : 1, // 1 is page default
      totalElements: total,
      pageSize: pageSize,
    };
  }, [data]);

  const COLUMNS: TableColumn[] = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
      align: 'center',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
      align: 'center',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      responsive: ['lg'],
    },
    {
      title: 'Ngày sinh',
      dataIndex: 'birthday',
      key: 'birthday',
      render: (__index, record) => <div>{record.birthday && moment(record.birthday).format(DATE_FORMAT_DDMMYYYY)}</div>,
      align: 'center',
      responsive: ['md'],
    },
    {
      title: 'Sổ địa chỉ',
      dataIndex: 'customerAddressId',
      key: 'customerAddressId',
      render: (__index, record) => (
        <button
          className='py-2 px-3 bg-gray text-primary rounded-md font-semibold hover:text-white duration-200 ease-linear hover:bg-primary'
          onClick={() => handleShowListCustomerAddress(record?._id)}
        >
          Xem sổ địa chỉ
        </button>
      ),
      align: 'center',
    },

    // {
    //   title: 'Địa chỉ',
    //   dataIndex: 'address',
    //   key: 'address',
    //   align: 'left',
    //   render: (__index, record) => <span>{handleConvertAddress(record)}</span>,
    //   responsive: ['xl'],
    // },
  ];

  const handleShowListCustomerAddress = async (customerId?: string) => {
    try {
      if (customerId) {
        const listCustomerAddress = await customerAddressService.getListCustomerAddressByCustomerId(customerId);
        return setDataCustomerAddress({ visible: true, dataCustomerAddress: listCustomerAddress });
      }
      setDataCustomerAddress({ visible: false });
    } catch (error) {
      console.log(error);
    }
  };

  const handleConvertAddress = (record: Customer) => {
    const addressParts = [record.address, record.ward, record.district, record.city];
    return addressParts.filter(Boolean).join(', ');
  };

  const handleCloseProductDetailModal = () => {
    setShowCreateOrUpdateCustomerModal({
      isShowCreateOrUpdateCustomerModal: false,
      customerID: CUSTOMER_ID_WHEN_EMPTY,
      type: 'CREATE',
    });
  };

  const handleShowCustomerDetail = (customerID: number | undefined) => {
    if (customerID) {
      setShowCreateOrUpdateCustomerModal({
        isShowCreateOrUpdateCustomerModal: !showCreateOrUpdateCustomerModal.isShowCreateOrUpdateCustomerModal,
        customerID: customerID,
        type: 'DETAIL',
      });
    }
  };

  const handleShowCustomerUpdateForm = (customerID: number | undefined) => {
    if (customerID) {
      setShowCreateOrUpdateCustomerModal({
        isShowCreateOrUpdateCustomerModal: !showCreateOrUpdateCustomerModal.isShowCreateOrUpdateCustomerModal,
        customerID: customerID,
        type: 'UPDATE',
      });
    }
  };

  const handleCloseUpdateCustomerPointModal = () => {
    setShowCreateOrUpdateCustomerModal({
      isShowUpdateCustomerPointModal: false,
      customerID: CUSTOMER_ID_WHEN_EMPTY,
    });
  };

  const handleShowUpdateCustomerPointModal = (customerID: number | undefined) => {
    if (customerID) {
      setShowCreateOrUpdateCustomerModal({
        isShowUpdateCustomerPointModal: !showCreateOrUpdateCustomerModal.isShowUpdateCustomerPointModal,
        customerID: customerID,
      });
    }
  };

  return (
    <>
      <Table
        rowKey='_id'
        dataSource={data?.data}
        columns={COLUMNS}
        className='rounded-sm border border-stroke w-full max-w-full bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'
        rowClassName='text-black dark:text-white'
        onChange={handleTableChange}
        pagination={{
          current: pagination.pageCurrent,
          pageSize: pagination.pageSize,
          total: pagination.totalElements,
        }}
      />
      {showCreateOrUpdateCustomerModal.isShowCreateOrUpdateCustomerModal && (
        <CreateOrUpdateCustomerModal
          isShowCustomerModal={showCreateOrUpdateCustomerModal.isShowCreateOrUpdateCustomerModal}
          customerID={showCreateOrUpdateCustomerModal.customerID}
          type={showCreateOrUpdateCustomerModal.type || 'DETAIL'}
          handleCancelModal={handleCloseProductDetailModal}
          handleConfirmModal={handleCloseProductDetailModal}
          refreshData={refreshData}
        />
      )}
      {showCreateOrUpdateCustomerModal.isShowUpdateCustomerPointModal && (
        <UpdateCustomerPointModal
          isShowUpdateCustomerPointModal={showCreateOrUpdateCustomerModal.isShowUpdateCustomerPointModal}
          customerID={showCreateOrUpdateCustomerModal.customerID}
          handleCancelModal={handleCloseUpdateCustomerPointModal}
          handleConfirmModal={handleCloseUpdateCustomerPointModal}
          refreshData={refreshData}
        />
      )}
      {dataCustomerAddress.visible && (
        <CustomerAddressTable
          data={dataCustomerAddress}
          onClose={() => setDataCustomerAddress({ visible: false })}
        />
      )}
    </>
  );
};

export default CustomerTable;
