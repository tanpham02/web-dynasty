import { Empty, Skeleton, Table, Tooltip } from "antd";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CheckCircleOutlined, CloseOutlined } from "@ant-design/icons";
import { useMemo, useState } from "react";
import { QUERY_KEY } from "~/constants/queryKey";
import { ProductCategory } from "~/models/productCategory";
import productCategoryService from "~/services/productCategoryService";
import { toast } from "react-hot-toast";
import { TableRowSelection } from "antd/lib/table/interface";

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

interface ProductCategoryFromThirdPartyModalProps {
  handleOpenProductCategoryFromThirdPartyModal: () => void;
}

const ProductCategoryFromThirdPartyModal = ({
  handleOpenProductCategoryFromThirdPartyModal,
}: ProductCategoryFromThirdPartyModalProps) => {
  const [listProductCategorySelected, setListProductCategorySelected] =
    useState<ProductCategory[]>([]);

  const {
    data: productCategoryFromThirdPartyResponse,
    refetch,
    isLoading: isLoadingProductCategoryFromThirdPart,
  } = useInfiniteQuery(
    [QUERY_KEY.PRODUCT_CATEGORY_FROM_THIRD_PARTY_IN_PRODUCT_CATEGORY_PAGE],
    async () => {
      return await productCategoryService.getAllProductCategoryFromThirdParty();
    },
  );

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
    return (
      productCategoryFromThirdPartyResponse?.pages[0] &&
      changeChildCategoryDTOsToChildren(
        productCategoryFromThirdPartyResponse?.pages[0],
      )
    );
  }, [productCategoryFromThirdPartyResponse]);

  const rowSelection: TableRowSelection<ProductCategory> = {
    onSelect: (__record, __selected, selectedRows) => {
      setListProductCategorySelected(selectedRows);
    },
    onSelectAll: (__selected, selectedRows) => {
      setListProductCategorySelected(selectedRows);
    },
    getCheckboxProps: (record: ProductCategory) => ({
      disabled: record.existInDatabase,
      key: record.key,
    }),
    checkStrictly: false,
    renderCell(
      __checked: boolean,
      record: ProductCategory,
      __index: number,
      node: any,
    ) {
      if (record.existInDatabase) {
        return (
          <Tooltip title="Đã hiển thị">
            <CheckCircleOutlined style={{ color: "#219653" }} />
          </Tooltip>
        );
      }
      return node;
    },
  };

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
      title: "Hiển thị trên Zalo Mini App",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (__index, record) => (
        <div
          className={
            record.existInDatabase
              ? "inline-flex items-center rounded-lg bg-success  px-3 py-1 text-center font-semibold  text-white"
              : "inline-flex items-center rounded-lg bg-danger  px-3 py-1 text-center font-semibold  text-white"
          }
        >
          {record.existInDatabase ? "Đã hiển thị" : "Chưa hiển thị"}
        </div>
      ),
    },
  ];

  const handleAddProductCategoryFromThirdPartyToZaloMiniApp = async () => {
    if (
      listProductCategorySelected.length !== 0 &&
      productCategoryFromThirdPartyResponse
    ) {
      let listProductCategory = listProductCategorySelected;

      listProductCategory.map((productCategory) => {
        if (productCategoryFromThirdPartyResponseAfterChangeField) {
          if (productCategory.nhanhVnParentId) {
            const parentProductCategorySelected =
              productCategoryFromThirdPartyResponseAfterChangeField.find(
                (productCategoryFromThirdParty) =>
                  productCategoryFromThirdParty.nhanhVnId ===
                    productCategory.nhanhVnParentId &&
                  productCategoryFromThirdParty.existInDatabase === false,
              );

            if (parentProductCategorySelected) {
              delete parentProductCategorySelected.children;

              const tempListProductCategory = [...listProductCategory];
              const isAlreadySelected = tempListProductCategory.some(
                (item) =>
                  item.nhanhVnId === parentProductCategorySelected.nhanhVnId,
              );
              if (!isAlreadySelected) {
                tempListProductCategory.push(parentProductCategorySelected);
              }
              const filteredListProductCategory =
                tempListProductCategory.filter(
                  (item, index, self) =>
                    index ===
                    self.findIndex((i) => i.nhanhVnId === item.nhanhVnId),
                );

              listProductCategory = filteredListProductCategory;
            }
          }
        }
      });

      if (listProductCategory) {
        try {
          await productCategoryService.addProductCategoryFromThirdPartyToZaloMiniApp(
            listProductCategory,
          );
          toast.success("Thêm danh mục sản phẩm vào Zalo Mini App thành công", {
            position: "bottom-right",
            duration: 3500,
            icon: "👏",
          });
          setListProductCategorySelected([]);
          refetch();
          handleOpenProductCategoryFromThirdPartyModal();
        } catch (error) {
          console.log(error);
          toast.error("Lỗi khi thêm danh mục sản phẩm vào Mini App");
        }
      }
    }
  };

  return (
    <div
      className="fixed z-[99999] top-0 bottom-0 right-0 left-0 3xl:px-60 lg:px-60 md:px-10 xsm:px-5 rounded-2xl flex justify-center items-end bg-[#00000066]"
      onClick={() => handleOpenProductCategoryFromThirdPartyModal()}
    >
      <div
        onClick={() => handleOpenProductCategoryFromThirdPartyModal()}
        className=" bg-white w-full h-auto my-auto p-8 rounded-2xl relative"
      >
        <CloseOutlined
          style={{
            fontSize: "16px",
            color: "#000",
            fontWeight: 600,
            position: "absolute",
            top: 17,
            right: 26,
            cursor: "pointer",
            padding: 8,
          }}
        />
        <div onClick={(e) => e.stopPropagation()}>
          <div className="!h-full">
            <div className="flex items-center gap-2 lg:w-[75%] md:w-[75%] py-4 ">
              <span className="font-bold text-xl">
                {"Danh sách danh mục sản phẩm được lấy từ NhanhVN"}
              </span>
            </div>

            <Table
              rowSelection={rowSelection}
              rowKey="nhanhVnId"
              columns={COLUMN}
              dataSource={productCategoryFromThirdPartyResponseAfterChangeField}
              className="product-list !h-[100%] rounded-sm border border-stroke bg-white pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 "
              scroll={{ y: "50vh" }}
              pagination={false}
              locale={{
                emptyText: isLoadingProductCategoryFromThirdPart ? (
                  <Skeleton />
                ) : (
                  <Empty />
                ),
              }}
              expandable={{ defaultExpandAllRows: true }}
            />
          </div>

          <div
            className={`flex ${
              listProductCategorySelected.length > 0
                ? "justify-between"
                : "justify-end"
            } mt-5 `}
          >
            {listProductCategorySelected.length > 0 && (
              <div className="flex items-center    ">
                <span className="font-bold text-sm">{`Bạn đã chọn ${listProductCategorySelected.length} danh mục`}</span>
              </div>
            )}
            <div>
              <button
                className="w-auto px-8 py-2 rounded-lg border-2 border-gray border-solid font-medium hover:bg-stroke"
                onClick={() => handleOpenProductCategoryFromThirdPartyModal()}
              >
                Hủy
              </button>
              <button
                className={`w-auto px-8 py-2 ml-3 rounded-lg font-medium ${
                  listProductCategorySelected.length == 0
                    ? "bg-stroke "
                    : "bg-menu-color hover:bg-primary"
                }  text-white`}
                disabled={listProductCategorySelected.length == 0}
                onClick={handleAddProductCategoryFromThirdPartyToZaloMiniApp}
              >
                Thêm vào Zalo Mini App
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCategoryFromThirdPartyModal;
