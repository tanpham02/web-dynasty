import { useState } from "react";

interface Pagination {
  pageSize: number;
  pageIndex: number;
}

interface PaginationProps {
  pageSize: number;
  pageIndex: number;
  setPagination(pageSize: number, pageIndex: number): void;
}

const usePagination = (): PaginationProps => {
  const [paginationValue, setPaginationValue] = useState<Pagination>({
    pageIndex: 0,
    pageSize: 10,
  });

  const setPagination = (pageSize: number, pageIndex: number) => {
    setPaginationValue((prev) => ({ ...prev, pageSize, pageIndex }));
  };

  return {
    setPagination,
    pageIndex: paginationValue.pageIndex,
    pageSize: paginationValue.pageSize,
  };
};

export default usePagination;
