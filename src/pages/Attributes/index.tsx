import { Button, Tooltip, useDisclosure } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import SVG from 'react-inlinesvg';
import { useState } from 'react';
import { useSnackbar } from 'notistack';

import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable';
import { QUERY_KEY } from '~/constants/queryKey';
import { Attribute } from '~/models/attribute';
import { attributeService } from '~/services/attributeService';
import AttributeModal from './AttributeModal';

import DeleteIcon from '~/assets/svg/delete.svg';
import EyeIcon from '~/assets/svg/eye.svg';
import EditIcon from '~/assets/svg/edit.svg';
import ModalConfirmDelete, { ModalConfirmDeleteState } from '~/components/ModalConfirmDelete';

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
      key: '_id',
      align: 'center',
      name: 'STT',
      render: (_attribute: Attribute, index?: number) => (index || 0) + 1,
    },
    {
      key: 'name',
      align: 'center',
      name: 'Tên thuộc tính',
      render: (attribute: Attribute) => attribute?.name,
    },
    {
      key: 'attributeList',
      align: 'center',
      name: 'Số lượng giá trị',
      render: (attribute: Attribute) => (
        <span className="font-bold">{attribute?.attributeList?.length || 0}</span>
      ),
    },
    {
      key: 'id',
      align: 'center',
      name: 'Hành động',
      render: (attribute: Attribute) => (
        <div className="relative flex items-center gap-2">
          <Tooltip content="Chỉnh sửa thuộc tính" showArrow delay={1500}>
            <span
              className="text-lg text-default-400 cursor-pointer active:opacity-50"
              onClick={() => handleOpenModalEdit(attribute)}
            >
              <SVG src={EditIcon} />
            </span>
          </Tooltip>
          <Tooltip color="danger" content="Xóa thuộc tính này" showArrow delay={1500}>
            <span
              className="text-lg text-danger cursor-pointer active:opacity-50"
              onClick={() => handleOpenDeleteModal(attribute)}
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
      />
      <div className="flex justify-end mb-2">
        <Button color="primary" variant="shadow" onClick={handleOpenModalAddAttribute}>
          Thêm thuộc tính
        </Button>
      </div>
      <CustomTable
        columns={columns}
        data={attributes}
        tableName="Danh sách thuộc tính"
        emptyContent="Không có thuộc tính nào"
        isLoading={isLoadingAttributes || isFetchingAttributes || isRefetchingAttributes}
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
