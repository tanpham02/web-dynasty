import { SelectItem } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Box from '~/components/Box';
import CustomModal from '~/components/NextUI/CustomModal';
import { FormContextInput } from '~/components/NextUI/Form';
import FormContextSelect from '~/components/NextUI/Form/FormContextSelect';
import { QUERY_KEY } from '~/constants/queryKey';
import useAddress from '~/hooks/useAddress';
import { StoreModel } from '~/models/store';
import { storeService } from '~/services/storeService';
import { PATTERN } from '~/utils/regex';

interface FormStoreModalProps {
  isOpen: boolean;
  onClose(): void;
  storeId?: string;
}

const FormStoreModal = ({ isOpen, onClose, storeId }: FormStoreModalProps) => {
  const formMethods = useForm<StoreModel>();

  const { enqueueSnackbar } = useSnackbar();

  const {
    watch,
    reset,
    setValue,
    handleSubmit,
    getFieldState,
    formState: { isSubmitting },
  } = formMethods;

  const currentFormValue = watch();

  const { cityOptions, districtOptions, wardOptions } = useAddress({
    cityId: currentFormValue?.cityId?.[0],
    districtId: currentFormValue?.districtId?.[0],
    wardId: currentFormValue?.wardId?.[0],
  });

  useEffect(() => {
    setValue('districtId', []);
    setValue('wardId', []);
  }, [currentFormValue?.cityId]);

  useEffect(() => {
    setValue('wardId', []);
  }, [currentFormValue?.districtId]);

  useQuery({
    queryKey: [QUERY_KEY.STORE, storeId],
    queryFn: async () => {
      try {
        if (!storeId) return null;

        const response = await storeService.getById(storeId);

        reset({ ...response, cityId: [], districtId: [], wardId: [] });
        return response;
      } catch (err) {
        console.log('🚀 ~ queryFn: ~ err:', err);
        enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau!', {
          variant: 'error',
        });
      }
    },
  });

  const createOrUpdateStore = async (data: StoreModel) => {
    try {
      const formData = new FormData();
      if (storeId) {
        const storeChangeData: StoreModel = {};

        Object.entries(data).map((data) => {
          const fieldName = data[0] as keyof StoreModel;

          if (getFieldState(fieldName).isDirty)
            storeChangeData[fieldName] = data[1];
        });
        formData.append('storeSystemInfo', JSON.stringify(storeChangeData));

        Object.keys(storeChangeData)?.length &&
          (await storeService.updateById(storeId, formData));
      } else {
        formData.append('storeSystemInfo', JSON.stringify(data));
        await storeService.createNew(formData);
        enqueueSnackbar('Thêm cửa hàng thành công!');
      }
    } catch (err) {
      console.log('🚀 ~ createOrUpdateStore ~ err:', err);
      enqueueSnackbar('Có lỗi xảy ra vui lòng thử lại sau!', {
        variant: 'error',
      });
    } finally {
      onClose();
    }
  };

  return (
    <CustomModal
      size="2xl"
      isOpen={isOpen}
      onClose={onClose}
      okButtonText="Lưu"
      title="Thêm cửa hàng mới"
      isLoading={isSubmitting}
      onOk={handleSubmit(createOrUpdateStore)}
    >
      <FormProvider {...formMethods}>
        <Box className="space-y-4">
          <FormContextInput
            isRequired
            name="name"
            label="Tên cửa hàng"
            rules={{
              required: 'Vui lòng nhập tên cửa hàng!',
              pattern: {
                value: PATTERN.PHONE,
                message: 'Số điện thoại không đúng định dạng!',
              },
            }}
          />
          <FormContextInput
            isRequired
            name="phone"
            label="Tên cửa hàng"
            rules={{
              required: 'Vui lòng nhập số điện thoại cửa hàng!',
            }}
          />
          <FormContextSelect
            isRequired
            name="cityId"
            label="Tỉnh / Thành phố"
            items={cityOptions}
            rules={{
              required: 'Vui lòng chọn tỉnh, thành phố!',
            }}
          >
            {(city: any) => (
              <SelectItem key={city.value} textValue={city.label}>
                {city.label}
              </SelectItem>
            )}
          </FormContextSelect>{' '}
          <FormContextSelect
            isRequired
            isDisabled={!currentFormValue?.cityId?.[0]}
            name="districtId"
            label="Quận / Huyện"
            items={districtOptions}
            rules={{
              required: 'Vui lòng chọn quận, huyện!',
            }}
          >
            {(district: any) => (
              <SelectItem key={district.value} textValue={district.label}>
                {district.label}
              </SelectItem>
            )}
          </FormContextSelect>{' '}
          <FormContextSelect
            isRequired
            isDisabled={!currentFormValue?.districtId?.[0]}
            name="wardId"
            label="Phường / Xã / Thị trấn"
            items={wardOptions}
            rules={{
              required: 'Vui lòng chọn phường xã!',
            }}
          >
            {(ward: any) => (
              <SelectItem key={ward.value} textValue={ward.label}>
                {ward.label}
              </SelectItem>
            )}
          </FormContextSelect>
          <FormContextInput
            isRequired
            name="location"
            label="Số nhà, tên đường,..."
            rules={{
              required: 'Vui lòng nhập số nhà, tên đường',
            }}
          />
          <Box className="grid grid-cols-2 gap-4">
            <FormContextInput
              isRequired
              type="number"
              name="latitude"
              label="Vĩ độ (latitude)"
              rules={{
                required: 'Vui lòng nhập vĩ độ!',
                min: {
                  value: -90,
                  message: 'Giá trị tối thiểu của vĩ độ là -90',
                },
                max: {
                  value: 90,
                  message: 'Giá trị cao nhất của vĩ độ là 90',
                },
              }}
            />
            <FormContextInput
              isRequired
              type="number"
              name="longitude"
              label="Kinh độ (longitude)"
              rules={{
                required: 'Vui lòng nhập kinh độ!',
                min: {
                  value: -90,
                  message: 'Giá trị tối thiểu của kinh độ là -180',
                },
                max: {
                  value: 90,
                  message: 'Giá trị cao nhất của kinh độ là 180',
                },
              }}
            />
          </Box>
        </Box>
      </FormProvider>
    </CustomModal>
  );
};

export default FormStoreModal;
