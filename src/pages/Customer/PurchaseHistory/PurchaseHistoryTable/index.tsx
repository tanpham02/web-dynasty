import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Table } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Customer } from '~/models/customers';

interface TableColumn {
  title: string;
  dataIndex?: keyof Customer;
  key?: keyof Customer;
  sorter?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: Item, index: number) => React.ReactNode;
}

{
  /* <!-- ===== Simple Data Start ===== --> */
}
interface Item {
  id: string;
  fullName: string;
  type: string;
  address: string;
}
const originData: Item[] = [];
for (let i = 0; i < 100; i++) {
  originData.push({
    id: i.toString(),
    fullName: `Hoàng Phúc ${i}`,
    type: 'Chuyển khoản',
    address: `Cao Lãnh no. ${i}`,
  });
}

{
  /* <!-- ===== Simple Data End ===== --> */
}

const PurchaseHistoryTable = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Item[]>(originData);
  const [editingKey, setEditingKey] = useState<string>('');
  console.log(setData, editingKey);
  const cancel = () => {
    setEditingKey('');
  };
  const columns: TableColumn[] = [
    {
      title: 'ID Giao dịch',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
    },
    {
      title: 'Khách hàng',
      dataIndex: 'fullName',
      key: 'fullName',
      align: 'left',
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
    },
    {
      title: 'Trạng thái giao dịch',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
    },
    {
      title: 'Hành động',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (__text, record) => (
        <div className="flex justify-center gap-2 text-center">
          <div onClick={() => navigate(`/create-customers/${record.id}`)}>
            <Button type="primary" className="!flex items-center justify-center !rounded-lg">
              <InfoCircleOutlined /> Chi tiết
            </Button>
          </div>
          {/* <Button
            type={'danger' as 'primary'}
            className='!flex items-center justify-center !rounded-lg'
          >
            <DeleteOutlined /> Xóa
          </Button> */}
        </div>
      ),
    },
  ];
  return (
    <>
      <Table
        rowKey="id"
        dataSource={data}
        columns={columns}
        className="rounded-sm border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
        rowClassName="text-black dark:text-white"
        pagination={{
          onChange: cancel,
        }}
      />
    </>
  );
};

export default PurchaseHistoryTable;
