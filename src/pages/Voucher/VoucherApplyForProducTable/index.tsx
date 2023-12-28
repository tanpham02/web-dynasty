import { CheckCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { InfiniteData } from "@tanstack/react-query";
import {
  Avatar,
  Table,
  Typography,
  Skeleton,
  TablePaginationConfig,
  Tooltip,
  Popconfirm,
  Empty,
} from "antd";
import { useMemo, useState } from "react";
import { Product, ProductMain } from "~/models/product";
import { Voucher, VoucherOverriding } from "~/models/voucher";
import { ListDataResponse, ListResponse } from "~/types";
import { ModalType } from "../VoucherModal";

export interface VoucherApplyForProductTableProps {
  onSetListSelectionKeyProduct: (ids: string[]) => void;
  onGetPagination: (pages: Pagination) => void;
  product: InfiniteData<ListDataResponse<ProductMain>> | undefined;
  loadingProduct: boolean;
  voucherById: VoucherOverriding | undefined;
  listProductIdInVoucher: string[];
  onSetListProductIdInVoucher: (ids: string[]) => void;
  modalType: ModalType | undefined;
}

export interface Pagination {
  current?: number;
  pageSize?: number;
}

interface VoucherApplyForProductTableI {
  key?: keyof ProductMain;
  dataIndex?: keyof ProductMain;
  title?: string;
  align?: "left" | "center" | "right";
  render?: (
    text: string,
    record: ProductMain,
    index: number,
  ) => React.ReactNode;
  visible?: boolean;
  hidden?: boolean;
}

const VoucherApplyForProductTable = ({
  onSetListSelectionKeyProduct,
  onGetPagination,
  product,
  loadingProduct,
  listProductIdInVoucher,
  onSetListProductIdInVoucher,
  modalType,
}: VoucherApplyForProductTableProps) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    current: 0,
    pageSize: 10,
  });

  console.log("listProductIdInVoucher", listProductIdInVoucher);

  const COLUMNS: VoucherApplyForProductTableI[] = [
    {
      key: "name",
      align: "left",
      dataIndex: "name",
      title: "Tên sản phẩm",
    },
    {
      key: "image",
      dataIndex: "image",
      title: "Hình ảnh",
      render: (__id, record) =>
        record.image != "" ? (
          <Avatar src={record.image} shape="square" size={84} />
        ) : (
          <Avatar
            style={{ backgroundColor: "#de7300" }}
            shape="square"
            size={84}
          >
            {record.name && record.name.charAt(0)}
          </Avatar>
        ),
      align: "center",
    },
    // {
    //   key: 'id',
    //   align: 'center',
    //   dataIndex: 'id',
    //   title: 'Trạng thái',
    //   render: (__, record: Product) => (
    //     <Typography.Text>
    //       <label
    //         className={`tracking-[0.5px]   px-2 py-1 rounded-md font-medium ${
    //           record._id && listProductIdInVoucher?.includes(record._id)
    //             ? 'bg-success text-white'
    //             : 'bg-danger text-white'
    //         } `}
    //       >
    //         {record._id && listProductIdInVoucher?.includes(record._id) ? 'Đã chọn' : 'Chưa chọn'}
    //       </label>
    //     </Typography.Text>
    //   ),
    //   visible: false,
    // },
    {
      key: "price",
      align: "center",
      dataIndex: "price",
      title: "Giá",
      render: (__, record: ProductMain) => (
        <Typography.Text>
          <label className="tracking-[0.5px] font-normal ">
            {record.price?.toLocaleString("EN")} đ
          </label>
        </Typography.Text>
      ),
    },
    {
      key: "_id",
      align: "center",
      dataIndex: "_id",
      title: "",
      render: (__, record: ProductMain) => (
        <>
          {record?._id && listProductIdInVoucher?.includes(record?._id) && (
            <Popconfirm
              title="Xác nhận xóa sản phẩm này?"
              okText="Có"
              cancelText="Không"
              onConfirm={() => handleDeleteListProductIDInVoucher(record._id)}
            >
              <button className="px-2 rounded-sm py-[6px] bg-danger mx-auto flex items-center">
                <DeleteOutlined style={{ color: "#fff" }} />
              </button>
            </Popconfirm>
          )}
        </>
      ),
      hidden: modalType !== ModalType.CREATE ? false : true,
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
      onSetListSelectionKeyProduct(newSelectedRowKeys as string[]);
    },
    getCheckboxProps: (record: ProductMain) => ({
      disabled: record?._id
        ? listProductIdInVoucher?.includes(record?._id)
        : false,
      key: record._id,
    }),
    renderCell(
      __checked: boolean,
      record: ProductMain,
      __index: number,
      node: any,
    ) {
      if (record._id) {
        if (listProductIdInVoucher?.includes(record._id)) {
          return (
            <Tooltip title="Đã hiển thị">
              <CheckCircleOutlined style={{ color: "#219653" }} />
            </Tooltip>
          );
        }
        return node;
      }
    },
  };

  const handleDeleteListProductIDInVoucher = (id?: string) => {
    const output = listProductIdInVoucher.filter((item) => item !== id);
    onSetListProductIdInVoucher(output);
  };

  const handleChangeCurrentPage = (pages: TablePaginationConfig) => {
    setPagination({
      current: pages.current,
      pageSize: pages.pageSize,
    });
    onGetPagination({
      current: pages?.current ? pages?.current - 1 : 1,
      pageSize: pages.pageSize,
    });
  };

  const handlePagination = useMemo(() => {
    if (pagination.current === 0) {
      pagination.current += 1;
    }

    return {
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: product?.pages?.[product?.pages.length - 1].totalElement,
    };
  }, [pagination, product]);

  return (
    <>
      {loadingProduct ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        <Table
          rowKey="_id"
          dataSource={product?.pages?.[product?.pages.length - 1].data}
          columns={COLUMNS.filter((item) => !item.hidden)}
          rowSelection={rowSelection}
          pagination={{
            current: handlePagination.current,
            pageSize: handlePagination.pageSize,
            total: handlePagination.total,
          }}
          scroll={{ y: "45vh" }}
          onChange={handleChangeCurrentPage}
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="Không có dữ liệu"
              />
            ),
          }}
        />
      )}
    </>
  );
};

export default VoucherApplyForProductTable;
