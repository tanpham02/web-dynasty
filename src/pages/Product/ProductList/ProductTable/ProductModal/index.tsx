/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, Input, InputNumber, Modal, Row, Select, Tag, Typography } from 'antd';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import React, { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Loading from '~/components/Loading';
import { ProductMain, ProductStatusOptions, ProductType } from '~/models/product';
import { ModalType } from '~/pages/User/UserModal';
import { ProductTypeTagRenderMapping } from '..';
import { productService } from '~/services/productService';
import toast from 'react-hot-toast';

interface ProductModalProps {
  visible?: boolean;
  modalType?: string;
  onClose: () => void;
  refetchData: () => void;
  product?: ProductMain;
}

const defaultProductValues: ProductMain = {
  name: '',
  price: 0,
  oldPrice: 0,
  description: '',
  image: '',
  information: '',
  types: [ProductType.NORMAL],
};
function ProductModal({ modalType, visible, onClose, refetchData, product }: ProductModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fileProduct, setFileProduct] = useState<{
    filePreview?: any;
    fileUpload?: File | string;
  }>();

  const {
    control,
    formState: { errors },
    reset,
    watch,
    handleSubmit,
  } = useForm({
    defaultValues: defaultProductValues,
  });

  const getTitleModalAndButton = useMemo(() => {
    let result = {
      titleModal: '',
      titleButton: '',
    };
    switch (modalType) {
      case ModalType.CREATE:
        result = {
          titleModal: 'Thêm sản phẩm mới',
          titleButton: 'Thêm sản phẩm',
        };
        break;
      case ModalType.UPDATE:
        result = {
          titleModal: 'Cập nhật thông tin sản phẩm',
          titleButton: 'Cập nhật',
        };
        break;
      case ModalType.INFORMATION:
        result = {
          titleModal: 'Thông tin sản phẩm',
          titleButton: '',
        };
        break;
    }

    return result;
  }, [modalType]);

  useEffect(() => {
    if (product?.image) {
      setFileProduct((prev) => ({ ...prev, filePreview: product.image }));
    }
    reset(product);
  }, [product]);

  const handleChangeFileAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const reader = new FileReader();

    reader.onloadend = function () {
      setFileProduct((prev) => ({
        ...prev,
        filePreview: reader.result,
      }));
    };

    if (files) {
      reader.readAsDataURL(files?.[0]);
      setFileProduct((prev) => ({
        ...prev,
        fileUpload: files[0],
      }));
    }
  };

  const tagRender = ({ label, value, closable, onClose }: CustomTagProps) => {
    const onPreventMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
    };

    return (
      <Tag
        color={ProductTypeTagRenderMapping?.[value as ProductType]}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{
          marginRight: 3,
        }}
      >
        {label}
      </Tag>
    );
  };

  const onSubmit = async (dataSubmit: ProductMain) => {
    setIsLoading(true);
    const formData = new FormData();
    try {
      formData.append('file', fileProduct?.fileUpload || '');

      formData.append('productInfo', JSON.stringify(dataSubmit));

      modalType === ModalType.CREATE
        ? await productService.createProduct(formData)
        : modalType === ModalType.UPDATE &&
          product?._id &&
          (await productService.updateProduct(formData, product._id));

      toast.success(
        `${
          modalType === ModalType.CREATE
            ? 'Thêm sản phẩm thành công'
            : modalType === ModalType.UPDATE
            ? 'Cập nhật sản phẩm thành công'
            : ''
        }`,
        {
          position: 'bottom-right',
          duration: 4000,
          icon: '🤪',
        },
      );
      setIsLoading(false);
      setFileProduct({});
      refetchData();
      reset({});
      onClose();
    } catch (error) {
      console.log(error);
      toast.error('Thêm sản phẩm thất bại', {
        position: 'bottom-right',
        duration: 4000,
        icon: '😞',
      });
      setIsLoading(false);
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
        style={{ minWidth: '80%' }}
        footer={[
          modalType === ModalType.INFORMATION ? null : <Button onClick={onClose}>Hủy</Button>,
          <Button
            form="form-user"
            key="submit"
            htmlType="submit"
            className="!bg-primary !text-white border border-solid !border-primary"
          >
            {getTitleModalAndButton.titleButton}
          </Button>,
        ]}
      >
        <form autoComplete="off" id="form-user" onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={24}>
            <Col span={8}>
              {modalType !== ModalType.INFORMATION && (
                <div>
                  <div
                    id="FileUpload"
                    className="relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5 "
                  >
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none"
                      onChange={handleChangeFileAvatar}
                    />
                    {!fileProduct?.filePreview ? (
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z"
                              fill="#3C50E0"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z"
                              fill="#3C50E0"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z"
                              fill="#3C50E0"
                            />
                          </svg>
                        </span>
                        <p>
                          <span className="text-primary">Click to upload</span> or drag and drop
                        </p>
                        <p className="mt-1.5">SVG, PNG, JPG or GIF</p>
                        <p>(max, 800 X 800px)</p>
                      </div>
                    ) : (
                      <img
                        src={fileProduct?.filePreview}
                        className="max-h-[300px] border-[1px] border-solid border-[#ddd] mx-auto "
                        alt={`Ảnh ${product?.name}` || ''}
                      />
                    )}
                  </div>
                </div>
              )}
            </Col>

            <Col span={16}>
              <Typography.Text className="text-[17px] font-semibold">
                Thông tin sản phẩm
              </Typography.Text>
              <Row gutter={16} className="mt-5">
                {modalType != ModalType.INFORMATION && (
                  <>
                    <Col span={24}>
                      <Typography.Text type="secondary" className="!text-black text-[14.5px]">
                        Tên sản phẩm <strong className="text-xl text-danger">*</strong>
                      </Typography.Text>
                      <Controller
                        name="name"
                        rules={{ required: true }}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Input
                            value={value}
                            onChange={onChange}
                            className={`h-[38px] border-solid border-[1px] ${
                              errors.name ? '!border-danger' : ''
                            }`}
                            placeholder="Tên sản phẩm"
                          />
                        )}
                      />
                      {errors.name?.type === 'required' ? (
                        <small className="text-danger text-[13px]">
                          Tên sản phẩm không được rỗng
                        </small>
                      ) : (
                        ''
                      )}
                    </Col>

                    {/* (
                  <Col span={12}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black '
                    >
                      Họ và tên:&nbsp;
                    </Typography.Text>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[15px] font-medium'
                    >
                      {user?.fullName || ''}
                    </Typography.Text>
                  </Col>
                ) */}
                  </>
                )}
              </Row>

              <Row gutter={16} className="mt-5">
                {modalType != ModalType.INFORMATION && (
                  <>
                    <Col span={24}>
                      <Typography.Text type="secondary" className="!text-black text-[14.5px]">
                        Mô tả sản phẩm
                      </Typography.Text>
                      <Controller
                        name="description"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Input
                            value={value}
                            onChange={onChange}
                            className={`h-[38px] border-solid border-[1px] ${
                              errors.description ? '!border-danger' : ''
                            }`}
                            placeholder="Tên sản phẩm"
                          />
                        )}
                      />
                    </Col>

                    {/* (
                  <Col span={12}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black '
                    >
                      Họ và tên:&nbsp;
                    </Typography.Text>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[15px] font-medium'
                    >
                      {user?.fullName || ''}
                    </Typography.Text>
                  </Col>
                ) */}
                  </>
                )}
              </Row>

              <Row gutter={16} className="mt-5">
                {modalType != ModalType.INFORMATION && (
                  <>
                    <Col span={24}>
                      <Typography.Text type="secondary" className="!text-black text-[14.5px]">
                        Giá sản phẩm <strong className="text-xl text-danger">*</strong>
                      </Typography.Text>
                      <Controller
                        name="price"
                        control={control}
                        rules={{
                          required: true,
                        }}
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
                              errors.price
                                ? '!border-danger border-solid  border-[100%] border-t-0 border-l-0'
                                : ''
                            } `}
                            placeholder="Nhập số tiền được giảm"
                            controls={false}
                            addonAfter="đ"
                          />
                        )}
                      />
                      {errors.price?.type === 'required' ? (
                        <small className="text-danger text-[13px]">
                          Giá sản phẩm không được rỗng
                        </small>
                      ) : (
                        ''
                      )}
                    </Col>

                    {/* (
                  <Col span={12}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black '
                    >
                      Họ và tên:&nbsp;
                    </Typography.Text>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[15px] font-medium'
                    >
                      {user?.fullName || ''}
                    </Typography.Text>
                  </Col>
                ) */}
                  </>
                )}
              </Row>

              <Row gutter={16} className="mt-5">
                {modalType != ModalType.INFORMATION && (
                  <>
                    <Col span={24}>
                      <Typography.Text type="secondary" className="!text-black text-[14.5px]">
                        Giá cũ sản phẩm
                      </Typography.Text>
                      <Controller
                        name="oldPrice"
                        control={control}
                        rules={{
                          required: true,
                        }}
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
                              errors.oldPrice
                                ? '!border-danger border-solid  border-[100%] border-t-0 border-l-0'
                                : ''
                            } `}
                            placeholder="Nhập số tiền được giảm"
                            controls={false}
                            addonAfter="đ"
                          />
                        )}
                      />
                    </Col>

                    {/* (
                  <Col span={12}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black '
                    >
                      Họ và tên:&nbsp;
                    </Typography.Text>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[15px] font-medium'
                    >
                      {user?.fullName || ''}
                    </Typography.Text>
                  </Col>
                ) */}
                  </>
                )}
              </Row>

              <Row gutter={16} className="mt-5">
                {modalType != ModalType.INFORMATION && (
                  <>
                    <Col span={24}>
                      <Typography.Text type="secondary" className="!text-black text-[14.5px]">
                        Thể loại sản phẩm
                      </Typography.Text>
                      <Controller
                        name="types"
                        control={control}
                        rules={{
                          required: true,
                        }}
                        render={({ field: { value, onChange } }) => (
                          <Select
                            mode="multiple"
                            allowClear
                            value={value}
                            style={{ width: '100%' }}
                            onChange={onChange}
                            options={ProductStatusOptions}
                            tagRender={tagRender}
                          />
                        )}
                      />
                    </Col>

                    {/* (
                  <Col span={12}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black '
                    >
                      Họ và tên:&nbsp;
                    </Typography.Text>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[15px] font-medium'
                    >
                      {user?.fullName || ''}
                    </Typography.Text>
                  </Col>
                ) */}
                  </>
                )}
              </Row>
            </Col>
          </Row>
        </form>
      </Modal>
      {isLoading && <Loading />}
    </>
  );
}

export default ProductModal;
