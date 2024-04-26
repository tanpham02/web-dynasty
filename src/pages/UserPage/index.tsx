import { Button } from '@nextui-org/button';
import {
  Chip,
  Input,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable';
import { QUERY_KEY } from '~/constants/queryKey';
import useDebounce from '~/hooks/useDebounce';
import { UserRole, UserStatus, Users } from '~/models/user';
import { RootState } from '~/redux/store';
import userService from '~/services/userService';
import { DATE_FORMAT_DDMMYYYY, formatDate } from '~/utils/date.utils';
import { getFullImageUrl } from '~/utils/image';
import UserModal, { ModalType } from './UserModal';

import DeleteIcon from '~/assets/svg/delete.svg';
import EditIcon from '~/assets/svg/edit.svg';
import Box from '~/components/Box';
import ButtonIcon from '~/components/ButtonIcon';
import { globalLoading } from '~/components/GlobalLoading';
import ModalConfirmDelete, {
  ModalConfirmDeleteState,
} from '~/components/ModalConfirmDelete';
import CustomImage from '~/components/NextUI/CustomImage';
import usePagination from '~/hooks/usePagination';

export interface ModalKey {
  visible?: boolean;
  type?: ModalType;
  user?: Users;
}

const UserListPage = () => {
  const currentUserLogin = useSelector<RootState, Users>(
    (state) => state.userStore.user,
  );
  const [selectedRowKeys, setSelectedRowKeys] = useState(new Set([]));
  const [searchText, setSearchText] = useState<string>('');
  const [filterRole, setFilterRole] = useState<UserStatus | string>('');
  const [modal, setModal] = useState<{
    isEdit?: boolean;
    userId?: string;
  }>({ isEdit: false });
  const [modalConfirmDelete, setModalConfirmDelete] =
    useState<ModalConfirmDeleteState>();

  const { enqueueSnackbar } = useSnackbar();

  const { pageIndex, pageSize, setPage, setRowPerPage } = usePagination();

  const isHavePermission = useMemo(
    () => currentUserLogin?.role === UserRole.ADMIN,
    [currentUserLogin],
  );

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
          <Box className="image-table relative !h-[80px] !w-[80px] flex items-center">
            <CustomImage
              src={getFullImageUrl(user.image)}
              fallbackSrc="https://via.placeholder.com/80x80"
              radius="full"
              isPreview
              loading="lazy"
              classNames={{
                img: '!object-contain',
              }}
            />
          </Box>
        ) : (
          <Box className="rounded-2xl !h-[80px] !w-[80px] flex items-center justify-center bg-primary text-white font-semibold text-xl">
            {user?.fullName
              ? user.fullName.charAt(0)
              : user?.username!.charAt(0).toUpperCase()}
          </Box>
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
          {user?.status === UserStatus.ACTIVE
            ? 'Đang hoạt động'
            : 'Ngừng hoạt động'}
        </Chip>
      ),
    },
    {
      align: 'center',
      name: 'Hành động',
      render: (user: Users) => (
        <div className="flex items-center gap-2">
          <ButtonIcon
            // title={`${
            //   handleCheckRolePermission(user, currentUserLogin)
            //     ? 'Bạn không có quyền chỉnh sửa thông tin người này!'
            //     : 'Chỉnh sửa nhân viên'
            // }`}
            title={
              isHavePermission
                ? 'Chỉnh sửa'
                : 'Bạn không có quyền chỉnh sửa thông tin người này'
            }
            disable={!isHavePermission}
            icon={EditIcon}
            placement="top-end"
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
            title={
              isHavePermission && !(currentUserLogin?._id === user._id)
                ? 'Xóa'
                : 'Bạn không có quyền xóa người này'
            }
            icon={DeleteIcon}
            placement="top-end"
            disable={!isHavePermission || currentUserLogin?._id === user._id}
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
    [QUERY_KEY.USERS, search, role, pageIndex, pageSize],
    async () => {
      const params = {
        pageIndex: pageIndex - 1,
        pageSize: pageSize,
        fullName: search,
        role: role,
      };
      return await userService.searchUserByCriteria(params);
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const userDisableId = useMemo(() => {
    if (Array.isArray(users?.data) && users.data.length > 0) {
      return isHavePermission
        ? [
            currentUserLogin?._id,
            ...users.data.map((user) => user.role === UserRole.ADMIN),
          ]
        : users.data.map((user) => user._id);
    }

    return [currentUserLogin?._id];
  }, [users?.data, isHavePermission]);

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

    if (selectedRowKeys && Array.from(selectedRowKeys).length) {
      if (String(selectedRowKeys) === 'all') {
        ids = users?.data
          .filter((user) => user._id !== currentUserLogin._id)
          ?.map((user) => user._id) as any;
      } else {
        ids = Array.from(selectedRowKeys);
      }
    }

    try {
      await userService.deleteUser(ids);
      refetchUser();
      enqueueSnackbar({
        message: 'Xoá nhân viên thành công!',
      });
      setSelectedRowKeys(new Set([]));
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
        <div className="flex items-center mb-2 gap-2 flex-wrap">
          <div className="flex flex-1 items-center flex-wrap gap-2 min-w-fit">
            <Input
              size="md"
              variant="faded"
              className="w-full max-w-[300px] text-md"
              label="Tìm kiếm..."
              classNames={{
                inputWrapper: 'bg-white ',
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
                base: '!ml-0',
              }}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              {(status) => (
                <SelectItem
                  key={status.value.toString()}
                  value={status.value?.toString()}
                >
                  {status.label}
                </SelectItem>
              )}
            </Select>
          </div>

          <div className="space-x-2 space-y-2 w-fit ml-auto">
            {selectedRowKeys && Array.from(selectedRowKeys).length ? (
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
            {!isHavePermission && (
              <Button
                color="primary"
                variant="shadow"
                className="w-fit ml-auto"
                onClick={onOpenModal}
              >
                Thêm nhân viên
              </Button>
            )}
          </div>
        </div>
      </div>

      <CustomTable
        rowKey="_id"
        columns={columns}
        isLoading={isLoadingUser}
        data={users?.data}
        pagination
        disabledKeys={userDisableId as any}
        tableName="Danh sách nhân viên"
        emptyContent="Không có nhân viên nào"
        selectedKeys={selectedRowKeys}
        onSelectionChange={(keys) => setSelectedRowKeys(keys as any)}
        page={pageIndex}
        totalPage={users?.totalPage}
        total={isHavePermission ? users?.totalElement : 0}
        rowPerPage={pageSize}
        onChangePage={setPage}
        onChangeRowPerPage={setRowPerPage}
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
