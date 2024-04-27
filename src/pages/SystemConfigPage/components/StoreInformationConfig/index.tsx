import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  SelectItem,
} from '@nextui-org/react';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import Svg from 'react-inlinesvg';

import StoreSvg from '~/assets/svg/store.svg';
import { FormContextInput } from '~/components/NextUI/Form';
import FormContextSelect from '~/components/NextUI/Form/FormContextSelect';
import FormContextTextArea from '~/components/NextUI/Form/FormContextTextArea';
import useAddress from '~/hooks/useAddress';
import { StoreSettingModel } from '~/models/storeSetting';
import { PATTERN } from '~/utils/regex';

const StoreInformationConfig = () => {
  const { watch, getFieldState, setValue } =
    useFormContext<StoreSettingModel>();

  const currentFormValue = watch();

  const { cityOptions, districtOptions, wardOptions } = useAddress({
    cityId: currentFormValue?.storeInformation?.cityId?.[0],
    districtId: currentFormValue?.storeInformation?.districtId?.[0],
    wardId: currentFormValue?.storeInformation?.wardId?.[0],
  });

  useEffect(() => {
    if (getFieldState('storeInformation.cityId').isDirty) {
      setValue('storeInformation.districtId', []);
      setValue('storeInformation.wardId', []);
    }
  }, [currentFormValue?.storeInformation?.cityId]);

  useEffect(() => {
    if (getFieldState('storeInformation.districtId').isDirty) {
      setValue('storeInformation.wardId', []);
    }
  }, [currentFormValue?.storeInformation?.districtId]);
  return (
    <Card>
      <CardHeader>
        <span className="font-bold text-lg flex items-center gap-4 text-zinc-700">
          <Svg src={StoreSvg} className="w-5 h-5" />
          <span>Thông tin cửa hàng</span>
        </span>
      </CardHeader>
      <Divider />
      <CardBody className="p-4 space-y-4">
        <FormContextInput name="storeInformation.name" label="Tên cửa hàng" />
        <FormContextInput name="storeInformation.email" label="Email" rules={{
          pattern: {
            value: PATTERN.EMAIL,
            message: 'Email không hợp lệ!',
          }
        }} />
        <FormContextInput
          name="storeInformation.phoneNumber"
          label="Số điện thoại"
          rules={{
            pattern: {
              value: PATTERN.PHONE,
              message: 'Số điện thoại không hợp lệ!',
            }
          }}
        />
        <FormContextSelect
          items={cityOptions}
          label="Tỉnh / Thành phố"
          name="storeInformation.cityId"
        >
          {(item: any) => (
            <SelectItem key={item.value} textValue={item.label}>
              {item.label}
            </SelectItem>
          )}
        </FormContextSelect>
        <FormContextSelect
          items={districtOptions}
          label="Quận / Huyện"
          name="storeInformation.districtId"
          isDisabled={!currentFormValue?.storeInformation?.cityId?.[0]}
        >
          {(item: any) => (
            <SelectItem key={item.value} textValue={item.label}>
              {item.label}
            </SelectItem>
          )}
        </FormContextSelect>
        <FormContextSelect
          items={wardOptions}
          label="Phường / Xã / Thị Trấn"
          name="storeInformation.wardId"
          isDisabled={!currentFormValue?.storeInformation?.districtId?.[0]}
        >
          {(item: any) => (
            <SelectItem key={item.value} textValue={item.label}>
              {item.label}
            </SelectItem>
          )}
        </FormContextSelect>
        <FormContextInput
          name="storeInformation.location"
          label="Địa chỉ nhà, tên đường,..."
        />
        <FormContextInput name="storeInformation.taxCode" label="Mã số thuế" />
        <FormContextTextArea
          variant="bordered"
          classNames={{
            inputWrapper: 'border',
          }}
          label="Mô tả cửa hàng"
          name="storeInformation.description"
        />
      </CardBody>
    </Card>
  );
};

export default StoreInformationConfig;
