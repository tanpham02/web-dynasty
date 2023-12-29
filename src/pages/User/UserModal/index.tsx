/* eslint-disable react-hooks/exhaustive-deps */
import { useState } from 'react';
import { FieldValue, FieldValues, FormProvider, useForm } from 'react-hook-form';
import { Users, UserRole } from '~/models/user';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '~/redux/store';
import CustomModal from '~/components/NextUI/CustomModal';
import { FormContextInput } from '~/components/NextUI/Form';
import Box from '~/components/Box';
import { PATTERN } from '~/utils/regex';

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

const UserModal = ({ isOpen, onOpenChange, onRefetch, isEdit, userId }: UserModalProps) => {
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

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<File | string>('');
  const [avatarBlob, setAvatarBlob] = useState<any>();
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

  const handleChangeFileAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    const reader = new FileReader();

    reader.onloadend = function () {
      setAvatarBlob(reader.result);
    };

    if (files) {
      reader.readAsDataURL(files?.[0]);
      setAvatar(files[0]);
    }
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
    >
      <FormProvider {...forms}>
        <Box className="grid grid-cols-[3fr_7fr] gap-8">
          <Box>
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
                {!avatarBlob ? (
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
                    <p className="text-center">
                      <span className="text-primary">Click to upload</span> or drag and drop
                    </p>
                    <p className="mt-1.5 text-center">SVG, PNG, JPG or GIF</p>
                    <p className="text-center">(max, 800 X 800px)</p>
                  </div>
                ) : (
                  <img
                    src={avatarBlob}
                    className="max-h-[300px] border-[1px] border-solid border-[#ddd] mx-auto "
                  />
                )}
              </div>
            </div>
          </Box>

          <Box className="space-y-4">
            <FormContextInput control={control} name="fullName" label="Họ và tên" />
            <FormContextInput<Users>
              control={control}
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
            <FormContextInput<Users>
              control={control}
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
            />
            <FormContextInput<Users>
              isRequired
              control={control}
              name="username"
              label="Tên đăng nhập"
              rules={{
                required: 'Vui lòng nhập tên đăng nhập',
              }}
            />
            <FormContextInput<Users>
              isRequired
              control={control}
              name="password"
              label="Mật khẩu"
              rules={{
                required: 'Vui lòng nhập mật khẩu',
                pattern: {
                  value: PATTERN.PASSWORD,
                  message: 'Mật khẩu không hợp lệ',
                },
              }}
            />
            <FormContextInput<Users>
              control={control}
              isRequired
              name="confirmPw"
              label="Xác nhận mật khẩu"
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
