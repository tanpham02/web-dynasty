import {
  Button,
  Chip,
  Input,
  Selection,
  Tooltip,
  useDisclosure,
  usePagination,
} from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import SVG from 'react-inlinesvg';

import DeleteIcon from '~/assets/svg/delete.svg';
import EditIcon from '~/assets/svg/edit.svg';
import ModalConfirmDelete, { ModalConfirmDeleteState } from '~/components/ModalConfirmDelete';
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable';
import { QUERY_KEY } from '~/constants/queryKey';
import useDebounce from '~/hooks/useDebounce';
import { Category, CategoryStatus } from '~/models/category';
import { categoryService } from '~/services/categoryService';
import CategoryModal from './CategoryModal';

const Categories = () => {
  const {
    isOpen: isOpenModal,
    onOpen: onOpenModal,
    onOpenChange: onOpenChangeModal,
  } = useDisclosure();

  const {
    isOpen: isOpenModalDelete,
    onOpen: onOpenModalDelete,
    onOpenChange: onOpenChangeModalDelete,
  } = useDisclosure();

  const [modalDelete, setModalDelete] = useState<ModalConfirmDeleteState>();
  const [searchCategory, setSearchCategory] = useState<string>('');
  const [categorySelectedKeys, setCategorySelectedKeys] = useState<Selection>();
  const [modal, setModal] = useState<{
    isEdit?: boolean;
    categoryId?: string;
  }>();
  const { setPage, total, activePage } = usePagination({
    page: 0,
    total: 100,
  });
  const { enqueueSnackbar } = useSnackbar();

  const searchCategoryDebounce = useDebounce(searchCategory, 500);

  const columns: ColumnType<Category>[] = [
    {
      key: '_id',
      align: 'center',
      name: 'STT',
      render: (_category: Category, index?: number) => (index || 0) + 1,
    },
    {
      key: 'name',
      align: 'center',
      name: 'Tên danh mục',
      render: (category: Category) => category?.name,
    },
    {
      key: 'products',
      align: 'center',
      name: 'Số lượng sản phẩm',
      render: (category: Category) => category?.products?.length || 0,
    },
    {
      key: 'priority',
      align: 'center',
      name: 'Thứ tự hiển thị',
      render: (category: Category) => category?.priority || 0,
    },
    {
      key: 'status',
      align: 'center',
      name: 'Trạng thái',
      render: (category: Category) => (
        <Chip
          color={category?.status === CategoryStatus.ACTIVE ? 'success' : 'danger'}
          variant="flat"
          classNames={{
            content: 'font-semibold',
          }}
        >
          {category?.status === CategoryStatus.ACTIVE ? 'Đang kinh doanh' : 'Ngưng kinh doanh'}
        </Chip>
      ),
    },
    {
      key: '_id',
      align: 'center',
      name: 'Hành động',
      render: (category: Category) => (
        <div className="relative flex items-center gap-3">
          <Tooltip content="Chỉnh sửa thuộc tính" showArrow>
            <span
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
              onClick={() => handleOpenModalEdit(category)}
            >
              <SVG src={EditIcon} />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Xóa thuộc tính này" showArrow>
            <span
              className="text-lg text-danger cursor-pointer active:opacity-50"
              onClick={() => handleOpenDeleteModal(category)}
            >
              <SVG src={DeleteIcon} />
            </span>
          </Tooltip>
        </div>
      ),
    },
  ];

  const {
    data: attributes,
    isLoading: isLoadingAttributes,
    isFetching: isFetchingAttributes,
    isRefetching: isRefetchingAttributes,
    refetch: refetchCategory,
  } = useQuery(
    [QUERY_KEY.ATTRIBUTE, searchCategoryDebounce, activePage],
    async () =>
      await categoryService.getCategoryByCriteria({
        pageSize: 10,
        pageIndex: 0,
        name: searchCategoryDebounce,
      }),
    {
      refetchOnWindowFocus: false,
    },
  );

  const handleOpenDeleteModal = (category: Category) => {
    setModalDelete({
      id: category?._id,
      desc: `Bạn có chắc muốn xóa danh mục ${category?.name} này không?`,
    });
    onOpenModalDelete();
  };

  

  const handleOpenModalAddAttribute = () => {
    setModal({});
    onOpenModal();
  };

  const handleDeleteAttribute = async () => {
    try {
      setModalDelete((prev) => ({ ...prev, isLoading: true }));
      await categoryService.deleteCategoryByIds(modalDelete?.id ? [modalDelete.id] : []);
      enqueueSnackbar('Xóa danh mục thành công!');
    } catch (err) {
      enqueueSnackbar('Có lỗi xảy ra khi xóa danh mục!', {
        variant: 'error',
      });
      console.log('🚀 ~ file: index.tsx:112 ~ handleDeleteAttribute ~ err:', err);
    } finally {
      await refetchCategory();
      setModalDelete({});
      onOpenChangeModalDelete();
    }
  };

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
          size="sm"
          className="max-w-[250px]"
          color="primary"
          variant="bordered"
          value={searchCategory}
          onValueChange={setSearchCategory}
        />
        <Button color="primary" variant="shadow" onClick={handleOpenModalAddAttribute}>
          Thêm danh mục
        </Button>
      </div>
      <CustomTable
        pagination
        columns={columns}
        data={attributes?.data}
        tableName="Danh mục sản phẩm"
        emptyContent="Không có danh mục nào"
        selectedKeys={categorySelectedKeys}
        onSelectionChange={setCategorySelectedKeys}
        isLoading={isLoadingAttributes || isFetchingAttributes || isRefetchingAttributes}
        totalPage={total}
        onChangePage={setPage}
      />
      <CategoryModal
        isOpen={isOpenModal}
        onOpenChange={onOpenChangeModal}
        onRefetch={refetchCategory}
        {...modal}
      />
      <ModalConfirmDelete
        isOpen={isOpenModalDelete}
        onOpenChange={onOpenChangeModalDelete}
        desc={modalDelete?.desc}
        onAgree={handleDeleteAttribute}
        isLoading={modalDelete?.isLoading}
      />
    </div>
  );
};

export default Categories;
