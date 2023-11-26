import { useInfiniteQuery } from '@tanstack/react-query';
import { Skeleton, TablePaginationConfig } from 'antd';
import { useState } from 'react';
import SVG from 'react-inlinesvg';
import SEARCH_ICON from '~ assets/svg/search.svg';
import { QUERY_KEY } from '~/constants/querryKey';
import useDebounce from '~/hooks/useDebounce';
import { membershipService } from '~/services/membershipService';
import { SearchParams } from '~/types';
import MembershipTable from './MembershipTable';

export const MembershipPage = () => {
  const [pageParameter, setPageParameter] = useState<SearchParams>({
    page: 0,
    pageSize: 10,
  });
  const [valueSearch, setValueSearch] = useState<string>('');
  const queryText = useDebounce(valueSearch, 800);

  const {
    data: membershipData,
    isLoading: isLoadingMembershipData,
    refetch,
  } = useInfiniteQuery([QUERY_KEY.MEMBERSHIP, pageParameter, queryText], async () => {
    const params = {
      pageIndex: pageParameter.page,
      pageSize: pageParameter.pageSize,
      name: queryText,
    };
    return await membershipService.searchMembershipByCriteria(params);
  });

  const handleTableChange = (paginationFromTable: TablePaginationConfig) => {
    if (paginationFromTable.current && paginationFromTable.pageSize)
      setPageParameter({
        page: paginationFromTable.current - 1,
        pageSize: paginationFromTable.pageSize,
      });
  };

  return (
    <>
      <div className='lg:w-[40%] sm:w-[30%] sm:flex sm:flex-wrap '>
        <div className='flex items-center flex-row md:flex-wrap lg:flex-nowrap gap-2'>
          <div className='my-2 flex flex-1 items-center rounded-lg border-2 border-gray bg-white p-2 dark:bg-boxdark '>
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
      </div>
      {isLoadingMembershipData ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        <MembershipTable
          data={membershipData}
          refreshData={refetch}
          handleTableChange={handleTableChange}
        />
      )}
    </>
  );
};
