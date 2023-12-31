import axiosService from '../axiosService';
import { NHANH_VN_CONFIG } from '../apiUrl';
import qs from 'qs';
import { NhanhVn } from '~/models/nhanhVn';

export const nhanhVnService = {
  getAllNhanhVn: async (): Promise<NhanhVn[]> => {
    return axiosService()({
      baseURL: `${NHANH_VN_CONFIG}/all`,
      method: 'GET',
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  createNhanhVn: async (data: NhanhVn): Promise<NhanhVn> => {
    return axiosService()({
      baseURL: `${NHANH_VN_CONFIG}`,
      method: 'POST',
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  updateNhanhVn: async (data: NhanhVn, id: number): Promise<NhanhVn> => {
    return axiosService()({
      baseURL: `${NHANH_VN_CONFIG}/${id}`,
      method: 'PATCH',
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getNhanhVnById: async (id: number): Promise<NhanhVn> => {
    return axiosService()({
      baseURL: `${NHANH_VN_CONFIG}/${id}`,
      method: 'GET',
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },

  deleteNhanhVn: async (ids: number[]): Promise<NhanhVn> => {
    return axiosService()({
      baseURL: `${NHANH_VN_CONFIG}`,
      method: 'DELETE',
      params: {
        ids,
      },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
};
