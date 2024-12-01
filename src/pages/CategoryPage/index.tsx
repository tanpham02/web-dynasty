import {
  Button,
  Chip,
  Input,
  Selection,
  useDisclosure,
} from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useEffect, useRef, useState } from 'react'

import DeleteIcon from '~/assets/svg/delete.svg'
import EditIcon from '~/assets/svg/edit.svg'
import Box from '~/components/Box'
import ButtonIcon from '~/components/ButtonIcon'
import ModalConfirmDelete, {
  ModalConfirmDeleteState,
} from '~/components/ModalConfirmDelete'
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb'
import CustomImage from '~/components/NextUI/CustomImage'
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable'
import { QUERY_KEY } from '~/constants/queryKey'
import useDebounce from '~/hooks/useDebounce'
import usePagination from '~/hooks/usePagination'
import { Category, CategoryStatus } from '~/models/category'
import { categoryService } from '~/services/categoryService'
import { getFullImageUrl } from '~/utils/image'
import CategoryModal from './CategoryModal'

const Categories = () => {
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onOpenChange: onOpenChangeModal,
  } = useDisclosure()

  const {
    isOpen: isOpenModalDelete,
    onOpen: onOpenModalDelete,
    onOpenChange: onOpenChangeModalDelete,
    onClose,
  } = useDisclosure()

  const [modalDelete, setModalDelete] = useState<ModalConfirmDeleteState>()
  const [searchCategory, setSearchCategory] = useState<string>('')
  const [categorySelectedKeys, setCategorySelectedKeys] = useState<Selection>()
  const [modal, setModal] = useState<{
    isEdit?: boolean
    categoryId?: string
  }>()
  const isQuickDelete = useRef<boolean>(false)

  const { pageIndex, pageSize, setPage, setRowPerPage } = usePagination()

  const { enqueueSnackbar } = useSnackbar()

  const searchCategoryDebounce = useDebounce(searchCategory, 500)

  const columns: ColumnType<Category>[] = [
    {
      align: 'center',
      name: 'STT',
      render: (_category: Category, index?: number) =>
        (index || 0) + 1 + (pageIndex - 1) * 10,
    },
    {
      name: <Box className="flex justify-center">Hình ảnh</Box>,
      render: (category: Category) => {
        return (
          <CustomImage
            isPreview
            src={getFullImageUrl(category?.avatar)}
            fallbackSrc="https://via.placeholder.com/80x80"
          />
        )
      },
    },
    {
      align: 'center',
      name: 'Tên danh mục',
      render: (category: Category) => category?.name,
    },
    {
      align: 'center',
      name: <Box className="flex justify-center">Số lượng sản phẩm</Box>,
      render: (category: Category) => (
        <Box className="flex justify-center">
          {category?.products?.length ||
            category?.childrenCategory?.category?.reduce(
              (totalProduct, childrenCategory) =>
                totalProduct + (childrenCategory?.products?.length || 0),
              0,
            ) ||
            0}
        </Box>
      ),
    },
    {
      align: 'center',
      name: <Box className="flex justify-center">Thứ tự hiển thị</Box>,
      render: (category: Category) => (
        <Box className="flex justify-center">{category?.priority || 0}</Box>
      ),
    },
    {
      align: 'center',
      name: <Box className="flex justify-center">Trạng thái</Box>,
      render: (category: Category) => (
        <Box className="flex justify-center">
          <Chip
            color={
              category?.status === CategoryStatus.ACTIVE ? 'success' : 'danger'
            }
            variant="flat"
            classNames={{
              content: 'font-semibold',
            }}
          >
            {category?.status === CategoryStatus.ACTIVE
              ? 'Đang kinh doanh'
              : 'Ngưng kinh doanh'}
          </Chip>
        </Box>
      ),
    },
    {
      align: 'center',
      name: <Box className="flex justify-center">Hành động</Box>,
      render: (category: Category) => (
        <div className="flex justify-center space-x-2">
          <ButtonIcon
            icon={EditIcon}
            title="Chỉnh sửa danh mục"
            onClick={() => handleOpenModalEdit(category)}
          />
          <ButtonIcon
            icon={DeleteIcon}
            title="Xóa thuộc danh mục này"
            onClick={() => handleOpenDeleteModal(category)}
            status="danger"
          />
        </div>
      ),
    },
  ]

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isFetching: isFetchingCategories,
    isRefetching: isRefetchingCategories,
    refetch: refetchCategory,
  } = useQuery(
    [QUERY_KEY.ATTRIBUTE, searchCategoryDebounce, pageIndex, pageSize],
    async () => {
      const response = await categoryService.getCategoryByCriteria({
        pageSize: pageSize,
        pageIndex: pageIndex - 1,
        name: searchCategoryDebounce,
      })

      return {
        ...response,
        data: (response?.data || [])
          .sort(
            (a: Category, b: Category) =>
              Number(a?.priority) - Number(b?.priority),
          )
          .map((category, index) => ({ ...category, priority: index + 1 })),
      }
    },
    {
      refetchOnWindowFocus: false,
    },
  )

  useEffect(() => {
    if (!isOpenModal) setModal({ isEdit: false })
  }, [isOpenModal])

  const handleOpenModalEdit = (category: Category) => {
    setModal({ isEdit: true, categoryId: category?._id })
    onOpenModal()
  }

  const handleOpenDeleteModal = (category: Category) => {
    setModalDelete({
      id: category?._id,
      desc: `Bạn có chắc muốn xóa danh mục ${category?.name} này không?`,
    })
    onOpenModalDelete()
  }

  const handleOpenModalAddAttribute = () => {
    setModal({})
    onOpenModal()
  }

  const handleDeleteCategory = async () => {
    try {
      setModalDelete((prev) => ({ ...prev, isLoading: true }))
      if (!isQuickDelete.current) {
        await categoryService.deleteCategoryByIds(
          modalDelete?.id ? [modalDelete.id] : [],
        )
      }
      const categoryIds =
        categorySelectedKeys === 'all'
          ? categories?.data?.map((item) => item._id)
          : [...(categorySelectedKeys as any)]
      await categoryService.deleteCategoryByIds(categoryIds)

      enqueueSnackbar('Xóa danh mục thành công!')
    } catch (err) {
      enqueueSnackbar('Có lỗi xảy ra khi xóa danh mục!', {
        variant: 'error',
      })
      console.log(
        '🚀 ~ file: index.tsx:112 ~ handleDeleteAttribute ~ err:',
        err,
      )
    } finally {
      await refetchCategory()
      setModalDelete({})
      onOpenChangeModalDelete()
      setCategorySelectedKeys(new Set())
      isQuickDelete.current = false
    }
  }

  const showModalConfirmQuickDeleteCategory = () => {
    isQuickDelete.current = true
    setModalDelete({
      desc: 'Bạn có chắc muốn xóa tất cả danh mục đã chọn không?',
    })
    onOpenModalDelete()
  }

  return (
    <div>
      <CustomBreadcrumb
        pageName="Danh mục sản phẩm"
        routes={[
          {
            label: 'Danh mục sản phẩm',
          },
        ]}
      />
      <div className="flex justify-between items-end mb-2">
        <Input
          label="Tìm kiếm tên danh mục..."
          size="md"
          className="max-w-[300px] text-md"
          variant="faded"
          value={searchCategory}
          onValueChange={setSearchCategory}
          classNames={{
            inputWrapper: 'bg-white text-md',
            label: 'font-semibold',
            input: 'text-primary-text-color text-md',
          }}
        />
        <Button
          color="primary"
          variant="shadow"
          onClick={handleOpenModalAddAttribute}
        >
          Thêm danh mục
        </Button>
      </div>
      {(categorySelectedKeys == 'all' ||
        (categorySelectedKeys && categorySelectedKeys?.size > 0)) && (
        <Button
          color="danger"
          size="sm"
          className="mb-2"
          onClick={showModalConfirmQuickDeleteCategory}
        >
          Xoá tất cả
        </Button>
      )}
      <CustomTable
        pagination
        rowKey="_id"
        columns={columns}
        data={categories?.data}
        tableName="Danh mục sản phẩm"
        emptyContent="Không có danh mục nào"
        selectedKeys={categorySelectedKeys}
        onSelectionChange={setCategorySelectedKeys}
        totalPage={categories?.totalPage || 0}
        total={categories?.totalElement}
        page={pageIndex}
        rowPerPage={pageSize}
        onChangePage={setPage}
        onChangeRowPerPage={setRowPerPage}
        isLoading={
          isLoadingCategories || isFetchingCategories || isRefetchingCategories
        }
      />
      <CategoryModal
        isOpen={isOpenModal}
        onOpenChange={onOpenChangeModal}
        onRefetch={refetchCategory}
        {...modal}
      />
      <ModalConfirmDelete
        isOpen={isOpenModalDelete}
        onOpenChange={onClose}
        desc={modalDelete?.desc}
        onAgree={handleDeleteCategory}
        isLoading={modalDelete?.isLoading}
      />
    </div>
  )
}

export default Categories
