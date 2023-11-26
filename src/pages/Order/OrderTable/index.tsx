import { InfiniteData } from '@tanstack/react-query';
import { Empty, Select, Table, TablePaginationConfig, Typography } from 'antd';
import React, { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Order, StatusOrder, TypeOrder } from '~/models/order';
import orderService from '~/services/orderService';
import { Breakpoint, ListDataResponse } from '~/types';
import { formatCurrencyVND } from '~/utils/number';
import { PaginationProps } from '..';

interface Columns {
  title?: string;
  dataIndex?: keyof Order;
  key?: keyof Order;
  sorter?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: Order) => React.ReactNode;
  responsive?: Breakpoint[];
}

interface OrderTableProps {
  data?: InfiniteData<ListDataResponse<Order>>;
  onGetIsLoading: (value: boolean) => void;
  refetchData: () => void;
  onGetPaginationState: (data?: PaginationProps) => void;
}

export const STATUS_ORDER_OPTIONS = [
  {
    label: 'Đợi xác nhận',
    value: StatusOrder.PENDING,
  },
  {
    label: 'Đợi lấy hàng',
    value: StatusOrder.WAITING_FOR_DELIVERING,
  },
  {
    label: 'Đang giao hàng',
    value: StatusOrder.DELIVERING,
  },
  {
    label: 'Giao hàng thất bại',
    value: StatusOrder.FAIL,
  },
  {
    label: 'Đơn đã hủy',
    value: StatusOrder.CANCELED,
  },
  {
    label: 'Giao hàng thành công',
    value: StatusOrder.SUCCESS,
  },
];

const OrderTable = ({ data, onGetIsLoading, refetchData, onGetPaginationState }: OrderTableProps) => {
  const COLUMNS: Columns[] = [
    {
      key: 'fullName',
      dataIndex: 'fullName',
      title: 'Tên khách hàng',
      align: 'center',
    },

    {
      key: 'phoneNumber',
      dataIndex: 'phoneNumber',
      title: 'Số điện thoại',
      align: 'center',
    },
    {
      title: 'Địa chỉ giao hàng',
      dataIndex: 'address',
      key: 'address',
      align: 'center',
      render: (__index, record) => <Typography.Text>{handleGenerateAddress(record)}</Typography.Text>,
      responsive: ['xl'],
    },
    {
      title: 'Loại đơn hàng',
      dataIndex: 'typeOrder',
      key: 'typeOrder',
      align: 'center',
      render: (__index, record) => (
        <Typography.Text
          className={`font-medium ${
            record.typeOrder === TypeOrder.ORDER_DELIVERING ? '!text-primary' : '!text-[#d50e15]'
          }`}
        >{`${record.typeOrder === TypeOrder.ORDER_DELIVERING ? 'Đặt giao hàng' : 'Đặt đến lấy'}`}</Typography.Text>
      ),
      responsive: ['md'],
    },
    {
      key: 'totalOrder',
      dataIndex: 'totalOrder',
      title: 'Tổng tiền',
      align: 'center',
      render: (__index, record) => (
        <Typography.Text className='tracking-[0.5px]'>
          {record?.totalOrder ? formatCurrencyVND(record.totalOrder) : ''}
        </Typography.Text>
      ),
      responsive: ['md'],
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'statusOrder',
      key: 'statusOrder',
      align: 'center',
      render: (__id, record) => (
        <Select
          style={{ minWidth: 'calc(100% + 16px)' }}
          className=' rounded-lg !max-w-[200px] border-2 border-gray bg-white dark:bg-boxdark'
          value={record?.statusOrder}
          onChange={(value) => handleUpdateOrderStatus(record?._id, value)}
          showSearch={false}
          options={STATUS_ORDER_OPTIONS}
        />
      ),
    },
  ];

  const pagination = useMemo(() => {
    const current = data?.pages?.[data?.pages.length - 1].pageIndex;
    const total = data?.pages?.[data?.pages.length - 1].totalElement;
    const pageSize = data?.pages?.[data?.pages.length - 1].pageSize;
    return {
      pageCurrent: current ? current + 1 : 1, // 1 is page default
      totalElements: total,
      pageSize: pageSize,
    };
  }, [data]);

  const handleUpdateOrderStatus = async (orderId?: string, value?: StatusOrder) => {
    onGetIsLoading(true);

    try {
      if (orderId && value) {
        await orderService.updateOrderStatus(orderId, value);
        toast.success('Thay đổi trạng thái đơn hàng thành công', {
          position: 'bottom-right',
          duration: 1500,
          icon: '🤪',
        });
        onGetIsLoading(false);
        refetchData();
      }
    } catch (error) {
      console.log(error);
      toast.error('Thay đổi trạng thái đơn hàng thất bại', {
        position: 'bottom-right',
        duration: 1500,
        icon: '😞',
      });
      onGetIsLoading(false);
    }
  };

  const handleGenerateAddress = (record: Order) => {
    return `${record?.address}, ${record?.ward}, ${record?.district}, ${record?.city}`;
  };

  return (
    <Table
      rowKey='_id'
      dataSource={data?.pages[data?.pages?.length - 1]?.data}
      columns={COLUMNS}
      className='rounded-sm border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'
      rowClassName='text-black dark:text-white'
      pagination={{
        current: pagination?.pageCurrent,
        pageSize: pagination?.pageSize,
        total: pagination?.totalElements,
      }}
      onChange={({ current, pageSize, total }: TablePaginationConfig) => {
        onGetPaginationState({ pageIndex: current ? current - 1 : current, pageSize });
      }}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description='Không có dữ liệu'
          />
        ),
      }}
    />
  );
};

export default OrderTable;
