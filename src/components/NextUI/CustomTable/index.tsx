import {
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Selection,
} from "@nextui-org/react";
import React, { Key } from "react";

export interface ColumnType<T> {
  key?: keyof T;
  name?: string;
  align?: "start" | "center" | "end";
  render: (value: T, index?: number) => React.ReactNode;
}

export default function CustomTable<T>({
  selectedKeys = [],
  columns = [],
  data = [],
  page = 1,
  totalPage = 1,
  onChangePage,
  emptyContent,
  tableName,
  onSelectionChange,
  selectionMode = "multiple",
}: {
  columns?: ColumnType<T>[];
  data?: Iterable<T>;
  page?: number;
  totalPage?: number;
  onChangePage?(page: number): void;
  emptyContent?: React.ReactNode;
  tableName?: string;
  selectedKeys?: Key[];
  onSelectionChange?(keys: Selection): void;
  selectionMode?: "multiple" | "single" | "none";
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
              align={column.align}
              className="font-bold text-sm"
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={emptyContent} items={data}>
          {(item: any) => (
            <TableRow key={item?._id || item?.id}>
              {
                columns?.map((_, index) => (
                  <TableCell key={index}>
                    {columns[index].render(item, index)}
                  </TableCell>
                )) as any
              }
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-end">
        <Pagination
          showControls
          showShadow
          color="primary"
          page={page}
          total={totalPage}
          onChange={onChangePage}
        />
      </div>
    </div>
  );
}
