/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import { Controller, FieldValue, FieldValues, FormProvider, useForm } from 'react-hook-form';
import { Users, UserRole } from '~/models/user';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '~/redux/store';
import CustomModal from '~/components/NextUI/CustomModal';
import { FormContextInput } from '~/components/NextUI/Form';
import Box from '~/components/Box';
import { PATTERN } from '~/utils/regex';
import Upload from '~/components/Upload';
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { DATE_FORMAT_DDMMYYYY } from '~/utils/date.utils';
import moment from 'moment';
import FormContextSelect from '~/components/NextUI/Form/FormContextSelect';
import { Select, SelectItem } from '@nextui-org/react';

const defaultUserValues: Users = {
  role: UserRole.ADMIN,
};

export enum ModalType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  INFORMATION = 'INFORMATION',
}
export interface UserModalProps {
  isOpen?: boolean;
  onOpenChange?(): void;
  onRefetch?(): Promise<any>;
  isEdit?: boolean;
  userId?: string;
}
const roleSelection = [
  {
    value: UserRole.ADMIN,
    label: 'Quản trị',
  },
  {
    value: UserRole.USER,
    label: 'Nhân viên',
  },
];

const UserModal = ({ isOpen, onOpenChange, onRefetch, isEdit, userId }: UserModalProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<any>();
  const [isShowInputUpdatePw, setIsShowInputUpdatePw] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const forms = useForm<Users>({
    defaultValues: defaultUserValues,
  });

  const {
    control,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
    getValues,
    handleSubmit,
  } = forms;

  // useEffect(() => {
  //   if (user && visible) {
  //     setAvatarBlob(user?.image || '');
  //     return reset(user);
  //   }
  //   return reset(defaultUserValues);
  // }, [user]);

  // useEffect(() => {
  //   if (!visible || modalType === ModalType.CREATE) {
  //     setAvatarBlob('');
  //   }
  // }, [visible, modalType]);

  // const getTitleModalAndButton = useMemo(() => {
  //   let result = {
  //     titleModal: '',
  //     titleButton: '',
  //   };
  //   switch (modalType) {
  //     case ModalType.CREATE:
  //       result = {
  //         titleModal: 'Thêm nhân viên mới',
  //         titleButton: 'Thêm nhân viên',
  //       };
  //       setIsShowInputUpdatePw(true);
  //       break;
  //     case ModalType.UPDATE:
  //       result = {
  //         titleModal: 'Cập nhật thông tin nhân viên',
  //         titleButton: 'Cập nhật',
  //       };
  //       setIsShowInputUpdatePw(false);
  //       break;
  //     case ModalType.INFORMATION:
  //       result = {
  //         titleModal: 'Thông tin nhân viên',
  //         titleButton: '',
  //       };
  //       break;
  //   }

  //   return result;
  // }, [modalType]);

  const onSubmit = async (data: Users) => {
    setIsLoading(true);
    const formData = new FormData();
    if (avatar) {
      formData.append('files', avatar);
    }

    // try {
    //   formData.append('userInfo', JSON.stringify(data));
    //   modalType === ModalType.CREATE
    //     ? await userService.createUser(formData)
    //     : modalType === ModalType.UPDATE &&
    //       user?._id &&
    //       (await userService.updateUser(formData, user._id));

    //   if (modalType !== ModalType.CREATE && currentUserLogin._id === user?._id) {
    //     dispatch(getUserInfo(currentUserLogin?._id || ''));
    //   }

    //   toast.success(
    //     `${
    //       modalType === ModalType.CREATE
    //         ? 'Thêm nhân viên thành công'
    //         : modalType === ModalType.UPDATE
    //         ? 'Cập nhật nhân viên thành công'
    //         : ''
    //     }`,
    //     {
    //       position: 'bottom-right',
    //       duration: 4000,
    //       icon: '🤪',
    //     },
    //   );
    //   setIsShowInputUpdatePw(false);
    //   setIsLoading(false);
    //   setAvatarBlob('');
    //   refetchData();
    //   reset({});
    //   onClose();
    // } catch (err) {
    //   console.log(err);
    //   toast.success('Thêm nhân viên thất bại', {
    //     position: 'bottom-right',
    //     duration: 4000,
    //     icon: '😞',
    //   });
    //   setIsLoading(false);
    // }
  };

  const handleShowInputUpdatePassword = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setIsShowInputUpdatePw(!isShowInputUpdatePw);
  };

  const handleCheckRolePermission = (recordRole: UserRole, currentUserLoginRole: UserRole) => {
    if (currentUserLoginRole === UserRole.ADMIN) {
      if (recordRole === UserRole.ADMIN) {
        return true;
      } else return false;
    } else return true;
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
      isDismissable={false}
    >
      <FormProvider {...forms}>
        <Box className="grid grid-cols-1 xl:grid-cols-[3fr_7fr] gap-8">
          <Box>
            <Upload
              onChange={(src) => setAvatar(src)}
              src={avatar}
              loading="lazy"
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
                  value={value || null}
                  format={DATE_FORMAT_DDMMYYYY}
                  placeholder="Ngày sinh"
                  onChange={(date) => (date ? onChange(moment(date)) : '')}
                  className="w-1/2 !mt-10 h-[48px] "
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
              label="Email"
              isClearable
            />

            <FormContextInput<Users>
              isRequired
              name="username"
              label="Tên đăng nhập"
              rules={{
                required: 'Vui lòng nhập tên đăng nhập',
              }}
              isClearable
            />

            <FormContextSelect
              isRequired
              name="role"
              label="Vai trò"
              rules={{
                required: 'Vui lòng chọn vai trò',
              }}
              value={UserRole.ADMIN}
              items={roleSelection}
            >
              {(optionItem: any) => (
                <SelectItem key={optionItem.value.toString()} value={optionItem.value?.toString()}>
                  {optionItem.label}
                </SelectItem>
              )}
            </FormContextSelect>

            <FormContextInput<Users>
              isRequired
              name="password"
              label="Mật khẩu"
              type="password"
              rules={{
                required: 'Vui lòng nhập mật khẩu',
                pattern: {
                  value: PATTERN.PASSWORD,
                  message: 'Mật khẩu không hợp lệ',
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
                  confirmPw: (value) => value === watch('password'),
                },
              }}
            />
          </Box>
        </Box>
      </FormProvider>
    </CustomModal>
  );
};

export default UserModal;
