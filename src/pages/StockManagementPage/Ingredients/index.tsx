import { UseQueryResult } from '@tanstack/react-query'
import { Box, CustomTable, Text } from '~/components'
import { ColumnType } from '~/components/NextUI/CustomTable'
import { PaginationProps } from '~/hooks/usePagination'
import { Ingredients as IngredientsModel } from '~/models/ingredients'

import { ListDataResponse } from '~/types'
import { formatCurrencyVND } from '~/utils/number'

interface IngredientProps {
  ingredientPagination: PaginationProps
  ingredientsResponse: UseQueryResult<
    ListDataResponse<IngredientsModel>,
    unknown
  >
}

const Ingredients = (props: IngredientProps) => {
  const { ingredientsResponse, ingredientPagination } = props
  const { pageIndex, pageSize, setPage, setRowPerPage } = ingredientPagination
  const { data, isFetching, isLoading } = ingredientsResponse

  const columns: ColumnType<IngredientsModel>[] = [
    {
      name: 'STT',
      render: (_category: IngredientsModel, index?: number) =>
        (index || 0) + 1 + (pageIndex - 1) * 10,
    },
    {
      name: <Box className="flex justify-center">Tên nguyên liệu</Box>,
      render: (stock: IngredientsModel) => (
        <Box className="flex justify-center">{stock?.name ?? '-'}</Box>
      ),
    },
    {
      name: <Box className="flex justify-center">Giá</Box>,
      render: (stock: IngredientsModel) => (
        <Box className="flex justify-center">
          {`${formatCurrencyVND(stock?.price || 0)} đ`}
        </Box>
      ),
    },
    {
      name: <Box className="flex justify-center">Số lượng tồn</Box>,
      render: (stockManagement: IngredientsModel) => (
        <Text className="text-center line-clamp-2">
          {`${stockManagement?.quantity} (${stockManagement?.unit})` || '-'}
        </Text>
      ),
    },
  ]

  return (
    <Box style={{ marginTop: 12 }}>
      <CustomTable
        rowKey="_id"
        tableName="Nguyên liệu"
        emptyContent="Không có nguyên liệu nào"
        columns={columns}
        data={data?.data}
        totalPage={data?.totalPage || 0}
        page={pageIndex}
        rowPerPage={pageSize}
        onChangePage={setPage}
        onChangeRowPerPage={setRowPerPage}
        isLoading={isFetching || isLoading}
      />
    </Box>
  )
}

export default Ingredients
