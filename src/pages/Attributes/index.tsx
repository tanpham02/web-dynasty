import { Button, useDisclosure } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable';
import { QUERY_KEY } from '~/constants/queryKey';
import { Attribute } from '~/models/attribute';
import { attributeService } from '~/services/attributeService';
import AttributeModal from './AttributeModal';

import DeleteIcon from '~/assets/svg/delete.svg';
import EditIcon from '~/assets/svg/edit.svg';
import Box from '~/components/Box';
import ButtonIcon from '~/components/ButtonIcon';
import ModalConfirmDelete, { ModalConfirmDeleteState } from '~/components/ModalConfirmDelete';
import { DATE_FORMAT_DDMMYYYY, formatDate } from '~/utils/date.utils';

const Attributes = () => {
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
  const [modal, setModal] = useState<{
    isEdit?: boolean;
    attributeId?: string;
  }>();

  const { enqueueSnackbar } = useSnackbar();

  const columns: ColumnType<Attribute>[] = [
    {
      align: 'center',
      name: 'STT',
      render: (_attribute: Attribute, index?: number) => (index || 0) + 1,
    },
    {
      align: 'center',
      name: 'Tên thuộc tính',
      render: (attribute: Attribute) => attribute?.name,
    },
    {
      align: 'center',
      name: <Box className="flex justify-center">Số lượng giá trị</Box>,
      render: (attribute: Attribute) => (
        <Box className="flex justify-center">{attribute?.attributeList?.length || 0}</Box>
      ),
    },
    {
      align: 'center',
      name: <Box className="flex justify-center">Ngày tạo</Box>,
      render: (attribute: Attribute) => (
        <Box className="flex justify-center">
          {attribute.createdAt ? formatDate(attribute?.createdAt, DATE_FORMAT_DDMMYYYY) : ''}
        </Box>
      ),
    },
    {
      align: 'center',
      name: <Box className="flex justify-center">Hành động</Box>,
      render: (attribute: Attribute) => (
        <div className="flex items-center justify-center space-x-2">
          <ButtonIcon
            title="Chỉnh sửa thuộc tính"
            icon={EditIcon}
            onClick={() => handleOpenModalEdit(attribute)}
          />
          <ButtonIcon
            icon={DeleteIcon}
            onClick={() => handleOpenDeleteModal(attribute)}
            title="Xóa thuộc tính này"
            status="danger"
          />
        </div>
      ),
    },
  ];

  const {
    data: attributes,
    isLoading: isLoadingAttributes,
    isFetching: isFetchingAttributes,
    isRefetching: isRefetchingAttributes,
    refetch: refetchAttributes,
  } = useQuery([QUERY_KEY.ATTRIBUTE], async () => await attributeService.getAllAttributes(), {
    refetchOnWindowFocus: false,
  });

  const handleOpenDeleteModal = (attribute: Attribute) => {
    setModalDelete({
      id: attribute?._id,
      desc: `Bạn có chắc muốn xóa thuộc tính ${attribute?.name} này không?`,
    });
    onOpenModalDelete();
  };

  const handleOpenModalEdit = (attribute: Attribute) => {
    console.log('🚀 ~ file: index.tsx:129 ~ handleOpenModal ~ attribute:', attribute);
    setModal({ isEdit: true, attributeId: attribute?._id });
    onOpenModal();
  };

  const handleOpenModalAddAttribute = () => {
    setModal({});
    onOpenModal();
  };

  const handleDeleteAttribute = async () => {
    try {
      setModalDelete((prev) => ({ ...prev, isLoading: true }));
      await attributeService.deleteAttribute(modalDelete?.id ? [modalDelete.id] : []);
      enqueueSnackbar('Xóa thuộc tính thành công!');
    } catch (err) {
      enqueueSnackbar('Có lỗi xảy ra khi xóa thuộc tính!', {
        variant: 'error',
      });
      console.log('🚀 ~ file: index.tsx:112 ~ handleDeleteAttribute ~ err:', err);
    } finally {
      await refetchAttributes();
      setModalDelete({});
      onOpenChangeModalDelete();
    }
  };

  return (
    <div>
      <CustomBreadcrumb
        pageName="Danh sách thuộc tính"
        routes={[
          {
            label: 'Danh sách thuộc tính',
          },
        ]}
        renderRight={
          <Button color="primary" variant="shadow" onClick={handleOpenModalAddAttribute}>
            Thêm thuộc tính
          </Button>
        }
      />
      <CustomTable
        columns={columns}
        data={attributes}
        tableName="Danh sách thuộc tính"
        emptyContent="Không có thuộc tính nào"
        isLoading={isLoadingAttributes || isFetchingAttributes || isRefetchingAttributes}
        total={attributes?.length || 0}
      />
      <AttributeModal
        isOpen={isOpenModal}
        onOpenChange={onOpenChangeModal}
        onRefetch={refetchAttributes}
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

export default Attributes;
