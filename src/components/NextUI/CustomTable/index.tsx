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
} from '@nextui-org/react'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'

export interface ColumnType<T> {
  name?: React.ReactNode
  align?: 'start' | 'center' | 'end'
  render: (value: T, index?: number) => React.ReactNode
  className?: string
  width?: number
  hide?: boolean
}

interface CustomTableProps<T> {
  rowKey?: keyof T
  columns?: ColumnType<T>[]
  data?: T[]
  page?: number
  isLoading?: boolean
  totalPage?: number
  rowPerPage?: number
  total?: number
  onChangePage?(page: number): void
  rowPerPageOptions?: number[]
  onChangeRowPerPage?(rowPerPage: number): void
  emptyContent?: React.ReactNode
  tableName?: string
  selectedKeys?: Selection
  onSelectionChange?(keys: Selection): void
  selectionMode?: 'multiple' | 'single' | 'none'
  pagination?: boolean
  removeWrapper?: boolean
  isStriped?: boolean
  disabledKeys?: Selection
  isScrollable?: boolean
}

export default function CustomTable<T>({
  rowKey,
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
  selectionMode = 'multiple',
  pagination,
  removeWrapper,
  isStriped,
  disabledKeys,
  total = 0,
  isScrollable,
}: CustomTableProps<T>): React.ReactNode {
  return (
    <div className="space-y-2">
      <Table
        aria-label={tableName}
        selectedKeys={selectedKeys}
        selectionMode={isLoading || !total ? 'none' : selectionMode}
        onSelectionChange={onSelectionChange}
        removeWrapper={removeWrapper}
        isStriped={isStriped}
        disabledKeys={disabledKeys}
        onRowAction={() => {}}
        isHeaderSticky
        classNames={{
          th: ['bg-zinc-200', 'text-black'],
          base: isScrollable ? 'max-h-[450px]' : '',
          emptyWrapper: 'text-lg font-semibold',
        }}
      >
        <TableHeader columns={columns as ColumnType<T>[]} className="relative">
          {(column: ColumnType<T>) => (
            <TableColumn
              key={uuidv4()}
              className={`font-bold text-sm select-none ${column?.className}`}
              width={column?.width}
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
          {(isLoading ? Array.from({ length: rowPerPage }) : data)?.map(
            (row: any, rowIndex: number) => (
              <TableRow key={rowKey && !isLoading ? row?.[rowKey] : uuidv4()}>
                {columns?.map((_, index) =>
                  isLoading ? (
                    <TableCell key={uuidv4()}>
                      <Skeleton className="rounded-lg">
                        <div className="h-4 rounded-lg bg-default-300"></div>
                      </Skeleton>
                    </TableCell>
                  ) : (
                    <TableCell key={uuidv4()}>
                      {columns[index].render(row, rowIndex)}
                    </TableCell>
                  ),
                )}
              </TableRow>
            ),
          )}
        </TableBody>
      </Table>
      {Boolean(pagination && totalPage) && (
        <div className="flex justify-end items-center">
          <label
            id="row-per-page"
            className="flex items-center text-default-400 text-small mr-2 bg-white shadow-sm py-0.5 px-2 mb-3 rounded-lg"
          >
            Số lượng dòng:
            <select
              id="row-per-page"
              value={rowPerPage}
              className="outline-none text-default-700 text-small"
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
            loop
            showShadow
            showControls
            color="primary"
            variant="faded"
            page={page}
            total={totalPage}
            onChange={onChangePage}
            classNames={{
              next: 'bg-white',
              prev: 'bg-white',
            }}
          />
        </div>
      )}
    </div>
  )
}
