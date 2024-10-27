import { Button, SelectItem } from '@nextui-org/react'
import { useQuery } from '@tanstack/react-query'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import Box from '~/components/Box'
import { globalLoading } from '~/components/GlobalLoading'
import CustomModal from '~/components/NextUI/CustomModal'
import {
  FormContextDatePicker,
  FormContextInput,
  FormContextSelect,
  FormContextUpload,
} from '~/components/NextUI/Form'
import { QUERY_KEY } from '~/constants/queryKey'
import useAddress from '~/hooks/useAddress'
import { UserRole, Users } from '~/models/user'
import userService from '~/services/userService'
import { DATE_FORMAT_YYYYMMDD, formatDate } from '~/utils/date.utils'
import { PATTERN } from '~/utils/regex'

const defaultUserValues: Users = {}

export enum ModalType {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  INFORMATION = 'INFORMATION',
}
export interface UserModalProps {
  isOpen?: boolean
  onClose?(): void
  onOpenChange?(): void
  setModal?({ isEdit, userId }: { isEdit?: boolean; userId?: string }): void
  onRefetch?(): Promise<any>
  isEdit?: boolean
  userId?: string
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
]

const UserModal = ({
  isOpen,
  onClose,
  onOpenChange,
  onRefetch,
  isEdit,
  userId,
  setModal,
}: UserModalProps) => {
  const { enqueueSnackbar } = useSnackbar()
  const [changePw, setChangePw] = useState<boolean>(false)

  const forms = useForm<Users>({
    defaultValues: defaultUserValues,
  })

  const {
    formState: { isSubmitting, errors },
    reset,
    watch,
    handleSubmit,
    getFieldState,
    setValue,
    setError,
    clearErrors,
  } = forms

  const phoneNumber = watch('phoneNumber')
  const currentFormData = watch()

  const { cityOptions, districtOptions, wardOptions, addressInfo } = useAddress(
    {
      cityId: currentFormData?.cityId?.[0],
      districtId: currentFormData?.districtId?.[0],
      wardId: currentFormData?.wardId?.[0],
    },
  )

  useQuery(
    [QUERY_KEY.USERS_DETAIL, userId],
    async () => {
      globalLoading.show()
      if (userId) {
        const response = await userService.getUserByUserId(userId)
        reset({
          ...response,
          cityId: response?.cityId
            ? ([String(response.cityId || '')] as any)
            : [],
          districtId: response?.districtId
            ? ([String(response.districtId || '')] as any)
            : [],
          wardId: response?.wardId
            ? ([String(response.wardId || '')] as any)
            : [],
          role: response?.role ? ([response.role] as any) : [],
        })
      }
      globalLoading.hide()
    },
    {
      enabled: Boolean(userId) && isEdit,
      refetchOnWindowFocus: false,
    },
  )

  useEffect(() => {
    if (getFieldState('cityId').isDirty) setValue('districtId', '')
  }, [currentFormData?.cityId, getFieldState])

  useEffect(() => {
    if (getFieldState('cityId').isDirty) setValue('wardId', '')
  }, [currentFormData?.districtId, getFieldState])

  useEffect(() => {
    if (
      !isEdit &&
      phoneNumber &&
      PATTERN.PHONE.test(phoneNumber) &&
      !getFieldState('username').isDirty
    ) {
      setValue('username', phoneNumber)
    }
  }, [phoneNumber, isEdit])

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
    })

    setChangePw(false)
  }

  const handleShowOrHideInputChangePassword = () => setChangePw(!changePw)

  const onSubmit = async (data: Users) => {
    globalLoading.show()
    const formData = new FormData()

    try {
      const isMatchOldPassword = await userService.checkMatchOldPassword({
        _id: data._id,
        password: data.oldPassword,
      })

      if (data?.oldPassword && isEdit && !isMatchOldPassword) {
        setError('oldPassword', {
          message: 'Mật khẩu cũ không chính xác',
          type: 'isMatchPassword',
        })
        return
      } else {
        if (errors?.oldPassword) clearErrors('oldPassword')
        if (
          !isEdit &&
          phoneNumber &&
          watch('username') &&
          !getFieldState('username').isDirty
        ) {
          setValue('username', phoneNumber, { shouldDirty: true })
        }

        if (data.image instanceof Blob) {
          formData.append('file', data.image)
        }
        const newData: Users = {
          ...data,
          role: (data?.role?.[0] as UserRole) || UserRole.USER,
          birthday: data?.birthday
            ? formatDate(data.birthday, DATE_FORMAT_YYYYMMDD)
            : null,
          ward: addressInfo?.ward,
          wardId: data?.wardId?.[0] || '',
          district: addressInfo?.district,
          districtId: data?.districtId?.[0] || '',
          city: addressInfo?.city,
          cityId: data?.cityId?.[0] || '',
        }

        if (isEdit && changePw && data?.newPassword) {
          newData.password = data.newPassword
        }

        delete newData?.confirmPw
        delete newData?.oldPassword
        delete newData?.newPassword

        formData.append('staffInfo', JSON.stringify(newData))
      }
      if (!isEdit) await userService.createUser(formData)
      else if (userId) await userService.updateUser(formData, userId)

      handleResetFormValue()
      onClose?.()
      onRefetch?.()
      setModal?.({
        userId: undefined,
      })
      enqueueSnackbar({
        message: `${!isEdit ? 'Thêm' : 'Cập nhật'} nhân viên thành công!`,
      })
    } catch (err) {
      console.log('🚀 ~ file: index.tsx:219 ~ onSubmit ~ err:', err)
      enqueueSnackbar({
        message: `${!isEdit ? 'Thêm' : 'Cập nhật'} nhân viên thất bại!`,
        variant: 'error',
      })
    } finally {
      globalLoading.hide()
    }
  }

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
        handleResetFormValue()
        setModal?.({
          userId: undefined,
        })
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
              {cityOptions?.map((item) => (
                <SelectItem key={item?.value} value={item?.value}>
                  {item?.label}
                </SelectItem>
              ))}
            </FormContextSelect>
            <FormContextSelect
              name="districtId"
              label="Quận/Huyện"
              isDisabled={!currentFormData?.cityId?.[0]}
              disallowEmptySelection
            >
              {districtOptions?.map((item) => (
                <SelectItem key={item?.value} value={item?.label}>
                  {item?.label}
                </SelectItem>
              ))}
            </FormContextSelect>
            <FormContextSelect
              name="wardId"
              label="Phường/Xã"
              isDisabled={!currentFormData?.districtId?.[0]}
              disallowEmptySelection
            >
              {wardOptions?.map((item) => (
                <SelectItem key={item?.value} value={item?.label}>
                  {item?.label}
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
  )
}

export default UserModal
