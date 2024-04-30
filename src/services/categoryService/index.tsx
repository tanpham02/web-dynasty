import { Key } from 'react';
import qs from 'qs';

import { ListResponse, SearchParams } from '~/types';
import axiosService from '../axiosService';
import { CATEGORY_URL } from '../apiUrl';
import { Category } from '~/models/category';

export const categoryService = {
  getAllCategory: async (): Promise<Category[]> => {
    return axiosService()({
      url: `${CATEGORY_URL}/search-all`,
      method: 'GET',
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getCategoryByCriteria: async (
    params: SearchParams,
  ): Promise<ListResponse<Category>> => {
    return axiosService()({
      url: `${CATEGORY_URL}/search`,
      method: 'GET',
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  createCategory: async (data: FormData): Promise<Category> => {
    return axiosService()({
      url: CATEGORY_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  updateCategory: async (id?: Key, data?: FormData): Promise<Category> => {
    return axiosService()({
      url: `${CATEGORY_URL}/${id}`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  deleteCategoryByIds: async (ids?: Key[]): Promise<string> => {
    return axiosService()({
      url: CATEGORY_URL,
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
  getCategoryById: async (id?: Key): Promise<Category> => {
    return axiosService()({
      url: `${CATEGORY_URL}/${id}`,
      method: 'GET',
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
};
