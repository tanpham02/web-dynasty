import { DeleteOutlined, EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Table, TablePaginationConfig, Popconfirm, Typography, Empty } from 'antd';
import { ListResponse, Breakpoint, ListDataResponse } from '~/types';
import React, { useState, useMemo } from 'react';
import { ModalType } from '../VoucherModal';
import { SaleScope, VoucherOverriding, VoucherSaleScope, VoucherStatus } from '~/models/voucher';

interface TableColumn {
  title: string;
  dataIndex?: keyof VoucherOverriding;
  key?: keyof VoucherOverriding;
  sorter?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: VoucherOverriding, index: number) => React.ReactNode;
  responsive?: Breakpoint[];
}

interface VoucherTableProps {
  data?: ListDataResponse<VoucherOverriding>;
  onGetPagination: (data: TablePaginationConfig) => void;
  handleChangeListIdsVoucherForDelete: (ids: React.Key[]) => void;
  handleDeleteSingleVoucher: (id: any) => void;
  handleShowModalVoucher: (type?: ModalType, voucherID?: string) => void;
  handleShowVoucherForNewCustomer: (type?: ModalType, voucherID?: string) => void;
}

export interface Pagination {
  current: number;
  pageSize: number;
}

const VoucherTable = ({
  data,
  onGetPagination,
  handleDeleteSingleVoucher,
  handleChangeListIdsVoucherForDelete,
  handleShowModalVoucher,
  handleShowVoucherForNewCustomer,
}: VoucherTableProps) => {
  const [productCategorySelectedKeys, setProductCategorySelectedKeys] = useState<React.Key[]>([]);
  const pagination = useMemo(() => {
    const current = data?.pageIndex;
    const total = data?.totalElement;

    return {
      pageCurrent: current ? current + 1 : 1, // 1 is page default
      totalElements: total || 0,
    };
  }, [data]);

  const COLUMNS: TableColumn[] = [
    {
      title: 'Tên voucher',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
    },
    {
      title: 'Mã voucher',
      dataIndex: 'code',
      key: 'code',
      align: 'center',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      title: 'Phạm vi khuyến mãi',
      dataIndex: 'saleScope',
      key: 'saleScope',
      align: 'center',
      render: (_, record) => (
        <Typography.Text className='text-[14px] !text-primary font-semibold  rounded-md '>
          {record.saleScope
            ? record.saleScope === SaleScope.ALL
              ? 'Toàn shop'
              : record.saleScope === SaleScope.BY_PRODUCT
              ? 'Theo sản phẩm'
              : 'Giới thiệu khách hàng mới'
            : ''}
        </Typography.Text>
      ),
      responsive: ['xl'],
    },
    {
      title: 'Hành động',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (__text, record) => (
        <div className='flex justify-center gap-2 text-center'>
          <div>
            <Button
              type='primary'
              className='!flex items-center justify-center !rounded-lg !bg-warning border border-solid !border-warning !text-white'
              onClick={() => {
                handleShowModalVoucher(ModalType.UPDATE, record._id);
              }}
            >
              <EditOutlined />
            </Button>
          </div>
          <div
            onClick={() => {
              handleShowModalVoucher(ModalType.INFORMATION, record._id as unknown as string);
            }}
          >
            <Button
              type='primary'
              className='!flex items-center justify-center !rounded-lg  !bg-primary border border-solid !border-primary !text-white'
            >
              <InfoCircleOutlined />
            </Button>
          </div>
          <Popconfirm
            title='Xác nhận xóa voucher này?'
            className=' flex items-center'
            onConfirm={() => {
              handleDeleteSingleVoucher(record._id);
            }}
            okText='Có'
            cancelText='Không'
          >
            <Button
              type={'danger' as 'primary'}
              className={` flex  items-center justify-center !rounded-lg`}
            >
              <DeleteOutlined className='!flex' />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleChangeListIdVoucherChange = (newSelectedRowKeys: React.Key[]) => {
    console.log('🚀 ~ file: index.tsx:144 ~ handleChangeListIdVoucherChange ~ newSelectedRowKeys:', newSelectedRowKeys);
    setProductCategorySelectedKeys(newSelectedRowKeys);
    handleChangeListIdsVoucherForDelete(newSelectedRowKeys);
  };

  const rowSelection = {
    productCategorySelectedKeys,
    onChange: handleChangeListIdVoucherChange,
  };

  return (
    <>
      {data && (
        <Table
          rowSelection={rowSelection}
          rowKey='_id'
          dataSource={data?.data}
          columns={COLUMNS}
          className='rounded-sm border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'
          rowClassName='text-black dark:text-white'
          pagination={{
            current: pagination.pageCurrent,
            total: pagination.totalElements,
          }}
          onChange={onGetPagination}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description='Không có dữ liệu'
              />
            ),
          }}
        />
      )}
    </>
  );
};

export default VoucherTable;
