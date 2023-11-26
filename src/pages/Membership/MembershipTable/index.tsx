import { EditOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { InfiniteData, useQuery } from '@tanstack/react-query';
import { Avatar, Button, Table, TablePaginationConfig, Tooltip } from 'antd';
import { useMemo, useState } from 'react';
import { Membership } from '~/models/membership';
import { Breakpoint, ListResponse } from '~/types';
import { MembershipCreateModal, ModalType } from '../MembershipModal';
import { QUERY_KEY } from '~/constants/querryKey';
import { membershipService } from '~/services/membershipService';
import { MembershipModalInfo } from '../MembershipModal/MembershipModalInfo';

interface Columns {
  title?: string;
  dataIndex?: keyof Membership;
  key?: keyof Membership;
  sorter?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: Membership) => React.ReactNode;
  responsive?: Breakpoint[];
}

export interface ModalMembership {
  isShowMembershipDetailModal: boolean;
  membershipID?: number;
  modalType?: ModalType;
}

interface MembershipTableProps {
  data: InfiniteData<ListResponse<Membership>> | undefined;
  refreshData: () => void;
  handleTableChange: (paginationFromTable: TablePaginationConfig) => void;
}

const MEMBERSHIP_ID_WHEN_EMPTY = -100;

const MembershipTable = ({ data, refreshData, handleTableChange }: MembershipTableProps) => {
  const [showMembershipModal, setShowMembershipModal] = useState<ModalMembership>({
    isShowMembershipDetailModal: false,
    membershipID: MEMBERSHIP_ID_WHEN_EMPTY,
  });

  const { data: membershipById } = useQuery(
    [QUERY_KEY.MEMBERSHIP, showMembershipModal.membershipID],
    async () => {
      if (showMembershipModal.membershipID) {
        return membershipService.getMembershipByID(showMembershipModal.membershipID);
      }
    },
    {
      enabled: Boolean(showMembershipModal.isShowMembershipDetailModal),
    },
  );

  const handleOpenOrCloseMembershipDetailModal = (type?: ModalType, membershipId?: number) => {
    setShowMembershipModal({
      isShowMembershipDetailModal: !showMembershipModal.isShowMembershipDetailModal,
      membershipID: membershipId ? membershipId : 0,
      modalType: type,
    });
  };

  const COLUMNS: Columns[] = [
    {
      key: 'id',
      dataIndex: 'id',
      title: 'ID',
      align: 'center',
      render: (__index, record: Membership) => <span>{record.id}</span>,
      responsive: ['lg'],
    },

    {
      key: 'name',
      dataIndex: 'name',
      title: 'Hạng thành viên',
      align: 'center',
      render: (__index, record: Membership) => <span>{record.name}</span>,
    },
    {
      key: 'conditionPrice',
      dataIndex: 'conditionPrice',
      title: 'Giá trị tích lũy cần đạt',
      align: 'center',
      render: (__index, record: Membership) => <span>{record.conditionPrice}</span>,
    },
    {
      key: 'percentDiscount',
      dataIndex: 'percentDiscount',
      title: 'Phần % giảm giá',
      align: 'center',
      render: (__index, record: Membership) => <span>{record.percentDiscount}</span>,
    },
    {
      key: 'backgroundImage',
      dataIndex: 'backgroundImage',
      title: 'Banner',
      render: (__id, record) =>
        record.backgroundImage != '' ? (
          <Avatar
            src={record.backgroundImage}
            shape='square'
            className='!rounded-lg'
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
      responsive: ['xl'],
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (__index, record) => (
        <div
          className={
            record.status === 'ACTIVE'
              ? 'inline-flex items-center rounded-lg bg-success px-3 py-1 text-center font-semibold  text-white'
              : 'inline-flex items-center rounded-lg bg-danger px-3 py-1 text-center font-semibold  text-white'
          }
        >
          {record.status == 'ACTIVE' ? 'Hoạt động' : 'Ngưng hoạt động'}
        </div>
      ),
      responsive: ['xxl'],
    },
    {
      title: 'Hành động',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (__id, record) => {
        return (
          <div className='flex justify-center gap-2 text-center'>
            <Button
              type='primary'
              className='!flex items-center justify-center !rounded-lg'
              onClick={() => record && handleOpenOrCloseMembershipDetailModal(ModalType.UPDATE, record.id)}
              // disabled={record?.existingCustomer}
            >
              <EditOutlined />
            </Button>

            <Button
              type='primary'
              className='!flex items-center justify-center !rounded-lg'
              onClick={() => record && handleOpenOrCloseMembershipDetailModal(ModalType.INFORMATION, record.id)}
            >
              <InfoCircleOutlined />
            </Button>
          </div>
        );
      },
    },
  ];

  const pagination = useMemo(() => {
    const current = data?.pages[data?.pages.length - 1].pageable.pageNumber;
    const total = data?.pages[data?.pages.length - 1].totalElements;
    const pageSize = data?.pages[data?.pages.length - 1].pageable.pageSize;
    return {
      pageCurrent: current ? current + 1 : 1, // 1 is page default
      totalElements: total,
      pageSize: pageSize,
    };
  }, [data]);

  return (
    <>
      <div className='mb-2 flex flex-row justify-end flex-wrap  items-center gap-2'>
        {' '}
        <div className='flex flex-row justify-between items-center gap-2 w-full'>
          <span className='font-bold text-xl'>{'Danh sách hạng thành viên'}</span>
          <button
            onClick={() => handleOpenOrCloseMembershipDetailModal(ModalType.CREATE)}
            className='rounded-lg bg-primary px-4 py-2 font-normal text-white'
          >
            Thêm hạng thành viên
          </button>
        </div>
      </div>
      <Table
        rowKey='id'
        dataSource={data?.pages[data?.pages.length - 1]?.content}
        columns={COLUMNS}
        className='rounded-sm border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1'
        rowClassName='text-black dark:text-white'
        pagination={{
          current: pagination.pageCurrent,
          pageSize: pagination.pageSize,
          total: pagination.totalElements,
        }}
        onChange={handleTableChange}
      />
      {showMembershipModal.isShowMembershipDetailModal && showMembershipModal.modalType !== ModalType.INFORMATION && (
        <MembershipCreateModal
          handleOpenOrCloseMembershipCreateModal={handleOpenOrCloseMembershipDetailModal}
          refreshMembershipData={refreshData}
          modalType={showMembershipModal.modalType}
          membershipById={membershipById}
        />
      )}

      {showMembershipModal.isShowMembershipDetailModal && showMembershipModal.modalType === ModalType.INFORMATION && (
        <MembershipModalInfo
          onClose={() => setShowMembershipModal({ isShowMembershipDetailModal: false })}
          membershipById={membershipById}
        />
      )}
    </>
  );
};

export default MembershipTable;
