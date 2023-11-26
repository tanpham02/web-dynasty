import React, { useState } from 'react';
import SEARCH_ICON from '~ assets/svg/search.svg';
import SVG from 'react-inlinesvg';
import { DatePicker, Skeleton } from 'antd';
import OrderTable, { STATUS_ORDER_OPTIONS } from './OrderTable';
import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '~/constants/querryKey';
import orderService from '~/services/orderService';
import { SearchParams } from '~/types';
import Loading from '~/components/Loading';
import SelectCustom from '~/components/customs/Select';
import { DATE_FORMAT_DDMMYYYY, DATE_FORMAT_YYYYMMDD, formatDate } from '~/utils/date.utils';
import useDebounce from '~/hooks/useDebounce';

export interface PaginationProps {
  pageIndex?: number;
  pageSize?: number;
}

const Order = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paginationState, setPaginationState] = useState<PaginationProps>();
  const [filter, setFilter] = useState<{
    statusOrder?: string;
    from?: string | null;
    to?: string | null;
  }>();

  const debounceStatusOrder = useDebounce(filter?.statusOrder, 500);
  const debounceFromDate = useDebounce(filter?.from, 500);
  const debounceToDate = useDebounce(filter?.to, 500);

  const {
    data: dataOrder,
    isLoading: isLoadingOrder,
    refetch,
  } = useInfiniteQuery(
    [
      QUERY_KEY.ORDER,
      paginationState?.pageIndex,
      paginationState?.pageSize,
      debounceStatusOrder,
      debounceFromDate,
      debounceToDate,
    ],
    async () => {
      const params = {
        pageIndex: paginationState?.pageIndex,
        pageSize: paginationState?.pageSize,
        statusOrder: debounceStatusOrder,
        from: debounceFromDate,
        to: debounceToDate,
      };
      return orderService.searchPagination(params);
    },
  );

  const handleChangeDateFilter = (values: any) => {
    console.log('values', values);
    if (values) {
      const fromDate = formatDate(new Date(values[0]), DATE_FORMAT_YYYYMMDD);
      const toDate = formatDate(new Date(values[1]), DATE_FORMAT_YYYYMMDD);
      setFilter((prev) => ({
        ...prev,
        from: fromDate,
        to: toDate,
      }));
      return;
    }
    setFilter((prev) => ({
      ...prev,
      from: null,
      to: null,
    }));
  };
  return (
    <>
      <div className='flex flex-row justify-between items-center gap-2 w-full'>
        <span className='font-bold text-title-xl block pb-2'>Danh sách đơn hàng</span>
      </div>
      <div className='flex items-center flex-row lg:w-[70%] sm:w-[40%] xs:w-full flex-wrap gap-2 mt-3 mb-5'>
        <SelectCustom
          options={[{ label: 'Tất cả', value: null }, ...STATUS_ORDER_OPTIONS]}
          className='flex w-full items-center rounded-lg lg:w-[40%] md:w-[65%] sm:max-w-[100%]'
          placeholder='Trạng thái đơn hàng'
          onChange={(e: any) =>
            setFilter((prev) => ({
              ...prev,
              statusOrder: e.value,
            }))
          }
        />
        <DatePicker.RangePicker
          className='!py-[7px] !rounded-md'
          placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
          format={[DATE_FORMAT_DDMMYYYY, DATE_FORMAT_DDMMYYYY]}
          onChange={handleChangeDateFilter}
        />

        <button className='rounded-lg bg-primary px-4 py-2 font-normal text-white'>Tìm</button>
      </div>
      {isLoadingOrder ? (
        Array(5).map((__item, index) => <Skeleton key={index} />)
      ) : (
        <OrderTable
          data={dataOrder}
          onGetIsLoading={setIsLoading}
          refetchData={refetch}
          onGetPaginationState={setPaginationState}
        />
      )}

      {isLoading && <Loading />}
    </>
  );
};

export default Order;
