import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { InfiniteData } from "@tanstack/react-query";
import { Avatar, Button, Popconfirm, Table } from "antd";
import Modal from "antd/lib/modal/Modal";
import { useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmDeleteModal from "~/components/customs/ConfirmDeleteModal";
import { ProductCategory } from "~/models/productCategory";
import productCategoryService from "~/services/productCategoryService";
import ProductCategoryUpdateModal from "../ProductCategoryUpdateModal";

interface TableColumn {
  title?: string;
  dataIndex?: keyof ProductCategory;
  key?: keyof ProductCategory;
  sorter?: boolean;
  align?: "left" | "center" | "right";
  render?: (
    value: any,
    record: ProductCategory,
    index: number,
  ) => React.ReactNode;
}

interface ProductCategoryTableProps {
  data: InfiniteData<ProductCategory[]> | undefined;
  refreshData: () => void;
}

const ProductCategoryTable = ({
  data,
  refreshData,
}: ProductCategoryTableProps) => {
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] =
    useState<boolean>(false);
  const [showConfirmDeleteMultiModal, setShowConfirmDeleteMultiModal] =
    useState<boolean>(false);
  const [showUpdateBannerModal, setShowUpdateBannerModal] = useState<{
    visible: boolean;
    productCatgoryID: number;
  }>({
    visible: false,
    productCatgoryID: -100,
  });
  const [isLoadingDeleteMulti, setIsLoadingDeleteMulti] =
    useState<boolean>(false);
  const [productCategorySelectedKeys, setProductCategorySelectedKeys] =
    useState<React.Key[]>([]);

  const COLUMN: TableColumn[] = [
    {
      title: "STT",
      dataIndex: "id",
      key: "id",
      align: "center",
      render: (__item, __record, index: number) => (
        <div className="text-center font-bold">{index + 1}</div>
      ),
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      align: "left",
    },
    {
      title: "Banner",
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (__id, record) =>
        record.image != "" ? (
          <Avatar
            src={record.image}
            shape="square"
            className="!w-[70px] !h-[70px] !rounded-[10px]"
          />
        ) : (
          <Avatar
            style={{ backgroundColor: "#de7300" }}
            shape="square"
            className="!w-[70px] !h-[70px] !rounded-[10px] !leading-[70px]"
          >
            {record.name && record.name.charAt(0).toUpperCase()}
          </Avatar>
        ),
    },
    {
      title: "Hành động",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (__id, record) => (
        <div className="flex justify-center gap-2 text-center">
          <Button
            type="primary"
            className="!flex items-center justify-center !rounded-lg"
            onClick={() => record.id && handleOpenUpdateBannerModal(record.id)}
          >
            <EditOutlined />
          </Button>
          <Popconfirm
            title="Xác nhận xóa danh mục ra khỏi Zalo Mini App"
            className=" flex items-center"
            onConfirm={() => {
              handleDelete(record.nhanhVnId);
            }}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type={"danger" as "primary"}
              className="flex r items-center justify-center !rounded-lg"
            >
              <DeleteOutlined className="!flex" />
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const changeChildCategoryDTOsToChildren = (
    productCategories: ProductCategory[],
  ) => {
    for (const productCategory of productCategories) {
      if (productCategory.childCategoryDTOs?.length !== 0) {
        productCategory.children = productCategory.childCategoryDTOs;
        delete productCategory.childCategoryDTOs;
      }
    }
    return productCategories;
  };
  const productCategoryFromThirdPartyResponseAfterChangeField = useMemo(() => {
    if (data && data?.pages && data?.pages[0]) {
      return changeChildCategoryDTOsToChildren(data?.pages[0]);
    }
  }, [data]);

  const onProductCategorySelectedChange = (newSelectedRowKeys: React.Key[]) => {
    setProductCategorySelectedKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    productCategorySelectedKeys,
    checkStrictly: false,
    onChange: onProductCategorySelectedChange,
  };

  const handleOpenOrCloseConfirmDeleteModal = () => {
    setShowConfirmDeleteModal(!showConfirmDeleteModal);
  };

  const handleOpenUpdateBannerModal = (productCategoryID: number) => {
    setShowUpdateBannerModal({
      visible: true,
      productCatgoryID: productCategoryID,
    });
  };

  const handleCloseUpdateBannerModal = () => {
    setShowUpdateBannerModal({
      visible: false,
      productCatgoryID: -100,
    });
  };

  const handleOpenOrCloseConfirmDeleteMultiModal = () => {
    setShowConfirmDeleteMultiModal(!showConfirmDeleteMultiModal);
  };

  const handleDelete = async (id: any) => {
    if (id) {
      try {
        await productCategoryService.deleteProductCategoryInZaloMiniApp(id);
        toast.success("Xóa danh mục sản phẩm khỏi Mini App thành công", {
          position: "bottom-right",
          duration: 3500,
          icon: "👏",
        });
        setProductCategorySelectedKeys([]);
        if (Array.isArray(id)) {
          setIsLoadingDeleteMulti(false);
          setProductCategorySelectedKeys([]);
          handleOpenOrCloseConfirmDeleteMultiModal();
        }
        refreshData();
      } catch (error) {
        console.log(error);
        toast.error("Lỗi khi xóa danh mục sản phẩm");
      }
    }
  };

  const handleConfirmDeleteMulti = () => {
    setIsLoadingDeleteMulti(true);
    handleDelete(productCategorySelectedKeys);
  };

  const handleCancelDeleteMulti = () => {
    handleOpenOrCloseConfirmDeleteMultiModal();
    setIsLoadingDeleteMulti(false);
  };

  return (
    <>
      <div className="mb-2 flex flex-row justify-end flex-wrap  items-center gap-2">
        {productCategorySelectedKeys.length > 0 && (
          <div className="flex items-center    ">
            <span className="font-bold text-sm">{`Bạn đã chọn ${productCategorySelectedKeys.length} danh mục`}</span>
          </div>
        )}
        <div className="flex justify-end ">
          {" "}
          <Button
            type={"danger" as "primary"}
            className={`!flex items-center justify-center !rounded-lg  ${
              productCategorySelectedKeys.length > 0 ? "" : "opacity-0"
            }`}
            onClick={() => {
              handleOpenOrCloseConfirmDeleteMultiModal();
            }}
          >
            <DeleteOutlined className="!flex" />
            Xóa danh mục được chọn
          </Button>
        </div>
      </div>

      {data && (
        <Table
          rowSelection={rowSelection}
          rowKey="nhanhVnId"
          dataSource={productCategoryFromThirdPartyResponseAfterChangeField}
          columns={COLUMN}
          className="rounded-sm border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
          rowClassName="text-black dark:text-white"
          pagination={false}
        />
      )}
      <ConfirmDeleteModal
        visible={showConfirmDeleteModal}
        onConfirm={handleOpenOrCloseConfirmDeleteModal}
        onCancel={handleOpenOrCloseConfirmDeleteModal}
      />
      <Modal
        title="Bạn có muốn ?"
        open={showConfirmDeleteMultiModal}
        onOk={handleConfirmDeleteMulti}
        confirmLoading={isLoadingDeleteMulti}
        onCancel={handleCancelDeleteMulti}
      >
        <p>{"Bạn có chắc chắn muốn xóa các danh mục sản phẩm vừa chọn ? "}</p>
      </Modal>
      <ProductCategoryUpdateModal
        productCategoryID={showUpdateBannerModal.productCatgoryID}
        onClose={handleCloseUpdateBannerModal}
        visible={showUpdateBannerModal.visible}
        refetchData={refreshData}
      />
    </>
  );
};

export default ProductCategoryTable;
