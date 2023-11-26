/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button, Input, InputNumber, Modal, Tooltip } from 'antd';
import { Membership, MembershipStatus } from '~/models/membership';
import { membershipService } from '~/services/membershipService';
import { toast } from 'react-hot-toast';
import snippingLoading from '~/assets/gif/sniping-loading.gif';
import { HexColorPicker } from 'react-colorful';
import { PATTERN } from '~/utils/regex';
import { QuestionCircleOutlined } from '@ant-design/icons';

export enum ModalType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  INFORMATION = 'INFORMATION',
}

interface MembershipCreateModalProps {
  handleOpenOrCloseMembershipCreateModal: () => void;
  refreshMembershipData: () => void;
  modalType: ModalType | undefined;
  membershipById?: Membership;
}
const defaultValueMemberShip: Membership = {
  name: '',
  conditionLabel: '',
  conditionPrice: 0,
  percentDiscount: 0,
  status: MembershipStatus.ACTIVE,
};

export const MembershipCreateModal = ({
  handleOpenOrCloseMembershipCreateModal,
  refreshMembershipData,
  modalType,
  membershipById,
}: MembershipCreateModalProps) => {
  const [membershipImageBlob, setMembershipImageBlob] = useState<string>('');
  const [membershipImageRequest, setMembershipImageRequest] = useState<File | string>('');
  const [isLoadingWhenCallApiCreateOrUpdate, setIsLoadingWhenCallApiCreateOrUpdate] = useState<boolean>(false);

  const {
    reset,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm({ defaultValues: defaultValueMemberShip });

  const submitHandler = async (data: Membership) => {
    setIsLoadingWhenCallApiCreateOrUpdate(true);
    const partFormData = new FormData();
    if (membershipImageRequest) {
      partFormData.append('backgroundImage', membershipImageRequest);
    }
    partFormData.append('membershipLevelDTO ', JSON.stringify(data));

    try {
      modalType === ModalType.CREATE && (await membershipService.createMembership(partFormData));
      modalType === ModalType.UPDATE &&
        membershipById?.id &&
        (await membershipService.updateMembership(partFormData, membershipById?.id));
      setIsLoadingWhenCallApiCreateOrUpdate(false);
      toast.success(
        `${
          modalType === ModalType.CREATE
            ? 'Thêm hạng thành viên thành công'
            : modalType === ModalType.UPDATE
            ? 'Cập nhật hạng thành viên thành công'
            : ''
        }`,
        {
          position: 'bottom-right',
          duration: 4000,
          icon: '👏',
        },
      );
      handleOpenOrCloseMembershipCreateModal();
      refreshMembershipData();
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (membershipById) {
      reset(membershipById);
      if (membershipById.backgroundImage) {
        setMembershipImageBlob(membershipById.backgroundImage);
      }
    }
  }, [membershipById]);

  const handleChangeMembershipImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputFile = e.target;
    const file = inputFile.files !== null && inputFile.files[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      setMembershipImageRequest(file);
    }
    reader.onload = () => {
      setMembershipImageBlob(reader.result as string);
    };
  };

  const handleGenerateTextModal = useMemo(() => {
    let result = {
      titleModal: '',
      titleButton: '',
    };

    switch (modalType) {
      case ModalType.CREATE:
        result = {
          titleButton: 'Thêm',
          titleModal: 'Thêm hạng thành viên',
        };
        break;
      case ModalType.UPDATE:
        result = {
          titleButton: 'Cập nhật',
          titleModal: 'Cập nhật hạng thành viên',
        };
        break;
    }

    return result;
  }, [modalType]);

  return (
    <>
      <Modal
        open={true}
        title={handleGenerateTextModal.titleModal}
        okText='Lưu thay đổi'
        cancelText='Hủy bỏ'
        onCancel={handleOpenOrCloseMembershipCreateModal}
        style={{
          minWidth: '50%',
          maxHeight: '100%',
          paddingBottom: '0px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        footer={[
          <Button
            style={{ border: '1px solid #1890ff', color: '#1890ff' }}
            onClick={handleOpenOrCloseMembershipCreateModal}
          >
            Hủy bỏ
          </Button>,
          <Button
            form='form-membership'
            key='submit'
            htmlType='submit'
            style={{ background: '#1890ff', color: '#fff' }}
          >
            {handleGenerateTextModal.titleButton}
          </Button>,
        ]}
      >
        <div className='mx-auto max-w-270'>
          <div className='grid grid-cols-5 gap-8'>
            <div className='col-span-5 xl:col-span-3'>
              <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                <div className='border-b border-stroke py-4 px-7 dark:border-strokedark'>
                  <h3 className='font-medium text-black dark:text-white'>Thông tin hạng thành viên</h3>
                </div>
                <div className='p-7'>
                  <form
                    onSubmit={handleSubmit(submitHandler)}
                    id='form-membership'
                  >
                    <div className='mb-5.5 flex flex-col gap-5.5 sm:flex-row'>
                      <div className='w-full '>
                        <label className='mb-3 block text-sm font-medium text-black dark:text-white'>
                          Tên hạng thành viên <strong className='text-xl text-danger'>*</strong>
                        </label>
                        <Controller
                          control={control}
                          name='name'
                          rules={{ required: true }}
                          render={({ field: { value, onChange } }) => (
                            <Input
                              className={`!w-full !h-[48px] border-solid border-[1px] ${
                                errors.name ? '!border-danger' : ''
                              }`}
                              value={value}
                              placeholder='Nhập tên hạng thành viên'
                              onChange={onChange}
                            />
                          )}
                        />
                        {errors.name?.type === 'required' && (
                          <small className='text-danger text-[13px]'>Tên hạng thành viên không được rỗng</small>
                        )}
                      </div>
                    </div>

                    <div className='mb-5.5'>
                      <label className='mb-3 block text-sm font-medium text-black dark:text-white'>
                        Giá trị tích lũy cần đạt ( bằng số ) <strong className='text-xl text-danger'>*</strong>{' '}
                        <Tooltip title='Chỉ được chỉnh sửa khi không có thành viên!'>
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </label>
                      <div className='relative'>
                        <Controller
                          control={control}
                          name='conditionPrice'
                          rules={{ min: 0 }}
                          render={({ field: { value, onChange } }) => (
                            <>
                              <InputNumber
                                className={`!w-full !h-[48px] leading-[48px]  ${
                                  errors.conditionPrice
                                    ? '!border-danger border-solid  border-[100%] border-t-0 border-l-0'
                                    : ''
                                } `}
                                value={value || 0}
                                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => (value ? Number(value?.replace(/\$\s?|(,*)/g, '')) : 0)}
                                onChange={(value) => value && onChange(value)}
                                controls={false}
                                addonAfter='đ'
                                disabled={membershipById?.existingCustomer}
                              />
                            </>
                          )}
                        />
                        {errors.conditionPrice && (
                          <small className='text-danger text-[13px]'>
                            Giá trị tích lũy cần đạt ( bằng số ) không hợp lệ
                          </small>
                        )}
                      </div>
                    </div>
                    <div className='mb-5.5'>
                      <label className='mb-3 block text-sm font-medium text-black dark:text-white'>
                        Giá trị tích lũy cần đạt ( bằng chữ ) <strong className='text-xl text-danger'>*</strong>
                        <Tooltip title='Chỉ được chỉnh sửa khi không có thành viên!'>
                          <QuestionCircleOutlined />
                        </Tooltip>
                      </label>
                      <Controller
                        control={control}
                        name='conditionLabel'
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <>
                            <Input
                              className={`!w-full !h-[48px] border-solid border-[1px] ${
                                errors.conditionLabel ? '!border-danger' : ''
                              }`}
                              value={value}
                              placeholder='Nhập giá trị tích lũy cần đạt ( bằng chữ )'
                              onChange={onChange}
                              disabled={membershipById?.existingCustomer}
                            />
                          </>
                        )}
                      />
                      {errors.conditionLabel?.type === 'required' && (
                        <small className='text-danger text-[13px]'>
                          Giá trị tích lũy cần đạt ( bằng chữ ) không được rỗng
                        </small>
                      )}
                    </div>
                    <div className='mb-5.5'>
                      <label className='mb-3 block text-sm font-medium text-black dark:text-white'>
                        Phần % giảm giá <strong className='text-xl text-danger'>*</strong>
                      </label>
                      <div className='relative'>
                        <Controller
                          control={control}
                          name='percentDiscount'
                          rules={{ min: 0, max: 100 }}
                          render={({ field: { value, onChange } }) => (
                            <InputNumber
                              value={value ? Number(value) : 0}
                              className={`!w-full !h-[48px] leading-[48px]  ${
                                errors.percentDiscount
                                  ? '!border-danger border-solid  border-[100%] border-t-0 border-l-0'
                                  : ''
                              } `}
                              placeholder='Nhập % giảm giá'
                              formatter={(value) => `${value}`}
                              parser={(value) => (value ? Number(value?.replace('%', '')) : 0)}
                              controls={false}
                              onChange={(displayValue: number | null) => displayValue && onChange(displayValue)}
                              addonAfter='%'
                            />
                          )}
                        />
                        {errors.percentDiscount && (
                          <small className='text-danger text-[13px]'>Phần % giảm giá không hợp lệ</small>
                        )}
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className='col-span-5 xl:col-span-2'>
              <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                <div className='border-b border-stroke py-4 px-7 dark:border-strokedark'>
                  <h3 className='font-medium text-black dark:text-white'>Hạng thành viên</h3>
                </div>
                <div className='p-7'>
                  <form>
                    <div
                      id='FileUpload'
                      className='relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5'
                    >
                      <input
                        type='file'
                        accept='image/*'
                        className='absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none'
                        onChange={handleChangeMembershipImg}
                      />
                      {membershipImageBlob ? (
                        <img
                          className='mx-auto my-0'
                          src={membershipImageBlob}
                          onError={(e: any) => {
                            e.target.onerror = null;
                            e.target.alt = membershipById?.name;
                          }}
                        />
                      ) : (
                        <div className='flex flex-col items-center justify-center space-y-3'>
                          <span className='flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark'>
                            <svg
                              width='16'
                              height='16'
                              viewBox='0 0 16 16'
                              fill='none'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z'
                                fill='#3C50E0'
                              />
                              <path
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z'
                                fill='#3C50E0'
                              />
                              <path
                                fillRule='evenodd'
                                clipRule='evenodd'
                                d='M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z'
                                fill='#3C50E0'
                              />
                            </svg>
                          </span>
                          <p>
                            <span className='text-primary'>Click để upload </span> hoặc kéo thả vào ô
                          </p>
                          <p className='mt-1.5'>PNG hoặc JPG</p>
                          <p>(max, 1920 X 1080px)</p>
                        </div>
                      )}
                    </div>
                    <div className='mb-5.5'>
                      <label className='mb-3 block text-sm font-medium text-black dark:text-white'>
                        Màu chủ đạo <strong className='text-xl text-danger'>*</strong>
                      </label>

                      <div className='relative'>
                        <div className='mb-4'>
                          <HexColorPicker
                            color={watch('color')}
                            onChange={(color) => setValue('color', color)}
                          />
                        </div>
                        <Controller
                          control={control}
                          name='color'
                          rules={{ pattern: PATTERN.HEX_COLOR, required: true }}
                          render={({ field: { value, onChange } }) => (
                            <Input
                              className={`!w-full !h-[48px] border-solid border-[1px]  ${
                                errors.color ? '!border-danger' : ''
                              }`}
                              value={value}
                              placeholder='Nhập giá trị tích lũy cần đạt ( bằng chữ )'
                              onChange={onChange}
                            />
                          )}
                        />
                        {errors.color?.type === 'pattern' && (
                          <div className='grid'>
                            <small className='text-danger text-[13px]'>Màu chủ đạo không hợp lệ</small>
                            <small className='text-secondary text-[13px]'>
                              Màu chủ đạo thường có dạng là : #000000
                            </small>
                          </div>
                        )}
                        {errors.color?.type === 'error' && (
                          <small className='text-danger text-[13px]'>Màu chủ đạo không hợp lệ</small>
                        )}
                      </div>
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
