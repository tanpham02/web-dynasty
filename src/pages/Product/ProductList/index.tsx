import {
  Button,
  Chip,
  ChipProps,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { TablePaginationConfig } from "antd";
import { useCallback, useState } from "react";
import SVG from "react-inlinesvg";

import { QUERY_KEY } from "~/constants/querryKey";
import useDebounce from "~/hooks/useDebounce";
import { ProductMain } from "~/models/product";
import { ModalType } from "~/pages/User/UserModal";
import { productService } from "~/services/productService";
import { SearchParams } from "~/types";
import { getFullImageUrl } from "~/utils/image";
import { formatCurrencyVND } from "~/utils/number";
import VerticalDotIcon from "~/assets/svg/vertical-dot.svg";
import CustomTable, { ColumnType } from "~/components/NextUI/CustomTable";

const ProductListPage = () => {
  const [pageParameter, setPageParameter] = useState<SearchParams>({
    page: 0,
    pageSize: 10,
  });
  const [valueSearch, setValueSearch] = useState<string>("");
  const [propsProduct, setPropsProduct] = useState<{
    showModal?: boolean;
    modalType?: ModalType;
    product?: ProductMain;
  }>({});

  const queryText = useDebounce(valueSearch, 700);
  const [valueFilterFromCategory, setValueFilterFromCategory] =
    useState<string>();

  const handleTableChange = (paginationFromTable: TablePaginationConfig) => {
    if (paginationFromTable.current && paginationFromTable.pageSize)
      setPageParameter({
        page: paginationFromTable.current - 1,
        pageSize: paginationFromTable.pageSize,
      });
  };

  const handleOpenProductModal = () => {
    setPropsProduct((prev) => ({
      ...prev,
      showModal: true,
      modalType: ModalType.CREATE,
    }));
  };

  const {
    data: productList,
    isLoading: isLoadingProduct,
    refetch: refetchData,
  } = useInfiniteQuery(
    [
      QUERY_KEY.PRODUCT_IN_ZALO_MINI_APP,
      pageParameter,
      queryText,
      valueFilterFromCategory,
    ], // pageParameter thay đổi sẽ gọi lại useInfiniteQuery
    async () => {
      const params = {
        pageIndex: pageParameter.page,
        pageSize: pageParameter.pageSize,
        name: queryText,
      };
      return await productService.getProductPagination(params);
    },
  );

  const columns: ColumnType<ProductMain>[] = [
    {
      key: "_id",
      align: "center",
      name: "ID",
      render: (product: ProductMain, index?: number) => (index || 0) + 1,
    },
    {
      key: "image",
      align: "center",
      name: "Hình ảnh",
      render: (product: ProductMain) => (
        <Image
          isBlurred
          isZoomed
          src={getFullImageUrl(product?.image)}
          fallbackSrc="https://via.placeholder.com/80x80"
          alt={product?.name}
          className="w-20"
          loading="lazy"
        />
      ),
    },
    {
      key: "name",
      align: "center",
      name: "Tên",
      render: (product: ProductMain) => (
        <span className="line-clamp-1">{product?.name}</span>
      ),
    },
    {
      key: "price",
      align: "center",
      name: "Gía bán",
      render: (product: ProductMain) => formatCurrencyVND(product?.price),
    },
    {
      key: "types",
      align: "end",
      name: "Loại sản phẩm",
      render: (product: ProductMain) => (
        <Chip color="success" variant="flat">
          Mới
        </Chip>
      ),
    },
    {
      key: "description",
      align: "center",
      name: "Hành động",
      render: () => (
        <Dropdown>
          <DropdownTrigger>
            <Button isIconOnly size="sm" variant="light">
              <SVG src={VerticalDotIcon} className="text-default-300" />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem>Xem chi tiết</DropdownItem>
            <DropdownItem>Chỉnh sửa</DropdownItem>
            <DropdownItem>Xóa</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ),
    },
  ];

  return (
    <div>
      <div>
        <span className="font-bold text-title-xl">Danh sách sản phẩm</span>
      </div>
      <div className="flex justify-between items-center mt-4 mb-2">
        <Input
          size="sm"
          variant="bordered"
          className="max-w-[300px]"
          placeholder="Tìm kiếm theo tên sản phẩm..."
          value={valueSearch}
          onValueChange={setValueSearch}
        />
        <Button
          color="primary"
          variant="shadow"
          onClick={handleOpenProductModal}
        >
          Thêm sản phẩm
        </Button>
      </div>
      {!isLoadingProduct && (
        <CustomTable columns={columns} data={productList?.pages?.[0]?.data} />
      )}

      {/* {isLoadingProduct ? (
        Array(5).map((__item, index) => <Skeleton key={index} />)
      ) : (
        <ProductTable
          data={productList}
          refreshData={refetchData}
          handleTableChange={handleTableChange}
          onClose={() => setPropsProduct({ showModal: false })}
          propsProduct={propsProduct}
          onSetPropsProduct={setPropsProduct}
        />
      )} */}
    </div>
  );
};

export default ProductListPage;
