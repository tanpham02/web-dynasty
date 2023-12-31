import axiosService from '../axiosService';
import {
  CUSTOMER_URL,
  FIND_CUSTOMER_BY_CRITERIA_URL,
  FIND_CUSTOMER_HISTORY_BY_CRITERIA_URL,
} from '../apiUrl';
import { ListDataResponse, ListResponse, SearchParams } from '~/types';
import qs from 'qs';
import { Customer, CustomerHistory } from '~/models/customers';

const customerService = {
  searchCustomerByCriteria: async (params: SearchParams): Promise<ListDataResponse<Customer>> => {
    return axiosService()({
      url: `${FIND_CUSTOMER_BY_CRITERIA_URL}`,
      method: 'GET',
      params,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  searchCustomerHistoryByCriteria: async (
    params: SearchParams,
  ): Promise<ListResponse<CustomerHistory>> => {
    return axiosService()({
      url: `${FIND_CUSTOMER_HISTORY_BY_CRITERIA_URL}`,
      method: 'GET',
      params,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getCustomerByCustomerID: async (id: number): Promise<Customer> => {
    return axiosService()({
      url: `${CUSTOMER_URL}/${id}`,
      method: 'GET',
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  updateCustomer: async (data: Customer): Promise<Customer> => {
    return axiosService()({
      url: `${CUSTOMER_URL}`,
      method: 'PATCH',
      data: data,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  calculatorPoint: async (data: CustomerHistory): Promise<CustomerHistory> => {
    return axiosService()({
      url: `${CUSTOMER_URL}/point`,
      method: 'POST',
      data: data,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  deleteCustomer: async (ids: number[]) => {
    return axiosService()({
      url: `${CUSTOMER_URL}`,
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

export default customerService;
