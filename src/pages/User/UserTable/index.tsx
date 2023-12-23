import {
  CheckCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  ExclamationOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Table,
  TablePaginationConfig,
  Popconfirm,
  Tooltip,
  Checkbox,
  Empty,
} from "antd";
import { User, UserRole, UserStatus } from "~/models/user";
import { Breakpoint, ListDataResponse, ListResponse } from "~/types";
import React, { useState, useMemo } from "react";
import { ModalType } from "../UserModal";
import { DATE_FORMAT_DDMMYYYY, formatDate } from "~/utils/date.utils";
import { useSelector } from "react-redux";
import { RootState } from "~/redux/store";
import { getFullImageUrl } from "~/utils/image";

interface TableColumn {
  title: string;
  dataIndex?: keyof User;
  key?: keyof User;
  sorter?: boolean;
  align?: "left" | "center" | "right";
  render?: (value: any, record: User, index: number) => React.ReactNode;
  responsive?: Breakpoint[];
}

interface UserTableProps {
  data: ListDataResponse<User> | undefined;
  refreshData: () => void;
  onGetPagination: (data: TablePaginationConfig) => void;
  handleChangeListIdsUserForDelete: (ids: React.Key[]) => void;
  handleDeleteSingleUser: (id: any) => void;
  handleShowModalUser: (type?: ModalType, userId?: string) => void;
}

export interface Pagination {
  current: number;
  pageSize: number;
}

const UserTable = ({
  data,
  onGetPagination,
  handleDeleteSingleUser,
  handleChangeListIdsUserForDelete,
  handleShowModalUser,
}: UserTableProps) => {
  const [productCategorySelectedKeys, setProductCategorySelectedKeys] =
    useState<React.Key[]>([]);
  const currentUserLogin = useSelector<RootState, User>(
    (state) => state.userStore.user,
  );

  const pagination = useMemo(() => {
    const current = data?.pageIndex;
    const pageSize = data?.pageSize;
    const total = data?.totalElement;

    return {
      pageCurrent: current ? current + 1 : 1, // 1 is page default
      totalElements: total || 0,
      pageSize: pageSize,
    };
  }, [data]);

  const COLUMNS: TableColumn[] = [
    {
      title: "Hình ảnh",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (__id, record) =>
        record?.image ? (
          <Avatar
            src={getFullImageUrl(record?.image)}
            shape="square"
            className="!w-[70px] !h-[70px] !rounded-[10px]"
          />
        ) : (
          <Avatar
            shape="square"
            className="!w-[70px] !h-[70px] !bg-primary !rounded-[10px] !text-[18px] font-medium !leading-[70px]"
          >
            {record?.fullName && record?.fullName.charAt(0).toUpperCase()}
          </Avatar>
        ),
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      align: "center",
      render: (_, record) => (
        <span>
          {record.birthday
            ? formatDate(record.birthday, DATE_FORMAT_DDMMYYYY)
            : ""}
        </span>
      ),
      responsive: ["lg"],
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      align: "left",
      responsive: ["xxl"],
    },
    {
      title: "Trạng thái người dùng",
      dataIndex: "status",
      key: "status",
      render: (__id, record) => {
        switch (record.status) {
          case UserStatus.ACTIVE:
            return (
              <div className="!flex items-center justify-center">
                <button className="text-[14px] bg-success  text-white px-3 py-1 rounded-md font-medium">
                  Hoạt động
                </button>
              </div>
            );
            break;
          case UserStatus.IN_ACTIVE:
            return (
              <div className="!flex items-center justify-center">
                <button className="text-[14px] bg-danger text-white px-3 py-1 rounded-md font-medium">
                  Ngừng hoạt động
                </button>
              </div>
            );
            break;
          default:
          // code block
        }
      },
      responsive: ["xxl"],
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      align: "center",
      render: (_, record) => (
        <span>{record.role === UserRole.ADMIN ? "Quản trị" : "Nhân viên"}</span>
      ),
      responsive: ["xl"],
    },
    {
      title: "Hành động",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (__text, record) => (
        <div className="flex justify-center gap-2 text-center">
          <div>
            <Tooltip
              title={
                record._id !== currentUserLogin._id &&
                handleCheckRolePermission(record, currentUserLogin) &&
                "Bạn bị giới hạn chỉnh sửa nhân viên này"
              }
            >
              <Button
                type="primary"
                className={`!flex items-center justify-center !rounded-lg  text-center border border-solid ${
                  record._id !== currentUserLogin._id &&
                  handleCheckRolePermission(record, currentUserLogin)
                    ? "border-transparent"
                    : "!border-warning !bg-warning"
                } `}
                disabled={
                  record._id !== currentUserLogin._id &&
                  handleCheckRolePermission(record, currentUserLogin)
                }
                onClick={() =>
                  handleShowModalUser(ModalType.UPDATE, record._id)
                }
              >
                <EditOutlined />
              </Button>
            </Tooltip>
          </div>
          <div
            onClick={() =>
              handleShowModalUser(ModalType.INFORMATION, record._id)
            }
          >
            <Button
              type="primary"
              className="!flex items-center justify-center !rounded-lg !bg-primary border border-solid !border-primary"
            >
              <InfoCircleOutlined />
            </Button>
          </div>
          <>
            {handleCheckRolePermission(record, currentUserLogin) && (
              <Tooltip
                title={
                  handleCheckRolePermission(record, currentUserLogin) &&
                  "Bạn bị giới hạn xóa nhân viên này"
                }
              >
                <Button
                  disabled={handleCheckRolePermission(record, currentUserLogin)}
                  type={"danger" as "primary"}
                  className={` flex  items-center justify-center !rounded-lg`}
                >
                  <DeleteOutlined className="!flex" />
                </Button>
              </Tooltip>
            )}
            {!handleCheckRolePermission(record, currentUserLogin) && (
              <Popconfirm
                title="Xác nhận xóa nhân viên này?"
                className=" flex items-center"
                onConfirm={() => {
                  handleDeleteSingleUser(record._id);
                }}
                okText="Có"
                cancelText="Không"
              >
                <Button
                  disabled={
                    record._id !== currentUserLogin._id &&
                    handleCheckRolePermission(record, currentUserLogin)
                  }
                  type={"danger" as "primary"}
                  className={` flex  items-center justify-center !rounded-lg`}
                >
                  <DeleteOutlined className="!flex" />
                </Button>
              </Popconfirm>
            )}
          </>
        </div>
      ),
    },
  ];

  // !!!!!
  const handleCheckRolePermission = (recordUser: User, currentUser: User) => {
    if (recordUser && currentUser) {
      if (currentUser.role === UserRole.ADMIN) {
        if (recordUser.role === UserRole.ADMIN) {
          return true;
        } else return false;
      } else if (currentUser.role === UserRole.USER) {
        if (recordUser.role === UserRole.ADMIN) {
          return true;
        } else return false;
      }
      return true;
    }
  };

  const onUserListCheckedChange = (newSelectedRowKeys: React.Key[]) => {
    setProductCategorySelectedKeys(newSelectedRowKeys);
    handleChangeListIdsUserForDelete(newSelectedRowKeys);
  };

  const rowSelection = {
    productCategorySelectedKeys,
    onChange: onUserListCheckedChange,
    getCheckboxProps: (record: User) => ({
      disabled:
        record._id !== currentUserLogin._id &&
        handleCheckRolePermission(record, currentUserLogin)
          ? true
          : false,
    }),
    renderCell(__checked: boolean, record: User, __index: number, node: any) {
      if (handleCheckRolePermission(record, currentUserLogin)) {
        return (
          <Tooltip title="Bạn bị giới hạn xóa nhân viên này">
            <Checkbox disabled />
          </Tooltip>
        );
      }
      return node;
    },
  };

  return (
    <>
      <Table
        rowSelection={rowSelection}
        rowKey="_id"
        dataSource={data?.data}
        columns={COLUMNS}
        className="rounded-sm border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
        rowClassName="text-black dark:text-white"
        pagination={{
          current: pagination.pageCurrent,
          pageSize: pagination.pageSize,
          total: pagination.totalElements,
        }}
        onChange={onGetPagination}
        locale={{
          emptyText: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Không có dữ liệu"
            />
          ),
        }}
      />
    </>
  );
};

export default UserTable;
