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
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { TablePaginationConfig } from "antd";
import { useCallback, useState } from "react";
import SVG from "react-inlinesvg";

import { QUERY_KEY } from "~/constants/queryKey";
import useDebounce from "~/hooks/useDebounce";
import { ProductMain } from "~/models/product";
import { ModalType } from "~/pages/User/UserModal";
import { productService } from "~/services/productService";
import { SearchParams } from "~/types";
import { getFullImageUrl } from "~/utils/image";
import { formatCurrencyVND } from "~/utils/number";
import VerticalDotIcon from "~/assets/svg/vertical-dot.svg";
import CustomTable, { ColumnType } from "~/components/NextUI/CustomTable";
import CustomModal from "~/components/NextUI/CustomModal";
import CustomBreadcrumb from "~/components/NextUI/CustomBreadcrumb";

const ProductListPage = () => {
  const [pageParameter, setPageParameter] = useState<SearchParams>({
    page: 0,
    pageSize: 10,
  });
  const [valueSearch, setValueSearch] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const queryText = useDebounce(valueSearch, 700);
  const [valueFilterFromCategory, setValueFilterFromCategory] =
    useState<string>();

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
      name: "STT",
      render: (_product: ProductMain, index?: number) => (index || 0) + 1,
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
      {/* <div>
        <span className="font-bold text-title-xl">Danh sách sản phẩm</span>
      </div> */}
      <CustomBreadcrumb
        pageName="Danh sách sản phẩm"
        routes={[
          {
            label: "Danh sách sản phẩm",
          },
        ]}
      />
      <div className="flex justify-between items-center mt-4 mb-2">
        <Input
          size="sm"
          color="primary"
          variant="bordered"
          label="Tìm kiếm theo tên sản phẩm..."
          className="max-w-[300px]"
          value={valueSearch}
          onValueChange={setValueSearch}
        />
        <Button color="primary" variant="shadow" onClick={onOpen}>
          Thêm sản phẩm
        </Button>
      </div>
      <CustomTable
        columns={columns}
        data={productList?.pages?.[0]?.data}
        isLoading={isLoadingProduct}
        emptyContent="Không có sản phẩm nào"
        tableName="Danh sách sản phẩm"
      />
      <CustomModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title="Thêm sản phẩm"
      >
        <div className="grid grid-cols-2">
          <div></div>
          <div></div>
        </div>
      </CustomModal>
    </div>
  );
};

export default ProductListPage;
