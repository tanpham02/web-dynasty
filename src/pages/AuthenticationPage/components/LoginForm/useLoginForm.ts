import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useEventListener } from 'usehooks-ts'

import { LOCAL_STORAGE, PATH_NAME } from '~/constants'
import { SignInType } from '~/models'
import { AuthService } from '~/services'

export const useLoginForm = () => {
  const navigation = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  const formMethods = useForm<SignInType>({
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting: isLogin, isDirty },
  } = formMethods

  const login = async (data: SignInType) => {
    try {
      const dataSubmit: SignInType = {
        username: data.username,
        password: data.password,
      }

      const response = await AuthService.signIn(dataSubmit)

      localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, response.accessToken)
      localStorage.setItem(LOCAL_STORAGE.REFRESH_TOKEN, response.refreshToken)
      navigation(PATH_NAME.STAFF_MANAGEMENT)
      enqueueSnackbar({
        message: 'Đăng nhập thành công!',
      })
      reset()
    } catch (error) {
      enqueueSnackbar({
        message: 'Đăng nhập thất bại!',
        variant: 'error',
      })
      console.log(error)
    }
  }

  const handleLogin = handleSubmit(login)

  const handleKeyPress = (event: KeyboardEvent) => {
    if (isDirty && (event?.key === 'Enter' || event.keyCode === 13)) {
      handleLogin()
    }
  }

  useEventListener('keypress', handleKeyPress)

  return { handleLogin, formMethods, isLogin } as const
}
