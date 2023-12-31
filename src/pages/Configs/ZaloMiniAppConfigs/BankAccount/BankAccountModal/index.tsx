/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';
import { Button, Input, InputNumber, Modal, Select } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '~/constants/queryKey';
import { toast } from 'react-hot-toast';
import { BankAccount, BankAccountStatus } from '~/models/bankAccount';
import snippingLoading from '~/assets/gif/sniping-loading.gif';
import { bankAccountService } from '~/services/bankAccountService';

// eslint-disable-next-line react-refresh/only-export-components
export enum ModalType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  INFORMATION = 'INFORMATION',
}
export interface UserModalProps {
  visible?: boolean;
  modalType?: ModalType;
  onClose: () => void;
  refetchData: () => void;
  bankAccountById: BankAccount | undefined;
}

const defaultBankAccountValue: BankAccount = {
  bankAccountName: '',
  status: BankAccountStatus.ACTIVE,
};

const BankAccountModal = ({
  visible,
  modalType,
  onClose,
  refetchData,
  bankAccountById,
}: UserModalProps) => {
  const [isLoadingWhenCallApiCreateOrUpdate, setIsLoadingWhenCallApiCreateOrUpdate] =
    useState<boolean>(false);

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    defaultValues: defaultBankAccountValue,
  });

  const { data: bankFromThirdPartyVietQr } = useQuery({
    queryKey: [[QUERY_KEY.BANK_FROM_THIRD_PARTY_VIETQR]],
    queryFn: bankAccountService.findAllBankFromThirdPartyVietQr,
  });

  useEffect(() => {
    if (bankAccountById) {
      reset(bankAccountById);
    }
  }, [bankAccountById]);

  console.log(errors);

  const getTitleModalAndButton = useMemo(() => {
    let result = {
      titleModal: '',
      titleButton: '',
    };
    switch (modalType) {
      case ModalType.CREATE:
        result = {
          titleModal: 'Thêm mới tài khoản ngân hàng',
          titleButton: 'Thêm tài khoản ngân hàng',
        };
        break;
      case ModalType.UPDATE:
        result = {
          titleModal: 'Cập nhật thông tin tài khoản ngân hàng',
          titleButton: 'Cập nhật',
        };
        break;
      case ModalType.INFORMATION:
        result = {
          titleModal: 'Thông tin tài khoản ngân hàng',
          titleButton: '',
        };
        break;
    }

    return result;
  }, [modalType]);

  const generateOptionSelect = useMemo(
    () =>
      bankFromThirdPartyVietQr?.data.map((bank) => ({
        label: `${bank.name} - ${bank.shortName}`,
        value: Number(bank.bin),
      })),
    [bankFromThirdPartyVietQr],
  );

  const onSubmit = async (data: BankAccount) => {
    setIsLoadingWhenCallApiCreateOrUpdate(true);
    try {
      const bankAfterFindByBankId = bankFromThirdPartyVietQr?.data.find(
        (bank) => Number(bank.bin) === Number(data.bankId),
      );
      const newDate: BankAccount = {
        ...data,
        bankAccountName: data.bankAccountName?.toUpperCase(),
        bankId: Number(data.bankId),
        bankName: `${bankAfterFindByBankId?.name} - ${bankAfterFindByBankId?.shortName}`,
      };

      modalType === ModalType.CREATE && (await bankAccountService.createBankAccount(newDate));
      modalType === ModalType.UPDATE &&
        bankAccountById?.id &&
        (await bankAccountService.updateBankAccount(newDate, bankAccountById?.id));
      setIsLoadingWhenCallApiCreateOrUpdate(false);
      onClose();
      toast.success(
        `${modalType === ModalType.CREATE ? 'Thêm' : 'Cập nhật'} tài khoản ngân hàng thành công`,
        {
          position: 'bottom-right',
          duration: 4000,
          icon: '😞',
        },
      );
      refetchData();
    } catch (err) {
      console.log(err);
      toast.success(
        `${modalType === ModalType.CREATE ? 'Thêm' : 'Cập nhật'} tài khoản ngân hàng thành công`,
        {
          position: 'bottom-right',
          duration: 4000,
          icon: '😞',
        },
      );
    }
  };

  return (
    <>
      <Modal
        open={visible}
        title={getTitleModalAndButton.titleModal}
        okText="Lưu thay đổi"
        cancelText="Hủy bỏ"
        onCancel={onClose}
        style={{ minWidth: '50%' }}
        footer={[
          modalType === ModalType.INFORMATION ? '' : <Button onClick={onClose}>Hủy</Button>,
          <Button
            form="form-bank-account"
            key="submit"
            htmlType="submit"
            style={{ background: '#1890ff', color: '#fff' }}
          >
            {getTitleModalAndButton.titleButton}
          </Button>,
        ]}
      >
        <div className="mx-auto max-w-full">
          <div className="grid grid-cols-5 gap-8">
            <div className="col-span-5 ">
              <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                <div className="p-10">
                  <form id="form-bank-account" onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-5.5">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="Username"
                      >
                        Tên chủ tài khoản <strong className="text-xl text-danger">*</strong>
                      </label>
                      <Controller
                        name="bankAccountName"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <Input
                            value={value}
                            onChange={onChange}
                            className={`!h-[38px] !w-full border-solid border-[1px] ${
                              errors.bankAccountName ? '!border-danger' : ''
                            }`}
                            placeholder="Tên chủ tài khoản"
                          />
                        )}
                      />
                      {errors?.bankAccountName && (
                        <small className="text-danger text-[13px]">
                          Tên chủ tài khoản không được rỗng
                        </small>
                      )}
                    </div>
                    <div className="mb-5.5">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="Username"
                      >
                        Số tài khoản <strong className="text-xl text-danger">*</strong>
                      </label>
                      <Controller
                        name="bankAccountNumber"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <InputNumber
                            value={value}
                            onChange={(e) => e && onChange(e)}
                            className={`!h-[38px] !w-full border-solid border-[1px] ${
                              errors.bankAccountNumber ? '!border-danger' : ''
                            }`}
                            placeholder="Số tài khoản"
                            controls={false}
                          />
                        )}
                      />
                      {errors?.bankAccountNumber && (
                        <small className="text-danger text-[13px]">
                          Số tài khoản không được rỗng
                        </small>
                      )}
                    </div>
                    <div className="mb-5.5">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="Username"
                      >
                        Tên ngân hàng <strong className="text-xl text-danger">*</strong>
                      </label>
                      <Controller
                        name="bankId"
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <Select
                            options={generateOptionSelect}
                            placeholder="Vui lòng chọn ngân hàng"
                            value={value}
                            className={`${
                              errors.bankId ? '!border-danger' : ''
                            } w-full rounded border border-stroke  py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary`}
                            onChange={(e) => e && onChange(e)}
                            filterOption={(input, option) =>
                              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            showSearch
                          />
                        )}
                      />
                      {errors?.bankId && (
                        <small className="text-danger text-[13px]">
                          Tên ngân hàng không được rỗng
                        </small>
                      )}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {isLoadingWhenCallApiCreateOrUpdate && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center opacity-70 bg-[#8c8c8c] z-99999">
          <img src={snippingLoading} alt="" />
        </div>
      )}
    </>
  );
};

export default BankAccountModal;
