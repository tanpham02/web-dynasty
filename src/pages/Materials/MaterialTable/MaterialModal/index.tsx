/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Col, DatePicker, Modal, Row, Typography } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useFieldArray, Controller, FormProvider } from 'react-hook-form';
import { Material } from '~/models/materials';
import { DATE_FORMAT_YYYYMMDDTHHMMSS, formatDate } from '~/utils/date.utils';
import MaterialModalInfoChild from './MaterialModalInfoChild';
import materialService from '~/services/materialService';
import toast from 'react-hot-toast';
import moment from 'moment';
import { ModalType } from '~/pages/User/UserModal';

interface MaterialModalProps {
  visible?: boolean;
  onCloseModal?: () => void;
  refetch: () => void;
  onLoading: (value: boolean) => void;
  dataMaterialDetail?: Material;
  modalType?: string;
}

const defaultMaterialValues: Material = {
  importDate: '',
  materialInfo: [
    {
      name: '',
      price: 0,
      quantity: '',
    },
  ],
};

const MaterialModal = ({
  onCloseModal,
  visible,
  refetch,
  onLoading,
  dataMaterialDetail,
  modalType,
}: MaterialModalProps) => {
  const methodUseForm = useForm({ defaultValues: defaultMaterialValues });
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = methodUseForm;
  const { fields, append, remove } = useFieldArray({
    name: 'materialInfo',
    control,
  });

  useEffect(() => {
    if (modalType === ModalType.CREATE) {
      return reset(defaultMaterialValues);
    }
    reset(dataMaterialDetail);
  }, [dataMaterialDetail, modalType]);

  const handleGenerateTextTitleAndButtonModal = useMemo(() => {
    let result: {
      textTitle: string;
      textButton: any;
    } = {
      textTitle: '',
      textButton: '',
    };

    switch (modalType) {
      case ModalType.CREATE:
        result = {
          textButton: 'Thêm',
          textTitle: 'Thêm thông tin nhập hàng',
        };
        break;
      case ModalType.INFORMATION:
        result = {
          textButton: null,
          textTitle: 'Chỉnh sửa thông tin nhập hàng',
        };
        break;
    }
    return result;
  }, [modalType, visible]);

  const onSubmitData = async (dataSubmit: Material) => {
    onLoading(true);
    try {
      modalType === ModalType.CREATE
        ? await materialService.create(dataSubmit)
        : modalType === ModalType.UPDATE &&
          dataMaterialDetail?._id &&
          (await materialService.update(dataMaterialDetail?._id, dataSubmit));
      onLoading(false);
      reset();
      onCloseModal?.();
      refetch();
      toast.success(
        `${modalType === ModalType.CREATE ? 'Thêm' : 'Cập nhật'} nguyên liệu thành công`,
        {
          position: 'bottom-right',
          duration: 2000,
          icon: '🤪',
        },
      );
    } catch (error) {
      console.log(error);
      onLoading(false);
      toast.error(`${modalType === ModalType.CREATE ? 'Thêm' : 'Cập nhật'} nguyên liệu thất bại`, {
        position: 'bottom-right',
        duration: 2000,
        icon: '😞',
      });
    }
  };

  const handleAddProductInfoImport = (field: any, index: any) => {
    append({
      name: field?.[index]?.name,
      price: field?.[index]?.price,
      quantity: field?.[index]?.quantity,
    });
  };

  const handleChangeValueImportDate = (value: any) => {
    setValue('importDate', value);
    setError('importDate', {
      type: 'required',
    });
    if (value._d) {
      setValue('importDate', formatDate(value._d, DATE_FORMAT_YYYYMMDDTHHMMSS));
      clearErrors('importDate');
      return;
    }
  };

  return (
    <>
      <Modal
        title={handleGenerateTextTitleAndButtonModal?.textTitle}
        open={visible}
        style={{ minWidth: '70%' }}
        onCancel={onCloseModal}
        footer={[
          modalType !== ModalType.INFORMATION && <Button onClick={onCloseModal}>Hủy</Button>,
          <Button
            form="form-materials"
            key="submit"
            htmlType="submit"
            className="!bg-primary !text-white border border-solid !border-primary"
          >
            {handleGenerateTextTitleAndButtonModal?.textButton}
          </Button>,
        ]}
      >
        <FormProvider {...methodUseForm}>
          <form onSubmit={handleSubmit(onSubmitData)} id="form-materials">
            <Row gutter={24}>
              {modalType !== ModalType.INFORMATION && (
                <Col span={12}>
                  <Typography.Text type="secondary" className="!text-black !mb-2 text-[14.5px]">
                    Ngày nhập hàng <strong className="text-xl text-danger">*</strong>
                  </Typography.Text>
                  <Controller
                    control={control}
                    name="importDate"
                    rules={{ required: true }}
                    render={({ field: { value } }) => (
                      <DatePicker
                        className={`!py-[7px] w-full border-solid border rounded-md ${
                          errors.importDate?.type === 'required'
                            ? 'border  !border-danger'
                            : 'border-current'
                        } blur-0 `}
                        placeholder="Chọn ngày nhập hàng"
                        format={'HH:mm:ss DD/MM/YYYY '}
                        showTime={{ format: 'HH:mm:ss' }}
                        allowClear
                        onChange={handleChangeValueImportDate}
                        value={value ? moment(value) : null}
                      />
                    )}
                  />
                  {errors?.importDate?.type === 'required' && (
                    <small className="text-danger text-[13px]">
                      Ngày nhập hàng không được rỗng
                    </small>
                  )}
                </Col>
              )}

              {modalType === ModalType.INFORMATION && (
                <Col span={12} className="mt-[5px]">
                  <Typography.Text type="secondary" className="!text-black !mb-2 text-[14.5px]">
                    Ngày nhập hàng
                  </Typography.Text>
                  <Controller
                    control={control}
                    name="importDate"
                    rules={{ required: true }}
                    render={({ field: { value } }) => (
                      <DatePicker
                        className={`!py-[10px] w-full !border-none !outline-none !bg-gray/70 !z-10 pointer-events-none`}
                        placeholder="Thời gian cập nhật"
                        format={'HH:mm:ss DD/MM/YYYY '}
                        showTime={{ format: 'HH:mm:ss' }}
                        allowClear={false}
                        suffixIcon={null}
                        onChange={handleChangeValueImportDate}
                        value={value ? moment(value) : null}
                      />
                    )}
                  />
                </Col>
              )}

              {modalType === ModalType.INFORMATION && (
                <Col span={12} className="mt-[5px]">
                  <Typography.Text type="secondary" className="!text-black !mb-2 text-[14.5px]">
                    Thời gian cập nhật gần đây
                  </Typography.Text>
                  <Controller
                    control={control}
                    name="updatedAt"
                    rules={{ required: true }}
                    render={({ field: { value } }) => (
                      <DatePicker
                        className={`!py-[10px] w-full !border-none !outline-none !bg-gray/70 !z-10 pointer-events-none`}
                        placeholder="Thời gian cập nhật"
                        format={'HH:mm:ss DD/MM/YYYY '}
                        showTime={{ format: 'HH:mm:ss' }}
                        allowClear={false}
                        suffixIcon={null}
                        onChange={handleChangeValueImportDate}
                        value={value ? moment(value) : null}
                      />
                    )}
                  />
                  {errors?.importDate?.type === 'required' && (
                    <small className="text-danger text-[13px]">
                      Ngày nhập hàng không được rỗng
                    </small>
                  )}
                </Col>
              )}
              <Col span={24} className="mt-7">
                <Typography.Text
                  type="secondary"
                  className="!text-black !mb-0.5 font-semibold text-[17px] block "
                >
                  Thông tin sản phẩm
                </Typography.Text>
                <div className="grid grid-cols-2 gap-4">
                  {fields?.map((field, index) => (
                    <div className="mt-1.5">
                      <span className="text-[14px] text-meta-1 font-bold">{`${index + 1})`}</span>
                      <MaterialModalInfoChild
                        {...{ field, control, index, errors }}
                        key={field.id}
                        data={dataMaterialDetail}
                        modalType={modalType}
                      />
                      {modalType !== ModalType.INFORMATION && (
                        <div
                          className={`mt-5 flex ${
                            index === fields?.length - 1 ? '!justify-between' : '!justify-end'
                          } items-center px-4 flex-wrap gap-y-2`}
                        >
                          {index === fields?.length - 1 && (
                            <button
                              onClick={() => handleAddProductInfoImport(field, index)}
                              className="px-3 py-2 bg-primary text-white font-medium rounded-md"
                            >
                              + Thêm sản phẩm
                            </button>
                          )}
                          {fields?.length > 1 && (
                            <button
                              className={`px-3 py-2 bg-danger text-white font-medium rounded-md`}
                              onClick={(e) => {
                                e.preventDefault();
                                remove(index);
                              }}
                            >
                              - Xóa sản phẩm
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </form>
        </FormProvider>
      </Modal>
    </>
  );
};

export default MaterialModal;
