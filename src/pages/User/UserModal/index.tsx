/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';
import { Button, Col, DatePicker, Input, Modal, Row, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { User, UserRole, UserStatus } from '~/models/user';
import { PATTERN } from '~/utils/regex';
import moment from 'moment';
import { DATE_FORMAT_DDMMYYYY, DATE_FORMAT_YYYYMMDD, formatDate } from '~/utils/date.utils';
import { toast } from 'react-hot-toast';
import userService from '~/services/userService';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '~/redux/store';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Loading from '~/components/Loading';
import { getUserInfo } from '~/redux/slice/userSlice';
import CustomModal from '~/components/NextUI/CustomModal';
import { FormContextInput } from '~/components/NextUI/Form';

const defaultUserValues: User = {
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
  const currentUserLogin = useSelector<RootState, User>((state) => state.userStore.user);
  const dispatch = useDispatch<AppDispatch>();

  const forms = useForm({
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

  const onSubmit = async (data: User) => {
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
      title={isEdit ? 'Cập nhật danh mục' : 'Thêm danh mục mới'}
      okButtonText={isEdit ? 'Lưu thay đổi' : 'Thêm'}
      className="w-full max-w-[600px]"
      onOk={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
    >
      <FormProvider {...forms}>
        <div className="space-y-4">
          <FormContextInput
            isRequired
            name=""
            label="Tên danh mục"
            rules={{
              required: 'Vui lòng nhập tên danh mục',
            }}
          />
        </div>
      </FormProvider>
    </CustomModal>
  );
};

export default UserModal;
