import SVG from 'react-inlinesvg';
import SEARCH_ICON from '~ assets/svg/search.svg';
import CustomerTable from './CustomerTable';
import { QUERY_KEY } from '~/constants/querryKey';
import { useState } from 'react';
import { SearchParams } from '~/types';
import useDebounce from '~/hooks/useDebounce';
import { useInfiniteQuery } from '@tanstack/react-query';
import customerService from '~/services/customerService';
import { Skeleton, TablePaginationConfig } from 'antd';

const CustomerListPage = () => {
  const [pageParameter, setPageParameter] = useState<SearchParams>({
    page: 0,
    pageSize: 10,
  });
  const [valueSearch, setValueSearch] = useState<string>('');
  const queryText = useDebounce(valueSearch, 700);
  const {
    data: customers,
    isLoading: isLoadingCustomer,
    refetch,
  } = useInfiniteQuery(
    [QUERY_KEY.CUSTOMERS, pageParameter, queryText], // pageParameter thay đổi sẽ gọi lại useInfiniteQuery
    async () => {
      const params = {
        pageIndex: pageParameter.page,
        pageSize: pageParameter.pageSize,
        fullName: queryText,
      };
      return await customerService.searchCustomerByCriteria(params);
    },
  );

  const handleTableChange = (paginationFromTable: TablePaginationConfig) => {
    if (paginationFromTable.current && paginationFromTable.pageSize)
      setPageParameter({
        page: paginationFromTable.current - 1,
        pageSize: paginationFromTable.pageSize,
      });
  };

  return (
    <>
      <div className='flex flex-row justify-between items-center gap-2 w-full'>
        <span className='font-bold text-title-xl block pb-2'>Danh sách khách hàng</span>
      </div>

      <div className='flex items-center flex-row lg:w-[30%] mt-3 sm:w-[40%] xs:w-full flex-wrap gap-2 mb-5'>
        <div className='flex flex-1 items-center justify-center rounded-lg border-2 border-gray bg-white p-2 dark:bg-boxdark lg:w-[70%] sm:w-[40%]'>
          <SVG src={SEARCH_ICON} />
          <input
            type='text'
            placeholder='Tìm kiếm...'
            className='w-full bg-transparent pl-6 pr-4 focus:outline-none'
            onChange={(e) => setValueSearch(e.target.value)}
          />
        </div>
        <button className='rounded-lg bg-primary px-4 py-2 font-normal text-white  '>Tìm</button>
      </div>
      {isLoadingCustomer ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        <CustomerTable
          data={customers?.pages?.[customers?.pages.length - 1]}
          refreshData={refetch}
          handleTableChange={handleTableChange}
        />
      )}
    </>
  );
};

export default CustomerListPage;
