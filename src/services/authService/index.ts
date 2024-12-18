import axios from 'axios'

import { SignInType } from '~/models'
import { REFRESH_TOKEN_URL, SIGNIN_URL, SIGN_OUT_URL } from '../apiUrl'
import axiosService from '../axiosService'

const authService = {
  signIn: async (payload: SignInType) => {
    return axios({
      baseURL: SIGNIN_URL,
      method: 'POST',
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err
      })
  },
  signOut: async () => {
    return axiosService()({
      method: 'POST',
      url: SIGN_OUT_URL,
    })
  },
  refreshToken: async (refresh_token: string) => {
    return axios({
      method: 'POST',
      url: REFRESH_TOKEN_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        refreshToken: refresh_token,
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error
      })
  },
}

export default authService
