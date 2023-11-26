/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo } from 'react';
import { Button, Col, DatePicker, Input, Modal, Row, Select, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
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

const defaultUserValues: User = {
  address: '',
  birthday: '', // moment(new Date()).format(DATE_FORMAT_YYYYMMDD)
  fullName: '',
  phoneNumber: '',
  role: UserRole.ADMIN,
  username: '',
  password: '',
  cpassword: '',
};

// eslint-disable-next-line react-refresh/only-export-components
export enum ModalType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  INFORMATION = 'INFORMATION',
}
export interface UserModalProps {
  user?: User;
  visible?: boolean;
  modalType?: ModalType;
  onClose: () => void;
  refetchData: () => void;
}

const UserModal = ({ visible, user, modalType, onClose, refetchData }: UserModalProps) => {
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

  const {
    control,
    formState: { errors },
    reset,
    watch,
    handleSubmit,
  } = useForm({
    defaultValues: defaultUserValues,
  });

  useEffect(() => {
    if (user && visible) {
      setAvatarBlob(user?.image || '');
      return reset(user);
    }
    return reset(defaultUserValues);
  }, [user]);

  useEffect(() => {
    if (!visible || modalType === ModalType.CREATE) {
      setAvatarBlob('');
    }
  }, [visible, modalType]);

  const getTitleModalAndButton = useMemo(() => {
    let result = {
      titleModal: '',
      titleButton: '',
    };
    switch (modalType) {
      case ModalType.CREATE:
        result = {
          titleModal: 'Thêm nhân viên mới',
          titleButton: 'Thêm nhân viên',
        };
        setIsShowInputUpdatePw(true);
        break;
      case ModalType.UPDATE:
        result = {
          titleModal: 'Cập nhật thông tin nhân viên',
          titleButton: 'Cập nhật',
        };
        setIsShowInputUpdatePw(false);
        break;
      case ModalType.INFORMATION:
        result = {
          titleModal: 'Thông tin nhân viên',
          titleButton: '',
        };
        break;
    }

    return result;
  }, [modalType]);

  const onSubmit = async (data: User) => {
    setIsLoading(true);
    const formData = new FormData();
    if (avatar) {
      formData.append('files', avatar);
    }

    try {
      formData.append('userInfo', JSON.stringify(data));
      modalType === ModalType.CREATE
        ? await userService.createUser(formData)
        : modalType === ModalType.UPDATE && user?._id && (await userService.updateUser(formData, user._id));

      if (modalType !== ModalType.CREATE && currentUserLogin._id === user?._id) {
        dispatch(getUserInfo(currentUserLogin?._id || ''));
      }

      toast.success(
        `${
          modalType === ModalType.CREATE
            ? 'Thêm nhân viên thành công'
            : modalType === ModalType.UPDATE
            ? 'Cập nhật nhân viên thành công'
            : ''
        }`,
        {
          position: 'bottom-right',
          duration: 4000,
          icon: '🤪',
        },
      );
      setIsShowInputUpdatePw(false);
      setIsLoading(false);
      setAvatarBlob('');
      refetchData();
      reset({});
      onClose();
    } catch (err) {
      console.log(err);
      toast.success('Thêm nhân viên thất bại', {
        position: 'bottom-right',
        duration: 4000,
        icon: '😞',
      });
      setIsLoading(false);
    }
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
    <>
      <Modal
        open={visible}
        title={getTitleModalAndButton.titleModal}
        okText='Lưu thay đổi'
        cancelText='Hủy bỏ'
        onCancel={onClose}
        style={{ minWidth: '70%' }}
        footer={[
          modalType === ModalType.INFORMATION ? '' : <Button onClick={onClose}>Hủy</Button>,
          <Button
            form='form-user'
            key='submit'
            htmlType='submit'
            className='!bg-primary !text-white border border-solid !border-primary'
          >
            {getTitleModalAndButton.titleButton}
          </Button>,
        ]}
      >
        <form
          autoComplete='off'
          id='form-user'
          onSubmit={handleSubmit(onSubmit)}
        >
          <Row gutter={24}>
            <Col span={8}>
              {modalType !== ModalType.INFORMATION && (
                <div>
                  <div
                    id='FileUpload'
                    className='relative mb-5.5 block w-full cursor-pointer appearance-none rounded border-2 border-dashed border-primary bg-gray py-4 px-4 dark:bg-meta-4 sm:py-7.5 '
                  >
                    <input
                      type='file'
                      accept='image/*'
                      className='absolute inset-0 z-50 m-0 h-full w-full cursor-pointer p-0 opacity-0 outline-none'
                      onChange={handleChangeFileAvatar}
                    />
                    {!avatarBlob ? (
                      <div className='flex flex-col items-center justify-center space-y-3'>
                        <span className='flex h-10 w-10 items-center justify-center rounded-full border border-stroke bg-white dark:border-strokedark dark:bg-boxdark'>
                          <svg
                            width='16'
                            height='16'
                            viewBox='0 0 16 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M1.99967 9.33337C2.36786 9.33337 2.66634 9.63185 2.66634 10V12.6667C2.66634 12.8435 2.73658 13.0131 2.8616 13.1381C2.98663 13.2631 3.1562 13.3334 3.33301 13.3334H12.6663C12.8431 13.3334 13.0127 13.2631 13.1377 13.1381C13.2628 13.0131 13.333 12.8435 13.333 12.6667V10C13.333 9.63185 13.6315 9.33337 13.9997 9.33337C14.3679 9.33337 14.6663 9.63185 14.6663 10V12.6667C14.6663 13.1971 14.4556 13.7058 14.0806 14.0809C13.7055 14.456 13.1968 14.6667 12.6663 14.6667H3.33301C2.80257 14.6667 2.29387 14.456 1.91879 14.0809C1.54372 13.7058 1.33301 13.1971 1.33301 12.6667V10C1.33301 9.63185 1.63148 9.33337 1.99967 9.33337Z'
                              fill='#3C50E0'
                            />
                            <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M7.5286 1.52864C7.78894 1.26829 8.21106 1.26829 8.4714 1.52864L11.8047 4.86197C12.0651 5.12232 12.0651 5.54443 11.8047 5.80478C11.5444 6.06513 11.1223 6.06513 10.8619 5.80478L8 2.94285L5.13807 5.80478C4.87772 6.06513 4.45561 6.06513 4.19526 5.80478C3.93491 5.54443 3.93491 5.12232 4.19526 4.86197L7.5286 1.52864Z'
                              fill='#3C50E0'
                            />
                            <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M7.99967 1.33337C8.36786 1.33337 8.66634 1.63185 8.66634 2.00004V10C8.66634 10.3682 8.36786 10.6667 7.99967 10.6667C7.63148 10.6667 7.33301 10.3682 7.33301 10V2.00004C7.33301 1.63185 7.63148 1.33337 7.99967 1.33337Z'
                              fill='#3C50E0'
                            />
                          </svg>
                        </span>
                        <p>
                          <span className='text-primary'>Click to upload</span> or drag and drop
                        </p>
                        <p className='mt-1.5'>SVG, PNG, JPG or GIF</p>
                        <p>(max, 800 X 800px)</p>
                      </div>
                    ) : (
                      <img
                        src={avatarBlob}
                        className='max-h-[300px] border-[1px] border-solid border-[#ddd] mx-auto '
                      />
                    )}
                  </div>
                </div>
              )}
            </Col>

            <Col span={16}>
              <Typography.Text className='text-[17px] font-semibold'>Thông tin nhân viên</Typography.Text>
              <Row
                gutter={16}
                className='mt-5'
              >
                {modalType != ModalType.INFORMATION ? (
                  <>
                    <Col span={12}>
                      <Typography.Text
                        type='secondary'
                        className='!text-black text-[14.5px]'
                      >
                        Họ và tên <strong className='text-xl text-danger'>*</strong>
                      </Typography.Text>
                      <Controller
                        name='fullName'
                        rules={{ required: true }}
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Input
                            value={value}
                            onChange={onChange}
                            className={`h-[38px] border-solid border-[1px] ${errors.fullName ? '!border-danger' : ''}`}
                            placeholder='Họ và tên'
                          />
                        )}
                      />
                      {errors.fullName?.type === 'required' ? (
                        <small className='text-danger text-[13px]'>Họ và tên không được rỗng</small>
                      ) : (
                        ''
                      )}
                    </Col>
                    {modalType === ModalType.CREATE && (
                      <Col span={12}>
                        <Typography.Text
                          type='secondary'
                          className='!text-black text-[14.5px]'
                        >
                          Tên đăng nhập <strong className='text-xl text-danger'>*</strong>
                        </Typography.Text>
                        <Controller
                          control={control}
                          name='username'
                          rules={{ required: modalType === ModalType.CREATE }}
                          render={({ field: { value, onChange } }) => (
                            <Input
                              className={`h-[38px] border-solid border-[1px] ${
                                errors.username ? '!border-danger' : ''
                              }`}
                              value={value}
                              onChange={onChange}
                              placeholder='Tên đăng nhập'
                            />
                          )}
                        />
                        {errors.username?.type === 'required' && (
                          <small className='text-danger text-[13px]'>Tên đăng nhập không được rỗng</small>
                        )}
                      </Col>
                    )}

                    {modalType === ModalType.UPDATE && (
                      <Col span={12}>
                        <Typography.Text
                          type='secondary'
                          className='!text-black text-[14.5px] block !mt-[5px]'
                        >
                          Trạng thái hoạt động
                        </Typography.Text>
                        <Controller
                          name='status'
                          rules={{ required: true }}
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <Select
                              className='w-full'
                              onChange={onChange}
                              value={value}
                              options={[
                                { value: UserStatus.ACTIVE, label: 'Hoạt động' },
                                { value: UserStatus.IN_ACTIVE, label: 'Không hoạt động' },
                              ]}
                            />
                          )}
                        />
                      </Col>
                    )}
                  </>
                ) : (
                  <Col span={12}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black '
                    >
                      Họ và tên:&nbsp;
                    </Typography.Text>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[15px] font-medium'
                    >
                      {user?.fullName || ''}
                    </Typography.Text>
                  </Col>
                )}
              </Row>

              <Row
                gutter={16}
                className='mt-5'
              >
                {modalType != ModalType.INFORMATION ? (
                  <Col span={12}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[14.5px]'
                    >
                      Ngày sinh
                    </Typography.Text>
                    <Controller
                      control={control}
                      name='birthday'
                      render={({ field: { value, onChange } }) => {
                        if (value) {
                          return (
                            <DatePicker
                              allowClear={false}
                              value={moment(value)}
                              className='h-[38px] w-full '
                              onChange={(value) => onChange(moment(value).format(DATE_FORMAT_YYYYMMDD))}
                              format={DATE_FORMAT_DDMMYYYY}
                            />
                          );
                        } else {
                          return (
                            <DatePicker
                              allowClear={false}
                              className='h-[38px] w-full '
                              placeholder='Ngày sinh'
                              // value={moment(value)}
                              onChange={(value) => onChange(moment(value).format(DATE_FORMAT_YYYYMMDD))}
                              format={DATE_FORMAT_DDMMYYYY}
                            />
                          );
                        }
                      }}
                    />
                  </Col>
                ) : (
                  <Col span={12}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black '
                    >
                      Ngày sinh:&nbsp;
                    </Typography.Text>
                    <Typography.Text
                      type='secondary'
                      className='!text-black  text-[15px] font-medium'
                    >
                      {user?.birthday ? formatDate(user?.birthday, DATE_FORMAT_DDMMYYYY) : ''}
                    </Typography.Text>
                  </Col>
                )}

                {modalType !== ModalType.INFORMATION ? (
                  <Col span={12}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[14.5px] block !mt-[-5px]'
                    >
                      Vai trò <strong className='text-xl text-danger'>*</strong>
                    </Typography.Text>
                    <Controller
                      name='role'
                      control={control}
                      render={({ field: { onChange, value } }) => {
                        return (
                          <Select
                            defaultValue={roleSelection[0].value}
                            value={value ? value : roleSelection[0].value}
                            options={roleSelection}
                            className='w-full !h-[38px]'
                            disabled={
                              value &&
                              currentUserLogin.role &&
                              handleCheckRolePermission(value, currentUserLogin.role) &&
                              modalType !== ModalType.CREATE
                            }
                            onChange={onChange}
                          />
                        );
                      }}
                    />
                  </Col>
                ) : (
                  <Col span={12}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[14.5px]'
                    >
                      Vai trò:&nbsp;
                    </Typography.Text>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[15px] font-medium'
                    >
                      {user?.role ? (user.role === UserRole.ADMIN ? 'Quản trị' : 'Nhân viên') : ''}
                    </Typography.Text>
                  </Col>
                )}
              </Row>

              <Row
                gutter={16}
                className='mt-5'
              >
                {modalType !== ModalType.INFORMATION ? (
                  <Col span={12}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[14.5px]'
                    >
                      Số điện thoại <strong className='text-xl text-danger'>*</strong>
                    </Typography.Text>
                    <Controller
                      name='phoneNumber'
                      rules={{
                        required: true,
                        pattern: PATTERN.PHONE,
                      }}
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Input
                          className={`h-[38px] border-solid border-[1px] ${errors.phoneNumber ? '!border-danger' : ''}`}
                          placeholder='Số điện thoại'
                          value={value}
                          onChange={onChange}
                        />
                      )}
                    />
                    {errors.phoneNumber && errors.phoneNumber.type === 'required' && (
                      <small className='text-danger text-[13px]'>Số điện thoại không được rỗng</small>
                    )}
                    {errors.phoneNumber && errors.phoneNumber.type === 'pattern' && (
                      <small className='text-danger text-[13px]'>Số điện thoại không hợp lệ</small>
                    )}
                  </Col>
                ) : (
                  <Col span={12}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[14.5px]'
                    >
                      Số điện thoại:&nbsp;
                    </Typography.Text>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[15px] font-medium'
                    >
                      {user?.phoneNumber || ''}
                    </Typography.Text>
                  </Col>
                )}

                {modalType !== ModalType.INFORMATION ? (
                  <Col span={12}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[14.5px] block mt-[5px]'
                    >
                      Địa chỉ
                    </Typography.Text>
                    <Controller
                      name='address'
                      control={control}
                      render={({ field: { value, onChange } }) => (
                        <Input
                          className='h-[38px] w-full'
                          placeholder=' Địa chỉ'
                          value={value}
                          onChange={onChange}
                        />
                      )}
                    />
                  </Col>
                ) : (
                  <Col span={12}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[14.5px]'
                    >
                      Địa chỉ:&nbsp;
                    </Typography.Text>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[15px] font-medium'
                    >
                      {user?.address || ''}
                    </Typography.Text>
                  </Col>
                )}
              </Row>

              <Row
                gutter={16}
                className={`${modalType === ModalType.UPDATE ? 'mt-5' : ''}`}
              >
                {modalType === ModalType.UPDATE && (
                  <Col span={12}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[14.5px]'
                    >
                      Tên đăng nhập <strong className='text-xl text-danger'>*</strong>
                    </Typography.Text>
                    <Controller
                      control={control}
                      name='username'
                      render={({ field: { value, onChange } }) => (
                        <Input
                          className={`h-[38px] border-solid border-[1px] ${errors.username ? '!border-danger' : ''}`}
                          value={value}
                          onChange={onChange}
                          disabled={modalType === ModalType.UPDATE}
                          placeholder='Tên đăng nhập'
                        />
                      )}
                    />
                    {errors.username?.type === 'required' && (
                      <small className='text-danger text-[13px]'>Tên đăng nhập không được rỗng</small>
                    )}
                  </Col>
                )}
                {modalType === ModalType.UPDATE && (
                  <Col span={12}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[14.5px]'
                    >
                      Email <strong className='text-xl text-danger'>*</strong>
                    </Typography.Text>
                    <Controller
                      control={control}
                      name='email'
                      rules={{ required: true, pattern: PATTERN.EMAIL }}
                      render={({ field: { value, onChange } }) => (
                        <Input
                          className={`h-[38px] border-solid border-[1px] ${errors.email ? '!border-danger' : ''}`}
                          value={value}
                          onChange={onChange}
                          placeholder='Email'
                        />
                      )}
                    />
                    {errors.email?.type === 'required' && (
                      <small className='text-danger text-[13px]'>Email không được rỗng</small>
                    )}
                    {errors.email?.type === 'pattern' && (
                      <small className='text-danger text-[13px]'>Email không hợp lệ</small>
                    )}
                  </Col>
                )}
                {modalType === ModalType.INFORMATION && (
                  <Col span={12}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black '
                    >
                      Tên đăng nhập:&nbsp;
                    </Typography.Text>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[15px] font-medium'
                    >
                      {user?.username || ''}
                    </Typography.Text>
                  </Col>
                )}
              </Row>

              <Row
                gutter={16}
                className={` mt-5`}
              >
                {modalType !== ModalType.INFORMATION && modalType !== ModalType.UPDATE && (
                  <Col span={24}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[14.5px]'
                    >
                      Email <strong className='text-xl text-danger'>*</strong>
                    </Typography.Text>
                    <Controller
                      control={control}
                      name='email'
                      rules={{ required: true, pattern: PATTERN.EMAIL }}
                      render={({ field: { value, onChange } }) => (
                        <Input
                          className={`h-[38px] border-solid border-[1px] ${errors.email ? '!border-danger' : ''}`}
                          value={value}
                          autoComplete='new-email'
                          aria-autocomplete='none'
                          onChange={onChange}
                          placeholder='Email'
                        />
                      )}
                    />
                    {errors.email?.type === 'required' && (
                      <small className='text-danger text-[13px]'>Email không được rỗng</small>
                    )}
                    {errors.email?.type === 'pattern' && (
                      <small className='text-danger text-[13px]'>Email không hợp lệ</small>
                    )}
                  </Col>
                )}
                {modalType === ModalType.UPDATE && (
                  <div className='mt-1.5 flex items-center justify-end w-full'>
                    <Row gutter={24}>
                      <Col span={24}>
                        <button
                          onClick={handleShowInputUpdatePassword}
                          className='h-[38px] px-3 bg-success rounded-[5px] text-white font-medium '
                        >
                          Đổi mật khẩu
                        </button>
                      </Col>
                    </Row>
                  </div>
                )}
              </Row>

              {isShowInputUpdatePw && modalType !== ModalType.INFORMATION && (
                <Row
                  gutter={16}
                  className='mt-1.5'
                >
                  <Col span={12}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[14.5px]'
                    >
                      Mật khẩu <strong className='text-xl text-danger'>*</strong>
                    </Typography.Text>
                    <Controller
                      name='password'
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { value, onChange } }) => (
                        <Input.Password
                          className={`h-[38px] border-solid border-[1px] ${errors.password ? '!border-danger' : ''}`}
                          placeholder='Mật khẩu'
                          autoComplete='new-password'
                          value={value}
                          onChange={onChange}
                          type='password'
                          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                      )}
                    />
                    {errors.password?.type === 'required' && (
                      <small className='text-danger text-[13px]'>Mật khẩu không được rỗng</small>
                    )}
                  </Col>

                  <Col span={12}>
                    <Typography.Text
                      type='secondary'
                      className='!text-black text-[14.5px]'
                    >
                      Nhập lại mật khẩu <strong className='text-xl text-danger'>*</strong>
                    </Typography.Text>
                    <Controller
                      name='cpassword'
                      control={control}
                      rules={{
                        required: true,
                        validate: (value) => value === watch('password'),
                      }}
                      render={({ field: { value, onChange } }) => (
                        <Input.Password
                          className={`h-[38px] border-solid border-[1px] ${errors.cpassword ? '!border-danger' : ''}`}
                          placeholder='Nhập lại mật khẩu'
                          value={value}
                          onChange={onChange}
                          type='password'
                          iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                        />
                      )}
                    />
                    {errors.cpassword?.type === 'required' && (
                      <small className='text-danger text-[13px]'>Vui lòng nhập lại mật khẩu</small>
                    )}
                    {errors.cpassword?.type === 'validate' && (
                      <small className='text-danger text-[13px]'>Nhập lại mật khẩu không trùng khớp</small>
                    )}
                  </Col>
                </Row>
              )}
            </Col>
          </Row>
        </form>
      </Modal>
      {isLoading && <Loading />}
    </>
  );
};

export default UserModal;
