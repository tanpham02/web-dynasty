import axios from 'axios';
import { REFRESH_TOKEN_URL, SIGNIN_URL, SIGN_OUT_URL } from '../apiUrl';
import axiosService from '../axiosService';
import { SignInType } from '~/models/authen';
const authService = {
  signIn: async (payload: SignInType) => {
    return axios({
      url: SIGNIN_URL,
      method: 'POST',
      data: payload,
    });
  },
  signOut: async () => {
    return axiosService()({
      method: 'POST',
      url: SIGN_OUT_URL,
    });
  },
  refreshToken: async (refresh_token: string) => {
    return axiosService()({
      method: 'POST',
      url: REFRESH_TOKEN_URL,
      headers: {
        'Content-Type': 'text/plain',
      },
      data: refresh_token,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
};

export default authService;
