import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Input,
} from '@nextui-org/react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import SVG from 'react-inlinesvg';
import { useNavigate } from 'react-router-dom';

import Box from '~/components/Box';
import ButtonIcon from '~/components/ButtonIcon';
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable';
import { QUERY_KEY } from '~/constants/queryKey';
import { PATH_NAME } from '~/constants/router';
import useDebounce from '~/hooks/useDebounce';
import { ProductMain } from '~/models/product';
import { productService } from '~/services/productService';
import { SearchParams } from '~/types';
import { getFullImageUrl } from '~/utils/image';
import { formatCurrencyVND } from '~/utils/number';
import EditIcon from '~/assets/svg/edit.svg';
import DeleteIcon from '~/assets/svg/delete.svg';

const ProductListPage = () => {
  const navigate = useNavigate();

  const [pageParameter, setPageParameter] = useState<SearchParams>({
    page: 0,
    pageSize: 10,
  });
  const [valueSearch, setValueSearch] = useState<string>('');

  const queryText = useDebounce(valueSearch, 700);
  const [valueFilterFromCategory, setValueFilterFromCategory] = useState<string>();

  const {
    data: productList,
    isLoading: isLoadingProduct,
    isFetching: isFetchingProduct,
  } = useInfiniteQuery(
    [QUERY_KEY.PRODUCTS, pageParameter, queryText, valueFilterFromCategory], // pageParameter thay đổi sẽ gọi lại useInfiniteQuery
    async () => {
      const params = {
        pageIndex: pageParameter.page,
        pageSize: pageParameter.pageSize,
        name: queryText,
      };
      return await productService.getProductPagination(params);
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const columns: ColumnType<ProductMain>[] = [
    {
      align: 'center',
      name: 'STT',
      render: (_product: ProductMain, index?: number) => (index || 0) + 1,
    },
    {
      align: 'center',
      name: 'Hình ảnh',
      render: (product: ProductMain) => (
        <Image
          isBlurred
          isZoomed
          src={getFullImageUrl(product?.image)}
          fallbackSrc="https://via.placeholder.com/80x80"
          alt={product?.name}
          className="w-20 h-20"
          loading="lazy"
        />
      ),
    },
    {
      align: 'center',
      name: 'Tên',
      render: (product: ProductMain) => <span className="line-clamp-1">{product?.name}</span>,
    },
    {
      align: 'center',
      name: 'Giá bán',
      render: (product: ProductMain) => formatCurrencyVND(product?.price),
    },
    {
      align: 'end',
      name: 'Loại sản phẩm',
      render: (product: ProductMain) => (
        <Chip color="success" variant="flat">
          Mới
        </Chip>
      ),
    },
    {
      align: 'center',
      name: 'Hành động',
      render: (record: ProductMain) => (
        <Box className="space-x-2">
          <ButtonIcon
            title="Chỉnh sửa sản phẩm"
            icon={EditIcon}
            onClick={() => navigate(`${PATH_NAME.PRODUCT}/${record?._id}`)}
          />
          <ButtonIcon title="Xóa sản phẩm này" icon={DeleteIcon} status="danger" />
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <CustomBreadcrumb
        pageName="Danh sách sản phẩm"
        routes={[
          {
            label: 'Danh sách sản phẩm',
          },
        ]}
      />
      <Box className="flex justify-between items-center mt-4 mb-2">
        <Input
          size="sm"
          color="primary"
          variant="bordered"
          label="Tìm kiếm theo tên sản phẩm..."
          className="max-w-[300px]"
          value={valueSearch}
          onValueChange={setValueSearch}
        />
        <Button color="primary" variant="shadow" onClick={() => navigate(PATH_NAME.PRODUCT)}>
          Thêm sản phẩm
        </Button>
      </Box>
      <CustomTable
        rowKey="_id"
        columns={columns}
        data={productList?.pages?.[0]?.data}
        isLoading={isLoadingProduct || isFetchingProduct}
        emptyContent="Không có sản phẩm nào"
        tableName="Danh sách sản phẩm"
      />
    </Box>
  );
};

export default ProductListPage;
