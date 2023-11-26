/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';
import { Button, Input, InputNumber, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '~/constants/querryKey';
import { toast } from 'react-hot-toast';
import snippingLoading from '~/assets/gif/sniping-loading.gif';
import { bankAccountService } from '~/services/bankAccountService';
import { NhanhVn, NhanhVnStatus } from '~/models/nhanhVn';
import { nhanhVnService } from '~/services/nhanhVnService';

// eslint-disable-next-line react-refresh/only-export-components
export enum ModalType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  INFORMATION = 'INFORMATION',
}
export interface NhanhVnModalProps {
  visible?: boolean;
  modalType?: ModalType;
  onClose: () => void;
  refetchData: () => void;
  nhanhVnById: NhanhVn | undefined;
}

const defaultBankAccountValue: NhanhVn = {
  appId: '',
  version: '',
  secretKey: '',
  priority: 0,
  status: NhanhVnStatus.ACTIVE,
};

const NhanhVnModal = ({ visible, modalType, onClose, refetchData, nhanhVnById }: NhanhVnModalProps) => {
  const [isLoadingWhenCallApiCreateOrUpdate, setIsLoadingWhenCallApiCreateOrUpdate] = useState<boolean>(false);

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
    if (nhanhVnById) {
      reset(nhanhVnById);
    }
  }, [nhanhVnById]);

  const getTitleModalAndButton = useMemo(() => {
    let result = {
      titleModal: '',
      titleButton: '',
    };
    switch (modalType) {
      case ModalType.CREATE:
        result = {
          titleModal: 'Thêm mới cấu hình NhanhVn',
          titleButton: 'Thêm cấu hình NhanhVn',
        };
        break;
      case ModalType.UPDATE:
        result = {
          titleModal: 'Cập nhật thông tin cấu hình NhanhVn',
          titleButton: 'Cập nhật',
        };
        break;
      case ModalType.INFORMATION:
        result = {
          titleModal: 'Thông tin cấu hình NhanhVn',
          titleButton: '',
        };
        break;
    }

    return result;
  }, [modalType]);

  const onSubmit = async (data: NhanhVn) => {
    try {
      modalType === ModalType.CREATE && (await nhanhVnService.createNhanhVn(data));
      modalType === ModalType.UPDATE && nhanhVnById?.id && (await nhanhVnService.updateNhanhVn(data, nhanhVnById?.id));
      setIsLoadingWhenCallApiCreateOrUpdate(false);
      onClose();
      toast.success(`${modalType === ModalType.CREATE ? 'Thêm' : 'Cập nhật'} tài khoản ngân hàng thành công`, {
        position: 'bottom-right',
        duration: 4000,
        icon: '😞',
      });
      refetchData();
    } catch (err) {
      console.log(err);
      toast.success(`${modalType === ModalType.CREATE ? 'Thêm' : 'Cập nhật'} tài khoản ngân hàng thành công`, {
        position: 'bottom-right',
        duration: 4000,
        icon: '😞',
      });
    }
  };

  return (
    <>
      <Modal
        open={visible}
        title={getTitleModalAndButton.titleModal}
        okText='Lưu thay đổi'
        cancelText='Hủy bỏ'
        onCancel={onClose}
        style={{ minWidth: '50%' }}
        footer={[
          modalType === ModalType.INFORMATION ? '' : <Button onClick={onClose}>Hủy</Button>,
          <Button
            form='form-bank-account'
            key='submit'
            htmlType='submit'
            style={{ background: '#1890ff', color: '#fff' }}
          >
            {getTitleModalAndButton.titleButton}
          </Button>,
        ]}
      >
        <div className='mx-auto max-w-full'>
          <div className='grid grid-cols-5 gap-8'>
            <div className='col-span-5 '>
              <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                <div className='p-10'>
                  <form
                    id='form-bank-account'
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className='mb-5.5'>
                      <label className='mb-3 block text-sm font-medium text-black dark:text-white'>
                        App ID <strong className='text-xl text-danger'>*</strong>
                      </label>
                      <Controller
                        name='appId'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <Input
                            value={value}
                            onChange={onChange}
                            className={`!h-[38px] !w-full border-solid border-[1px] ${
                              errors.appId ? '!border-danger' : ''
                            }`}
                            placeholder='VD: 33162'
                          />
                        )}
                      />
                      {errors?.appId && <small className='text-danger text-[13px]'>App ID không được rỗng</small>}
                    </div>
                    <div className='mb-5.5'>
                      <label className='mb-3 block text-sm font-medium text-black dark:text-white'>
                        Phiên bản <strong className='text-xl text-danger'>*</strong>
                      </label>
                      <Controller
                        name='version'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <Input
                            value={value}
                            onChange={onChange}
                            className={`!h-[38px] !w-full border-solid border-[1px] ${
                              errors.version ? '!border-danger' : ''
                            }`}
                            placeholder='VD: 1.0'
                          />
                        )}
                      />
                      {errors?.version && <small className='text-danger text-[13px]'>Phiên bản không được rỗng</small>}
                    </div>
                    <div className='mb-5.5'>
                      <label className='mb-3 block text-sm font-medium text-black dark:text-white'>
                        Secret Key <strong className='text-xl text-danger'>*</strong>
                      </label>
                      <Controller
                        name='secretKey'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <Input.Password
                            value={value}
                            onChange={onChange}
                            className={`!h-[38px] !w-full border-solid border-[1px] ${
                              errors.secretKey ? '!border-danger' : ''
                            }`}
                            placeholder='VD: DABSJD21y38'
                          />
                        )}
                      />
                      {errors?.secretKey && (
                        <small className='text-danger text-[13px]'>Secret Key không được rỗng</small>
                      )}
                    </div>
                    <div className='mb-5.5'>
                      <label className='mb-3 block text-sm font-medium text-black dark:text-white'>
                        Độ ưu tiên <strong className='text-xl text-danger'>*</strong>
                      </label>
                      <Controller
                        name='priority'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <InputNumber
                            value={value}
                            onChange={(e) => e && onChange(e)}
                            className={`!h-[38px] !w-full border-solid border-[1px] ${
                              errors.priority ? '!border-danger' : ''
                            }`}
                            placeholder='VD: 99999'
                            controls={false}
                          />
                        )}
                      />
                      {errors?.priority && (
                        <small className='text-danger text-[13px]'>Độ ưu tiên không được rỗng</small>
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
        <div className='fixed top-0 left-0 right-0 bottom-0 flex justify-center items-center opacity-70 bg-[#8c8c8c] z-99999'>
          <img
            src={snippingLoading}
            alt=''
          />
        </div>
      )}
    </>
  );
};

export default NhanhVnModal;
