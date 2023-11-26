import SVG from 'react-inlinesvg';
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '~/constants/querryKey';
import { Button, Modal, Skeleton } from 'antd';
import trash from '~/assets/svg/trash.svg';
import { toast } from 'react-hot-toast';
import BankAccountTable from './BankAccountTable';
import BankAccountModal, { ModalType } from './BankAccountModal';
import { BankAccountStatus } from '~/models/bankAccount';
import { bankAccountService } from '~/services/bankAccountService';

export interface ModalKey {
  visible?: boolean;
  type?: ModalType;
  bankAccountId?: number | string;
}

const BankAccount = () => {
  const [showDeleteBankAccountModal, setShowDeleteBankAccountModal] = useState<boolean>(false);
  const [bankAccountModal, setBankAccountModal] = useState<ModalKey>({
    visible: false,
  });
  const [listIdsBankAccountForDelete, setListIdsBankAccountForDelete] = useState<React.Key[]>([]);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);

  const {
    data: bankAccount,
    refetch,
    isLoading: isLoadingBankAccount,
  } = useQuery([QUERY_KEY.BANK_ACCOUNT], async () => {
    const params = {
      status: BankAccountStatus.ACTIVE,
    };
    return await bankAccountService.getBankAccountByStatus(params);
  });

  const { data: bankAccountById } = useQuery(
    [QUERY_KEY.BANK_ACCOUNT, bankAccountModal],
    async () => {
      return await bankAccountService.getBankAccountById(Number(bankAccountModal.bankAccountId));
    },
    { enabled: bankAccountModal.bankAccountId ? true : false },
  );

  const handleShowModalDeleteBankAccount = () => {
    setShowDeleteBankAccountModal(true);
  };

  const handleOk = () => {
    handleDeleteBankAccount(listIdsBankAccountForDelete);
  };

  const handleCancel = () => {
    setShowDeleteBankAccountModal(false);
  };

  const handleShowModalBankAccount = (type?: ModalType, bankAccountId?: number) => {
    if (bankAccountId) {
      setBankAccountModal({
        type,
        bankAccountId: bankAccountId,
        visible: true,
      });
      return;
    }
    setBankAccountModal({
      type,
      visible: true,
    });
  };

  const handleDeleteBankAccount = async (ids: any) => {
    setIsLoadingDelete(true);
    try {
      await bankAccountService.deleteBankAccount(ids);
      toast.success('Xóa thành công', {
        position: 'bottom-right',
        duration: 3000,
        icon: '👏',
        style: { width: '70%' },
      });

      setIsLoadingDelete(false);
      if (Array.isArray(ids)) {
        setListIdsBankAccountForDelete([]);
        if (!isLoadingDelete) {
          setShowDeleteBankAccountModal(false);
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
      <div className='flex flex-row justify-between mb-6 items-center gap-2 w-full'>
        <span className='font-semibold text-[22px]'>Tài khoản ngân hàng</span>
        <button
          className='rounded-lg bg-primary px-4 py-2 font-normal text-white'
          onClick={() => handleShowModalBankAccount(ModalType.CREATE)}
        >
          Thêm tài khoản ngân hàng
        </button>
      </div>

      <div className=' flex flex-row justify-between flex-wrap  items-center gap-2'>
        {listIdsBankAccountForDelete.length !== 0 ? (
          <div
            className='rounded-lg cursor-pointer transition duration-1000 linear bg-danger mt-2 mb-1 px-4 py-2 font-normal text-white flex items-center justify-between float-right'
            onClick={handleShowModalDeleteBankAccount}
          >
            <SVG
              src={trash}
              className='mr-1'
            />
            Xóa danh sách tài khoản ngân hàng đã chọn
          </div>
        ) : (
          ''
        )}
      </div>

      {showDeleteBankAccountModal && (
        <Modal
          title={`Xác nhận xóa danh sách tài khoản ngân hàng này`}
          open={showDeleteBankAccountModal}
          onCancel={handleCancel}
          footer={[
            <Button
              title='cancel'
              onClick={handleCancel}
            >
              Hủy bỏ
            </Button>,
            <Button
              key='submit'
              type='primary'
              onClick={handleOk}
              loading={isLoadingDelete}
            >
              Xác nhận xóa
            </Button>,
          ]}
        />
      )}
      {isLoadingBankAccount ? (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      ) : (
        <BankAccountTable
          data={bankAccount}
          refreshData={refetch}
          handleDeleteOneBankAccount={handleDeleteBankAccount}
          handleChangeListIdsBankAccountForDelete={setListIdsBankAccountForDelete}
          handleShowModalBankAccount={handleShowModalBankAccount}
        />
      )}
      {bankAccountModal.visible && (
        <BankAccountModal
          refetchData={refetch}
          onClose={() => setBankAccountModal({ visible: false })}
          visible={bankAccountModal.visible}
          modalType={bankAccountModal.type}
          bankAccountById={bankAccountById}
        />
      )}
    </>
  );
};

export default BankAccount;
