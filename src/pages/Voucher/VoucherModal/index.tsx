/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react';
import './index.scss';
import {
  Button,
  Col,
  DatePicker,
  Input,
  InputNumber,
  Modal,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Typography,
} from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
  DiscountBy,
  PromotionsType,
  SaleScope,
  StatusVoucher,
  Voucher,
  VoucherOverriding,
  VoucherPromotionType,
  VoucherStatus,
  VoucherType,
  VoucherTypes,
} from '~/models/voucher';
import VoucherApplyForProductTable, { Pagination } from '../VoucherApplyForProducTable';
import SVG from 'react-inlinesvg';
import SEARCH_ICON from '~ assets/svg/search.svg';
import {
  DATE_FORMAT_DDMMYYYYTHHMMSS,
  DATE_FORMAT_DDMMYYYY_THHMMSS,
  DATE_FORMAT_YYYYMMDDTHHMMSS,
} from '~/utils/date.utils';
import moment from 'moment';
import { voucherService } from '~/services/voucherService';
import { QUERY_KEY } from '~/constants/querryKey';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import useDebounce from '~/hooks/useDebounce';
import { productService } from '~/services/productService';
import { ListDataResponse, ListResponse } from '~/types';
import ListProductGetFromVoucher from '../ListProductGetFromVoucher';
import snippingLoading from '~/assets/gif/sniping-loading.gif';
import { PATTERN } from '~/utils/regex';
import convertViToEn from '~/utils/convertViToEn';
import Loading from '~/components/Loading';

const defaultVoucherValues: VoucherOverriding = {
  name: '',
  code: '',
  description: '',
  saleScope: SaleScope.ALL,
  promotionType: PromotionsType.DISCOUNT_BY_MONEY,
  startDate: '',
  endDate: '',
  minimumOrderValue: 1,
  totalQuantityVoucher: 1,
  discount: 0,
  discountPercent: 0,
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
export interface VoucherModalProps {
  voucherById?: VoucherOverriding;
  voucher: InfiniteData<ListDataResponse<VoucherOverriding>> | undefined;
  visible?: boolean;
  modalType?: ModalType;
  onClose: () => void;
  refetchData: () => void;
  listProductIdInVoucher: string[];
  onSetListProductIdInVoucher: (ids: string[]) => void;
}

interface VoucherDate {
  startDate?: string | Date;
  endDate?: string | Date;
}

const VoucherModal = ({
  visible,
  voucherById,
  modalType,
  onClose,
  refetchData,
  listProductIdInVoucher,
  onSetListProductIdInVoucher,
}: VoucherModalProps) => {
  const [searchText, setSearchText] = useState<string>('');
  const [showVoucherApplyForProductTable, setShowVoucherApplyForProductTable] = useState<boolean>(false);
  const [listSelectionKeyProduct, setListSelectionKeyProduct] = useState<string[]>([]);
  const [onGetPagination, setOnGetPagination] = useState<Pagination>({ current: 0, pageSize: 10 });
  const [voucherDate, setVoucherDate] = useState<VoucherDate>({
    startDate: '',
    endDate: '',
  });
  const [discountBy, setDiscountBy] = useState<DiscountBy | string>(PromotionsType.DISCOUNT_BY_MONEY);
  const [isLoadingWhenCallApiCreateOrUpdate, setIsLoadingWhenCallApiCreateOrUpdate] = useState<boolean>(false);

  const {
    control,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    clearErrors,
  } = useForm({
    defaultValues: defaultVoucherValues,
  });

  const searchProduct = useDebounce(searchText, 500);

  useEffect(() => {
    if (voucherById) {
      reset(voucherById);
      setVoucherDate({
        startDate: voucherById.startDate ?? '',
        endDate: voucherById.endDate ?? '',
      });
      if (voucherById?.promotionType) {
        setValue('promotionType', voucherById.promotionType);
        setDiscountBy(voucherById.promotionType);
      }
      // if (voucherById.discount || voucherById.receivePoint) {
      //   setDiscountBy(DiscountBy.DISCOUNT);
      // }
      // if (voucherById.discountPercent || voucherById.receivePointPercent) {
      //   setDiscountBy(DiscountBy.DISCOUNT_PERCENT);
      // }
    }
  }, [voucherById]);

  console.log("watch('promotionType')", watch('promotionType'));

  const getTitleModalAndButton = useMemo(() => {
    let result = {
      titleModal: '',
      titleButton: '',
    };
    switch (modalType) {
      case ModalType.CREATE:
        result = {
          titleModal: 'Thêm voucher',
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

  const handleSetProductIds = useMemo(() => {
    return listSelectionKeyProduct.flatMap((item) => (watch('saleScope') !== SaleScope.ALL ? [item] : []));
  }, [watch('saleScope'), listSelectionKeyProduct]);

  const { data: product, isLoading: isLoadingProduct } = useInfiniteQuery(
    [QUERY_KEY.PRODUCT_IN_ZALO_MINI_APP, searchProduct, onGetPagination],
    async () => {
      const params = { pageIndex: onGetPagination.current, pageSize: onGetPagination.pageSize, name: searchProduct };
      return await productService.getProductPagination(params);
    },
  );

  const handleUpdateNewProductId = useMemo(() => {
    return listProductIdInVoucher?.flatMap((item) => (item ? [item] : []));
  }, [listProductIdInVoucher]);

  useEffect(() => {
    if (voucherDate.endDate) {
      clearErrors('endDate');
    }
  }, [voucherDate.endDate]);

  const onSubmit = async (data: VoucherOverriding) => {
    let newData: VoucherOverriding = data;
    if (voucherDate.endDate === '' || errors.endDate?.type === 'required') {
      setError('endDate', {
        type: 'required',
        message: 'Ngày bắt đầu và ngày kết thúc không được rỗng',
      });
    } else {
      setIsLoadingWhenCallApiCreateOrUpdate(true);
      const startDateFormat =
        modalType === ModalType.CREATE
          ? moment(voucherDate.startDate, DATE_FORMAT_DDMMYYYYTHHMMSS).format(DATE_FORMAT_YYYYMMDDTHHMMSS)
          : voucherDate.startDate;
      const endDateFormat =
        modalType === ModalType.CREATE
          ? moment(voucherDate.endDate, DATE_FORMAT_DDMMYYYYTHHMMSS).format(DATE_FORMAT_YYYYMMDDTHHMMSS)
          : voucherDate.endDate;
      newData = {
        ...newData,
        startDate: startDateFormat,
        endDate: endDateFormat,
        discount: newData.discount || null,
        discountPercent: newData.discountPercent || null,
        code: newData?.code?.trim()?.toUpperCase(),
        name: newData?.name?.trim(),
        description: newData?.description?.trim(),
        promotionType: discountBy as PromotionsType,
      };

      if (handleSetProductIds && modalType === ModalType.CREATE) {
        newData = {
          ...newData,
          listProductUsedVoucher: [...handleSetProductIds],
        };
      } else if (handleUpdateNewProductId && modalType === ModalType.UPDATE) {
        const productIds = handleUpdateNewProductId.concat(handleSetProductIds);
        newData = {
          ...newData,
          listProductUsedVoucher: [...productIds],
        };
      }

      try {
        modalType === ModalType.CREATE
          ? await voucherService.createVoucher(newData)
          : modalType === ModalType.UPDATE &&
            voucherById?._id &&
            (await voucherService.updateVoucher(newData, voucherById?._id));
        toast.success(
          `${
            modalType === ModalType.CREATE
              ? 'Thêm voucher thành công'
              : modalType === ModalType.UPDATE
              ? 'Cập nhật voucher thành công'
              : ''
          }`,
          {
            position: 'bottom-right',
            duration: 4000,
            icon: '👏',
          },
        );
        setIsLoadingWhenCallApiCreateOrUpdate(false);
        refetchData();
        onClose();
      } catch (err: any) {
        if (err.response.status !== 400) {
          toast.success('Thêm voucher thất bại', {
            position: 'bottom-right',
            duration: 4000,
            icon: '😞',
          });
          return;
        }
        toast.success(
          `Thêm voucher thất bại vì đã có một voucher cùng loại đang tồn tại trong hệ thống. Vui lòng thay đổi thời gian diễn ra để tránh trùng lặp.`,
          {
            position: 'bottom-right',
            duration: 4000,
            icon: '😞',
          },
        );
        setIsLoadingWhenCallApiCreateOrUpdate(false);
      }
    }
  };

  const handleShowBtnVoucherApplyForProductTable = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setShowVoucherApplyForProductTable(!showVoucherApplyForProductTable);
  };

  const handleChangeStartAndEndDate = (value: any, dateStrings: [string, string]) => {
    setVoucherDate({
      startDate: value[0] ? value[0]._d : '',
      endDate: value[1] ? value[1]._d : '',
    });
  };

  const handleCheckErrorWhenChangeValue = (value?: any) => {
    const valueMinimumOrderPrice = watch('minimumOrderValue');
    if (valueMinimumOrderPrice) {
      if (value) {
        return value <= valueMinimumOrderPrice;
      }
    }
  };

  const handleCheckLengthPercent = (value?: number | null) => {
    if (value) {
      return value >= 0 && value <= 100;
    }
  };

  const handleCheckExpiredVoucher = useMemo(() => {
    if (voucherById?.status) {
      switch (voucherById?.status) {
        case StatusVoucher.IN_ACTIVE:
          return <span className='font-semibold text-[14px] text-danger'>(Đã kết thúc)</span>;
        case StatusVoucher.ACTIVE:
          return <span className='font-semibold text-[14px] text-success'>(Đang diễn ra)</span>;
        case StatusVoucher.IN_COMING:
          return <span className='font-semibold text-[14px] text-meta-8'>(Sắp diễn ra)</span>;
        default:
          return <span className='font-semibold text-[14px] text-danger'></span>;
      }
    }
  }, [voucherById]);

  return (
    <>
      <Modal
        open={visible}
        title={getTitleModalAndButton.titleModal}
        okText='Lưu thay đổi'
        cancelText='Hủy bỏ'
        onCancel={onClose}
        style={{ minWidth: '60%', maxHeight: '90%', top: 50, paddingBottom: 0, overflow: 'auto' }}
        footer={[
          modalType === ModalType.INFORMATION ? '' : <Button onClick={onClose}>Hủy</Button>,
          <Button
            form='form-voucher'
            key='submit'
            htmlType='submit'
            // loading={isLoading}
            className='!bg-primary !text-white hover:!text-white border border-solid !border-primary'
          >
            {getTitleModalAndButton.titleButton}
          </Button>,
        ]}
      >
        <form
          id='form-voucher'
          onSubmit={handleSubmit(onSubmit)}
        >
          <>
            <Row>
              {modalType != ModalType.INFORMATION ? (
                <Col span={24}>
                  <Typography.Text
                    type='secondary'
                    className='!text-black '
                  >
                    <label
                      className='mb-2 block text-sm font-medium text-black dark:text-white'
                      htmlFor='name'
                    >
                      Tên voucher {modalType !== ModalType.UPDATE && <strong className='text-xl text-danger'>*</strong>}
                    </label>
                  </Typography.Text>
                  <Controller
                    name='name'
                    control={control}
                    rules={{ required: true, pattern: PATTERN.CHECK_EMPTY }}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        value={value}
                        onChange={onChange}
                        className={`h-[38px] border-solid border-[1px] ${errors.name ? '!border-danger' : ''}`}
                        placeholder='Tên voucher'
                      />
                    )}
                  />
                  {errors.name?.type === 'required' && (
                    <small className='text-danger text-[13px]'>Tên voucher không được rỗng</small>
                  )}
                  {errors.name?.type === 'pattern' && (
                    <small className='text-danger text-[13px]'>Tên voucher không được rỗng</small>
                  )}
                </Col>
              ) : (
                <Col span={24}>
                  <Typography.Text
                    type='secondary'
                    className='!text-black '
                  >
                    Tên voucher:&nbsp;
                  </Typography.Text>
                  <Typography.Text
                    type='secondary'
                    className='!text-black text-[15px] font-medium'
                  >
                    {voucherById?.name || ''}
                  </Typography.Text>
                </Col>
              )}
            </Row>
            <Row className='mt-2'>
              {modalType != ModalType.INFORMATION ? (
                <Col span={24}>
                  <Typography.Text
                    type='secondary'
                    className='!text-black '
                  >
                    <label
                      className='mb-2 block text-sm font-medium text-black dark:text-white'
                      htmlFor='code'
                    >
                      Mã voucher {modalType !== ModalType.UPDATE && <strong className='text-xl text-danger'>*</strong>}
                    </label>
                  </Typography.Text>
                  <Controller
                    rules={{ required: true, pattern: PATTERN.CHECK_EMPTY }}
                    name='code'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        value={value}
                        onChange={(e) => onChange(convertViToEn(e.target.value))}
                        disabled={modalType === ModalType.UPDATE}
                        className={`h-[38px] border-solid border-[1px] uppercase  ${
                          errors.code ? '!border-danger' : ''
                        }`}
                        placeholder='Mã voucher'
                      />
                    )}
                  />
                  {errors?.code?.type === 'required' && (
                    <small className='text-danger text-[13px]'>Mã voucher không được rỗng</small>
                  )}
                  {errors?.code?.type === 'pattern' && (
                    <small className='text-danger text-[13px]'>Mã voucher không được rỗng</small>
                  )}
                </Col>
              ) : (
                <Col span={24}>
                  <Typography.Text
                    type='secondary'
                    className='!text-black '
                  >
                    Mã voucher:&nbsp;
                  </Typography.Text>
                  <Typography.Text
                    type='secondary'
                    className='!text-black text-[15px] font-medium'
                  >
                    {voucherById?.code || ''}
                  </Typography.Text>
                </Col>
              )}
            </Row>
            <Row className='mt-2'>
              {modalType != ModalType.INFORMATION ? (
                <Col span={24}>
                  <Typography.Text
                    type='secondary'
                    className='!text-black '
                  >
                    <label
                      className='mb-2 block text-sm font-medium text-black dark:text-white'
                      htmlFor='description'
                    >
                      Mô tả {modalType !== ModalType.UPDATE && <strong className='text-xl text-danger'>*</strong>}
                    </label>
                  </Typography.Text>
                  <Controller
                    name='description'
                    control={control}
                    rules={{ required: true, pattern: PATTERN.CHECK_EMPTY }}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        value={value}
                        onChange={onChange}
                        className={`h-[38px] border-solid border-[1px] ${errors.description ? '!border-danger' : ''} `}
                        placeholder='Mô tả'
                      />
                    )}
                  />
                  {errors?.description?.type === 'required' && (
                    <small className='text-danger text-[13px]'> Mô tả voucher không được rỗng</small>
                  )}
                  {errors?.description?.type === 'pattern' && (
                    <small className='text-danger text-[13px]'> Mô tả voucher không được rỗng</small>
                  )}
                </Col>
              ) : (
                <Col span={24}>
                  <Typography.Text
                    type='secondary'
                    className='!text-black '
                  >
                    Mô tả:&nbsp;
                  </Typography.Text>
                  <Typography.Text
                    type='secondary'
                    className='!text-black text-[15px] font-medium'
                  >
                    {voucherById?.description || ''}
                  </Typography.Text>
                </Col>
              )}
            </Row>
            {modalType !== ModalType.INFORMATION ? (
              <Row>
                <Col
                  span={12}
                  className='mt-5'
                >
                  <Typography.Text
                    type='secondary'
                    className='!text-black '
                  >
                    <label className='mb-2 block text-sm  font-medium text-black dark:text-white'>
                      Thời gian diễn ra{' '}
                      {modalType !== ModalType.UPDATE && <strong className='text-xl text-danger'>*</strong>}&nbsp;
                      {modalType === ModalType.UPDATE && handleCheckExpiredVoucher}
                    </label>
                  </Typography.Text>
                  {modalType === ModalType.UPDATE ? (
                    <DatePicker.RangePicker
                      showTime={{ format: 'HH:mm:ss' }}
                      format={[DATE_FORMAT_DDMMYYYY_THHMMSS, DATE_FORMAT_DDMMYYYY_THHMMSS]}
                      placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                      onChange={handleChangeStartAndEndDate}
                      value={[moment(voucherDate.startDate), moment(voucherDate.endDate)]}
                      disabled={[true, false]}
                      className='!w-full'
                      inputReadOnly
                    />
                  ) : (
                    modalType === ModalType.CREATE && (
                      <>
                        <DatePicker.RangePicker
                          showTime={{ format: DATE_FORMAT_DDMMYYYY_THHMMSS }}
                          format={DATE_FORMAT_DDMMYYYY_THHMMSS}
                          placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                          onChange={handleChangeStartAndEndDate}
                          className={`h-[38px] !w-full border-solid border-[1px] ${
                            errors.endDate?.type === 'required' && voucherDate.endDate === '' ? '!border-danger' : ''
                          } `}
                          inputReadOnly={true}
                        />
                        {errors?.endDate?.type === 'required' && voucherDate.endDate === '' && (
                          <small className='text-danger text-[13px]'>{errors?.endDate.message}</small>
                        )}
                      </>
                    )
                  )}
                </Col>
              </Row>
            ) : (
              <Row className='mt-2'>
                <Col span={12}>
                  <Typography.Text
                    type='secondary'
                    className='!text-black '
                  >
                    Ngày bắt đầu:&nbsp;
                  </Typography.Text>
                  <Typography.Text
                    type='secondary'
                    className='!text-black text-[15px] font-medium'
                  >
                    {voucherDate?.startDate ? moment(voucherDate.startDate).format(DATE_FORMAT_DDMMYYYY_THHMMSS) : ''}
                  </Typography.Text>
                </Col>

                <Col span={12}>
                  <Typography.Text
                    type='secondary'
                    className='!text-black '
                  >
                    Ngày kết thúc:&nbsp;
                  </Typography.Text>
                  <Typography.Text
                    type='secondary'
                    className='!text-black text-[15px] font-medium'
                  >
                    {voucherDate?.endDate ? moment(voucherDate.endDate).format(DATE_FORMAT_DDMMYYYY_THHMMSS) : ''}
                  </Typography.Text>
                </Col>
              </Row>
            )}
            {modalType !== ModalType.INFORMATION ? (
              <Row>
                <Col
                  span={12}
                  className='mt-5'
                >
                  <Typography.Text
                    type='secondary'
                    className='!text-black '
                  >
                    <label
                      className='mb-2 block text-sm  font-medium text-black dark:text-white'
                      htmlFor='promotionType'
                    >
                      Tổng số lượng mã giảm giá
                    </label>
                  </Typography.Text>
                  <Controller
                    name='totalQuantityVoucher'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        type='number'
                        value={value}
                        min={1}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(Number(e.target.value))}
                        className={`h-[38px] border-solid border-[1px]`}
                        placeholder='Tổng số lượng mã giảm giá'
                      />
                    )}
                  />
                </Col>
              </Row>
            ) : (
              <Row className='mt-2'>
                <Col span={12}>
                  <Typography.Text
                    type='secondary'
                    className='!text-black '
                  >
                    Tổng số lượng mã giảm giá:&nbsp;
                  </Typography.Text>
                  <Typography.Text
                    type='secondary'
                    className='!text-black text-[15px] font-medium'
                  >
                    {voucherById?.totalQuantityVoucher || 0}
                  </Typography.Text>
                </Col>
              </Row>
            )}
            {modalType !== ModalType.INFORMATION ? (
              <Row>
                <Col
                  span={12}
                  className='mt-5'
                >
                  <Typography.Text
                    type='secondary'
                    className='!text-black '
                  >
                    <label
                      className='mb-2 block text-sm  font-medium text-black dark:text-white'
                      htmlFor='promotionType'
                    >
                      Giá trị đơn hàng tối thiểu được sử dụng mã giảm giá
                    </label>
                  </Typography.Text>
                  <Controller
                    name='minimumOrderValue'
                    control={control}
                    render={({ field: { value, onChange } }) => {
                      return (
                        <InputNumber
                          formatter={(value, __info) => (value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
                          parser={(displayValue) =>
                            displayValue ? Number.parseInt(`${displayValue}`.replace(/\$\s?|(,*)/g, '')) : 0
                          }
                          value={value}
                          min={0}
                          onChange={(value) => value && onChange(value)}
                          className='h-[38px] !w-full'
                          placeholder='Giá trị đơn hàng tối thiểu được sử dụng mã giảm giá'
                          controls={false}
                          addonAfter='đ'
                          disabled={modalType === ModalType.UPDATE}
                        />
                      );
                    }}
                  />
                </Col>
              </Row>
            ) : (
              <Row className='mt-2'>
                <Col span={12}>
                  <Typography.Text
                    type='secondary'
                    className='!text-black '
                  >
                    Giá trị đơn hàng tối thiểu được sử dụng mã giảm giá:&nbsp;
                  </Typography.Text>
                  <Typography.Text
                    type='secondary'
                    className='!text-black text-[15px] font-medium'
                  >
                    {voucherById?.minimumOrderValue
                      ? `${Number(voucherById?.minimumOrderValue).toLocaleString('EN')} đ`
                      : 0}
                  </Typography.Text>
                </Col>
              </Row>
            )}

            {modalType !== ModalType.INFORMATION && (
              <Row>
                <Col
                  span={24}
                  className='mt-5'
                >
                  <Typography.Text
                    type='secondary'
                    className='!text-black '
                  >
                    <label
                      className='mb-2 block text-sm font-medium text-black dark:text-white'
                      htmlFor='promotionType'
                    >
                      Giảm giá
                    </label>
                  </Typography.Text>
                  <Radio.Group
                    onChange={(e: RadioChangeEvent) => setDiscountBy(e.target.value)}
                    value={discountBy}
                    className={`${modalType === ModalType.UPDATE ? 'pointer-events-none cursor-not-allowed ' : ''} `}
                    optionType='button'
                    buttonStyle='solid'
                    disabled={modalType === ModalType.UPDATE}
                  >
                    <Radio value={PromotionsType.DISCOUNT_BY_MONEY}>Theo tiền</Radio>
                    <Radio value={PromotionsType.DISCOUNT_BY_PERCENT}>Theo phần trăm</Radio>
                  </Radio.Group>
                </Col>
              </Row>
            )}
            {/* GIẢM GIÁ VÀ GIẢM THEO TIỀN */}
            {discountBy === PromotionsType.DISCOUNT_BY_MONEY &&
            // watch('promotionType') === PromotionsType.DISCOUNT_BY_MONEY &&
            modalType !== ModalType.INFORMATION ? (
              <Row>
                <Col
                  span={12}
                  className='mt-5'
                >
                  <Typography.Text
                    type='secondary'
                    className='!text-black '
                  >
                    <label
                      className='mb-2 block text-sm  font-medium text-black dark:text-white'
                      htmlFor='discount'
                    >
                      Nhập số tiền được giảm
                    </label>
                  </Typography.Text>
                  <Controller
                    name='discount'
                    control={control}
                    rules={{
                      validate: {
                        lengthLessThanOrEqual: (value) => handleCheckErrorWhenChangeValue(value),
                      },
                    }}
                    render={({ field: { value, onChange } }) => (
                      <InputNumber
                        formatter={(value) => (value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '')}
                        parser={(displayValue?: string) =>
                          displayValue ? Number(displayValue.replace(/\$\s?|(,*)/g, '')) : 0
                        }
                        value={value}
                        min={0}
                        onChange={(value) => value && onChange(value)}
                        className={`h-[38px] !w-full   ${
                          errors.discount ? '!border-danger border-solid  border-[100%] border-t-0 border-l-0' : ''
                        } `}
                        placeholder='Nhập số tiền được giảm'
                        controls={false}
                        addonAfter='đ'
                      />
                    )}
                  />
                  {errors.discount && (
                    <small className='text-danger text-[13px]'>Số tiền được giảm phải nhỏ hơn giá trị đơn hàng</small>
                  )}
                </Col>
              </Row>
            ) : (
              discountBy === PromotionsType.DISCOUNT_BY_MONEY &&
              watch('promotionType') === PromotionsType.DISCOUNT_BY_MONEY &&
              modalType === ModalType.INFORMATION && (
                <Col
                  span={12}
                  className='mt-2'
                >
                  <Col span={24}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black '
                    >
                      Số tiền được giảm:&nbsp;
                    </Typography.Text>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[15px] font-medium'
                    >
                      {voucherById?.discount ? Number(voucherById.discount).toLocaleString('EN') + ' ' + 'đ' : ''}
                    </Typography.Text>
                  </Col>
                </Col>
              )
            )}
            {
              // GIẢM GIÁ VÀ THEO PHẦN TRĂM
              discountBy === PromotionsType.DISCOUNT_BY_PERCENT &&
              // watch('promotionType') === PromotionsType.DISCOUNT_BY_PERCENT &&
              modalType !== ModalType.INFORMATION ? (
                <Row className='!flex !flex-col'>
                  <Col
                    span={12}
                    className='mt-5'
                  >
                    <Typography.Text
                      type='secondary'
                      className='!text-black '
                    >
                      <label
                        className='mb-2 block text-sm  font-medium text-black dark:text-white'
                        htmlFor='discountPercent'
                      >
                        Nhập phần trăm
                      </label>
                    </Typography.Text>
                    <Controller
                      name='discountPercent'
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
                          placeholder='Nhập phần trăm'
                          addonAfter='%'
                          controls={false}
                        />
                      )}
                    />
                    {errors.discountPercent && (
                      <small className='text-danger text-[13px]'>Phần trăm phải nằm trong khoản từ 0 đến 100</small>
                    )}
                  </Col>
                </Row>
              ) : (
                discountBy === PromotionsType.DISCOUNT_BY_PERCENT &&
                watch('promotionType') === PromotionsType.DISCOUNT_BY_PERCENT &&
                modalType === ModalType.INFORMATION && (
                  <Col
                    span={12}
                    className='mt-2'
                  >
                    <Col span={24}>
                      <Typography.Text
                        type='secondary'
                        className='!text-black '
                      >
                        Số phần trăm được giảm:&nbsp;
                      </Typography.Text>
                      <Typography.Text
                        type='secondary'
                        className='!text-black text-[15px] font-medium'
                      >
                        {voucherById?.discountPercent ? voucherById?.discountPercent + '%' : ''}
                      </Typography.Text>
                    </Col>
                  </Col>
                )
              )
            }

            {modalType !== ModalType.INFORMATION ? (
              <Row>
                <Col
                  span={24}
                  className='mt-5'
                >
                  <Typography.Text
                    type='secondary'
                    className='!text-black '
                  >
                    <label
                      className='mb-2 block text-sm font-medium text-black dark:text-white'
                      htmlFor='saleScope'
                    >
                      Phạm vi khuyến mãi
                    </label>
                  </Typography.Text>
                  <Controller
                    name='saleScope'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Radio.Group
                        onChange={(e: RadioChangeEvent) => onChange(e.target.value)}
                        value={value}
                        optionType='button'
                        buttonStyle='solid'
                        disabled={modalType === ModalType.UPDATE}
                      >
                        <Radio value={SaleScope.ALL}>Toàn shop</Radio>
                        <Radio value={SaleScope.BY_PRODUCT}>Theo sản phẩm</Radio>
                      </Radio.Group>
                    )}
                  />
                </Col>
              </Row>
            ) : (
              <Col
                span={12}
                className='mt-2'
              >
                <Col span={24}>
                  <Typography.Text
                    type='secondary'
                    className='!text-black '
                  >
                    Phạm vi khuyến mãi:&nbsp;
                  </Typography.Text>
                  <Typography.Text
                    type='secondary'
                    className='!text-black text-[15px] font-medium'
                  >
                    {voucherById?.saleScope
                      ? voucherById?.saleScope === SaleScope.ALL
                        ? 'Toàn shop'
                        : 'Theo sản phẩm'
                      : ''}
                  </Typography.Text>
                </Col>
              </Col>
            )}
            {watch('saleScope') === SaleScope.BY_PRODUCT && modalType !== ModalType.INFORMATION && (
              <div className='flex justify-end mt-4'>
                <button
                  onClick={handleShowBtnVoucherApplyForProductTable as any}
                  className='rounded-md py-2 px-3 text-[14px] bg-primary text-white font-medium'
                >
                  {modalType === ModalType.CREATE
                    ? 'Thêm danh sách sản phẩm được sử dụng voucher +'
                    : modalType === ModalType.UPDATE && 'Cập nhật danh sách sản phẩm được sử dụng voucher'}
                </button>
              </div>
            )}
            {watch('saleScope') !== SaleScope.ALL && showVoucherApplyForProductTable ? (
              <Col
                span={24}
                className='mt-5'
              >
                <div className='flex items-center gap-2  xl:w-[100%] lg:w-[75%] md:w-[50%]'>
                  <div className='my-2 flex  w-full items-center rounded-lg border-2 border-gray bg-white p-2 dark:bg-boxdark lg:w-[25%] xl:w-[25%]'>
                    <SVG src={SEARCH_ICON} />
                    <input
                      type='text'
                      placeholder='Tìm kiếm...'
                      className='w-full bg-transparent pl-6 pr-4 focus:outline-none'
                      onChange={(e: any) => setSearchText(e.target.value)}
                      value={searchText}
                    />
                  </div>
                </div>
                <VoucherApplyForProductTable
                  onSetListSelectionKeyProduct={setListSelectionKeyProduct}
                  onGetPagination={setOnGetPagination}
                  product={product || undefined}
                  loadingProduct={isLoadingProduct}
                  voucherById={voucherById || {}}
                  listProductIdInVoucher={listProductIdInVoucher}
                  onSetListProductIdInVoucher={onSetListProductIdInVoucher}
                  modalType={modalType}
                />
              </Col>
            ) : (
              <div className='mt-7'>
                {modalType === ModalType.INFORMATION && voucherById?.saleScope === SaleScope.BY_PRODUCT && (
                  <>
                    <Typography.Text
                      type='secondary'
                      className='!text-primary font-bold mb-2 text-[16px] block '
                    >
                      Danh sách sản phẩm được áp dụng voucher
                    </Typography.Text>

                    <ListProductGetFromVoucher
                      onSetListSelectionKeyProduct={setListSelectionKeyProduct}
                      product={product}
                      loadingProduct={isLoadingProduct}
                      voucherById={voucherById}
                      listProductIdInVoucher={listProductIdInVoucher}
                    />
                  </>
                )}
              </div>
            )}
          </>
        </form>
      </Modal>
      {isLoadingWhenCallApiCreateOrUpdate && <Loading />}
    </>
  );
};

export default VoucherModal;
