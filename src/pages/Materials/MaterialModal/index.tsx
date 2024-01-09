import { Button } from '@nextui-org/react';
import { DatePicker } from 'antd';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { Controller, FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';

import DeleteIcon from '~/assets/svg/delete.svg';
import Box from '~/components/Box';
import ButtonIcon from '~/components/ButtonIcon';
import { globalLoading } from '~/components/GlobalLoading';
import CustomModal from '~/components/NextUI/CustomModal';
import CustomTable, { ColumnType } from '~/components/NextUI/CustomTable';
import { FormContextInput } from '~/components/NextUI/Form';
import { QUERY_KEY } from '~/constants/queryKey';
import { Category } from '~/models/category';
import { Material, MaterialInformation } from '~/models/materials';
import materialService from '~/services/materialService';
import {
  DATE_FORMAT_DDMMYYYY,
  currentMonthFirstDate,
  currentMonthLastDate,
} from '~/utils/date.utils';

interface MaterialModalProps {
  isOpen?: boolean;
  onOpenChange?(): void;
  onRefetch?(): void;
  isEdit?: boolean;
  materialId?: string;
}
const MaterialModal = ({
  isOpen,
  onOpenChange,
  onRefetch,
  isEdit,
  materialId,
}: MaterialModalProps) => {
  const forms = useForm<Material>();

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset: resetFormValue,
    control,
  } = forms;

  const {
    fields: materials,
    remove: removeMaterial,
    append: appendMaterial,
  } = useFieldArray({
    control,
    name: 'materialInfo',
  });

  const columns: ColumnType<Category>[] = [
    {
      name: 'Tên nguyên liệu',
      render: (_record: MaterialInformation, index?: number) => (
        <FormContextInput
          name={`materialInfo.${index}.name`}
          rules={{
            required: 'Vui lòng nhập tên nguyên liệu!',
          }}
        />
      ),
    },
    {
      name: 'Giá nhập',
      width: 200,
      render: (_record: MaterialInformation, index?: number) => (
        <FormContextInput
          name={`materialInfo.${index}.price`}
          type="number"
          rules={{
            required: 'Vui lòng nhập giá nguyên liệu!',
          }}
        />
      ),
    },
    {
      name: 'Số lượng',
      width: 200,
      render: (_record: MaterialInformation, index?: number) => (
        <FormContextInput
          name={`materialInfo.${index}.quantity`}
          type="number"
          rules={{
            required: 'Vui lòng nhập số lượng nguyên liệu!',
            min: {
              value: 0.01,
              message: 'Số lượng nguyên liệu nhập không được nhỏ hơn 0!',
            },
          }}
        />
      ),
    },
    {
      name: 'Đơn vị tính',
      width: 200,
      render: (_record: MaterialInformation, index?: number) => (
        <FormContextInput
          name={`materialInfo.${index}.unit`}
          rules={{
            required: 'Vui lòng nhập đơn vị tính nguyên liệu!',
          }}
        />
      ),
    },
    {
      name: <Box className="flex justify-center">Hành động</Box>,
      width: 100,
      render: (_record: MaterialInformation, index?: number) => (
        <Box className="flex justify-center">
          <ButtonIcon
            icon={DeleteIcon}
            title="Xóa nguyên liệu nhập này"
            status="danger"
            onClick={() => removeMaterial(index)}
          />
        </Box>
      ),
    },
  ];

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!(materialId && isEdit && isOpen)) {
      resetFormValue({ materialInfo: [], importDate: undefined });
    }
  }, [isEdit, materialId, isOpen]);

  useQuery(
    [QUERY_KEY.MATERIALS, materialId],
    async () => {
      try {
        globalLoading.show();
        if (materialId) {
          const response = await materialService.getById(materialId);
          if (response && Object.keys(response).length > 0) {
            resetFormValue(response);
          }
        }
        return null;
      } catch (err) {
        enqueueSnackbar('Có lỗi xảy ra khi lấy dữ liệu hóa đơn nhập nguyên liệu!', {
          variant: 'error',
        });
        onOpenChange?.();
        console.log('🚀 ~ file: index.tsx:125 ~ getMaterialDetail ~ err:', err);
      } finally {
        setTimeout(() => {
          globalLoading.hide();
        }, 1000);
      }
    },
    { enabled: Boolean(materialId && isOpen && isEdit), refetchOnWindowFocus: false },
  );

  const onSubmit = async (data: Material) => {
    if (!data?.materialInfo?.length) {
      enqueueSnackbar('Vui lòng thêm ít nhất một nguyên liệu nhập!', {
        variant: 'error',
      });
      return;
    }

    try {
      const formData = new FormData();

      formData.append('materialInfo', JSON.stringify(data));

      if (isEdit) {
        await materialService.update(materialId, formData);
      } else {
        await materialService.create(formData);
      }

      enqueueSnackbar(`${isEdit ? 'Chỉnh sửa' : 'Thêm'} hóa đơn nhập hàng thành công!`);
    } catch (err) {
      enqueueSnackbar(`Có lỗi xảy ra khi ${isEdit ? 'chỉnh sửa' : 'thêm'} hóa đơn nhập hàng!`, {
        variant: 'error',
      });
      console.log('🚀 ~ file: index.tsx:69 ~ onSubmit ~ err:', err);
    } finally {
      onRefetch?.();
      onOpenChange?.();
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Cập nhật hóa đơn nhập hàng' : 'Thêm hóa đơn nhập hàng mới'}
      okButtonText={isEdit ? 'Lưu thay đổi' : 'Thêm'}
      className="w-full max-w-[1200px]"
      isDismissable={false}
      onOk={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
    >
      <FormProvider {...forms}>
        <Box className="space-y-4">
          <Controller
            control={control}
            name="importDate"
            rules={{
              required: 'Vui lòng chọn ngày nhập hàng!',
            }}
            render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
              <Box>
                <DatePicker
                  allowClear
                  ref={ref}
                  value={value ? moment(value) : undefined}
                  format={DATE_FORMAT_DDMMYYYY}
                  placeholder="Ngày nhập hàng"
                  onChange={(date) => (date ? onChange(moment(date)) : '')}
                  disabledDate={(value) => {
                    const date = new Date();
                    return !value.isBetween(
                      currentMonthFirstDate(date),
                      currentMonthLastDate(date),
                    );
                  }}
                />
                <span className="text-xs text-danger">{error?.message}</span>
              </Box>
            )}
          />
          <Box className="flex justify-between items-end mb-2">
            <span className="font-bold text-base">Danh sách nguyên liệu</span>
            <Box className="space-x-2">
              <Button
                color="danger"
                size="sm"
                variant="flat"
                className="font-bold"
                onClick={() => removeMaterial(undefined)}
              >
                Xóa tất cả
              </Button>
              <Button
                color="default"
                size="sm"
                className="bg-sky-100 text-sky-500 font-bold"
                onClick={() => appendMaterial({ name: '', price: 0, quantity: 0, unit: '' })}
              >
                Thêm nguyên liệu nhập
              </Button>
            </Box>
          </Box>
          <CustomTable
            key="id"
            isScrollable
            columns={columns}
            data={materials || []}
            isLoading={false}
            emptyContent="Chưa có nguyên liệu nào"
          />
        </Box>
      </FormProvider>
    </CustomModal>
  );
};

export default MaterialModal;
