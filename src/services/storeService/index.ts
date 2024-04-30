import { ListResponse, SearchParams } from '~/types';
import { STORE_SYSTEM_URL } from '../apiUrl';
import axiosService from '../axiosService';
import { StoreModel } from '~/models/store';
import qs from 'qs';

export const storeService = {
  searchStoreByCriteria: async (
    params: SearchParams,
  ): Promise<ListResponse<StoreModel>> => {
    return axiosService()({
      url: `${STORE_SYSTEM_URL}/search`,
      method: 'GET',
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  createNew: async (data: StoreModel): Promise<StoreModel> => {
    return axiosService()({
      url: STORE_SYSTEM_URL,
      method: 'POST',
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  updateById: async (id: string, data: StoreModel): Promise<StoreModel> => {
    return axiosService()({
      url: `${STORE_SYSTEM_URL}/${id}`,
      method: 'PATCH',
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getById: async (id: string): Promise<StoreModel> => {
    return axiosService()({
      url: `${STORE_SYSTEM_URL}/${id}`,
      method: 'GET',
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  deleteByIds: async (ids: string[]): Promise<StoreModel> => {
    return axiosService()({
      url: STORE_SYSTEM_URL,
      method: 'DELETE',
      params: { ids },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: 'repeat' }),
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
};
