import { Button, Selection, useDisclosure } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { DatePicker } from 'antd';
import { Moment } from 'moment';

import DeleteIcon from '~/assets/svg/delete.svg';
import EditIcon from '~/assets/svg/edit.svg';
import Box from '~/components/Box';
import ButtonIcon from '~/components/ButtonIcon';
import ModalConfirmDelete, { ModalConfirmDeleteState } from '~/components/ModalConfirmDelete';
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable';
import { QUERY_KEY } from '~/constants/queryKey';
import usePagination from '~/hooks/usePagination';
import { Category } from '~/models/category';
import { Material } from '~/models/materials';
import materialService from '~/services/materialService';
import { DATE_FORMAT_DDMMYYYY, formatDate } from '~/utils/date.utils';
import { formatCurrencyVND } from '~/utils/number';
import MaterialModal from './MaterialModal';

const OrderPage = () => {
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
  const [filterImportDate, setFilterImportDate] = useState<Moment[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const columns: ColumnType<Category>[] = [
    {
      align: 'center',
      name: 'STT',
      render: (_category: Material, index?: number) => (index || 0) + 1 + (pageIndex - 1) * 10,
    },
    {
      align: 'center',
      name: 'Ngày nhập',
      render: (material: Material) =>
        material?.importDate ? formatDate(material.importDate as string, DATE_FORMAT_DDMMYYYY) : '',
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
    [QUERY_KEY.MATERIALS, pageIndex, pageSize, filterImportDate],
    async () =>
      await materialService.searchPagination({
        pageSize: pageSize,
        pageIndex: pageIndex - 1,
        from: filterImportDate?.[0]?.toString(),
        to: filterImportDate?.[1]?.toString(),
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
      desc: `Bạn có chắc muốn xóa hóa đơn nhập hàng này không?`,
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
      await materialService.delete(modalDelete?.id);
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

  const handleChangeFilterImportDate = (e: [Moment, Moment]) => {
    console.log('🚀 ~ file: index.tsx:154 ~ handleChangeFilterImportDate ~ e:', e);
    if (e) {
      const [start, end] = e;
      setFilterImportDate([start, end]);
    } else {
      setFilterImportDate([]);
    }
  };

  return (
    <div>
      <CustomBreadcrumb
        pageName="Danh sách đơn hàng"
        routes={[
          {
            label: 'Danh sách đơn hàng',
          },
        ]}
      />
      <div className="flex justify-between items-end mb-2">
        <DatePicker.RangePicker
          size="small"
          className="max-w-[300px]"
          value={
            Array.isArray(filterImportDate) && filterImportDate.length === 2
              ? [filterImportDate[0], filterImportDate[1]]
              : undefined
          }
          onChange={(range) => handleChangeFilterImportDate(range as [Moment, Moment])}
        />
        <Button color="primary" variant="shadow" onClick={onOpenAddMaterialModal}>
          Thêm đơn hàng mới
        </Button>
      </div>
      <CustomTable
        pagination
        rowKey="_id"
        selectionMode="none"
        columns={columns}
        data={materials?.data}
        tableName="Danh sách đơn hàng"
        emptyContent="Không có đơn hàng nào"
        selectedKeys={materialSelectedKeys}
        onSelectionChange={setMaterialSelectedKeys}
        totalPage={materials?.totalPage || 0}
        total={materials?.totalElement}
        page={pageIndex}
        rowPerPage={pageSize}
        onChangePage={setPage}
        onChangeRowPerPage={setRowPerPage}
        isLoading={isLoadingMaterials || isFetchingMaterials || isRefetchingMaterials}
      />
      <MaterialModal
        isOpen={isOpenModal}
        onOpenChange={onOpenChangeModal}
        {...modal}
        onRefetch={refetchMaterials}
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

export default OrderPage;
