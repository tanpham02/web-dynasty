import { Banner } from '~/models/banner';
import { ListResponse, SearchParams } from '~/types';
import axiosService from '../axiosService';
import { BANNER_URL } from '../apiUrl';
import qs from 'qs';

export const bannerService = {
  getBanner: (params: SearchParams): Promise<ListResponse<Banner>> => {
    return axiosService()({
      baseURL: `${BANNER_URL}/search`,
      method: 'GET',
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  createBanner: (params: Banner, data: FormData): Promise<Banner> => {
    return axiosService()({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      baseURL: `${BANNER_URL}`,
      method: 'POST',
      params,
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  updateBanner: (params: Banner, data: FormData): Promise<Banner> => {
    return axiosService()({
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      baseURL: `${BANNER_URL}/${params.id}`,
      method: 'PATCH',
      params: {
        redirectId: params.redirectId,
        link: params.link,
        bannerType: params.bannerType,
      },
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  deleteBanner: async (ids: number[]) => {
    return axiosService()({
      url: `${BANNER_URL}`,
      method: 'DELETE',
      params: {
        ids: ids,
      },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
};
