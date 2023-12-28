import {
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { InfiniteData } from "@tanstack/react-query";
import { Button, Empty, Popconfirm, Table, Typography } from "antd";
import React from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Material } from "~/models/materials";
import { User, UserRole } from "~/models/user";
import { ModalType } from "~/pages/User/UserModal";
import { RootState } from "~/redux/store";
import materialService from "~/services/materialService";
import { Breakpoint, ListDataResponse } from "~/types";
import { formatDate } from "~/utils/date.utils";
import { formatCurrencyVND } from "~/utils/number";

interface Columns {
  title?: string;
  dataIndex?: keyof Material;
  key?: keyof Material;
  sorter?: boolean;
  align?: "left" | "center" | "right";
  render?: (value: any, record: Material) => React.ReactNode;
  responsive?: Breakpoint[];
}

interface MaterialTableProps {
  data?: InfiniteData<ListDataResponse<Material>>;
  onLoading: (value: boolean) => void;
  refetch: () => void;
  onGetMaterialId: (value?: string, type?: string) => void;
}

const MaterialTable = ({
  data,
  onLoading,
  refetch,
  onGetMaterialId,
}: MaterialTableProps) => {
  const userCurrentInSystem = useSelector<RootState, User>(
    (state) => state.userStore.user,
  );

  const COLUMNS: Columns[] = [
    {
      key: "importDate",
      dataIndex: "importDate",
      title: "Ngày nhập hàng",
      align: "center",
      render: (value, record) => (
        <Typography.Text className="font-medium text-[14.5px]">
          {record?.importDate
            ? formatDate(record.importDate, "HH:mm:ss DD-MM-YYYY")
            : ""}
        </Typography.Text>
      ),
    },

    {
      key: "totalPrice",
      dataIndex: "totalPrice",
      title: "Tổng tiền",
      align: "center",
      render: (value, record) => (
        <Typography.Text className="font-medium text-[14.5px]">
          {record?.totalPrice ? formatCurrencyVND(record.totalPrice) : ""}
        </Typography.Text>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "_id",
      key: "_id",
      align: "center",
      render: (__id, record) => (
        <div className="flex justify-center gap-2 text-center">
          {/* <Button
            type='primary'
            className='!flex items-center justify-center !rounded-lg !bg-warning border border-solid !border-warning !text-white'
            onClick={() => onGetMaterialId(record._id, ModalType.UPDATE)}
          >
            <EditOutlined />
          </Button> */}
          <Button
            type="primary"
            className="!flex items-center justify-center !rounded-lg !bg-primary border border-solid !border-primary !text-white"
            onClick={() => onGetMaterialId(record._id, ModalType.INFORMATION)}
          >
            <InfoCircleOutlined />
          </Button>
          <Popconfirm
            title="Xác nhận xóa?"
            className={` flex items-center ${
              handleCheckRoleUser() ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            disabled={handleCheckRoleUser()}
            onConfirm={() => {
              handleDelete(record._id);
            }}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type={"danger" as "primary"}
              className="flex r items-center justify-center !rounded-lg"
              disabled={handleCheckRoleUser()}
            >
              <DeleteOutlined className="!flex" />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const handleCheckRoleUser = () => {
    if (userCurrentInSystem.role === UserRole.ADMIN) {
      return false;
    } else return true;
  };

  const handleDelete = async (id?: string) => {
    onLoading(true);
    try {
      id && (await materialService.delete(id));
      onLoading(false);
      refetch();
      toast.success("Xóa thành công", {
        position: "bottom-right",
        duration: 2000,
        icon: "🤪",
      });
    } catch (error) {
      toast.success("Xóa thất bại", {
        position: "bottom-right",
        duration: 2000,
        icon: "🤪",
      });
      onLoading(false);
    }
  };
  return (
    <Table
      rowKey="_id"
      dataSource={data?.pages[data?.pages?.length - 1]?.data}
      columns={COLUMNS}
      className="rounded-sm border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
      rowClassName="text-black dark:text-white"
      // pagination={{
      //   current: pagination?.pageCurrent,
      //   pageSize: pagination?.pageSize,
      //   total: pagination?.totalElements,
      // }}
      // onChange={({ current, pageSize, total }: TablePaginationConfig) => {
      //   onGetPaginationState({ pageIndex: current ? current - 1 : current, pageSize });
      // }}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Không có dữ liệu"
          />
        ),
      }}
    />
  );
};

export default MaterialTable;
