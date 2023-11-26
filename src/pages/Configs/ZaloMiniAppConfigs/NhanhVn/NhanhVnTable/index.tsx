import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Button, Popconfirm, Table, Typography } from 'antd';
import React, { useState } from 'react';
import { ModalType } from '../NhanhVnModal';
import { NhanhVn, NhanhVnStatus } from '~/models/nhanhVn';
import { Breakpoint } from '~/types';

interface TableColumn {
  title: string;
  dataIndex?: keyof NhanhVn;
  key?: keyof NhanhVn;
  sorter?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: NhanhVn, index: number) => React.ReactNode;
  responsive?: Breakpoint[];
}

interface NhanhVnTableProps {
  data: NhanhVn[] | undefined;
  refreshData: () => void;
  handleChangeListIdsNhanhVnForDelete: (ids: React.Key[]) => void;
  handleDeleteOneNhanhVn: (id: any) => void;
  handleShowModalNhanhVn: (type?: ModalType, nhanhVnId?: number) => void;
}

export interface Pagination {
  current: number;
  pageSize: number;
}

const NhanhVnTable = ({
  data,
  handleChangeListIdsNhanhVnForDelete,
  handleDeleteOneNhanhVn,
  handleShowModalNhanhVn,
}: NhanhVnTableProps) => {
  const [nhanhVnSelectedKeys, setNhanhVnSelectedKeys] = useState<React.Key[]>([]);

  const COLUMNS: TableColumn[] = [
    {
      title: 'STT',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (__, __record, index) => <strong>{index + 1}</strong>,
    },
    {
      title: 'App ID',
      dataIndex: 'appId',
      key: 'appId',
      align: 'center',
    },
    {
      title: 'Business ID',
      dataIndex: 'businessId',
      key: 'businessId',
      align: 'center',
      responsive: ['xl'],
    },
    {
      title: 'Phiên bản',
      dataIndex: 'version',
      key: 'version',
      align: 'center',
      responsive: ['xl'],
    },
    {
      title: 'Độ ưu tiên',
      dataIndex: 'priority',
      key: 'priority',
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (__id, record) => {
        switch (record.status) {
          case NhanhVnStatus.ACTIVE:
            return (
              <div className='!flex items-center justify-center'>
                <Typography.Text className='text-[14px] !text-success font-semibold  rounded-md '>
                  Hoạt động
                </Typography.Text>
              </div>
            );
          case NhanhVnStatus.IN_ACTIVE:
            return (
              <div className='!flex items-center justify-center'>
                <button className='text-[14px] !text-danger  rounded-md font-semibold'>Ngưng hoạt động</button>
              </div>
            );
          default:
        }
      },
      responsive: ['lg'],
    },
    {
      title: 'Hành động',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      render: (__, record: NhanhVn) => (
        <div className='flex justify-center gap-2 text-center'>
          <div>
            <Button
              type='primary'
              className='!flex items-center justify-center !rounded-lg'
              onClick={() => handleShowModalNhanhVn(ModalType.UPDATE, record.id)}
            >
              <EditOutlined />
            </Button>
          </div>

          <div>
            <Popconfirm
              onConfirm={() => handleDeleteOneNhanhVn(record.id)}
              okText='Có'
              cancelText='Không'
              title='Xác nhận xóa cấu hình NhanhVn này'
            >
              <Button
                type={'danger' as 'primary'}
                className={` flex  items-center justify-center !rounded-lg`}
              >
                <DeleteOutlined className='!flex' />
              </Button>
            </Popconfirm>
          </div>
        </div>
      ),
    },
  ];

  const onChangeListCheckedNhanhVn = (newSelectedRowKeys: React.Key[]) => {
    setNhanhVnSelectedKeys(newSelectedRowKeys);
    handleChangeListIdsNhanhVnForDelete(newSelectedRowKeys);
  };

  const rowSelection = {
    nhanhVnSelectedKeys,
    onChange: onChangeListCheckedNhanhVn,
  };

  return (
    <>
      {data && (
        <Table
          rowSelection={rowSelection}
          rowKey='id'
          dataSource={data}
          columns={COLUMNS}
          className='rounded-sm border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'
          rowClassName='text-black dark:text-white'
          pagination={false}
        />
      )}
    </>
  );
};

export default NhanhVnTable;
