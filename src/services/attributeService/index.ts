import qs from 'qs';
import { Key } from 'react';

import { Attribute } from '~/models/attribute';
import { ATTRIBUTES_URL } from '../apiUrl';
import axiosService from '../axiosService';

export const attributeService = {
  getAllAttributes: async (): Promise<Attribute[]> => {
    return axiosService()({
      url: `${ATTRIBUTES_URL}/search-all`,
      method: 'GET',
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  createAttribute: async (data: Attribute): Promise<Attribute> => {
    return axiosService()({
      url: ATTRIBUTES_URL,
      method: 'POST',
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  deleteAttribute: async (ids?: Key[]): Promise<Attribute> => {
    return axiosService()({
      url: ATTRIBUTES_URL,
      method: 'DELETE',
      params: {
        ids,
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: 'repeat' }),
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getAttributeById: async (id?: Key): Promise<Attribute> => {
    return axiosService()({
      url: `${ATTRIBUTES_URL}/${id}`,
      method: 'GET',
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  updateAttributeById: async (
    id?: Key,
    data?: Attribute,
  ): Promise<Attribute> => {
    return axiosService()({
      url: `${ATTRIBUTES_URL}/${id}`,
      method: 'PATCH',
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
};
