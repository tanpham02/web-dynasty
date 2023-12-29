import { Avatar, Table } from 'antd';
import { Customer } from '~/models/customers';

interface Columns {
  title?: string;
  dataIndex?: keyof Customer;
  key?: keyof Customer;
  sorter?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: Customer) => React.ReactNode;
}

interface MembershipModalInfoTableCustomerProps {
  customerDTOs?: Customer[];
}

const MembershipModalInfoTableCustomer = ({
  customerDTOs,
}: MembershipModalInfoTableCustomerProps) => {
  const COLUMNS: Columns[] = [
    {
      key: 'id',
      dataIndex: 'id',
      title: 'ID',
      align: 'center',
      render: (__index, record: Customer) => <span>{record.id}</span>,
    },

    {
      key: 'username',
      dataIndex: 'username',
      title: 'Tên đăng nhập',
      align: 'center',
      render: (__index, record: Customer) => <span>{record.username}</span>,
    },
    {
      key: 'fullName',
      dataIndex: 'fullName',
      title: 'Tên khách hàng',
      align: 'center',
      render: (__index, record: Customer) => <span>{record.fullName}</span>,
    },
    {
      key: 'avatar',
      dataIndex: 'avatar',
      title: 'Hình ảnh',
      render: (__id, record) =>
        record.avatar != '' ? (
          <Avatar src={record.avatar} shape="square" className="!rounded-lg" size={84} />
        ) : (
          <Avatar style={{ backgroundColor: '#de7300' }} shape="square" size={84}>
            {record.fullName && record.fullName.charAt(0)}
          </Avatar>
        ),
    },
    {
      title: 'Hạng',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (__index, record) => (
        <>
          {record?.membershipDTO?.color && record?.membershipDTO?.name ? (
            <div
              style={{ backgroundColor: record?.membershipDTO?.color }}
              className={`inline-flex items-center rounded-lg px-3 py-1 text-center font-semibold  text-white`}
            >
              {record?.membershipDTO?.name}
            </div>
          ) : (
            <div
              className={`inline-flex items-center rounded-lg !bg-success px-3 py-1 text-center font-semibold  text-white`}
            >
              {record?.membershipDTO?.name}
            </div>
          )}
        </>
      ),
    },
  ];

  return (
    <div>
      <span className="flex justify-end text-[16px] font-semibold text-success mt-6 mb-3 ">
        Danh sách khách hàng sử dụng gói này
      </span>
      <Table
        scroll={{ y: '45vh' }}
        rowKey="id"
        dataSource={customerDTOs}
        columns={COLUMNS}
        className="rounded-sm border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
        rowClassName="text-black dark:text-white"
        pagination={false}
      />
    </div>
  );
};

export default MembershipModalInfoTableCustomer;
