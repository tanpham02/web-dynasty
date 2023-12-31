import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Table, TablePaginationConfig, Typography } from 'antd';
import { ListResponse } from '~/types';
import React, { useState, useMemo } from 'react';
import { Banner, BannerType } from '~/models/banner';

import { ModalType } from '../BannerModal';

interface TableColumn {
  title: string;
  dataIndex?: keyof Banner;
  key?: keyof Banner;
  sorter?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: Banner, index: number) => React.ReactNode;
}

interface UserTableProps {
  data: ListResponse<Banner> | undefined;
  refreshData: () => void;
  onGetPagination: (data: TablePaginationConfig) => void;
  handleChangeListIdsBannerForDelete: (ids: React.Key[]) => void;
  handleDeleteOneBanner: (id: any) => void;
  handleShowModalBanner: (type?: ModalType, bannerId?: number) => void;
}

export interface Pagination {
  current: number;
  pageSize: number;
}

const BannerTable = ({
  data,
  onGetPagination,
  handleChangeListIdsBannerForDelete,
  handleDeleteOneBanner,
  handleShowModalBanner,
}: UserTableProps) => {
  const [bannerSelectedKeys, setBannerSelectedKeys] = useState<React.Key[]>([]);

  const pagination = useMemo(() => {
    const current = data?.pageable?.pageNumber;
    const total = data?.totalElements;

    return {
      pageCurrent: current ? current + 1 : 1, // 1 is page default
      totalElements: total || 0,
    };
  }, [data]);

  const filterBannerByBannerType = (record: Banner) => {
    let filterBannerByBannerType = {
      title: '',
    };
    switch (record.bannerType) {
      case BannerType.CATEGORY:
        filterBannerByBannerType = {
          title: 'Danh mục',
        };
        break;

      case BannerType.PRODUCT:
        filterBannerByBannerType = {
          title: 'Sản phẩm',
        };
        break;
      case BannerType.NEWS:
        filterBannerByBannerType = {
          title: 'Tin tức',
        };
        break;
    }
    return filterBannerByBannerType;
  };

  const COLUMNS: TableColumn[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: 'Banner',
      dataIndex: 'path',
      key: 'path',
      align: 'center',
      render: (_, record: Banner) => (
        <>
          <img
            src={record.path}
            alt={filterBannerByBannerType(record).title}
            className="!h-[200px] !rounded-[10px] mx-auto"
          />
        </>
      ),
    },
    {
      title: 'Thể loại',
      dataIndex: 'bannerType',
      key: 'bannerType',
      align: 'center',
      render: (_, record: Banner) => (
        <Typography.Text type="secondary" className="!text-black">
          {filterBannerByBannerType(record).title}
        </Typography.Text>
      ),
    },

    // {
    //   title: 'Dẫn đến trang',
    //   dataIndex: 'id',
    //   key: 'id',
    //   align: 'center',
    //   render: (_, record: Banner) => (
    //     <Typography.Text
    //       type='secondary'
    //       className='!text-black'
    //     >
    //       ""
    //     </Typography.Text>
    //   ),
    // },
    {
      title: 'Hành động',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (__, record: Banner) => (
        <div className="flex justify-center gap-2 text-center">
          <div>
            <Button
              type="primary"
              className="!flex items-center justify-center !rounded-lg"
              onClick={() => handleShowModalBanner(ModalType.UPDATE, record.id)}
            >
              <EditOutlined />
            </Button>
          </div>

          <div>
            <Popconfirm
              onConfirm={() => handleDeleteOneBanner(record.id)}
              okText="Có"
              cancelText="Không"
              title="Xác nhận xóa banner này"
            >
              <Button
                type={'danger' as 'primary'}
                className={` flex  items-center justify-center !rounded-lg`}
              >
                <DeleteOutlined className="!flex" />
              </Button>
            </Popconfirm>
          </div>
        </div>
      ),
    },
  ];

  const onUserListCheckedChange = (newSelectedRowKeys: React.Key[]) => {
    setBannerSelectedKeys(newSelectedRowKeys);
    handleChangeListIdsBannerForDelete(newSelectedRowKeys);
  };

  const rowSelection = {
    bannerSelectedKeys,
    onChange: onUserListCheckedChange,
  };

  return (
    <>
      {data && (
        <Table
          rowSelection={rowSelection}
          rowKey="id"
          dataSource={data.content}
          columns={COLUMNS}
          className="rounded-sm border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
          rowClassName="text-black dark:text-white"
          pagination={{
            current: pagination.pageCurrent,
            total: pagination.totalElements,
          }}
          onChange={onGetPagination}
        />
      )}
    </>
  );
};

export default BannerTable;
