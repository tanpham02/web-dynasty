import SVG from 'react-inlinesvg';
import SEARCH_ICON from '~ assets/svg/search.svg';
import SelectCustom from '~/components/customs/Select';
import UserTable from './UserTable';
import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '~/constants/querryKey';
import userService from '~/services/userService';
import { Button, Modal, Skeleton, TablePaginationConfig } from 'antd';
import { User, UserRole, UserStatus } from '~/models/user';
import useDebounce from '~/hooks/useDebounce';
import trash from '~/assets/svg/trash.svg';
import { toast } from 'react-hot-toast';
import UserModal, { ModalType } from './UserModal';
import { SearchParams } from '~/types';
import { useSelector } from 'react-redux';
import { RootState } from '~/redux/store';

export interface ModalKey {
  visible?: boolean;
  type?: ModalType;
  user?: User;
}

const UserListPage = () => {
  const currentUserLogin = useSelector<RootState, User>((state) => state.userStore.user);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState<boolean>(false);
  const [userModal, setUserModal] = useState<ModalKey>({
    visible: false,
  });
  const [searchText, setSearchText] = useState<string>('');
  const [filterRole, setFilterRole] = useState<UserStatus | string>('');
  const [listIdsUserForDelete, setListIdsUserForDelete] = useState<React.Key[]>([]);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const [pagination, setPagination] = useState<SearchParams>({
    pageIndex: 0,
    pageSize: 10,
  });

  const optionStatus = [
    {
      value: null,
      label: 'Tất cả',
    },
    {
      value: UserRole.ADMIN,
      label: 'Quản trị',
    },
    {
      value: UserRole.USER,
      label: 'Nhân viên',
    },
  ];

  const search = useDebounce(searchText, 500);
  const role = useDebounce(filterRole, 500);

  const {
    data: users,
    refetch,
    isLoading: isLoadingUser,
  } = useInfiniteQuery([QUERY_KEY.USERS, search, role, pagination], async () => {
    const params = {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      fullName: search,
      role: role,
    };
    return await userService.searchUserByCriteria(params);
  });

  const handleShowModalDeleteUser = () => {
    setShowDeleteUserModal(true);
  };

  const handleGetPagination = (paginationFromTable: TablePaginationConfig) => {
    if (paginationFromTable.current && pagination.pageSize)
      setPagination({
        pageIndex: paginationFromTable.current - 1,
        pageSize: paginationFromTable.pageSize,
      });
  };

  const handleOk = () => {
    handleDeleteUser(listIdsUserForDelete);
  };

  const handleCancel = () => {
    setShowDeleteUserModal(false);
  };

  useEffect(() => {
    if (users) {
      if (users?.pages?.[0]?.data?.length <= 0) {
        setPagination((prev) => ({
          ...prev,
          pageIndex: prev?.pageIndex && prev?.pageIndex - 1,
        }));
      }
    }
  }, [users]);

  const handleShowModalUser = (type?: ModalType, userId?: string) => {
    if (userId && type !== ModalType.CREATE) {
      const userAfterFindById = users?.pages[users?.pages.length - 1]?.data?.find((user) => user._id === userId);
      setUserModal({
        type,
        user: userAfterFindById,
        visible: true,
      });
    } else {
      setUserModal({
        type,
        visible: true,
      });
    }
  };

  const handleDeleteUser = async (ids: any) => {
    setIsLoadingDelete(true);
    console.log('ids', ids);

    try {
      await userService.deleteUser(ids);
      toast.success('Xóa thành công', {
        position: 'bottom-right',
        duration: 3000,
        icon: '👏',
        style: { width: '70%' },
      });

      setIsLoadingDelete(false);
      if (Array.isArray(ids)) {
        setListIdsUserForDelete([]);
        if (!isLoadingDelete) {
          setShowDeleteUserModal(false);
        }
      }
      refetch();
    } catch (err) {
      console.log(err);
      toast.success('Xóa thất bại', {
        position: 'bottom-right',
        duration: 3500,
        icon: '😔',
      });
    }
  };

  return (
    <>
      <div className='flex flex-row justify-between items-center gap-2 w-full'>
        <span className='font-bold text-title-xl block pb-2 '>Danh sách nhân viên</span>
        <button
          className='rounded-lg px-4 py-2 font-normal text-white bg-primary
          '
          onClick={() => handleShowModalUser(ModalType.CREATE)}
        >
          Thêm nhân viên
        </button>
      </div>

      <div className='mb-2 flex flex-row justify-between flex-wrap  items-center gap-2'>
        <div className='flex items-center flex-wrap gap-2 lg:w-[75%] md:w-[50%]'>
          <div className='my-2 flex  w-full items-center rounded-lg border-2 border-gray bg-white p-2 dark:bg-boxdark lg:w-[35%] xl:w-[35%]'>
            <SVG src={SEARCH_ICON} />
            <input
              type='text'
              placeholder='Tìm kiếm...'
              className='w-full bg-transparent pl-6 pr-4 focus:outline-none'
              onChange={(e: any) => setSearchText(e.target.value)}
              value={searchText}
            />
          </div>
          <SelectCustom
            options={optionStatus}
            className='flex w-full items-center rounded-lg lg:w-[25%] xl:w-[25%]'
            placeholder='Vai trò'
            onChange={(e: any) => setFilterRole(e.value)}
          />

          <button className='rounded-lg bg-primary px-4 py-2 font-normal text-white  '>Tìm</button>
        </div>
        {listIdsUserForDelete.length !== 0 ? (
          <div
            className='rounded-lg cursor-pointer transition duration-1000 linear bg-danger px-4 py-2 font-normal text-white flex items-center justify-between float-right'
            onClick={handleShowModalDeleteUser}
          >
            <SVG
              src={trash}
              className='mr-1'
            />
            Xóa danh sách đã chọn
          </div>
        ) : (
          ''
        )}
      </div>

      {showDeleteUserModal && (
        <Modal
          title='Xác nhận xóa danh sách nhân viên này'
          open={showDeleteUserModal}
          onCancel={handleCancel}
          footer={[
            <Button
              title='cancel'
              onClick={handleCancel}
            >
              Hủy bỏ
            </Button>,
            <Button
              key='submit'
              type='primary'
              onClick={handleOk}
              loading={isLoadingDelete}
            >
              Lưu thay đổi
            </Button>,
          ]}
        />
      )}
      {isLoadingUser ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        <UserTable
          data={users?.pages[users?.pages?.length - 1]}
          refreshData={refetch}
          onGetPagination={handleGetPagination}
          handleDeleteSingleUser={handleDeleteUser}
          handleChangeListIdsUserForDelete={setListIdsUserForDelete}
          handleShowModalUser={handleShowModalUser}
        />
      )}
      {/* {userModal.visible && ( */}
      <UserModal
        refetchData={refetch}
        onClose={() => setUserModal({ visible: false })}
        visible={userModal.visible}
        modalType={userModal.type}
        user={userModal.user}
      />
      {/* )} */}
    </>
  );
};

export default UserListPage;
