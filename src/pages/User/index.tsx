import { Button } from '@nextui-org/button';
import {
  Chip,
  Input,
  Select,
  SelectItem,
  Tooltip,
  useDisclosure,
  usePagination,
} from '@nextui-org/react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Avatar, Modal, Skeleton, TablePaginationConfig } from 'antd';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import SVG from 'react-inlinesvg';
import { useSelector } from 'react-redux';
import trash from '~/assets/svg/trash.svg';
import { QUERY_KEY } from '~/constants/queryKey';
import useDebounce from '~/hooks/useDebounce';
import { User, UserRole, UserStatus } from '~/models/user';
import { RootState } from '~/redux/store';
import userService from '~/services/userService';
import { SearchParams } from '~/types';
import UserModal, { ModalType } from './UserModal';
import UserTable from './UserTable';
import CustomTable from '~/components/NextUI/CustomTable';
import { ColumnType } from '~/components/NextUI/CustomTable';
import { getFullImageUrl } from '~/utils/image';
import { DATE_FORMAT_DDMMYYYY, formatDate } from '~/utils/date.utils';
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';

import DeleteIcon from '~/assets/svg/delete.svg';
import EditIcon from '~/assets/svg/edit.svg';

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
  const { setPage, total, activePage } = usePagination({
    page: 0,
    total: 100,
  });
  const [modal, setModal] = useState<{
    isEdit?: boolean;
    userId?: string;
  }>();

  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onOpenChange: onOpenChangeModal,
  } = useDisclosure();

  const search = useDebounce(searchText, 500);
  const role = useDebounce(filterRole, 500);

  const optionStatus = [
    {
      value: UserRole.ALL,
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

  const columns: ColumnType<User>[] = [
    {
      key: '_id',
      align: 'center',
      name: 'STT',
      render: (_user: User, index?: number) => index || 0 + 1,
    },
    {
      name: 'Hình ảnh',
      key: 'image',
      align: 'center',
      render: (user: User) =>
        user?.image ? (
          <Avatar
            src={getFullImageUrl(user.image)}
            shape="square"
            className="!w-[70px] !h-[70px] !rounded-[10px]"
          />
        ) : (
          <Avatar
            shape="square"
            className="!w-[70px] !h-[70px] !bg-primary !rounded-[10px] !text-[18px] font-medium !leading-[70px]"
          >
            {user?.fullName && user.fullName.charAt(0).toUpperCase()}
          </Avatar>
        ),
    },
    {
      name: 'Họ tên',
      key: 'fullName',
      align: 'center',
      render: (user: User) => user?.fullName || '',
    },
    {
      name: 'Số điện thoại',
      key: 'phoneNumber',
      align: 'center',
      render: (user: User) => user?.phoneNumber || '',
    },
    {
      name: 'Ngày sinh',
      key: 'birthday',
      render: (user: User) =>
        user?.birthday ? formatDate(user.birthday, DATE_FORMAT_DDMMYYYY) : '',
    },
    {
      name: 'Địa chỉ',
      key: 'address',
      align: 'center',
      render: (user: User) => user?.address || '',
    },
    {
      key: 'status',
      align: 'center',
      name: 'Trạng thái',
      render: (user: User) => (
        <Chip
          color={user?.status === UserStatus.ACTIVE ? 'success' : 'danger'}
          variant="flat"
          classNames={{
            content: 'font-semibold',
          }}
        >
          {user?.status === UserStatus.ACTIVE ? 'Đang hoạt động' : 'Ngừng hoạt động'}
        </Chip>
      ),
    },
    {
      key: '_id',
      align: 'center',
      name: 'Hành động',
      render: (_user: User) => (
        <div className="relative flex items-center gap-3">
          <Tooltip content="Chỉnh sửa nhân viên" showArrow>
            <span
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
              onClick={() => handleOpenModalEdit(category)}
            >
              <SVG src={EditIcon} />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Xóa nhân viên này" showArrow>
            <span
              className="text-lg text-danger cursor-pointer active:opacity-50"
              onClick={() => handleOpenDeleteModal(category)}
            >
              <SVG src={DeleteIcon} />
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  const {
    data: users,
    refetch,
    isLoading: isLoadingUser,
  } = useQuery(
    [QUERY_KEY.USERS, search, role, pagination, activePage],
    async () => {
      const params = {
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        fullName: search,
        role: role,
      };
      return await userService.searchUserByCriteria(params);
    },
    {
      refetchOnWindowFocus: false,
    },
  );

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
      const userAfterFindById = users?.pages[users?.pages.length - 1]?.data?.find(
        (user) => user._id === userId,
      );
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

  const handleOpenModalEdit = (category: Category) => {
    setModal({ isEdit: true, categoryId: category?._id });
    onOpenModal();
  };

  return (
    <div>
      <CustomBreadcrumb
        pageName="Danh sách nhân viên"
        routes={[
          {
            label: 'Danh sách nhân viên',
          },
        ]}
      />
      <div>
        <div className="flex items-center mb-2">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              size="sm"
              variant="faded"
              className="w-full max-w-[250px] text-sm"
              label="Tìm kiếm..."
            />
            <Select
              size="sm"
              variant="faded"
              className="w-full max-w-[250px]"
              label="Chọn trạng thái"
              items={optionStatus}
              value={UserRole.ALL.toString()}
            >
              {(status) => (
                <SelectItem key={status.value.toString()} value={status.value?.toString()}>
                  {status.label}
                </SelectItem>
              )}
            </Select>
          </div>
          <Button color="primary" variant="shadow">
            Thêm nhân viên
          </Button>
        </div>
        {listIdsUserForDelete.length !== 0 ? (
          <div
            className="rounded-lg cursor-pointer transition duration-1000 linear bg-danger px-4 py-2 font-normal text-white flex items-center justify-between float-right"
            onClick={handleShowModalDeleteUser}
          >
            <SVG src={trash} className="mr-1" />
            Xóa danh sách đã chọn
          </div>
        ) : (
          ''
        )}
      </div>
      {showDeleteUserModal && (
        <Modal
          title="Xác nhận xóa danh sách nhân viên này"
          open={showDeleteUserModal}
          onCancel={handleCancel}
          footer={[
            <Button title="cancel" onClick={handleCancel}>
              Hủy bỏ
            </Button>,
            <Button key="submit" onClick={handleOk} isLoading={isLoadingDelete}>
              Lưu thay đổi
            </Button>,
          ]}
        />
      )}

      <CustomTable
        columns={columns}
        isLoading={isLoadingUser}
        data={users?.data}
        pagination
        tableName="Danh sách nhân viên"
        emptyContent="Không có nhân viên nào"
      />
      {/* <UserTable
        data={users?.pages[users?.pages?.length - 1]}
        refreshData={refetch}
        onGetPagination={handleGetPagination}
        handleDeleteSingleUser={handleDeleteUser}
        handleChangeListIdsUserForDelete={setListIdsUserForDelete}
        handleShowModalUser={handleShowModalUser}
      /> */}

      {/* {userModal.visible && ( */}
      <UserModal
        refetchData={refetch}
        onClose={() => setUserModal({ visible: false })}
        visible={userModal.visible}
        modalType={userModal.type}
        user={userModal.user}
      />
      {/* )} */}
    </div>
  );
};

export default UserListPage;
