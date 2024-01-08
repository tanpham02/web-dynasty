import { ListDataResponse, SearchParams } from '~/types';
import axiosService from '../axiosService';
import { Order, StatusOrder } from '~/models/order';

import { ORDER_URL } from '../apiUrl';

const orderService = {
  searchPagination: async (params: SearchParams): Promise<ListDataResponse<Order>> => {
    return axiosService()({
      method: 'GET',
      baseURL: `${ORDER_URL}/search`,
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  updateOrderStatus: async (orderId: string, statusOrder: StatusOrder) => {
    return axiosService()({
      method: 'PATCH',
      baseURL: `${ORDER_URL}/update-status-order/${orderId}`,
      params: {
        orderId,
        statusOrderRequest: statusOrder,
      },
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getOrderById: async (id?: string): Promise<Order> => {
    return axiosService()({
      method: 'GET',
      baseURL: `${ORDER_URL}/${id}`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
};

export default orderService;
