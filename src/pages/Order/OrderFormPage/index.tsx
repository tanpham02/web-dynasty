import { Button, Card, CardBody, CardHeader, Divider, SelectItem } from '@nextui-org/react';
import Svg from 'react-inlinesvg';
import { FormProvider, useForm } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { getProvinces, getDistricts, getWards } from 'vietnam-provinces';

import CustomBreadcrumb from '~/components/NextUI/CustomBreadcrumb';
import UserIcon from '~/assets/svg/user.svg';
import { Order } from '~/models/order';
import { FormContextInput } from '~/components/NextUI/Form';
import Box from '~/components/Box';
import FormContextSelect from '~/components/NextUI/Form/FormContextSelect';

const OrderFormPage = () => {
  const forms = useForm<Order>();

  const {
    watch,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = forms;

  const cityId = watch('cityId');
  const districtId = watch('districtId');
  console.log('🚀 ~ file: index.tsx:26 ~ OrderFormPage ~ districtId:', districtId);

  useEffect(() => {
    setValue('districtId', []);
    setValue('wardId', []);
  }, [cityId]);

  useEffect(() => {
    setValue('wardId', []);
  }, [districtId]);

  const cities = useMemo(
    () => getProvinces().map((city) => ({ key: city.code, value: city.code, label: city.name })),
    [],
  );

  const districts = useMemo(() => {
    return Array.isArray(cityId) && cityId.length > 0
      ? getDistricts(cityId[0].toString()).map((district) => ({
          key: district.code,
          value: district.code,
          label: district.name,
        }))
      : [];
  }, [cityId]);

  const wards = useMemo(() => {
    return Array.isArray(districtId) && districtId.length > 0
      ? getWards(districtId[0].toString()).map((ward) => ({
          key: ward.code,
          value: ward.code,
          label: ward.name,
        }))
      : [];
  }, [districtId]);

  return (
    <div>
      <CustomBreadcrumb
        pageName="Tạo đơn hàng mới"
        routes={[
          {
            label: 'Thêm đơn hàng mới',
          },
        ]}
      />
      <Card>
        <CardHeader>
          <Svg src={UserIcon} className="w-5 h-5 text-zinc-600 mr-2" />
          <span className="font-bold text-lg">Thông tin khách hàng</span>
        </CardHeader>
        <Divider />
        <CardBody className="p-4">
          <FormProvider {...forms}>
            <Box className="space-y-4">
              <FormContextInput<Order>
                isRequired
                name="fullName"
                label="Họ và tên"
                rules={{
                  required: 'Vui lòng nhập tên khách hàng!',
                }}
              />
              <FormContextInput<Order> isRequired name="phoneNumber" label="Số điện thoại" />
              <FormContextSelect isRequired name="cityId" label="Tỉnh / Thành phố" items={cities}>
                {(city: any) => (
                  <SelectItem key={city.key} textValue={city.label}>
                    {city.label}
                  </SelectItem>
                )}
              </FormContextSelect>
              <FormContextSelect
                isRequired
                name="districtId"
                items={districts}
                label="Quận / Huyện"
                isDisabled={!(Array.isArray(cityId) && cityId.length > 0)}
              >
                {(district: any) => (
                  <SelectItem key={district.key} textValue={district.label}>
                    {district.label}
                  </SelectItem>
                )}
              </FormContextSelect>
              <FormContextSelect
                isRequired
                name="wardId"
                items={wards}
                label="Phường / Xã"
                isDisabled={!(Array.isArray(districtId) && districtId.length > 0)}
              >
                {(ward: any) => (
                  <SelectItem key={ward.key} textValue={ward.label}>
                    {ward.label}
                  </SelectItem>
                )}
              </FormContextSelect>
              <FormContextInput<Order>
                isRequired
                name="location"
                label="Số nhà, tên đường cụ thể"
                rules={{
                  required: 'Vui lòng nhập tên khách hàng!',
                }}
              />
              <Button color="primary" variant="shadow">
                Tiếp tục
              </Button>
            </Box>
          </FormProvider>
        </CardBody>
      </Card>
    </div>
  );
};

export default OrderFormPage;
