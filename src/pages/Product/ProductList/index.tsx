import { useState, useMemo } from 'react';
import SVG from 'react-inlinesvg';
import SEARCH_ICON from '~ assets/svg/search.svg';
import ProductTable from './ProductTable';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '~/constants/querryKey';
import { SearchParams } from '~/types';
import { productService } from '~/services/productService';
import { Select, Skeleton, TablePaginationConfig } from 'antd';
import useDebounce from '~/hooks/useDebounce';
import productCategoryService from '~/services/productCategoryService';
import { ModalType } from '~/pages/User/UserModal';
import { ProductMain } from '~/models/product';

const ProductListPage = () => {
  const [pageParameter, setPageParameter] = useState<SearchParams>({
    page: 0,
    pageSize: 10,
  });
  const [valueSearch, setValueSearch] = useState<string>('');
  const [propsProduct, setPropsProduct] = useState<{
    showModal?: boolean;
    modalType?: ModalType;
    product?: ProductMain;
  }>({});

  const queryText = useDebounce(valueSearch, 700);
  const [valueFilterFromCategory, setValueFilterFromCategory] = useState<string>();

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
    [QUERY_KEY.PRODUCT_IN_ZALO_MINI_APP, pageParameter, queryText, valueFilterFromCategory], // pageParameter thay đổi sẽ gọi lại useInfiniteQuery
    async () => {
      const params = {
        pageIndex: pageParameter.page,
        pageSize: pageParameter.pageSize,
        name: queryText,
      };
      return await productService.getProductPagination(params);
    },
  );

  const onChange = (newValue: string) => {
    setValueFilterFromCategory(newValue);
  };

  return (
    <>
      <div className='flex flex-row justify-between items-center gap-2 w-full'>
        <span className='font-bold text-title-xl block pb-2'>Danh sách sản phẩm</span>
        <button
          onClick={handleOpenProductModal}
          className='rounded-lg bg-primary px-4 py-2 font-normal text-white'
        >
          Thêm sản phẩm
        </button>
      </div>
      <div className='flex items-center flex-row lg:w-[30%] mt-3 sm:w-[40%] xs:w-full flex-wrap gap-2'>
        <div className='flex flex-1 items-center justify-center rounded-lg border-2 border-gray bg-white p-2 dark:bg-boxdark lg:w-[70%] sm:w-[40%]'>
          <SVG src={SEARCH_ICON} />
          <input
            type='text'
            placeholder='Tìm kiếm...'
            className='w-full bg-transparent pl-6 pr-4 focus:outline-none'
            onChange={(e) => setValueSearch(e.target.value)}
          />
        </div>

        <button className='rounded-lg bg-primary px-4 py-2 font-normal text-white'>Tìm</button>
      </div>
      {isLoadingProduct ? (
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
      )}
    </>
  );
};

export default ProductListPage;
