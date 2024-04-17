import { Button, Input, Selection, useDisclosure } from '@nextui-org/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useState } from 'react';

import DeleteIcon from '~/assets/svg/delete.svg';
import EditIcon from '~/assets/svg/edit.svg';
import Box from '~/components/Box';
import ButtonIcon from '~/components/ButtonIcon';
import ModalConfirmDelete, {
  ModalConfirmDeleteState,
} from '~/components/ModalConfirmDelete';
import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable';
import { QUERY_KEY } from '~/constants/queryKey';
import useDebounce from '~/hooks/useDebounce';
import usePagination from '~/hooks/usePagination';
import { StoreModel } from '~/models/store';
import { storeService } from '~/services/storeService';
import FormStoreModal from './components/FormStoreModal';

const StorePage = () => {
  const columns: ColumnType<StoreModel>[] = [
    {
      align: 'center',
      name: 'STT',
      render: (_product: StoreModel, index?: number) =>
        (index || 0) + 1 + (pageIndex - 1) * 10,
    },
    {
      align: 'center',
      name: 'Tên cửa hàng',
      render: (store: StoreModel) => (
        <span className="line-clamp-1">{store?.name}</span>
      ),
    },
    {
      align: 'center',
      name: 'Số điện thoại',
      render: (store: StoreModel) => (
        <span className="line-clamp-1">{store?.phone}</span>
      ),
    },
    {
      align: 'center',
      name: 'Địa chỉ',
      render: (store: StoreModel) =>
        [store?.location, store?.ward, store?.district, store?.city]
          ?.filter((value) => Boolean(value))
          .join(', '),
    },
    {
      align: 'center',
      name: 'Hành động',
      render: (record: StoreModel) => (
        <Box className="space-x-2">
          <ButtonIcon
            title="Chỉnh sửa thông tin cửa hàng"
            icon={EditIcon}
            onClick={() => {
              setStoreUpdateId(record?._id);
              onOpenChangeModalCreate();
            }}
          />
          <ButtonIcon
            title="Xóa sản cửa hàng này"
            icon={DeleteIcon}
            status="danger"
            onClick={() => onDeleteStore(record)}
          />
        </Box>
      ),
    },
  ];

  const [valueSearch, setValueSearch] = useState<string>('');

  const [storeSelectedKeys, setStoreSelectedKeys] = useState<Selection>();

  const [storeUpdateId, setStoreUpdateId] = useState<string>();

  const { isOpen: isOpenModalDelete, onOpenChange: onOpenChangeModalDelete } =
    useDisclosure();

  const { isOpen: isOpenModalCreate, onOpenChange: onOpenChangeModalCreate } =
    useDisclosure();

  const [modalDelete, setModalDelete] = useState<ModalConfirmDeleteState>({});

  const { pageIndex, pageSize, setPage, setRowPerPage } = usePagination();

  const { enqueueSnackbar } = useSnackbar();

  const queryText = useDebounce(valueSearch, 700);

  const onDeleteStore = (store?: StoreModel) => {
    if (store && Object.keys(store).length > 0)
      setModalDelete({
        id: store?._id,
        desc: `Bạn có chắc muốn xóa cửa hàng ${store?.name} này không?`,
      });
    else
      setModalDelete({
        desc: `Bạn có chắc muốn xóa tất cả cửa hàng đã chọn không?`,
      });
    onOpenChangeModalDelete();
  };

  const {
    data: storeList,
    isLoading: isLoadingStoreList,
    refetch: refetchStoreList,
  } = useQuery(
    [QUERY_KEY.STORES, pageIndex, pageSize, queryText],
    async () => {
      const params = {
        pageIndex: pageIndex - 1,
        pageSize,
        name: queryText,
      };
      return await storeService.searchStoreByCriteria(params);
    },
    {
      refetchOnWindowFocus: false,
    },
  );

  const { isLoading: isDeletingStore, mutate: deleteStore } = useMutation({
    mutationKey: [QUERY_KEY.STORES_DELETE],
    mutationFn: async () => {
      try {
        let storeIds = [];

        if (storeSelectedKeys && storeSelectedKeys === 'all') {
          storeIds =
            storeList?.data
              ?.filter((store) => Boolean(store?._id))
              ?.map((store) => store?._id as string) || [];
        } else {
          storeIds = [...(storeSelectedKeys || [])];
          modalDelete?.id && storeIds.push(modalDelete.id);
        }

        await storeService.deleteByIds(storeIds as string[]);
        enqueueSnackbar('Xóa cửa hàng thành công!');
      } catch (err) {
        enqueueSnackbar('Xóa cửa hàng không thành công!', {
          variant: 'error',
        });
        console.log('🚀 ~ file: index.tsx:140 ~ mutationFn: ~ err:', err);
      } finally {
        await refetchStoreList();
        onCloseModalDeleteStore();
      }
    },
  });

  const onCloseModalDeleteStore = () => {
    setStoreSelectedKeys(new Set());
    onOpenChangeModalDelete();
  };

  return (
    <Box>
      <CustomBreadcrumb
        pageName="Danh sách cửa hàng"
        routes={[
          {
            label: 'Danh sách cửa hàng',
          },
        ]}
      />
      <Box className="flex justify-between items-center mb-2">
        <Input
          size="md"
          variant="faded"
          label="Tìm kiếm theo tên cửa hàng..."
          classNames={{
            inputWrapper: 'bg-white',
            label: 'font-semibold',
            input: 'text-primary-text-color text-md',
          }}
          className="max-w-[300px]"
          value={valueSearch}
          onValueChange={setValueSearch}
        />
        <Button
          color="primary"
          variant="shadow"
          onClick={onOpenChangeModalCreate}
        >
          Thêm cửa hàng mới
        </Button>
      </Box>
      {(storeSelectedKeys == 'all' ||
        (storeSelectedKeys && storeSelectedKeys?.size > 0)) && (
        <Button
          color="danger"
          size="sm"
          className="mb-2"
          onClick={() => onDeleteStore()}
        >
          Xoá tất cả
        </Button>
      )}
      <CustomTable
        rowKey="_id"
        selectedKeys={storeSelectedKeys}
        onSelectionChange={setStoreSelectedKeys}
        columns={columns}
        data={storeList?.data || []}
        isLoading={isLoadingStoreList}
        emptyContent="Không có cửa hàng nào"
        tableName="Danh sách cửa hàng"
        pagination={true}
        page={pageIndex}
        rowPerPage={pageSize}
        onChangePage={setPage}
        onChangeRowPerPage={setRowPerPage}
        totalPage={storeList?.totalPage || 0}
        total={storeList?.totalElement || 0}
      />
      <ModalConfirmDelete
        desc={modalDelete?.desc}
        isOpen={isOpenModalDelete}
        isLoading={isDeletingStore}
        onAgree={deleteStore}
        onOpenChange={onCloseModalDeleteStore}
      />
      <FormStoreModal
        isOpen={isOpenModalCreate}
        onClose={() => {
          setStoreUpdateId('');
          onOpenChangeModalCreate();
        }}
        storeId={storeUpdateId}
        refetchData={refetchStoreList}
      />
    </Box>
  );
};

export default StorePage;
