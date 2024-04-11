import { Button, Selection, useDisclosure } from '@nextui-org/react';
import { pdf } from '@react-pdf/renderer';
import { useQuery } from '@tanstack/react-query';
import { DatePicker } from 'antd';
import moment, { Moment } from 'moment';
import { useSnackbar } from 'notistack';
import { useId, useMemo, useRef, useState } from 'react';

import DeleteIcon from '~/assets/svg/delete.svg';
import EditIcon from '~/assets/svg/edit.svg';
import DownloadIcon from '~/assets/svg/download.svg';
import Box from '~/components/Box';
import ButtonIcon from '~/components/ButtonIcon';
import { globalLoading } from '~/components/GlobalLoading';
import ModalConfirmDelete, { ModalConfirmDeleteState } from '~/components/ModalConfirmDelete';
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable';
import { QUERY_KEY } from '~/constants/queryKey';
import usePagination from '~/hooks/usePagination';
import { Material } from '~/models/materials';
import materialService from '~/services/materialService';
import { DATE_FORMAT_DDMMYYYY, DATE_FORMAT_YYYYMMDD, formatDate } from '~/utils/date.utils';
import { formatCurrencyVND } from '~/utils/number';
import MaterialBillDetail from './MaterialBillDetail';
import MaterialModal from './MaterialModal';
import { SearchParams } from '~/types';

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
      name: <Box className="flex justify-end mr-4">Hành động</Box>,
      render: (material: Material) => {
        const isDisableEdit = !(moment().month() == moment(material?.importDate).month());

        return (
          <div className="flex justify-end space-x-2">
            <ButtonIcon
              disable={isDisableEdit}
              icon={EditIcon}
              title={
                isDisableEdit ? 'Bạn chỉ có thể sửa hóa đơn tháng hiện tại' : 'Chỉnh sửa hóa đơn'
              }
              onClick={() => handleOpenModalEdit(material)}
            />
            <ButtonIcon
              icon={DownloadIcon}
              title="Xuất hóa đơn"
              onClick={() => handleDownload(material)}
            />
            <ButtonIcon
              icon={DeleteIcon}
              disable={isDisableEdit}
              title={
                isDisableEdit ? 'Bạn chỉ có thể xóa hóa đơn tháng hiện tại' : 'Xóa hóa đơn này'
              }
              onClick={() => handleOpenDeleteModal(material)}
              status="danger"
            />
          </div>
        );
      },
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
    async () => {
      let params: SearchParams = {
        pageSize: 20,
        pageIndex: pageIndex - 1,
      };

      if (filterImportDate.length > 0) {
        params = {
          ...params,
          from: moment(filterImportDate?.[0]?.toString()).format(DATE_FORMAT_YYYYMMDD),
          to: moment(filterImportDate?.[1]?.toString()).format(DATE_FORMAT_YYYYMMDD),
        };
      }

      return await materialService.searchPagination(params);
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const isExistingBillInMonth = useMemo(() => {
    if (Array.isArray(materials?.data) && materials.data.length > 0) {
      const currentMonth = moment().month();

      return materials?.data?.some(
        (material) => moment(material?.importDate).month() == currentMonth,
      );
    }

    return false;
  }, [materials]);

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

  const handleDownload = async (billData?: Material) => {
    if (billData && Object.keys(billData).length > 0)
      try {
        globalLoading.show();
        const blob = await pdf(<MaterialBillDetail data={billData} />).toBlob();
        var data = new Blob([blob], { type: 'pdf' });
        var pdfURL = window.URL.createObjectURL(data);
        const tempLink = document.createElement('a');
        tempLink.href = pdfURL;
        tempLink.setAttribute(
          'download',
          `hoa-don-nhap-hang-thang-${moment(billData?.importDate).month() + 1}.pdf`,
        );
        tempLink.click();
        ('filename.pdf');
      } catch (err) {
        enqueueSnackbar('Oops! Có lỗi xảy ra khi xuất hóa đơn nhập hàng!', {
          variant: 'error',
        });
      } finally {
        setTimeout(() => {
          globalLoading.hide();
        }, 1500);
      }
  };

  return (
    <Box ref={containerRef} id={containerId} className="p-4">
      <CustomBreadcrumb
        pageName="Danh sách hóa đơn nhập hàng"
        routes={[
          {
            label: 'Danh sách hóa đơn nhập hàng',
          },
        ]}
      />
      <Box className="flex justify-between items-end mb-2">
        <DatePicker.RangePicker
          size="middle"
          className="max-w-[300px]"
          value={
            Array.isArray(filterImportDate) && filterImportDate.length === 2
              ? [filterImportDate[0], filterImportDate[1]]
              : undefined
          }
          onChange={(range) => handleChangeFilterImportDate(range as [Moment, Moment])}
        />
         {!isExistingBillInMonth && ( 
        <Button color="primary" variant="shadow" onClick={onOpenAddMaterialModal}>
          Thêm nguyên liệu
        </Button>
        )} 
      </Box>
      <CustomTable
        rowKey="_id"
        columns={columns}
        data={materials?.data}
        tableName="Danh sách hóa đơn nhập hàng"
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
