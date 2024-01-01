/* eslint-disable react-refresh/only-export-components */
import SVG from 'react-inlinesvg';
import SEARCH_ICON from '~ assets/svg/search.svg';
import SelectCustom from '~/components/customs/Select';
import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '~/constants/queryKey';
import { Button, Modal, Skeleton, Space, TablePaginationConfig } from 'antd';
import useDebounce from '~/hooks/useDebounce';
import trash from '~/assets/svg/trash.svg';
import { SearchParams } from '~/types';
import VoucherModal, { ModalType } from './VoucherModal';
import VoucherTable from './VoucherTable';
import {
  Voucher,
  VoucherOverriding,
  VoucherPromotionType,
  VoucherSaleScope,
  VoucherStatus,
} from '~/models/voucher';
import { voucherService } from '~/services/voucherService';
import { toast } from 'react-hot-toast';
import VoucherForNewCustomerModal from './VoucherForNewCustomerModal';
import { data } from 'autoprefixer';
import Loading from '~/components/GlobalLoading';

export interface ModalKey {
  visible?: boolean;
  type?: ModalType;
  voucher?: VoucherOverriding;
}

export const optionStatus = [
  {
    value: '',
    label: 'Tất cả',
  },
  {
    value: VoucherStatus.IN_COMING,
    label: 'Sắp diễn ra',
  },
  {
    value: VoucherStatus.ACTIVE,
    label: 'Đang diễn ra',
  },
  {
    value: VoucherStatus.IN_ACTIVE,
    label: 'Đã kết thúc',
  },
];

export const optionSaleScope = [
  {
    value: '',
    label: 'Tất cả',
  },
  {
    value: VoucherSaleScope.ALL,
    label: 'Toàn shop',
  },
  {
    value: VoucherSaleScope.PRODUCT,
    label: 'Theo sản phẩm',
  },
];

export const promotionType = [
  {
    value: '',
    label: 'Tất cả',
  },
  {
    value: VoucherPromotionType.SALE,
    label: 'Giảm giá',
  },
  // {
  //   value: VoucherPromotionType.RECEIVE_MONEY,
  //   label: 'Hoàn tiền',
  // },
];

const VoucherListPage = () => {
  const [showDeleteVoucherModal, setShowDeleteVoucherModal] = useState<boolean>(false);
  const [voucherModal, setVoucherModal] = useState<ModalKey>({
    visible: false,
  });
  const [voucherForNewCustomerModal, setVoucherForNewCustomerModal] = useState<ModalKey>({
    visible: false,
  });
  const [searchText, setSearchText] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<VoucherStatus | string>('');
  const [filterScope, setFilterScope] = useState<VoucherSaleScope | string>('');
  const [filterPromotionType, setFilterPromotionType] = useState<VoucherPromotionType | string>('');
  const [listIdsVoucherForDelete, setListIdsVoucherForDelete] = useState<React.Key[]>([]);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const [pagination, setPagination] = useState<SearchParams>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [listProductIdInVoucher, setListProductIDInVoucher] = useState<string[]>([]);

  const search = useDebounce(searchText, 500);
  const status = useDebounce(filterStatus, 500);
  const scope = useDebounce(filterScope, 500);
  const promotion = useDebounce(filterPromotionType, 500);

  const {
    data: vouchers,
    refetch,
    isLoading: isLoadingVoucher,
  } = useInfiniteQuery([QUERY_KEY.VOUCHER], async () => {
    const params = {
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
    };
    return await voucherService.searchVoucher(params);
  });

  const handleShowModalDeleteVoucher = () => {
    setShowDeleteVoucherModal(true);
  };

  const handleGetPagination = (paginationFromTable: TablePaginationConfig) => {
    if (paginationFromTable.current && pagination.pageSize)
      setPagination({
        pageIndex: paginationFromTable.current - 1,
        pageSize: paginationFromTable.pageSize,
      });
  };

  const handleOk = () => {
    handleDeleteVoucher(listIdsVoucherForDelete);
  };

  const handleCancel = () => {
    setShowDeleteVoucherModal(false);
  };

  useEffect(() => {
    if (vouchers) {
      if (vouchers?.pages?.[0]?.data?.length <= 0) {
        setPagination((prev) => ({
          ...prev,
          pageIndex: prev?.pageIndex && prev?.pageIndex - 1,
        }));
      }
    }
  }, [vouchers]);

  const handleShowModalVoucher = async (type?: ModalType, voucherId?: string) => {
    if (voucherId) {
      const voucherAfterFindById = await voucherService.findVoucherById(voucherId);
      setVoucherModal({
        type,
        voucher: voucherAfterFindById,
        visible: true,
      });
    } else {
      setVoucherModal({
        type,
        visible: true,
      });
    }
  };

  const handleShowVoucherForNewCustomer = async (type?: ModalType, voucherId?: string) => {
    if (voucherId) {
      const voucherAfterFindById = await voucherService.findVoucherById(voucherId);
      setVoucherForNewCustomerModal({
        type,
        voucher: voucherAfterFindById,
        visible: true,
      });
    } else {
      setVoucherForNewCustomerModal({
        type,
        visible: true,
      });
    }
  };

  useEffect(() => {
    setListProductIDInVoucher(
      voucherModal.voucher?.listProductUsedVoucher?.map((itemId) =>
        itemId?._id ? itemId?._id : '',
      ) as string[],
    );
  }, [voucherModal.voucher]);

  const handleDeleteVoucher = async (ids: any) => {
    setIsLoadingDelete(true);
    try {
      await voucherService.deleteVoucher(ids);
      toast.success('Xóa thành công', {
        position: 'bottom-right',
        duration: 3000,
        icon: '👏',
        style: { width: '70%' },
      });

      setIsLoadingDelete(false);
      if (Array.isArray(ids)) {
        setListIdsVoucherForDelete([]);
        if (!isLoadingDelete) {
          setShowDeleteVoucherModal(false);
        }
      }
      refetch();
    } catch (err) {
      console.log(err);
      toast.success('Xóa thất bại', {
        position: 'bottom-right',
        duration: 3500,
        icon: '😔',
      });
    }
  };

  return (
    <>
      <div className="flex flex-row justify-between items-center gap-2 w-full">
        <span className="font-bold text-title-xl block pb-2">Danh sách mã giảm giá</span>
        <Space size={10}>
          {/* <button
            className='rounded-lg bg-meta-8 px-4 py-2 font-normal text-white'
            onClick={() => handleShowVoucherForNewCustomer(ModalType.CREATE)}
          >
            Thêm voucher cho người mới
          </button> */}
          <button
            className="rounded-lg bg-primary px-4 py-2 font-normal text-white"
            onClick={() => handleShowModalVoucher(ModalType.CREATE)}
          >
            Thêm mã giảm giá
          </button>
        </Space>
      </div>

      <div className="mb-2 flex flex-row justify-between flex-wrap  items-center gap-2">
        <div className="flex items-center flex-wrap gap-2">
          <div className="my-2 flex  items-center rounded-lg border-2 border-gray bg-white p-2 dark:bg-boxdark ">
            <SVG src={SEARCH_ICON} />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full bg-transparent pl-6 pr-4 focus:outline-none"
              onChange={(e: any) => setSearchText(e.target.value)}
              value={searchText}
            />
          </div>

          <SelectCustom
            options={promotionType}
            className="flex items-center rounded-lg "
            placeholder="Thể loại khuyến mãi"
            onChange={(e: any) => setFilterPromotionType(e.value)}
          />

          <SelectCustom
            options={optionSaleScope}
            className="flex items-center rounded-lg "
            placeholder="Phạm vi khuyến mãi"
            onChange={(e: any) => setFilterScope(e.value)}
          />

          <SelectCustom
            options={optionStatus}
            className="flex items-center rounded-lg min-w-[180px]"
            placeholder="Trạng thái"
            onChange={(e: any) => setFilterStatus(e.value)}
          />

          <button className="rounded-lg bg-primary px-4 py-2 font-normal text-white  ">Tìm</button>
        </div>
        {listIdsVoucherForDelete.length !== 0 ? (
          <div
            className="rounded-lg cursor-pointer transition duration-1000 linear bg-danger px-4 py-2 font-normal text-white flex items-center justify-between float-right"
            onClick={handleShowModalDeleteVoucher}
          >
            <SVG src={trash} className="mr-1" />
            Xóa danh sách voucher đã chọn
          </div>
        ) : (
          ''
        )}
      </div>

      {showDeleteVoucherModal && (
        <Modal
          title="Xác nhận xóa danh sách voucher này"
          open={showDeleteVoucherModal}
          onCancel={handleCancel}
          footer={[
            <Button title="cancel" onClick={handleCancel}>
              Hủy bỏ
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={handleOk}
              // loading={isLoadingDelete}
            >
              Lưu thay đổi
            </Button>,
          ]}
        />
      )}
      {isLoadingVoucher ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        <VoucherTable
          data={vouchers?.pages[vouchers?.pages?.length - 1]}
          onGetPagination={handleGetPagination}
          handleDeleteSingleVoucher={handleDeleteVoucher}
          handleChangeListIdsVoucherForDelete={setListIdsVoucherForDelete}
          handleShowModalVoucher={handleShowModalVoucher}
          handleShowVoucherForNewCustomer={handleShowVoucherForNewCustomer}
        />
      )}
      {voucherModal.visible && (
        <VoucherModal
          refetchData={refetch}
          onClose={() => setVoucherModal({ visible: false })}
          visible={voucherModal.visible}
          modalType={voucherModal.type}
          voucherById={voucherModal.voucher}
          voucher={vouchers}
          listProductIdInVoucher={listProductIdInVoucher}
          onSetListProductIdInVoucher={setListProductIDInVoucher}
        />
      )}
      {/* {voucherForNewCustomerModal.visible && (
        <VoucherForNewCustomerModal
          refetchData={refetch}
          onClose={() => setVoucherForNewCustomerModal({ visible: false })}
          visible={voucherForNewCustomerModal.visible}
          modalType={voucherForNewCustomerModal.type}
          voucherById={voucherForNewCustomerModal.voucher}
          voucher={vouchers}
        />
      )} */}
      {isLoadingDelete && <Loading />}
    </>
  );
};

export default VoucherListPage;
