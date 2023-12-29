import SVG from 'react-inlinesvg';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '~/constants/queryKey';
import { Button, Modal, Skeleton } from 'antd';
import trash from '~/assets/svg/trash.svg';
import { toast } from 'react-hot-toast';
import NhanhVnTable from './NhanhVnTable';
import NhanhVnModal, { ModalType } from './NhanhVnModal';
import { nhanhVnService } from '~/services/nhanhVnService';

export interface ModalKey {
  visible?: boolean;
  type?: ModalType;
  nhanhVnId?: number | string;
}

const NhanhVn = () => {
  const [showDeleteNhanhVnModal, setShowDeleteNhanhVnModal] = useState<boolean>(false);
  const [nhanhVnModal, setNhanhVnModal] = useState<ModalKey>({
    visible: false,
  });
  const [listIdsNhanhVnForDelete, setListIdsNhanhVnForDelete] = useState<React.Key[]>([]);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

  const {
    data: bankAccount,
    refetch,
    isLoading: isLoadingNhanhVn,
  } = useQuery([QUERY_KEY.NHANH_VN_CONFIG], async () => {
    return await nhanhVnService.getAllNhanhVn();
  });

  const { data: nhanhVnById } = useQuery(
    [QUERY_KEY.NHANH_VN_CONFIG, nhanhVnModal],
    async () => {
      return await nhanhVnService.getNhanhVnById(Number(nhanhVnModal.nhanhVnId));
    },
    { enabled: nhanhVnModal.nhanhVnId ? true : false },
  );

  const handleShowModalDeleteNhanhVn = () => {
    setShowDeleteNhanhVnModal(true);
  };

  const handleOk = () => {
    handleDeleteNhanhVn(listIdsNhanhVnForDelete);
  };

  const handleCancel = () => {
    setShowDeleteNhanhVnModal(false);
  };

  const handleShowModalNhanhVn = (type?: ModalType, nhanhVnId?: number) => {
    if (nhanhVnId) {
      setNhanhVnModal({
        type,
        nhanhVnId: nhanhVnId,
        visible: true,
      });
      return;
    }
    setNhanhVnModal({
      type,
      visible: true,
    });
  };

  const handleDeleteNhanhVn = async (ids: any) => {
    setIsLoadingDelete(true);
    try {
      await nhanhVnService.deleteNhanhVn(ids);
      toast.success('Xóa thành công', {
        position: 'bottom-right',
        duration: 3000,
        icon: '👏',
        style: { width: '70%' },
      });

      setIsLoadingDelete(false);
      if (Array.isArray(ids)) {
        setListIdsNhanhVnForDelete([]);
        if (!isLoadingDelete) {
          setShowDeleteNhanhVnModal(false);
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
      <div className="flex flex-row justify-between mb-6 items-center gap-2 w-full">
        <span className="font-semibold text-[22px]">Cấu hình NhanhVN</span>
        <button
          className="rounded-lg bg-primary px-4 py-2 font-normal text-white"
          onClick={() => handleShowModalNhanhVn(ModalType.CREATE)}
        >
          + Thêm cấu hình NhanhVn
        </button>
      </div>

      <div className=" flex flex-row justify-between flex-wrap  items-center gap-2">
        {listIdsNhanhVnForDelete.length !== 0 ? (
          <div
            className="rounded-lg cursor-pointer transition duration-1000 linear bg-danger mt-2 mb-1 px-4 py-2 font-normal text-white flex items-center justify-between float-right"
            onClick={handleShowModalDeleteNhanhVn}
          >
            <SVG src={trash} className="mr-1" />
            Xóa danh sách cấu hình NhanhVn đã chọn
          </div>
        ) : (
          ''
        )}
      </div>

      {showDeleteNhanhVnModal && (
        <Modal
          title={`Xác nhận xóa danh sách NhanhVn này`}
          open={showDeleteNhanhVnModal}
          onCancel={handleCancel}
          footer={[
            <Button title="cancel" onClick={handleCancel}>
              Hủy bỏ
            </Button>,
            <Button key="submit" type="primary" onClick={handleOk} loading={isLoadingDelete}>
              Xác nhận xóa
            </Button>,
          ]}
        />
      )}
      {isLoadingNhanhVn ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        <NhanhVnTable
          data={bankAccount}
          refreshData={refetch}
          handleDeleteOneNhanhVn={handleDeleteNhanhVn}
          handleChangeListIdsNhanhVnForDelete={setListIdsNhanhVnForDelete}
          handleShowModalNhanhVn={handleShowModalNhanhVn}
        />
      )}
      {nhanhVnModal.visible && (
        <NhanhVnModal
          refetchData={refetch}
          onClose={() => setNhanhVnModal({ visible: false })}
          visible={nhanhVnModal.visible}
          modalType={nhanhVnModal.type}
          nhanhVnById={nhanhVnById}
        />
      )}
    </>
  );
};

export default NhanhVn;
