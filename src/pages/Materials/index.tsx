import { Button, Selection, useDisclosure } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { DatePicker } from 'antd';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Moment } from 'moment';
import { useSnackbar } from 'notistack';
import { useId, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { pdf } from '@react-pdf/renderer';

import DeleteIcon from '~/assets/svg/delete.svg';
import EditIcon from '~/assets/svg/edit.svg';
import Box from '~/components/Box';
import ButtonIcon from '~/components/ButtonIcon';
import ModalConfirmDelete, { ModalConfirmDeleteState } from '~/components/ModalConfirmDelete';
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable';
import { QUERY_KEY } from '~/constants/queryKey';
import usePagination from '~/hooks/usePagination';
import { Material } from '~/models/materials';
import materialService from '~/services/materialService';
import { DATE_FORMAT_DDMMYYYY, formatDate } from '~/utils/date.utils';
import { formatCurrencyVND } from '~/utils/number';
import MaterialModal from './MaterialModal';
import { globalLoading } from '~/components/GlobalLoading';
import MaterialDetail from './MaterialDetail';

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
  const [filterImportDate, setFilterImportDate] = useState<Moment[]>([]);

  const { enqueueSnackbar } = useSnackbar();

  const containerRef = useRef<HTMLDivElement>(null);

  const containerId = useId();

  const columns: ColumnType<Material>[] = [
    {
      name: 'STT',
      render: (_category: Material, index?: number) => (index || 0) + 1 + (pageIndex - 1) * 10,
    },
    {
      name: 'Ngày nhập',
      render: (material: Material) =>
        material?.importDate ? formatDate(material.importDate as string, DATE_FORMAT_DDMMYYYY) : '',
    },
    {
      name: <Box className="flex justify-center">Số lượng nguyên liệu</Box>,
      render: (material: Material) => (
        <Box className="flex justify-center">{material?.materialInfo?.length || 0}</Box>
      ),
    },
    {
      name: <Box className="flex justify-end">Tổng giá trị</Box>,
      render: (material: Material) => (
        <Box className="flex justify-end">{formatCurrencyVND(material?.totalPrice || 0)}</Box>
      ),
    },
    {
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

  const handleChangeFilterImportDate = (range: [Moment, Moment]) => {
    if (Array.isArray(range) && range.length === 2) {
      const [start, end] = range;
      setFilterImportDate([start, end]);
    } else {
      setFilterImportDate([]);
    }
  };

  const handleDownload = async () => {
    try {
      globalLoading.show();
      const blob = await pdf(<MaterialDetail />).toBlob();
      var data = new Blob([blob], { type: 'pdf' });
      var csvURL = window.URL.createObjectURL(data);
      const tempLink = document.createElement('a');
      tempLink.href = csvURL;
      tempLink.setAttribute('download', 'filename.pdf');
      tempLink.click();
    } catch (err) {
      enqueueSnackbar('Oops! Có lỗi xảy ra khi xuất hóa đơn nhập hàng!', {
        variant: 'error',
      });
    } finally {
      setTimeout(() => {
        globalLoading.hide();
      }, 3000);
    }
  };

  return (
    <Box ref={containerRef} id={containerId} className="p-4">
      <CustomBreadcrumb
        pageName="Danh sách nguyên liệu"
        routes={[
          {
            label: 'Danh sách nguyên liệu',
          },
        ]}
      />
      <Box className="flex justify-between items-end mb-2">
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
        <Button onClick={handleDownload}>Click me</Button>
        <Button color="primary" variant="shadow" onClick={onOpenAddMaterialModal}>
          Thêm nguyên liệu
        </Button>
      </Box>
      <CustomTable
        pagination
        rowKey="_id"
        columns={columns}
        data={materials?.data}
        tableName="Danh sách nguyên liệu"
        emptyContent="Không có hóa đơn nhập hàng nào"
        selectedKeys={materialSelectedKeys}
        onSelectionChange={setMaterialSelectedKeys}
        totalPage={materials?.totalPage || 0}
        // total={materials?.totalElement}
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
    </Box>
  );
};

export default MaterialsPage;
