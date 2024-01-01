import { Button } from '@nextui-org/button';
import {
  Chip,
  Image,
  Input,
  Select,
  SelectItem,
  useDisclosure,
  usePagination,
} from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';

import { QUERY_KEY } from '~/constants/queryKey';
import useDebounce from '~/hooks/useDebounce';
import { Users, UserRole, UserStatus } from '~/models/user';
import { RootState } from '~/redux/store';
import userService from '~/services/userService';
import UserModal, { ModalType } from './UserModal';
import CustomTable from '~/components/NextUI/CustomTable';
import { ColumnType } from '~/components/NextUI/CustomTable';
import { getFullImageUrl } from '~/utils/image';
import { DATE_FORMAT_DDMMYYYY, formatDate } from '~/utils/date.utils';
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';

import DeleteIcon from '~/assets/svg/delete.svg';
import EditIcon from '~/assets/svg/edit.svg';
import ButtonIcon from '~/components/ButtonIcon';
import ModalConfirmDelete, { ModalConfirmDeleteState } from '~/components/ModalConfirmDelete';
import { globalLoading } from '~/components/GlobalLoading';
import CustomImage from '~/components/NextUI/CustomImage';

export interface ModalKey {
  visible?: boolean;
  type?: ModalType;
  user?: Users;
}

const UserListPage = () => {
  const currentUserLogin = useSelector<RootState, Users>((state) => state.userStore.user);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState(new Set([]));
  const [searchText, setSearchText] = useState<string>('');
  const [filterRole, setFilterRole] = useState<UserStatus | string>('');

  const [modalConfirmDelete, setModalConfirmDelete] = useState<ModalConfirmDeleteState>();

  const { enqueueSnackbar } = useSnackbar();

  const { setPage, total, activePage } = usePagination({
    page: 0,
    total: 100,
  });
  const [modal, setModal] = useState<{
    isEdit?: boolean;
    userId?: string;
  }>({ isEdit: false });

  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onOpenChange: onOpenChangeModal,
    onClose,
  } = useDisclosure();

  const {
    isOpen: isOpenModalConfirmDeleteUser,
    onOpen: onOpenModalConfirmDeleteUser,
    onOpenChange: onOpenChangeModalConfirmDeleteUser,
  } = useDisclosure();

  const search = useDebounce(searchText, 500);
  const role = useDebounce(filterRole, 500);

  const handleGetAddress = (user: Users) => {
    const address = [user.location, user.ward, user.district, user.city]
      .filter((item) => Boolean(item))
      .join(', ');
    return address;
  };

  const optionStatus = [
    {
      value: '',
      label: 'Tất cả',
    },
    {
      value: UserRole.ADMIN,
      label: 'Quản trị viên',
    },
    {
      value: UserRole.USER,
      label: 'Nhân viên',
    },
  ];

  const columns: ColumnType<Users>[] = [
    {
      align: 'center',
      name: 'STT',
      render: (_user: Users, index?: number) => index! + 1,
    },
    {
      name: 'Hình ảnh',
      align: 'center',
      render: (user: Users) =>
        user?.image ? (
          <div className="image-table relative !h-[100px] !w-[100px]">
            <CustomImage src={getFullImageUrl(user.image)} radius="lg" isPreview loading="lazy" />
          </div>
        ) : (
          <Image className="!w-[70px] !h-[70px] !bg-primary !rounded-[10px] !text-[18px] font-medium !leading-[70px]">
            {user?.fullName && user.fullName.charAt(0).toUpperCase()}
          </Image>
        ),
    },
    {
      name: 'Họ tên',
      align: 'center',
      render: (user: Users) => user?.fullName || '',
    },
    {
      name: 'Số điện thoại',
      align: 'center',
      render: (user: Users) => user?.phoneNumber || '',
    },
    {
      name: 'Ngày sinh',
      render: (user: Users) =>
        user?.birthday ? formatDate(user.birthday, DATE_FORMAT_DDMMYYYY) : '',
    },
    {
      name: 'Địa chỉ',
      align: 'center',
      render: (user: Users) => handleGetAddress(user),
    },
    {
      align: 'center',
      name: 'Trạng thái',
      render: (user: Users) => (
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
      align: 'center',
      name: 'Hành động',
      render: (user: Users) => (
        <div className="flex items-center gap-2">
          <ButtonIcon
            title={`${
              handleCheckRolePermission(user, currentUserLogin)
                ? 'Bạn không có quyền chỉnh sửa thông tin người này!'
                : 'Chỉnh sửa nhân viên'
            }`}
            disable={handleCheckRolePermission(user, currentUserLogin)}
            icon={EditIcon}
            status={handleCheckRolePermission(user, currentUserLogin) ? 'warning' : 'default'}
            showArrow
            delay={500}
            onClick={() => {
              setModal({
                isEdit: true,
                userId: user._id,
              });
              onOpenModal();
            }}
          />
          <ButtonIcon
            title="Xóa nhân viên này"
            icon={DeleteIcon}
            status="danger"
            showArrow
            delay={500}
            onClick={() => {
              setModalConfirmDelete({
                desc: 'Bạn có chắc chắn muốn xoá nhân viên này?',
                id: user._id,
              });
              onOpenModalConfirmDeleteUser();
            }}
          />
        </div>
      ),
    },
  ];

  const {
    data: users,
    refetch: refetchUser,
    isLoading: isLoadingUser,
  } = useQuery(
    [QUERY_KEY.USERS, search, role, activePage],
    async () => {
      const params = {
        // pageIndex: pagination.pageIndex,
        // pageSize: pagination.pageSize,
        fullName: search,
        role: role,
      };
      return await userService.searchUserByCriteria(params);
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const handleCheckRolePermission = (userRecord: Users, userCurrentLogin: Users) => {
    return false;
  };

  const handleChangeSelectedRowsKey = (keys: any) => {
    setSelectedRowKeys(keys);
  };

  const handleDeleteUser = async () => {
    globalLoading.show();
    setModalConfirmDelete((prev) => ({
      ...prev,
      isLoading: true,
    }));
    let ids: string[] = [];
    if (modalConfirmDelete?.id) {
      ids.push(modalConfirmDelete.id);
    }

    if (selectedRowKeys.size !== 0) {
      console.log(
        '🚀 ~ file: index.tsx:228 ~ handleDeleteUser ~ selectedRowKeys:',
        selectedRowKeys,
      );
    }

    try {
      await userService.deleteUser(ids);
      refetchUser();
      enqueueSnackbar({
        message: 'Xoá nhân viên thành công!',
      });
    } catch (err) {
      console.log(err);
      enqueueSnackbar({
        message: 'Xoá nhân viên thất bại!',
        variant: 'error',
      });
    } finally {
      globalLoading.hide();
      onOpenChangeModalConfirmDeleteUser();
      setModalConfirmDelete((prev) => ({
        ...prev,
        isLoading: false,
      }));
    }
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
              size="md"
              variant="faded"
              className="w-full max-w-[250px] text-md"
              label="Tìm kiếm..."
              classNames={{
                inputWrapper: 'bg-white',
                label: 'font-semibold',
                input: 'text-primary-text-color text-md',
              }}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
              isClearable
              onClear={() => setSearchText('')}
            />
            <Select
              size="md"
              variant="bordered"
              className="w-full max-w-[250px] "
              label="Chọn trạng thái"
              items={optionStatus}
              value={filterRole}
              classNames={{
                mainWrapper: 'bg-white rounded-xl',
                label: 'font-semibold',
                value: 'text-primary-text-color text-md',
              }}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              {(status) => (
                <SelectItem key={status.value.toString()} value={status.value?.toString()}>
                  {status.label}
                </SelectItem>
              )}
            </Select>
          </div>

          <div className="space-x-4">
            {selectedRowKeys.size !== 0 ? (
              <Button
                color="danger"
                variant="shadow"
                onClick={() => {
                  setModalConfirmDelete({
                    desc: 'Bạn có chắc chắn muốn xoá danh sách nhân viên đã chọn?',
                  });
                  onOpenChangeModalConfirmDeleteUser();
                }}
              >
                Xác nhận xoá danh sách nhân viên
              </Button>
            ) : (
              ''
            )}
            <Button color="primary" variant="shadow" onClick={onOpenModal}>
              Thêm nhân viên
            </Button>
          </div>
        </div>
      </div>

      <CustomTable
        rowKey="_id"
        columns={columns}
        isLoading={isLoadingUser}
        data={users?.data}
        pagination
        tableName="Danh sách nhân viên"
        emptyContent="Không có nhân viên nào"
        selectedKeys={selectedRowKeys}
        onSelectionChange={handleChangeSelectedRowsKey}
      />

      <UserModal
        isOpen={isOpenModal}
        onClose={onClose}
        onRefetch={refetchUser}
        onOpenChange={onOpenChangeModal}
        setModal={setModal}
        {...modal}
      />

      <ModalConfirmDelete
        {...modalConfirmDelete}
        onAgree={handleDeleteUser}
        isOpen={isOpenModalConfirmDeleteUser}
        onOpenChange={onOpenChangeModalConfirmDeleteUser}
      />
    </div>
  );
};

export default UserListPage;
