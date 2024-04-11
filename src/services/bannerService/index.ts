import qs from 'qs';

import { Banner } from '~/models/banner';
import { BANNER_URL } from '../apiUrl';
import axiosService from '../axiosService';

export const bannerService = {
  getBanner: (): Promise<Banner[]> => {
    return axiosService()({
      baseURL: `${BANNER_URL}/search`,
      method: 'GET',
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getBannerById: (bannerId: string): Promise<Banner> => {
    return axiosService()({
      baseURL: `${BANNER_URL}/${bannerId}`,
      method: 'GET',
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  createBanner: (data: FormData): Promise<Banner> => {
    return axiosService()({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      baseURL: `${BANNER_URL}`,
      method: 'POST',
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  updateBanner: (bannerId: string, data: FormData): Promise<Banner> => {
    return axiosService()({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      baseURL: `${BANNER_URL}/${bannerId}`,
      method: 'PATCH',
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  deleteBanner: async (ids: string[]) => {
    return axiosService()({
      url: `${BANNER_URL}`,
      method: 'DELETE',
      params: {
        ids,
      },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
};
