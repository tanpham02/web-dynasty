import { ProductMain, ProductTypes } from './../../models/product';
import { Product } from '~/models/product';
import { ListDataResponse, ListResponse, SearchParams } from '~/types';
import axiosService from '../axiosService';
import {
  PRODUCT_URL,
  PRODUCT_FROM_THIRD_PARTY_URL,
  FIND_PRODUCT_BY_CRITERIA_URL,
  PRODUCT_CONFIG_TYPE_URL,
} from '../apiUrl';
import qs from 'qs';
import { Key } from 'react';

export const productService = {
  getProductFromThirdParty: async (params: SearchParams): Promise<ListResponse<Product>> => {
    return axiosService()({
      baseURL: `${PRODUCT_FROM_THIRD_PARTY_URL}`,
      method: 'GET',
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getProductPagination: async (params: SearchParams): Promise<ListDataResponse<ProductMain>> => {
    return axiosService()({
      baseURL: `${PRODUCT_URL}/search`,
      method: 'GET',
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getProductDetail: async (id: string): Promise<ProductMain> => {
    return axiosService()({
      baseURL: `${PRODUCT_URL}/${id}`,
      method: 'GET',
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  createProduct: async (products: FormData): Promise<Product> => {
    return axiosService()({
      baseURL: PRODUCT_URL,
      method: 'POST',
      data: products,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  updateProduct: async (products?: FormData, id?: string): Promise<Product> => {
    return axiosService()({
      baseURL: `${PRODUCT_URL}/${id}`,
      method: 'PATCH',
      data: products,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  deleteProduct: async (ids?: Key[]) => {
    return axiosService()({
      url: `${PRODUCT_URL}`,
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
  changeProductTypeInZaloMiniApp: async (ids: number[], productTypes: ProductTypes[]) => {
    return axiosService()({
      url: `${PRODUCT_CONFIG_TYPE_URL}`,
      method: 'PATCH',
      params: {
        nhanhVnIds: ids,
        productTypes: productTypes,
      },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
};
