import { SelectItem } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Svg from 'react-inlinesvg';

import Box from '~/components/Box';
import CustomModal from '~/components/NextUI/CustomModal';
import { FormContextInput } from '~/components/NextUI/Form';
import FormContextSelect from '~/components/NextUI/Form/FormContextSelect';
import { QUERY_KEY } from '~/constants/queryKey';
import useAddress from '~/hooks/useAddress';
import { StoreModel } from '~/models/store';
import { storeService } from '~/services/storeService';
import GoogleMaps from '../GoogleMaps';
import QuestionIcon from '~/assets/svg/question.svg';

interface FormStoreModalProps {
  isOpen: boolean;
  onClose(): void;
  storeId?: string;
  refetchData(): Promise<any>;
}

const FormStoreModal = ({
  isOpen,
  onClose,
  storeId,
  refetchData,
}: FormStoreModalProps) => {
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

  const { cityOptions, districtOptions, wardOptions, addressInfo } = useAddress(
    {
      cityId: currentFormValue?.cityId?.[0],
      districtId: currentFormValue?.districtId?.[0],
      wardId: currentFormValue?.wardId?.[0],
    },
  );

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
      const dataSubmit: StoreModel = {
        ...data,
        cityId:
          Array.isArray(data?.cityId) && data.cityId.length === 1
            ? data.cityId[0]
            : '',
        districtId:
          Array.isArray(data?.districtId) && data.districtId.length === 1
            ? data.districtId[0]
            : '',
        wardId:
          Array.isArray(data?.wardId) && data.wardId.length === 1
            ? data.wardId[0]
            : '',
        ward: addressInfo.ward,
        district: addressInfo.district,
        city: addressInfo.city,
      };

      if (storeId) {
        const storeChangeData: StoreModel = {};

        Object.entries(dataSubmit).map((dataSubmit) => {
          const fieldName = dataSubmit[0] as keyof StoreModel;

          if (getFieldState(fieldName).isDirty)
            storeChangeData[fieldName] = dataSubmit[1];
        });

        formData.append('storeSystemInfo', JSON.stringify(storeChangeData));

        if (Object.keys(storeChangeData)?.length) {
          await storeService.updateById(storeId, formData);
          enqueueSnackbar('Cập nhật thông tin cửa hàng thành công!');
        }
      } else {
        formData.append('storeSystemInfo', JSON.stringify(dataSubmit));
        await storeService.createNew(formData);
        enqueueSnackbar('Thêm cửa hàng thành công!');
      }
      await refetchData();
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
      size="5xl"
      isOpen={isOpen}
      onClose={onClose}
      okButtonText={storeId ? 'Lưu thay đổi' : 'Lưu'}
      title={storeId ? 'Chỉnh sửa thông tin cửa hàng' : 'Thêm cửa hàng mới'}
      isLoading={isSubmitting}
      onOk={handleSubmit(createOrUpdateStore)}
    >
      <FormProvider {...formMethods}>
        <Box className="lg:grid grid-cols-5 gap-4">
          <Box className="space-y-4 col-span-2">
            <FormContextInput
              isRequired
              name="name"
              label="Tên cửa hàng"
              rules={{
                required: 'Vui lòng nhập tên cửa hàng!',
              }}
            />
            <FormContextInput
              isRequired
              name="phone"
              label="Số điện thoại!"
              rules={{
                required: 'Vui lòng nhập số điện thoại cửa hàng!',
                // pattern: {
                //   value: PATTERN.PHONE,
                //   message: 'Số điện thoại không đúng định dạng!',
                // },
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
                required: 'Vui lòng nhập số nhà, tên đường!',
              }}
            />
            <Box className="grid grid-cols-2 gap-x-4">
              <FormContextInput
                isRequired
                type="number"
                name="latitude"
                label="Vĩ độ (latitude)"
                rules={{
                  required: 'Vui lòng nhập vĩ độ!',
                  min: {
                    value: -90,
                    message: 'Giá trị tối thiểu của vĩ độ là -90!',
                  },
                  max: {
                    value: 90,
                    message: 'Giá trị cao nhất của vĩ độ là 90!',
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
                    value: -180,
                    message: 'Giá trị tối thiểu của kinh độ là -180!',
                  },
                  max: {
                    value: 180,
                    message: 'Giá trị cao nhất của kinh độ là 180!',
                  },
                }}
              />
              <span className="col-span-2 items-start gap-2 mt-1 text-sm text-sky-600 hidden lg:flex">
                <Svg src={QuestionIcon} className="w-5 h-5" />
                Nhập trực tiếp vĩ độ và kinh độ hoặc chọn ở bản đồ bên cạnh
              </span>
            </Box>
          </Box>
          <Box className="col-span-3">
            <GoogleMaps
              googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places}`}
              loadingElement={<div style={{ height: `100%` }} />}
              containerElement={<div style={{ height: `100%` }} />}
              mapElement={<div style={{ height: `100%` }} />}
            />
          </Box>
        </Box>
      </FormProvider>
    </CustomModal>
  );
};

export default FormStoreModal;
