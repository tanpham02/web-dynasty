import {
  Pagination,
  Selection,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React, { Key } from "react";
import { v4 as uuidv4 } from "uuid";

export interface ColumnType<T> {
  key?: keyof T | string;
  name?: React.ReactNode;
  align?: "start" | "center" | "end";
  render: (value: T, index?: number) => React.ReactNode;
}

export default function CustomTable<T>({
  selectedKeys,
  columns = [],
  data = [],
  page = 1,
  isLoading = true,
  totalPage = 1,
  rowPerPage = 10,
  rowPerPageOptions = [10, 20, 50],
  onChangeRowPerPage,
  onChangePage,
  emptyContent,
  tableName,
  onSelectionChange,
  selectionMode = "multiple",
  pagination,
}: {
  columns?: ColumnType<T>[];
  data?: T[];
  page?: number;
  isLoading?: boolean;
  totalPage?: number;
  rowPerPage?: number;
  onChangePage?(page: number): void;
  rowPerPageOptions?: number[];
  onChangeRowPerPage?(rowPerPage: number): void;
  emptyContent?: React.ReactNode;
  tableName?: string;
  selectedKeys?: Selection;
  onSelectionChange?(keys: Selection): void;
  selectionMode?: "multiple" | "single" | "none";
  pagination?: boolean;
}): React.ReactNode {
  return (
    <div className="space-y-2">
      <Table
        aria-label={tableName}
        selectedKeys={selectedKeys}
        selectionMode={selectionMode}
        onSelectionChange={onSelectionChange}
      >
        <TableHeader columns={columns as ColumnType<T>[]}>
          {(column: ColumnType<T>) => (
            <TableColumn
              key={column.key as Key}
              align={column?.align}
              className={`font-bold text-sm select-none`}
            >
              {column?.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent={emptyContent}
          items={
            isLoading
              ? (Array.from({ length: rowPerPage }).fill({
                  id: uuidv4(),
                }) as any)
              : data
          }
        >
          {(isLoading
            ? (Array.from({ length: rowPerPage }).fill({
                id: uuidv4(),
              }) as any)
            : data
          )?.map((row: any, rowIndex: number) => (
            <TableRow key={rowIndex}>
              {columns?.map((_, index) =>
                isLoading ? (
                  <TableCell key={uuidv4()}>
                    <Skeleton className="rounded-lg">
                      <div className="h-4 rounded-lg bg-default-300"></div>
                    </Skeleton>
                  </TableCell>
                ) : (
                  <TableCell key={`${rowIndex} - ${index}`}>
                    {columns[index].render(row, rowIndex)}
                  </TableCell>
                ),
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination && (
        <div className="flex justify-end items-center">
          <label className="flex items-center text-default-400 text-small mr-2">
            Số lượng dòng:
            <select
              value={rowPerPage}
              className="outline-none text-default-400 text-small"
              onChange={(e) => onChangeRowPerPage?.(Number(e.target.value))}
            >
              {rowPerPageOptions.map((quantity) => (
                <option key={quantity} value={quantity}>
                  {quantity} / trang
                </option>
              ))}
            </select>
          </label>
          <Pagination
            showControls
            showShadow
            color="primary"
            page={page}
            total={totalPage}
            onChange={onChangePage}
          />
        </div>
      )}
    </div>
  );
}
