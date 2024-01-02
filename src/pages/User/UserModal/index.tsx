import { useEffect, useMemo, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { useSnackbar } from 'notistack';
import { getProvincesWithDetail } from 'vietnam-provinces';
import { DatePicker } from 'antd';
import moment from 'moment';
import { Button, SelectItem } from '@nextui-org/react';
import { useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

import { Users, UserRole } from '~/models/user';
import CustomModal from '~/components/NextUI/CustomModal';
import { FormContextInput } from '~/components/NextUI/Form';
import Box from '~/components/Box';
import { PATTERN } from '~/utils/regex';
import Upload, { onChangeUploadState } from '~/components/Upload';
import { DATE_FORMAT_DDMMYYYY, DATE_FORMAT_YYYYMMDD, formatDate } from '~/utils/date.utils';
import FormContextSelect from '~/components/NextUI/Form/FormContextSelect';
import { globalLoading } from '~/components/GlobalLoading';
import userService from '~/services/userService';
import { QUERY_KEY } from '~/constants/queryKey';
import { getFullImageUrl } from '~/utils/image';
import { AppDispatch } from '~/redux/store';
import { getUserInfo } from '~/redux/slice/userSlice';

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
  const [avatar, setAvatar] = useState<onChangeUploadState>();
  const { enqueueSnackbar } = useSnackbar();
  const [changePw, setChangePw] = useState<boolean>(false);
  const [locations, setLocations] = useState({
    city: {},
    ward: {},
    district: {},
  });

  const dispatch = useDispatch<AppDispatch>();
  const forms = useForm<Users>({
    defaultValues: defaultUserValues,
  });

  const {
    control,
    formState: { isSubmitting },
    reset,
    watch,
    setValue,
    handleSubmit,
    getFieldState,
  } = forms;
  // debugger;

  useQuery(
    [QUERY_KEY.USERS_DETAIL, userId],
    async () => {
      globalLoading.show();
      if (userId) {
        const response = await userService.getUserByUserId(userId);
        reset({
          ...response,
          cityId: response?.cityId ? ([String(response.cityId)] as any) : [],
          districtId: response?.districtId ? ([String(response.districtId)] as any) : [],
          wardId: response?.wardId ? ([String(response.wardId)] as any) : [],
          role: response?.role ? ([response.role] as any) : [],
        });

        if (response?.image) {
          setAvatar({
            srcPreview: getFullImageUrl(response.image),
          });
        }
      }
      globalLoading.hide();
    },
    {
      enabled: Boolean(userId) && isEdit,
      refetchOnWindowFocus: false,
    },
  );

  const mappingVietNamLocation = useMemo(() => {
    if (vietnamLocations) {
      const newLocationsArray = Object.keys(vietnamLocations).map((key) => vietnamLocations[key]);

      return newLocationsArray;
    }
  }, [JSON.stringify(vietnamLocations)]);

  const handleGetDistrictsFromVietnamLocation = useMemo(() => {
    const cityIdWatchValue = watch('cityId')?.toString();

    if (cityIdWatchValue) {
      const districtsMapping = mappingVietNamLocation?.find(
        (city) => city?.code === cityIdWatchValue,
      );
      console.log('districtsMapping', districtsMapping);

      // reset(
      //   (prev) =>
      //     ({
      //       ...prev,
      //       city: districtsMapping?.name,
      //       cityId: [cityIdWatchValue],
      //       districtId: getFieldState('cityId').isDirty ? [] : [prev.districtId],
      //       wardId: getFieldState('cityId').isDirty ? [] : [prev.wardId],
      //     }) as any,
      // );

      if (districtsMapping?.districts) {
        const districts = Object.keys(districtsMapping.districts)
          .map((key) => [districtsMapping.districts[key]])
          .flatMap((item) => item);
        return districts;
      }
    }
  }, [watch('cityId')]);

  const handleGetWardsFromVietnamLocation = useMemo(() => {
    const districtIdWatchValue = watch('districtId')?.toString();
    if (districtIdWatchValue) {
      const districtsMapping = handleGetDistrictsFromVietnamLocation?.find(
        (districts) =>
          districts?.code ===
          (Number(districtIdWatchValue) < 100 ? `0${districtIdWatchValue}` : districtIdWatchValue),
      );

      // reset(
      //   (prev) =>
      //     ({
      //       ...prev,
      //       district: districtsMapping?.name,
      //       wardId: getFieldState('districtId').isDirty ? [] : [prev.wardId],
      //     }) as any,
      // );
      if (districtsMapping?.wards) {
        const wards = Object.keys(districtsMapping.wards)
          .map((key) => [districtsMapping.wards[key]])
          .flatMap((item) => item);
        return wards;
      }
    }
  }, [watch('districtId')]);

  // useEffect(() => {
  //   const wardIdWatchValue = watch('wardId')?.toString();
  //   if (wardIdWatchValue) {
  //     const wards = handleGetWardsFromVietnamLocation?.find(
  //       (ward) => ward?.code === wardIdWatchValue,
  //     );

  //     setValue('ward', wards?.name);
  //   }
  // }, [watch('wardId')]);

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
      image: '',
      confirmPw: '',
    });
    setAvatar({
      srcPreview: '',
      srcRequest: '',
    });
    setChangePw(false);
  };

  const onSubmit = async (data: Users) => {
    globalLoading.show();
    const formData = new FormData();
    if (avatar) {
      formData.append('file', avatar.srcRequest);
    }
    const newData: Users = {
      ...data,
      birthday: data?.birthday ? formatDate(data.birthday, DATE_FORMAT_YYYYMMDD) : null,
    };
    formData.append('userInfo', JSON.stringify(newData));

    try {
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
        autoHideDuration: 2000,
      });
    } catch (err) {
      console.log('🚀 ~ file: index.tsx:219 ~ onSubmit ~ err:', err);
      enqueueSnackbar({
        message: `${!isEdit ? 'Thêm' : 'Cập nhật'} nhân viên thất bại!`,
        variant: 'error',
        autoHideDuration: 2000,
      });
    } finally {
      globalLoading.hide();
    }
  };

  // const handleCheckRolePermission = (recordRole: UserRole, currentUserLoginRole: UserRole) => {
  //   if (currentUserLoginRole === UserRole.ADMIN) {
  //     if (recordRole === UserRole.ADMIN) {
  //       return true;
  //     } else return false;
  //   } else return true;
  // };

  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Cập nhật thông tin nhân viên' : 'Thêm mới nhân viên'}
      okButtonText={isEdit ? 'Lưu thay đổi' : 'Thêm'}
      className="w-full max-w-[80%]"
      onOk={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
      isDismissable={false}
      scrollBehavior="inside"
      placement="center"
      onClose={() => {
        handleResetFormValue();
        setModal?.({
          userId: undefined,
        });
      }}
    >
      <FormProvider {...forms}>
        <Box className="grid grid-cols-1 xl:grid-cols-[3fr_7fr] gap-8">
          <Box>
            <Upload
              onChange={({ srcPreview, srcRequest }: onChangeUploadState) => {
                setAvatar({
                  srcPreview,
                  srcRequest,
                });
              }}
              src={avatar?.srcPreview}
              loading="lazy"
              className="!relative"
              radius="full"
              isPreview
            />
          </Box>

          <Box className="space-y-4">
            <FormContextInput<Users> name="fullName" label="Họ và tên" isClearable />
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
              isClearable
            />
            <Controller
              control={control}
              name="birthday"
              render={({ field: { value, onChange, ref } }) => (
                <DatePicker
                  allowClear
                  ref={ref}
                  value={value ? moment(value) : null}
                  format={DATE_FORMAT_DDMMYYYY}
                  placeholder="Ngày sinh"
                  onChange={(date) => (date ? onChange(moment(date)) : '')}
                />
              )}
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
              isClearable
            />
            <FormContextSelect
              isRequired
              name="role"
              label="Vai trò"
              rules={{
                required: 'Vui lòng chọn vai trò',
              }}
            >
              {roleSelection.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </FormContextSelect>
            <FormContextSelect name="cityId" label="Tỉnh/Thành">
              {mappingVietNamLocation &&
                mappingVietNamLocation.length > 0 &&
                (mappingVietNamLocation.map((item) => (
                  <SelectItem key={item?.code} value={item?.code}>
                    {item?.name}
                  </SelectItem>
                )) as any)}
            </FormContextSelect>
            <FormContextSelect
              name="districtId"
              label="Quận/Huyện"
              isDisabled={!handleGetDistrictsFromVietnamLocation}
              disallowEmptySelection
            >
              {(handleGetDistrictsFromVietnamLocation as any[])?.map((item) => (
                <SelectItem key={Number(item?.code)} value={Number(item?.code)}>
                  {item?.name}
                </SelectItem>
              ))}
            </FormContextSelect>
            <FormContextSelect
              name="wardId"
              label="Phường/Xã"
              isDisabled={!handleGetWardsFromVietnamLocation}
              disallowEmptySelection
            >
              {(handleGetWardsFromVietnamLocation as any[])?.map((item) => (
                <SelectItem key={Number(item?.code)} value={Number(item?.code)}>
                  {item?.name}
                </SelectItem>
              ))}
            </FormContextSelect>
            <FormContextInput<Users> name="location" label="Số nhà, tên đường" isClearable />
            <FormContextInput<Users>
              isRequired
              name="username"
              label="Tên đăng nhập"
              rules={{
                required: 'Vui lòng nhập tên đăng nhập',
              }}
              isClearable={!isEdit}
              isDisabled={isEdit}
            />

            {!isEdit && (
              <>
                <FormContextInput<Users>
                  isRequired
                  name="password"
                  label="Mật khẩu"
                  type="password"
                  rules={{
                    required: 'Vui lòng nhập mật khẩu',
                    pattern: {
                      value: PATTERN.PASSWORD,
                      message:
                        'Sai định dạng (Mật khẩu ít nhất 8 ký tự, bao gồm ít nhất một chữ số, một ký tự đặc biệt, một chứ cái thường và một chữ cái in hoa)',
                    },
                  }}
                />

                <FormContextInput<Users>
                  isRequired
                  name="confirmPw"
                  label="Xác nhận mật khẩu"
                  type="password"
                  rules={{
                    required: 'Vui lòng nhập mật khẩu xác nhận',
                    validate: {
                      confirmPw: (value) =>
                        value !== watch('password')
                          ? 'Mật khẩu và mật khẩu xác nhận không khớp'
                          : true,
                    },
                  }}
                />
              </>
            )}

            {isEdit && (
              <>
                {changePw && (
                  <>
                    <FormContextInput<Users>
                      isRequired
                      name="password"
                      label="Mật khẩu"
                      type="password"
                      rules={{
                        required: 'Vui lòng nhập mật khẩu',
                        pattern: {
                          value: PATTERN.PASSWORD,
                          message:
                            'Sai định dạng (Mật khẩu ít nhất 8 ký tự, bao gồm ít nhất một chữ số, một ký tự đặc biệt, một chứ cái thường và một chữ cái in hoa)',
                        },
                      }}
                    />

                    <FormContextInput<Users>
                      isRequired
                      name="confirmPw"
                      label="Xác nhận mật khẩu"
                      type="password"
                      rules={{
                        required: 'Vui lòng nhập mật khẩu xác nhận',
                        validate: {
                          confirmPw: (value) =>
                            value !== watch('password')
                              ? 'Mật khẩu và mật khẩu xác nhận không khớp'
                              : true,
                        },
                      }}
                    />
                  </>
                )}

                <Button
                  onClick={() => {
                    setChangePw(!changePw);
                  }}
                  radius="sm"
                  className="bg-white border border-primary hover:text-primary"
                >
                  {`${changePw ? 'Huỷ' : 'Đổi mật khẩu'}`}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </FormProvider>
    </CustomModal>
  );
};

export default UserModal;
