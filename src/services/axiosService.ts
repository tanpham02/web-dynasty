import axios from 'axios'
import { toast } from 'react-hot-toast'

import { BASE_URL } from '~/config'
import { LOCAL_STORAGE } from '../constants/local_storage'
import { asyncLocalStorage } from '../utils/localStorage.utils'
import { checkTokenExp } from '../utils/token.utils'
import authService from './authService'
import { PATH_NAME } from '~/constants'

// closure: to save the refreshTokenRequest
const axiosService = () => {
  const accessToken = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN) || ''
  const refreshToken = localStorage.getItem(LOCAL_STORAGE.REFRESH_TOKEN) || ''

  const loadRefreshToken = async () => {
    try {
      if (refreshToken) {
        const response = await authService.refreshToken(refreshToken)
        return response
      }
    } catch (error: any) {
      if (
        error?.response?.data?.status === 401 &&
        error?.response?.data?.message === 'jwt expired'
      ) {
        window.location.replace(PATH_NAME.LOGIN)
      }
      console.log('error when call refresh token: ', error)
      throw error
    }
  }

  const axiosOptions = axios.create({
    baseURL: BASE_URL,
    headers: {
      'content-type': 'application/json',
      Authorization: 'Bearer ' + accessToken,
    },
  })

  // Truoc khi gui server
  axiosOptions.interceptors.request.use(
    async (config: any) => {
      if (!checkTokenExp(accessToken)) {
        try {
          const response = await loadRefreshToken()
          if (response) {
            asyncLocalStorage.setLocalStorage(
              LOCAL_STORAGE.ACCESS_TOKEN,
              response.accessToken,
            )
            asyncLocalStorage.setLocalStorage(
              LOCAL_STORAGE.REFRESH_TOKEN,
              response.refreshToken,
            )
            config.headers = {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + response?.accessToken,
            }
          }
        } catch (error: any) {
          if (!error.response) {
            if (!error.response) {
              toast.error('Lỗi khi kết nối với server', {})
            }
          }
        }
        return config
      }
      return config
    },

    (error) => {
      Promise.reject(error)
    },
  )
  // Sau khi gui server
  axiosOptions.interceptors.response.use(
    (response) => {
      return response
    },
    (errors) => {
      console.log(
        'Error:',
        JSON.stringify(
          {
            url: errors.response.config.url,
            status: errors.response.status,
            method: errors.response.config.method,
            data: errors.response.data,
            headers: errors.response.headers,
          },
          null,
          2,
        ),
      )
      if (!errors.response) {
        toast.error('Lỗi khi kết nối với server', {})
      }
      if (errors?.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn', {})
        localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN)
        window.location.href = '/signin'
      }
      throw errors
    },
  )
  return axiosOptions
}

export default axiosService
