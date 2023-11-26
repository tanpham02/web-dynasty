import { InfiniteData } from '@tanstack/react-query';
import { Avatar, Table, Typography, Skeleton, Empty } from 'antd';
import { useMemo } from 'react';
import { Product, ProductMain } from '~/models/product';
import { Voucher, VoucherOverriding } from '~/models/voucher';
import { ListDataResponse, ListResponse } from '~/types';
import { ModalType } from '../VoucherModal';

export interface ListProductGetFromVoucherProps {
  onSetListSelectionKeyProduct: (ids: string[]) => void;
  product: InfiniteData<ListDataResponse<ProductMain>> | undefined;
  loadingProduct: boolean;
  voucherById: VoucherOverriding | undefined;
  listProductIdInVoucher: string[];
}

export interface Pagination {
  current?: number;
  pageSize?: number;
}

interface VoucherApplyForProductTableI {
  key?: keyof ProductMain;
  dataIndex?: keyof ProductMain;
  title?: string;
  align?: 'left' | 'center' | 'right';
  render?: (text: string, record: ProductMain, index: number) => React.ReactNode;
}

const ListProductGetFromVoucher = ({
  loadingProduct,
  voucherById,
  listProductIdInVoucher,
}: ListProductGetFromVoucherProps) => {
  const COLUMNS: VoucherApplyForProductTableI[] = [
    {
      key: 'name',
      align: 'left',
      dataIndex: 'name',
      title: 'Tên sản phẩm',
    },
    {
      key: 'image',
      dataIndex: 'image',
      title: 'Hình ảnh',
      render: (__id, record) =>
        record.image != '' ? (
          <Avatar
            src={record.image}
            shape='square'
            size={84}
          />
        ) : (
          <Avatar
            style={{ backgroundColor: '#de7300' }}
            shape='square'
            size={84}
          >
            {record.name && record.name.charAt(0)}
          </Avatar>
        ),
      align: 'center',
    },
    {
      key: '_id',
      align: 'center',
      dataIndex: '_id',
      title: 'Trạng thái',
      render: (__, record: ProductMain) => (
        <Typography.Text>
          <label
            className={`tracking-[0.5px]   px-2 py-1 rounded-md font-medium ${
              record._id && listProductIdInVoucher?.includes(record._id)
                ? 'bg-success text-white'
                : 'bg-danger text-white'
            } `}
          >
            {record._id && listProductIdInVoucher?.includes(record._id) ? 'Đã được áp dụng' : 'Chưa được áp dụng'}
          </label>
        </Typography.Text>
      ),
    },
    {
      key: 'price',
      align: 'center',
      dataIndex: 'price',
      title: 'Giá',
      render: (__, record: ProductMain) => (
        <Typography.Text>
          <label className='tracking-[0.5px] font-normal '>{record.price?.toLocaleString('EN')} đ</label>
        </Typography.Text>
      ),
    },
  ];

  const handleGetListProductWasUsingVoucher = useMemo(
    () => voucherById?.listProductUsedVoucher?.map((item) => item),
    [voucherById],
  );

  return (
    <>
      {loadingProduct ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        <Table
          rowKey='_id'
          dataSource={handleGetListProductWasUsingVoucher as unknown as ProductMain[]}
          columns={COLUMNS}
          pagination={false}
          scroll={{ y: '45vh' }}
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

export default ListProductGetFromVoucher;
