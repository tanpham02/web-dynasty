/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';
import {
  Button,
  Col,
  Input,
  InputNumber,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
  DiscountBy,
  Voucher,
  VoucherOverriding,
  VoucherPromotionType,
  VoucherSaleScope,
} from '~/models/voucher';

import { voucherService } from '~/services/voucherService';

import { InfiniteData } from '@tanstack/react-query';

import { ListDataResponse, ListResponse } from '~/types';

import { PATTERN } from '~/utils/regex';
import convertViToEn from '~/utils/convertViToEn';

const defaultVoucherValues: VoucherOverriding = {
  name: '',
  code: '',
  description: '',
  saleScope: VoucherSaleScope.ALL,
  promotionType: VoucherPromotionType.SALE,
  maxPromotion: 0,
  discount: 0,
  discountPercent: 0,
  receivePointPercent: 0,
};

// eslint-disable-next-line react-refresh/only-export-components
export enum ModalType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  INFORMATION = 'INFORMATION',
}

export interface ListNumberId {
  listId: number[];
}
export interface VoucherForNewCustomerModalProps {
  voucherById?: VoucherOverriding;
  voucher: InfiniteData<ListDataResponse<VoucherOverriding>> | undefined;
  visible?: boolean;
  modalType?: ModalType;
  onClose: () => void;
  refetchData: () => void;
  listProductIDInVoucher?: number[];
  onSetListProductIDInVoucher?: (ids: number[]) => void;
}

const VoucherForNewCustomerModal = ({
  visible,
  voucherById,
  modalType,
  onClose,
  refetchData,
}: VoucherForNewCustomerModalProps) => {
  const [discountBy, setDiscountBy] = useState<DiscountBy | string>(DiscountBy.DISCOUNT);

  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: defaultVoucherValues,
  });

  useEffect(() => {
    if (voucherById) {
      reset(voucherById);
    }
  }, [voucherById]);

  const getTitleModalAndButton = useMemo(() => {
    let result = {
      titleModal: '',
      titleButton: '',
    };
    switch (modalType) {
      case ModalType.CREATE:
        result = {
          titleModal: 'Thêm voucher cho người mới',
          titleButton: 'Thêm',
        };
        break;
      case ModalType.UPDATE:
        result = {
          titleModal: 'Cập nhật thông tin voucher',
          titleButton: 'Cập nhật',
        };
        break;
      case ModalType.INFORMATION:
        result = {
          titleModal: 'Thông tin voucher',
          titleButton: '',
        };
        break;
    }

    return result;
  }, [modalType]);

  // const onSubmit = async (data: Voucher) => {
  //   const newData: Voucher = {
  //     ...data,
  //     discount: data.discount || null,
  //     discountPercent: data.discountPercent || null,
  //     receivePointPercent: data.receivePointPercent || null,
  //     code: data?.code?.trim()?.toUpperCase(),
  //     name: data?.name?.trim(),
  //     description: data?.description?.trim(),
  //   };

  //   try {
  //     modalType === ModalType.CREATE
  //       ? await voucherService.createIntroduceVoucher(newData)
  //       : modalType === ModalType.UPDATE && (await voucherService.updateVoucher(newData, voucherById?.id as number));
  //     toast.success(
  //       `${
  //         modalType === ModalType.CREATE
  //           ? 'Thêm voucher thành công'
  //           : modalType === ModalType.UPDATE
  //           ? 'Cập nhật voucher thành công'
  //           : ''
  //       }`,
  //       {
  //         position: 'bottom-right',
  //         duration: 4000,
  //         icon: '👏',
  //       },
  //     );
  //     refetchData();
  //     onClose();
  //   } catch (err) {
  //     console.log(err);
  //     toast.success(
  //       `${
  //         modalType === ModalType.CREATE
  //           ? 'Thêm voucher thất bại'
  //           : modalType === ModalType.UPDATE
  //           ? 'Cập nhật voucher thất bại'
  //           : ''
  //       }`,
  //       {
  //         position: 'bottom-right',
  //         duration: 4000,
  //         icon: '😞',
  //       },
  //     );
  //   }
  // };

  // const handleCheckErrorWhenChangeValue = (value?: number | null) => {
  //   const valueMinimumOrderPrice = watch('minimumOrderPrice');
  //   if (valueMinimumOrderPrice) {
  //     if (value) {
  //       return value <= valueMinimumOrderPrice;
  //     }
  //   }
  // };

  const handleCheckLengthPercent = (value?: number | null) => {
    if (value) {
      return value >= 0 && value <= 100;
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
        style={{
          minWidth: '60%',
          maxHeight: '90%',
          top: 50,
          paddingBottom: 0,
          overflow: 'auto',
        }}
        footer={[
          modalType === ModalType.INFORMATION ? '' : <Button onClick={onClose}>Hủy</Button>,
          <Button
            form="form-voucher"
            key="submit"
            htmlType="submit"
            // loading={isLoading}
            style={{ background: '#1890ff', color: '#fff' }}
          >
            {getTitleModalAndButton.titleButton}
          </Button>,
        ]}
      >
        <form id="form-voucher" onSubmit={handleSubmit(onSubmit)}>
          <>
            <Row>
              {modalType != ModalType.INFORMATION ? (
                <Col span={24}>
                  <Typography.Text type="secondary" className="!text-black ">
                    <label
                      className="mb-2 block text-sm font-medium text-black dark:text-white"
                      htmlFor="name"
                    >
                      Tên voucher{' '}
                      {modalType !== ModalType.UPDATE && (
                        <strong className="text-xl text-danger">*</strong>
                      )}
                    </label>
                  </Typography.Text>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: true, pattern: PATTERN.CHECK_EMPTY }}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        value={value}
                        onChange={onChange}
                        className={`h-[38px] border-solid border-[1px] ${
                          errors.name ? '!border-danger' : ''
                        }`}
                        placeholder="Tên voucher"
                      />
                    )}
                  />
                  {errors.name?.type === 'required' && (
                    <small className="text-danger text-[13px]">Tên voucher không được rỗng</small>
                  )}
                  {errors.name?.type === 'pattern' && (
                    <small className="text-danger text-[13px]">Tên voucher không được rỗng</small>
                  )}
                </Col>
              ) : (
                <Col span={24}>
                  <Typography.Text type="secondary" className="!text-black ">
                    Tên voucher:&nbsp;
                  </Typography.Text>
                  <Typography.Text type="secondary" className="!text-black text-[15px] font-medium">
                    {voucherById?.name || ''}
                  </Typography.Text>
                </Col>
              )}
            </Row>
            <Row className="mt-2">
              {modalType != ModalType.INFORMATION ? (
                <Col span={24}>
                  <Typography.Text type="secondary" className="!text-black ">
                    <label
                      className="mb-2 block text-sm font-medium text-black dark:text-white"
                      htmlFor="code"
                    >
                      Mã voucher{' '}
                      {modalType !== ModalType.UPDATE && (
                        <strong className="text-xl text-danger">*</strong>
                      )}
                    </label>
                  </Typography.Text>
                  <Controller
                    rules={{ required: true, pattern: PATTERN.CHECK_EMPTY }}
                    name="code"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        value={value}
                        onChange={(e) => onChange(convertViToEn(e.target.value))}
                        disabled={modalType === ModalType.UPDATE}
                        className={`h-[38px] border-solid border-[1px] uppercase  ${
                          errors.code ? '!border-danger' : ''
                        }`}
                        placeholder="Mã voucher"
                      />
                    )}
                  />
                  {errors?.code?.type === 'required' && (
                    <small className="text-danger text-[13px]">Mã voucher không được rỗng</small>
                  )}
                  {errors?.code?.type === 'pattern' && (
                    <small className="text-danger text-[13px]">Mã voucher không được rỗng</small>
                  )}
                </Col>
              ) : (
                <Col span={24}>
                  <Typography.Text type="secondary" className="!text-black ">
                    Mã voucher:&nbsp;
                  </Typography.Text>
                  <Typography.Text type="secondary" className="!text-black text-[15px] font-medium">
                    {voucherById?.code || ''}
                  </Typography.Text>
                </Col>
              )}
            </Row>

            <Row className="mt-2">
              {modalType != ModalType.INFORMATION ? (
                <Col span={24}>
                  <Typography.Text type="secondary" className="!text-black ">
                    <label
                      className="mb-2 block text-sm font-medium text-black dark:text-white"
                      htmlFor="description"
                    >
                      Mô tả{' '}
                      {modalType !== ModalType.UPDATE && (
                        <strong className="text-xl text-danger">*</strong>
                      )}
                    </label>
                  </Typography.Text>
                  <Controller
                    name="description"
                    control={control}
                    rules={{ required: true, pattern: PATTERN.CHECK_EMPTY }}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        value={value}
                        onChange={onChange}
                        className={`h-[38px] border-solid border-[1px] ${
                          errors.description ? '!border-danger' : ''
                        } `}
                        placeholder="Mô tả"
                      />
                    )}
                  />
                  {errors?.description?.type === 'required' && (
                    <small className="text-danger text-[13px]">
                      {' '}
                      Mô tả voucher không được rỗng
                    </small>
                  )}
                  {errors?.description?.type === 'pattern' && (
                    <small className="text-danger text-[13px]">
                      {' '}
                      Mô tả voucher không được rỗng
                    </small>
                  )}
                </Col>
              ) : (
                <Col span={24}>
                  <Typography.Text type="secondary" className="!text-black ">
                    Mô tả:&nbsp;
                  </Typography.Text>
                  <Typography.Text type="secondary" className="!text-black text-[15px] font-medium">
                    {voucherById?.description || ''}
                  </Typography.Text>
                </Col>
              )}
            </Row>

            {modalType !== ModalType.INFORMATION ? (
              <Row>
                <Col span={24} className="mt-5">
                  <Typography.Text type="secondary" className="!text-black ">
                    <label
                      className="mb-2 block text-sm font-medium text-black dark:text-white"
                      htmlFor="promotionType"
                    >
                      Thể loại khuyến mãi
                    </label>
                  </Typography.Text>
                  <Controller
                    name="promotionType"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Radio.Group
                        onChange={(e: RadioChangeEvent) => onChange(e.target.value)}
                        value={value}
                        className={`${
                          modalType === ModalType.UPDATE
                            ? 'pointer-events-none cursor-not-allowed '
                            : ''
                        } `}
                        optionType="button"
                        buttonStyle="solid"
                        disabled={modalType === ModalType.UPDATE}
                      >
                        <Radio value={VoucherPromotionType.SALE}>Giảm giá</Radio>
                        {/* <Radio value={VoucherPromotionType.RECEIVE_MONEY}>Hoàn tiền</Radio> */}
                      </Radio.Group>
                    )}
                  />
                </Col>
              </Row>
            ) : (
              <Col span={12} className="mt-2">
                <Col span={24}>
                  <Typography.Text type="secondary" className="!text-black ">
                    Thể loại khuyến mãi:&nbsp;
                  </Typography.Text>
                  <Typography.Text type="secondary" className="!text-black text-[15px] font-medium">
                    {voucherById?.promotionType
                      ? voucherById?.promotionType === VoucherPromotionType.SALE
                        ? 'Giảm giá'
                        : 'Hoàn tiền'
                      : ''}
                  </Typography.Text>
                </Col>
              </Col>
            )}

            {modalType !== ModalType.INFORMATION && (
              <Row>
                <Col span={24} className="mt-5">
                  <Typography.Text type="secondary" className="!text-black ">
                    <label
                      className="mb-2 block text-sm font-medium text-black dark:text-white"
                      htmlFor="promotionType"
                    >
                      {`${
                        watch('promotionType') === VoucherPromotionType.SALE
                          ? 'Giảm giá theo'
                          : 'Hoàn tiền theo'
                      }`}
                    </label>
                  </Typography.Text>
                  <Radio.Group
                    onChange={(e: RadioChangeEvent) => setDiscountBy(e.target.value)}
                    value={discountBy}
                    className={`${
                      modalType === ModalType.UPDATE
                        ? 'pointer-events-none cursor-not-allowed '
                        : ''
                    } `}
                    optionType="button"
                    buttonStyle="solid"
                    disabled={modalType === ModalType.UPDATE}
                  >
                    <Radio value={DiscountBy.DISCOUNT}>Theo tiền</Radio>
                    <Radio value={DiscountBy.DISCOUNT_PERCENT}>Theo phần trăm</Radio>
                  </Radio.Group>
                </Col>
              </Row>
            )}

            {/* GIẢM GIÁ VÀ GIẢM THEO TIỀN */}
            {discountBy === DiscountBy.DISCOUNT &&
            watch('promotionType') === VoucherPromotionType.SALE &&
            modalType !== ModalType.INFORMATION ? (
              <Row>
                <Col span={12} className="mt-5">
                  <Typography.Text type="secondary" className="!text-black ">
                    <label
                      className="mb-2 block text-sm  font-medium text-black dark:text-white"
                      htmlFor="discount"
                    >
                      Nhập số tiền được giảm
                    </label>
                  </Typography.Text>
                  <Controller
                    name="discount"
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <InputNumber
                        formatter={(value) =>
                          value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                        }
                        parser={(displayValue?: string) =>
                          displayValue ? Number(displayValue.replace(/\$\s?|(,*)/g, '')) : 0
                        }
                        value={value}
                        min={0}
                        onChange={(value) => value && onChange(value)}
                        className={`h-[38px] !w-full   ${
                          errors.discount
                            ? '!border-danger border-solid  border-[100%] border-t-0 border-l-0'
                            : ''
                        } `}
                        placeholder="Nhập số tiền được giảm"
                        controls={false}
                        addonAfter="đ"
                      />
                    )}
                  />
                  {errors.discount && (
                    <small className="text-danger text-[13px]">
                      Số tiền được giảm phải nhỏ hơn giá trị đơn hàng
                    </small>
                  )}
                </Col>
              </Row>
            ) : (
              discountBy === DiscountBy.DISCOUNT &&
              watch('promotionType') === VoucherPromotionType.SALE &&
              modalType === ModalType.INFORMATION && (
                <Col span={12} className="mt-2">
                  <Col span={24}>
                    <Typography.Text type="secondary" className="!text-black ">
                      Số tiền được giảm:&nbsp;
                    </Typography.Text>
                    <Typography.Text
                      type="secondary"
                      className="!text-black text-[15px] font-medium"
                    >
                      {voucherById?.discount
                        ? Number(voucherById.discount).toLocaleString('EN') + ' ' + 'đ'
                        : ''}
                    </Typography.Text>
                  </Col>
                </Col>
              )
            )}
            {
              // GIẢM GIÁ VÀ THEO PHẦN TRĂM
              discountBy === DiscountBy.DISCOUNT_PERCENT &&
              watch('promotionType') === VoucherPromotionType.SALE &&
              modalType !== ModalType.INFORMATION ? (
                <Row className="!flex !flex-col">
                  <Col span={12} className="mt-5">
                    <Typography.Text type="secondary" className="!text-black ">
                      <label
                        className="mb-2 block text-sm  font-medium text-black dark:text-white"
                        htmlFor="discountPercent"
                      >
                        Nhập phần trăm
                      </label>
                    </Typography.Text>
                    <Controller
                      name="discountPercent"
                      control={control}
                      rules={{
                        validate: {
                          checkLengthPercent: (value) => handleCheckLengthPercent(value),
                        },
                      }}
                      render={({ field: { value, onChange } }) => (
                        <InputNumber
                          value={value}
                          className={`!h-[38px] !w-full ${
                            errors.discountPercent
                              ? '!border-danger border-solid  border-[100%] border-t-0 border-l-0'
                              : ''
                          } `}
                          onChange={(value) => value && onChange(value)}
                          placeholder="Nhập phần trăm"
                          addonAfter="%"
                          controls={false}
                        />
                      )}
                    />
                    {errors.discountPercent && (
                      <small className="text-danger text-[13px]">
                        Phần trăm phải nằm trong khoản từ 0 đến 100
                      </small>
                    )}
                  </Col>

                  <Col span={12} className="mt-2">
                    <Typography.Text type="secondary" className="!text-black ">
                      <label
                        className="mb-2 block text-sm  font-medium text-black dark:text-white"
                        htmlFor="discountPercent"
                      >
                        Số tiền được giảm tối đa
                      </label>
                    </Typography.Text>
                    <Controller
                      name="maxPromotion"
                      control={control}
                      rules={{
                        validate: {
                          lengthLessThanOrEqual: (value) => handleCheckErrorWhenChangeValue(value),
                        },
                      }}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <InputNumber
                            formatter={(value) =>
                              value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                            }
                            parser={(displayValue?: string) =>
                              displayValue ? Number(displayValue.replace(/\$\s?|(,*)/g, '')) : 0
                            }
                            value={value}
                            min={0}
                            onChange={(value) => value && onChange(value)}
                            className={`h-[38px] !w-full ${
                              errors.maxPromotion
                                ? '!border-danger border-solid  border-[100%] border-t-0 border-l-0'
                                : ''
                            } `}
                            placeholder="Số tiền được giảm tối đa"
                            controls={false}
                            addonAfter="đ"
                          />
                        );
                      }}
                    />
                    {errors.maxPromotion && (
                      <small className="text-danger text-[13px]">
                        Số tiền được giảm tối đa phải nhỏ hơn giá trị đơn hàng
                      </small>
                    )}
                  </Col>
                </Row>
              ) : (
                discountBy === DiscountBy.DISCOUNT_PERCENT &&
                watch('promotionType') === VoucherPromotionType.SALE &&
                modalType === ModalType.INFORMATION && (
                  <Row>
                    <Col span={12} className="mt-2">
                      <Col span={24}>
                        <Typography.Text type="secondary" className="!text-black ">
                          Phần trăm được giảm:&nbsp;
                        </Typography.Text>
                        <Typography.Text
                          type="secondary"
                          className="!text-black text-[15px] font-medium"
                        >
                          {voucherById?.discountPercent
                            ? Number(voucherById.discountPercent) + '%'
                            : ''}
                        </Typography.Text>
                      </Col>
                    </Col>
                    <Col span={12} className="mt-2">
                      <Col span={24}>
                        <Typography.Text type="secondary" className="!text-black ">
                          Số tiền được giảm tối đa:&nbsp;
                        </Typography.Text>
                        <Typography.Text
                          type="secondary"
                          className="!text-black text-[15px] font-medium"
                        >
                          {voucherById?.maxPromotion
                            ? Number(voucherById.maxPromotion) + ' ' + 'đ'
                            : ''}
                        </Typography.Text>
                      </Col>
                    </Col>
                  </Row>
                )
              )
            }

            {/*  HOÀN TIỀN VÀ GIẢM THEO TIỀN */}
            {discountBy === DiscountBy.DISCOUNT &&
            watch('promotionType') === VoucherPromotionType.RECEIVE_MONEY &&
            modalType !== ModalType.INFORMATION ? (
              <Row>
                <Col span={12} className="mt-5">
                  <Typography.Text type="secondary" className="!text-black ">
                    <label className="mb-2 block text-sm  font-medium text-black dark:text-white">
                      Nhập số tiền được hoàn lại
                    </label>
                  </Typography.Text>
                  <Controller
                    name="receivePoint"
                    control={control}
                    rules={{
                      validate: {
                        lengthLessThanOrEqual: (value) => handleCheckErrorWhenChangeValue(value),
                      },
                    }}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <InputNumber
                          formatter={(value) =>
                            value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                          }
                          parser={(displayValue?: string) =>
                            displayValue ? Number(displayValue.replace(/\$\s?|(,*)/g, '')) : 0
                          }
                          value={value}
                          min={0}
                          onChange={(value) => value && onChange(value)}
                          className={`h-[38px] !w-full   ${
                            errors.receivePoint
                              ? '!border-danger border-solid  border-[100%] border-t-0 border-l-0'
                              : ''
                          } `}
                          placeholder="Nhập số tiền được hoàn lại"
                          controls={false}
                          addonAfter="đ"
                        />
                      );
                    }}
                  />
                  {errors.receivePoint && (
                    <small className="text-danger text-[13px]">
                      Số tiền được hoàn lại phải nhỏ hơn giá trị đơn hàng
                    </small>
                  )}
                </Col>
              </Row>
            ) : (
              discountBy === DiscountBy.DISCOUNT &&
              watch('promotionType') === VoucherPromotionType.RECEIVE_MONEY &&
              modalType === ModalType.INFORMATION && (
                <Col span={12} className="mt-2">
                  <Col span={24}>
                    <Typography.Text type="secondary" className="!text-black ">
                      Số tiền được hoàn lại:&nbsp;
                    </Typography.Text>
                    <Typography.Text
                      type="secondary"
                      className="!text-black text-[15px] font-medium"
                    >
                      {voucherById?.receivePoint
                        ? Number(voucherById.receivePoint).toLocaleString('EN') + ' ' + 'đ'
                        : ''}
                    </Typography.Text>
                  </Col>
                </Col>
              )
            )}

            {
              // HOÀN TIỀN VÀ THEO PHẦN TRĂM
              discountBy === DiscountBy.DISCOUNT_PERCENT &&
              watch('promotionType') === VoucherPromotionType.RECEIVE_MONEY &&
              modalType !== ModalType.INFORMATION ? (
                <Row className="!flex !flex-col">
                  <Col span={12} className="mt-5">
                    <Typography.Text type="secondary" className="!text-black ">
                      <label
                        className="mb-2 block text-sm  font-medium text-black dark:text-white"
                        htmlFor="receiveMoneyPercent"
                      >
                        Nhập phần trăm được hoàn lại:
                      </label>
                    </Typography.Text>
                    <Controller
                      name="receivePointPercent"
                      control={control}
                      rules={{
                        validate: {
                          checkLengthPercent: (value) => handleCheckLengthPercent(value),
                        },
                      }}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <InputNumber
                            value={value}
                            className={`!h-[38px] !w-full ${
                              errors.receivePointPercent
                                ? '!border-danger border-solid  border-[100%] border-t-0 border-l-0'
                                : ''
                            } `}
                            onChange={(value) => onChange(Number(value))}
                            placeholder="Nhập phần trăm được hoàn lại"
                            addonAfter="%"
                            controls={false}
                          />
                        );
                      }}
                    />
                    {errors.receivePointPercent && (
                      <small className="text-danger text-[13px]">
                        Phần trăm phải nằm trong khoản từ 0 đến 100
                      </small>
                    )}
                  </Col>

                  <Col span={12} className="mt-2">
                    <Typography.Text type="secondary" className="!text-black ">
                      <label
                        className="mb-2 block text-sm  font-medium text-black dark:text-white"
                        htmlFor="maxPromotion"
                      >
                        Số tiền được hoàn lại tối đa:
                      </label>
                    </Typography.Text>
                    <Controller
                      name="maxPromotion"
                      control={control}
                      rules={{
                        validate: {
                          lengthLessThanOrEqual: (value) => handleCheckErrorWhenChangeValue(value),
                        },
                      }}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <InputNumber
                            formatter={(value) =>
                              value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : ''
                            }
                            parser={(displayValue?: string) =>
                              displayValue ? Number(displayValue.replace(/\$\s?|(,*)/g, '')) : 0
                            }
                            value={value}
                            min={0}
                            onChange={(value) => value && onChange(value)}
                            className={`h-[38px] !w-full ${
                              errors.maxPromotion
                                ? '!border-danger border-solid  border-[100%] border-t-0 border-l-0'
                                : ''
                            } `}
                            placeholder="Số tiền được hoàn lại tối đa"
                            controls={false}
                            addonAfter="đ"
                          />
                        );
                      }}
                    />

                    {errors.maxPromotion && (
                      <small className="text-danger text-[13px]">
                        Số tiền được hoàn lại tối đa phải nhỏ hơn giá trị đơn hàng
                      </small>
                    )}
                  </Col>
                </Row>
              ) : (
                discountBy === DiscountBy.DISCOUNT_PERCENT &&
                watch('promotionType') === VoucherPromotionType.RECEIVE_MONEY &&
                modalType === ModalType.INFORMATION && (
                  <Row>
                    <Col span={12} className="mt-2">
                      <Col span={24}>
                        <Typography.Text type="secondary" className="!text-black ">
                          Phần trăm được hoàn lại:&nbsp;
                        </Typography.Text>
                        <Typography.Text
                          type="secondary"
                          className="!text-black text-[15px] font-medium"
                        >
                          {voucherById?.receivePointPercent
                            ? Number(voucherById.receivePointPercent) + '%'
                            : ''}
                        </Typography.Text>
                      </Col>
                    </Col>
                    <Col span={12} className="mt-2">
                      <Col span={24}>
                        <Typography.Text type="secondary" className="!text-black ">
                          Số tiền được giảm tối đa:&nbsp;
                        </Typography.Text>
                        <Typography.Text
                          type="secondary"
                          className="!text-black text-[15px] font-medium"
                        >
                          {voucherById?.maxPromotion
                            ? Number(voucherById.maxPromotion).toLocaleString('EN') + ' ' + 'đ'
                            : ''}
                        </Typography.Text>
                      </Col>
                    </Col>
                  </Row>
                )
              )
            }
          </>
        </form>
      </Modal>
    </>
  );
};

export default VoucherForNewCustomerModal;
