import { Button, SelectItem } from '@nextui-org/react';
import { useQuery } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { getProvincesWithDetail } from 'vietnam-provinces';

import Box from '~/components/Box';
import { globalLoading } from '~/components/GlobalLoading';
import CustomModal from '~/components/NextUI/CustomModal';
import {
  FormContextDatePicker,
  FormContextInput,
  FormContextSelect,
  FormContextUpload,
} from '~/components/NextUI/Form';
import { QUERY_KEY } from '~/constants/queryKey';
import { UserRole, Users } from '~/models/user';
import { getUserInfo } from '~/redux/slice/userSlice';
import { AppDispatch } from '~/redux/store';
import userService from '~/services/userService';
import { DATE_FORMAT_YYYYMMDD, formatDate } from '~/utils/date.utils';
import { getFullImageUrl } from '~/utils/image';
import { PATTERN } from '~/utils/regex';

const defaultUserValues: Users = {};

export enum ModalType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  INFORMATION = 'INFORMATION',
}
export interface UserModalProps {
  isOpen?: boolean;
  onClose?(): void;
  onOpenChange?(): void;
  setModal?({ isEdit, userId }: { isEdit?: boolean; userId?: string }): void;
  onRefetch?(): Promise<any>;
  isEdit?: boolean;
  userId?: string;
}
const roleSelection = [
  {
    value: UserRole.ADMIN,
    label: 'Quản trị viên',
  },
  {
    value: UserRole.USER,
    label: 'Nhân viên',
  },
];

interface Locations {
  [key: string]: {
    name?: string;
    id?: string;
  };
}

const UserModal = ({
  isOpen,
  onClose,
  onOpenChange,
  onRefetch,
  isEdit,
  userId,
  setModal,
}: UserModalProps) => {
  const vietnamLocations = getProvincesWithDetail();
  const { enqueueSnackbar } = useSnackbar();
  const [changePw, setChangePw] = useState<boolean>(false);
  const [locations, setLocations] = useState<Locations>({
    city: {},
    ward: {},
    district: {},
  });

  const dispatch = useDispatch<AppDispatch>();
  const forms = useForm<Users>({
    defaultValues: defaultUserValues,
  });

  const {
    formState: { isSubmitting, errors },
    reset,
    watch,
    handleSubmit,
    getFieldState,
    getValues,
    setValue,
    setError,
    clearErrors,
  } = forms;

  const phoneNumber = watch('phoneNumber');

  useQuery(
    [QUERY_KEY.USERS_DETAIL, userId],
    async () => {
      globalLoading.show();
      if (userId) {
        const response = await userService.getUserByUserId(userId);
        reset({
          ...response,
          cityId: response?.cityId ? ([String(response.cityId)] as any) : [],
          districtId: response?.districtId
            ? ([String(response.districtId)] as any)
            : [],
          wardId: response?.wardId ? ([String(response.wardId)] as any) : [],
          role: response?.role ? ([response.role] as any) : [],
        });
        setLocations({
          city: {
            id: String(response?.cityId) || undefined,
            name: response?.city || '',
          },
          district: {
            id: String(response?.districtId) || undefined,
            name: response?.district || '',
          },
          ward: {
            id: String(response?.wardId) || undefined,
            name: response?.ward || '',
          },
        });
      }
      globalLoading.hide();
    },
    {
      enabled: Boolean(userId) && isEdit,
      refetchOnWindowFocus: false,
    },
  );

  const vietNamLocation = useMemo(() => {
    if (vietnamLocations) {
      const newLocationsArray = Object.keys(vietnamLocations).map(
        (key) => vietnamLocations[key],
      );
      return newLocationsArray;
    }
  }, [JSON.stringify(vietnamLocations)]);

  const districtsFromVietnamLocation = useMemo(() => {
    const cityIdWatchValue = watch('cityId')?.toString();

    if (cityIdWatchValue) {
      const districtsMapping = vietNamLocation?.find(
        (city) => city?.code === cityIdWatchValue,
      );

      setLocations({
        city: {
          id: cityIdWatchValue,
          name: districtsMapping?.name,
        },
      });

      if (districtsMapping?.districts) {
        const districts = Object.keys(districtsMapping.districts)
          .map((key) => [districtsMapping.districts[key]])
          .flatMap((item) => item);
        return districts;
      }
    }
  }, [watch('cityId')]);

  const wardsFromVietnamLocation = useMemo(() => {
    const districtIdWatchValue = watch('districtId')?.toString();
    if (districtIdWatchValue) {
      const districtsMapping = districtsFromVietnamLocation?.find(
        (districts) =>
          districts?.code ===
          (Number(districtIdWatchValue) < 100
            ? `0${districtIdWatchValue}`
            : districtIdWatchValue),
      );

      setLocations((prev) => ({
        ...prev,
        district: {
          id: getFieldState('districtId').isDirty
            ? String(getValues('districtId'))
            : districtIdWatchValue,
          name: districtsMapping?.name,
        },
        ward: {
          id: getFieldState('districtId').isDirty
            ? undefined
            : String(getValues('wardId')),
          name: getFieldState('districtId').isDirty ? '' : prev.ward?.name,
        },
      }));

      if (districtsMapping?.wards) {
        const wards = Object.keys(districtsMapping.wards)
          .map((key) => [districtsMapping.wards[key]])
          .flatMap((item) => item);
        return wards;
      }
    }
  }, [watch('districtId')]);

  useEffect(() => {
    const wardIdWatchValue = watch('wardId')?.toString();

    if (wardIdWatchValue) {
      const wards = wardsFromVietnamLocation?.find(
        (ward) => ward?.code === wardIdWatchValue,
      );
      setLocations((prev) => ({
        ...prev,
        ward: {
          id: wardIdWatchValue,
          name: wards?.name,
        },
      }));
    }
  }, [watch('wardId')]);

  useEffect(() => {
    if (
      !isEdit &&
      phoneNumber &&
      PATTERN.PHONE.test(phoneNumber) &&
      !getFieldState('username').isDirty
    ) {
      setValue('username', phoneNumber);
    }
  }, [phoneNumber, isEdit]);

  const handleResetFormValue = () => {
    reset({
      birthday: '',
      username: '',
      fullName: '',
      phoneNumber: '',
      email: '',
      location: '',
      city: '',
      cityId: undefined,
      district: '',
      districtId: undefined,
      ward: '',
      wardId: undefined,
      password: '',
      role: undefined,
      status: undefined,
      image: undefined,
      confirmPw: '',
    });

    setChangePw(false);

    setLocations({});
  };

  const handleShowOrHideInputChangePassword = () => setChangePw(!changePw);

  const onSubmit = async (data: Users) => {
    globalLoading.show();
    const formData = new FormData();

    try {
      const isMatchOldPassword = await userService.checkMatchOldPassword({
        _id: data._id,
        password: data.oldPassword,
      });

      if (data?.oldPassword && isEdit && !isMatchOldPassword) {
        setError('oldPassword', {
          message: 'Mật khẩu cũ không chính xác',
          type: 'isMatchPassword',
        });
        return;
      } else {
        if (errors?.oldPassword) clearErrors('oldPassword');
        if (
          !isEdit &&
          phoneNumber &&
          watch('username') &&
          !getFieldState('username').isDirty
        ) {
          setValue('username', phoneNumber, { shouldDirty: true });
        }

        if (data.image instanceof Blob) {
          formData.append('file', data.image);
        }
        const newData: Users = {
          ...data,
          role: (data?.role?.[0] as UserRole) || UserRole.USER,
          birthday: data?.birthday
            ? formatDate(data.birthday, DATE_FORMAT_YYYYMMDD)
            : null,
        };

        if (isEdit && changePw && data?.newPassword) {
          newData.password = data.newPassword;
        }

        delete newData?.confirmPw;
        delete newData?.oldPassword;
        delete newData?.newPassword;
        delete newData.cityId;
        delete newData.city;
        delete newData.districtId;
        delete newData.district;
        delete newData.wardId;
        delete newData.ward;

        if (
          locations?.city &&
          Object.keys(locations.city).length > 0 &&
          !!locations.city?.id &&
          !!locations.city?.name
        ) {
          newData.cityId = locations.city.id;
          newData.city = locations.city?.name;
        }

        if (
          locations?.district &&
          Object.keys(locations.district).length > 0 &&
          !!locations.district?.id &&
          !!locations.district?.name
        ) {
          newData.districtId = locations.district?.id;
          newData.district = locations.district?.name;
        }

        if (
          locations?.ward &&
          Object.keys(locations.ward).length > 0 &&
          !!locations.ward?.id &&
          !!locations.ward?.name
        ) {
          newData.wardId = locations.ward?.id;
          newData.ward = locations.ward?.name;
        }

        formData.append('staffInfo', JSON.stringify(newData));
      }
      if (!isEdit) {
        await userService.createUser(formData);
      } else if (userId) {
        await userService.updateUser(formData, userId);
        dispatch(getUserInfo(userId));
      }

      handleResetFormValue();
      onClose?.();
      onRefetch?.();
      setModal?.({
        userId: undefined,
      });
      enqueueSnackbar({
        message: `${!isEdit ? 'Thêm' : 'Cập nhật'} nhân viên thành công!`,
      });
    } catch (err) {
      console.log('🚀 ~ file: index.tsx:219 ~ onSubmit ~ err:', err);
      enqueueSnackbar({
        message: `${!isEdit ? 'Thêm' : 'Cập nhật'} nhân viên thất bại!`,
        variant: 'error',
      });
    } finally {
      globalLoading.hide();
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Cập nhật thông tin nhân viên' : 'Thêm mới nhân viên'}
      okButtonText={isEdit ? 'Lưu thay đổi' : 'Thêm'}
      className="w-full max-w-[80%]"
      onOk={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
      scrollBehavior="inside"
      placement="center"
      onClose={() => {
        handleResetFormValue();
        setModal?.({
          userId: undefined,
        });
      }}
      isDismissable={false}
    >
      <FormProvider {...forms}>
        <Box className="grid grid-cols-1 xl:grid-cols-[3fr_7fr] gap-8">
          <Box className="w-[20vw] mx-auto">
            <FormContextUpload name="image" isCircle label="Ảnh đại diện" />
          </Box>
          <Box className="space-y-4">
            <FormContextInput<Users> name="fullName" label="Họ và tên" />
            <FormContextInput<Users>
              name="phoneNumber"
              rules={{
                pattern: {
                  value: PATTERN.PHONE,
                  message: 'Số điện thoại không hợp lệ',
                },
                required: 'Vui lòng nhập số điện thoại',
              }}
              isRequired
              label="Số điện thoại"
            />
            <FormContextDatePicker<Users>
              name="birthday"
              label="Ngày sinh"
              calendarWidth={300}
            />
            <FormContextInput<Users>
              name="email"
              rules={{
                pattern: {
                  value: PATTERN.EMAIL,
                  message: 'Email không hợp lệ',
                },
                required: 'Vui lòng nhập email',
              }}
              isRequired
              type="email"
              label="E-mail"
            />
            <FormContextSelect
              isRequired
              name="role"
              label="Vai trò"
              rules={{
                required: 'Vui lòng chọn vai trò',
              }}
              isDisabled={isEdit}
            >
              {roleSelection.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </FormContextSelect>
            <FormContextSelect name="cityId" label="Tỉnh/Thành">
              {vietNamLocation &&
                vietNamLocation.length > 0 &&
                (vietNamLocation.map((item) => (
                  <SelectItem key={item?.code} value={item?.code}>
                    {item?.name}
                  </SelectItem>
                )) as any)}
            </FormContextSelect>
            <FormContextSelect
              name="districtId"
              label="Quận/Huyện"
              isDisabled={!districtsFromVietnamLocation}
              disallowEmptySelection
            >
              {(districtsFromVietnamLocation as any[])?.map((item) => (
                <SelectItem key={Number(item?.code)} value={Number(item?.code)}>
                  {item?.name}
                </SelectItem>
              ))}
            </FormContextSelect>
            <FormContextSelect
              name="wardId"
              label="Phường/Xã"
              isDisabled={!wardsFromVietnamLocation}
              disallowEmptySelection
            >
              {(wardsFromVietnamLocation as any[])?.map((item) => (
                <SelectItem key={Number(item?.code)} value={Number(item?.code)}>
                  {item?.name}
                </SelectItem>
              ))}
            </FormContextSelect>
            <FormContextInput<Users>
              name="location"
              label="Số nhà, tên đường"
            />
            <FormContextInput<Users>
              isRequired
              name="username"
              label="Tên đăng nhập"
              rules={{
                required: 'Vui lòng nhập tên đăng nhập',
              }}
              isDisabled={isEdit}
            />
            {(!isEdit || changePw) && (
              <>
                <FormContextInput<Users>
                  isRequired
                  name={`${changePw ? 'oldPassword' : 'password'}`}
                  label={`${changePw ? 'Mật khẩu cũ' : 'Mật khẩu'}`}
                  type="password"
                  rules={{
                    required: `Vui lòng nhập mật khẩu${changePw ? ' cũ' : ''}`,
                    pattern: {
                      value: PATTERN.PASSWORD,
                      message: 'Mật khẩu của bạn phải ít nhất 6 ký tự',
                    },
                  }}
                />

                {changePw && (
                  <FormContextInput<Users>
                    isRequired
                    name="newPassword"
                    label="Mật khẩu mới"
                    type="password"
                    rules={{
                      required: 'Vui lòng nhập mật khẩu mới',
                      pattern: {
                        value: PATTERN.PASSWORD,
                        message: 'Mật khẩu của bạn phải ít nhất 6 ký tự',
                      },
                    }}
                  />
                )}

                {isEdit && (
                  <FormContextInput<Users>
                    isRequired
                    name="confirmPw"
                    label="Xác nhận mật khẩu"
                    type="password"
                    rules={{
                      required: 'Vui lòng nhập mật khẩu xác nhận',
                      validate: {
                        confirmPw: (value) =>
                          value !== watch(changePw ? 'newPassword' : 'password')
                            ? `Mật khẩu${
                                changePw ? ' mới' : ''
                              } và mật khẩu xác nhận không khớp`
                            : true,
                      },
                    }}
                  />
                )}
              </>
            )}
            {isEdit && (
              <Button
                onClick={handleShowOrHideInputChangePassword}
                radius="sm"
                className="bg-white border border-primary hover:text-primary"
              >
                {`${changePw ? 'Huỷ' : 'Đổi mật khẩu'}`}
              </Button>
            )}
          </Box>
        </Box>
      </FormProvider>
    </CustomModal>
  );
};

export default UserModal;
