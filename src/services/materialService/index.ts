import { Material } from '~/models/materials';
import { ListDataResponse, SearchParams } from '~/types';
import axiosService from '../axiosService';
import { MATERIALS_URL } from '../apiUrl';
import { Key } from 'react';

const materialService = {
  searchPagination: (
    params: SearchParams,
  ): Promise<ListDataResponse<Material>> => {
    return axiosService()({
      method: 'GET',
      baseURL: `${MATERIALS_URL}/search`,
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  create: (data: Material): Promise<Material> => {
    return axiosService()({
      method: 'POST',
      baseURL: `${MATERIALS_URL}`,
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  update: (id?: string, data?: Material): Promise<Material> => {
    return axiosService()({
      method: 'PATCH',
      baseURL: `${MATERIALS_URL}/${id}`,
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getById: (id: string) => {
    return axiosService()({
      method: 'GET',
      baseURL: `${MATERIALS_URL}/${id}`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  delete: (id?: Key) => {
    return axiosService()({
      method: 'DELETE',
      baseURL: `${MATERIALS_URL}/${id}`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
};

export default materialService;
