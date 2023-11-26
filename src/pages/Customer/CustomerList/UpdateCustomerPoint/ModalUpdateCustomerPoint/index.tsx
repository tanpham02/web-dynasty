/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Input, InputNumber, Modal, Radio, RadioChangeEvent, Typography } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { CalculatorPoint, CustomerHistory } from '~/models/customers';
import customerService from '~/services/customerService';
import { DATE_FORMAT_YYYYMMDD, formatDate } from '~/utils/date.utils';
import { useEffect } from 'react';

export interface UserModalProps {
  visible?: boolean;
  onClose: () => void;
  refreshCustomerHistoryData: () => void;
  refetchCustomerDetail: () => void;
  customerId?: number;
  customerPoint?: number;
}

const ModalUpdateCustomerPoint = ({
  visible,
  customerPoint,
  onClose,
  customerId,
  refreshCustomerHistoryData,
  refetchCustomerDetail,
}: UserModalProps) => {
  const defaultValueCustomerPoint: CustomerHistory = {
    type: CalculatorPoint.ADDITION,
    reason: '',
    createdDate: '',
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm({
    defaultValues: defaultValueCustomerPoint,
  });

  useEffect(() => {
    if (!visible) {
      reset();
    }
  }, [visible]);

  const onSubmit = async (data: CustomerHistory) => {
    data.createdDate = formatDate(new Date(), DATE_FORMAT_YYYYMMDD);
    data.customerId = customerId;
    try {
      await customerService.calculatorPoint(data);
      onClose();
      toast.success('Cập nhật điểm cho khách hàng thành công', {
        position: 'bottom-right',
        duration: 3500,
        icon: '😜',
      });
      refreshCustomerHistoryData();
      refetchCustomerDetail();
      reset();
    } catch (err) {
      console.log(err);
      toast.success('Cập nhật điểm cho khách hàng thất bại', {
        position: 'bottom-right',
        duration: 3500,
        icon: '😞',
      });
    }
  };

  return (
    <>
      <Modal
        open={visible}
        title='Cập nhật điểm cho khách hàng'
        okText='Lưu thay đổi'
        cancelText='Hủy bỏ'
        onCancel={onClose}
        style={{ minWidth: '50%', zIndex: 9 }}
        footer={[
          <Button onClick={onClose}>Hủy</Button>,
          <Button
            form='form-update-customer-point'
            key='submit'
            htmlType='submit'
            style={{ background: '#1890ff', color: '#fff' }}
          >
            Cập nhật
          </Button>,
        ]}
      >
        <div className='mx-auto max-w-full'>
          <div className='grid grid-cols-5 gap-8'>
            <div className='col-span-5 '>
              <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                <div className='p-10'>
                  <form
                    id='form-update-customer-point'
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className='mb-5.5'>
                      <label
                        className='mb-3 block text-sm font-medium text-black dark:text-white'
                        htmlFor='Username'
                      >
                        Lý do muốn thay đổi điểm <strong className='text-xl text-danger'>*</strong>
                      </label>
                      <Controller
                        name='reason'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange } }) => (
                          <Input
                            value={value}
                            onChange={onChange}
                            className={`!h-[38px] !w-full border-solid border-[1px] ${
                              errors.reason ? '!border-danger' : ''
                            }`}
                            placeholder='Lý do thay đổi'
                          />
                        )}
                      />
                      {errors?.reason && (
                        <small className='text-danger text-[13px]'>Lý do muốn thay đổi điểm không được rỗng</small>
                      )}
                    </div>
                    <div className='mb-5.5'>
                      <label
                        className='mb-3 block text-sm font-medium text-black dark:text-white'
                        htmlFor='Username'
                      >
                        Số điểm muốn thay đổi <strong className='text-xl text-danger'>*</strong>
                      </label>
                      <div className='flex'>
                        <div className='flex-1'>
                          <Controller
                            name='point'
                            control={control}
                            rules={{
                              required: true,
                              validate: () =>
                                customerPoint && watch('point') && watch('type') !== CalculatorPoint.ADDITION
                                  ? Number(watch('point')) <= Number(customerPoint)
                                  : true,
                            }}
                            render={({ field: { value, onChange } }) => (
                              <InputNumber
                                value={value}
                                onChange={(e) => e && onChange(e)}
                                className={`!h-[38px] !w-full border-solid border-[1px] ${
                                  errors.point?.type === 'required' ||
                                  (errors.point?.type === 'validate' && watch('type') !== CalculatorPoint.ADDITION)
                                    ? '!border-danger'
                                    : ''
                                }`}
                                placeholder='Số điểm muốn thay đổi'
                                min={1}
                                controls={false}
                              />
                            )}
                          />
                          {errors?.point?.type === 'required' && (
                            <small className='text-danger text-[13px]'>Số điểm muốn thay đổi không được rỗng</small>
                          )}
                          {errors?.point?.type === 'validate' && (
                            <small className='text-danger text-[13px]'>
                              Số điểm muốn thay đổi phải nhỏ hơn số điểm hiện có
                            </small>
                          )}
                        </div>
                        <div className='flex-2 ml-4 '>
                          <Controller
                            control={control}
                            name='type'
                            render={({ field: { value, onChange } }) => (
                              <Radio.Group
                                onChange={(e: RadioChangeEvent) => onChange(e.target.value)}
                                value={value}
                                className='!h-[38px]'
                                optionType='button'
                                buttonStyle='solid'
                              >
                                <Radio
                                  className='!h-full !leading-[38px]'
                                  value={CalculatorPoint.ADDITION}
                                >
                                  Cộng
                                </Radio>
                                <Radio
                                  className={`!h-full !leading-[38px] ${customerPoint === 0 ? 'opacity-70' : ''}`}
                                  value={CalculatorPoint.SUBTRACTION}
                                  disabled={customerPoint === 0}
                                >
                                  Trừ
                                </Radio>
                              </Radio.Group>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdateCustomerPoint;
