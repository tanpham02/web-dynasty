import { useState } from 'react';

interface Pagination {
  pageSize: number;
  pageIndex: number;
}

interface PaginationProps {
  pageSize: number;
  pageIndex: number;
  setPage(page: number): void;
  setRowPerPage(pageSize: number): void;
}

const usePagination = (): PaginationProps => {
  const [paginationValue, setPaginationValue] = useState<Pagination>({
    pageIndex: 1,
    pageSize: 10,
  });

  const setPage = (pageIndex: number) => {
    setPaginationValue((prev) => ({ ...prev, pageIndex }));
  };

  const setRowPerPage = (pageSize: number) => {
    setPaginationValue((prev) => ({ ...prev, pageSize }));
  };

  return {
    setPage,
    setRowPerPage,
    pageIndex: paginationValue.pageIndex,
    pageSize: paginationValue.pageSize,
  };
};

export default usePagination;
