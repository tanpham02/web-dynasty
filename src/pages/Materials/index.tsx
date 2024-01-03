import { Button, Input, Selection, useDisclosure } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import DeleteIcon from '~/assets/svg/delete.svg';
import EditIcon from '~/assets/svg/edit.svg';
import Box from '~/components/Box';
import ButtonIcon from '~/components/ButtonIcon';
import ModalConfirmDelete, { ModalConfirmDeleteState } from '~/components/ModalConfirmDelete';
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable';
import { QUERY_KEY } from '~/constants/queryKey';
import useDebounce from '~/hooks/useDebounce';
import usePagination from '~/hooks/usePagination';
import { Category } from '~/models/category';
import { Material } from '~/models/materials';
import { categoryService } from '~/services/categoryService';
import materialService from '~/services/materialService';
import { DATE_FORMAT_DDMMYYYY, formatDate } from '~/utils/date.utils';
import { formatCurrencyVND } from '~/utils/number';
import CategoryModal from './CategoryModal';

const MaterialsPage = () => {
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
  const [materialSelectedKeys, setMaterialSelectedKeys] = useState<Selection>();
  const [modal, setModal] = useState<{
    isEdit?: boolean;
    materialId?: string;
  }>();

  const { pageIndex, pageSize, setPage, setRowPerPage } = usePagination();

  const { enqueueSnackbar } = useSnackbar();

  const columns: ColumnType<Category>[] = [
    {
      align: 'center',
      name: 'STT',
      render: (_category: Material, index?: number) => (index || 0) + 1,
    },
    {
      align: 'center',
      name: 'Ngày nhập',
      render: (material: Material) =>
        material?.importDate ? formatDate(material.importDate, DATE_FORMAT_DDMMYYYY) : '',
    },
    {
      align: 'center',
      name: <Box className="flex justify-center">Số lượng nguyên liệu</Box>,
      render: (material: Material) => (
        <Box className="flex justify-center">{material?.materialInfo?.length || 0}</Box>
      ),
    },
    {
      align: 'center',
      name: <Box className="flex justify-center">Tổng giá trị</Box>,
      render: (material: Material) => (
        <Box className="flex justify-center">{formatCurrencyVND(material?.totalPrice || 0)}</Box>
      ),
    },
    {
      align: 'center',
      name: <Box className="flex justify-center">Hành động</Box>,
      render: (material: Material) => (
        <div className="flex justify-center space-x-2">
          <ButtonIcon
            icon={EditIcon}
            title="Chỉnh sửa hóa đơn"
            onClick={() => handleOpenModalEdit(material)}
          />
          <ButtonIcon
            icon={DeleteIcon}
            title="Xóa hóa đơn này"
            onClick={() => handleOpenDeleteModal(material)}
            status="danger"
          />
        </div>
      ),
    },
  ];

  const {
    data: materials,
    isLoading: isLoadingMaterials,
    isFetching: isFetchingMaterials,
    isRefetching: isRefetchingMaterials,
    refetch: refetchMaterials,
  } = useQuery(
    [QUERY_KEY.MATERIALS, pageIndex, pageSize],
    async () =>
      await materialService.searchPagination({
        pageSize: pageSize,
        pageIndex: pageIndex,
      }),
    {
      refetchOnWindowFocus: false,
    },
  );

  const handleOpenModalEdit = (material: Material) => {
    setModal({ isEdit: true, materialId: material?._id });
    onOpenModal();
  };

  const handleOpenDeleteModal = (material: Material) => {
    setModalDelete({
      id: material?._id,
      desc: `Bạn có chắc muốn xóa hóa đơn này  không?`,
    });
    onOpenModalDelete();
  };

  const onOpenAddMaterialModal = () => {
    setModal({});
    onOpenModal();
  };

  const onCloseMaterialDeleteModal = () => {
    setModalDelete({});
    onOpenChangeModalDelete();
  };

  const handleDeleteMaterial = async () => {
    try {
      setModalDelete((prev) => ({ ...prev, isLoading: true }));
      await categoryService.deleteCategoryByIds(modalDelete?.id ? [modalDelete.id] : []);
      enqueueSnackbar('Xóa hóa đơn nhập nguyên liệu thành công!');
    } catch (err) {
      enqueueSnackbar('Có lỗi xảy ra khi xóa hóa đơn nhập nguyên liệu!', {
        variant: 'error',
      });
      console.log('🚀 ~ file: index.tsx:112 ~ handleDeleteMaterial ~ err:', err);
    } finally {
      await refetchMaterials();
      onCloseMaterialDeleteModal();
    }
  };

  return (
    <div>
      <CustomBreadcrumb
        pageName="Danh sách nguyên liệu"
        routes={[
          {
            label: 'Danh sách nguyên liệu',
          },
        ]}
      />
      <div className="flex justify-end items-end mb-2">
        <Button color="primary" variant="shadow" onClick={onOpenAddMaterialModal}>
          Thêm nguyên liệu
        </Button>
      </div>
      <CustomTable
        pagination
        rowKey="_id"
        columns={columns}
        data={materials?.data}
        tableName="Danh sách nguyên liệu"
        emptyContent="Không có nguyên nào nào"
        selectedKeys={materialSelectedKeys}
        onSelectionChange={setMaterialSelectedKeys}
        totalPage={materials?.totalPage || 1}
        total={materials?.totalElement}
        page={pageIndex + 1}
        rowPerPage={pageSize}
        onChangePage={setPage}
        onChangeRowPerPage={setRowPerPage}
        isLoading={isLoadingMaterials || isFetchingMaterials || isRefetchingMaterials}
      />
      <CategoryModal
        isOpen={isOpenModal}
        onOpenChange={onOpenChangeModal}
        onRefetch={refetchMaterials}
        {...modal}
      />
      <ModalConfirmDelete
        isOpen={isOpenModalDelete}
        onOpenChange={onOpenChangeModalDelete}
        desc={modalDelete?.desc}
        onAgree={handleDeleteMaterial}
        isLoading={modalDelete?.isLoading}
      />
    </div>
  );
};

export default MaterialsPage;
