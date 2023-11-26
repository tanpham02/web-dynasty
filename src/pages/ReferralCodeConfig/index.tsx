/* eslint-disable react-hooks/exhaustive-deps */
import { Col, InputNumber, Row, Typography } from 'antd';
import _ from 'lodash';
import { Controller, useForm } from 'react-hook-form';
import { SystemConfigs } from '~/models/systemConfig';
import { useEffect } from 'react';
import systemConfigService from '~/services/systemConfigService';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEY } from '~/constants/querryKey';


const defaultValuesReferralCodeConfig: SystemConfigs = {
  referralConversionRate: 0,
};

export const ReferralCodeConfigPage = () => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    clearErrors,
    watch,
    setError,
    reset,
  } = useForm({
    defaultValues: defaultValuesReferralCodeConfig,
  });

  const { data: systemConfigsData } = useQuery([QUERY_KEY.SYSTEM_CONFIG], async () => {
    return await systemConfigService.systemConfigService.getSystemConfig();
  });

  useEffect(() => {
    if (systemConfigsData?.referralConversionRate) {
      reset((prev) => ({
        ...prev,
        referralConversionRate: systemConfigsData?.referralConversionRate,
      }));
    }
  }, [systemConfigsData]);

  useEffect(() => {
    const referralCode = watch('referralConversionRate');
    if (referralCode || referralCode === 0) {
      clearErrors('referralConversionRate');
    } else {
      setError('referralConversionRate', {
        type: 'required',
      });
    }
  }, [watch('referralConversionRate')]);

  const onSubmit = async (data: SystemConfigs) => {
    try {
      await systemConfigService.systemConfigService.updateSystemConfig(data);
      toast.success('Cập nhật Cấu hình hệ thống thành công', {
        position: 'bottom-right',
        duration: 3500,
        icon: '👏',
      });
    } catch (error) {
      console.log(error);
      toast.error('Lỗi khi cập nhật Cấu hình hệ thống');
    }
  };

  return (
    <div className='mx-auto '>
      <Typography.Title level={2}>Cấu hình ưu đãi khi giới thiệu thành viên mới</Typography.Title>
      <div className='grid  gap-2'>
        <div className='col-span-5 xl:col-span-12'>
          <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
            <div className='p-7'>
              <form
                onSubmit={handleSubmit(onSubmit)}
                name='systemConfigsData'
                autoComplete='off'
                style={{ maxWidth: '100%' }}
              >
                <div
                  className='mt-3'
                  style={{ width: '95%' }}
                >
                  <div className='border-b  border-stroke mb-[16px]'>
                    <Typography.Paragraph className='text-[16px] py-[16px] leading-[1.5px] font-medium'>
                      {' '}
                      Ưu đãi cho người giới thiệu
                    </Typography.Paragraph>
                  </div>
                  <Row gutter={2}>
                    <Col xs={24}>
                      <Typography.Paragraph>
                        Phần trăm (%) số tiền đơn hàng của người được giới thiệu được quy đổi ra điểm
                      </Typography.Paragraph>
                      <Controller
                        control={control}
                        name='referralConversionRate'
                        rules={{ required: true }}
                        render={({ field: { value } }) => (
                          <InputNumber
                            className='!w-full !h-[38px]'
                            placeholder='Ví dụ: 10'
                            formatter={(value) => `${value}`}
                            controls={false}
                            addonAfter='%'
                            min={0}
                            max={100}
                            value={value}
                            onChange={(value) => setValue('referralConversionRate', value)}
                          />
                        )}
                      />
                      {errors.referralConversionRate?.type === 'required' && (
                        <span className='text-danger'>
                          Phần trăm (%) số tiền đơn hàng của người được giới thiệu được quy đổi ra điểm không được để
                          trống
                        </span>
                      )}

                      <div className='text-[#999]'>
                        <span>{`Ví dụ: Phần trăm (%) số tiền đơn hàng được quy đổi ra điểm là % `}</span> <br />
                        <span>Tổng giá trị đơn hàng của khách là 10,000,000đ</span> <br />
                        <span>{`=> Số điểm khách hàng sẽ nhận được là
                          điểm`}</span>
                      </div>
                    </Col>
                  </Row>
                </div>

                <div className='flex justify-end gap-4.5'>
                  <button className='flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:shadow-1'>
                    Lưu
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className='col-span-5 xl:col-span-12'></div>
      </div>
    </div>
  );
};
