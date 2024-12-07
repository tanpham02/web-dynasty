import { StockManagementInformation } from '~/models/stockManagements'
import { ListDataResponse, SearchParams } from '~/types'
import axiosService from '../axiosService'
import { STOCK_MANAGEMENTS_URL } from '../apiUrl'
import { Key } from 'react'

const stockManagementService = {
  searchPagination: (
    params: SearchParams,
  ): Promise<ListDataResponse<StockManagementInformation>> => {
    return axiosService()({
      method: 'GET',
      baseURL: `${STOCK_MANAGEMENTS_URL}/search`,
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err
      })
  },
  create: (
    data: StockManagementInformation,
  ): Promise<StockManagementInformation> => {
    return axiosService()({
      method: 'POST',
      baseURL: `${STOCK_MANAGEMENTS_URL}`,
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err
      })
  },
  update: (
    id?: string,
    data?: StockManagementInformation,
  ): Promise<StockManagementInformation> => {
    return axiosService()({
      method: 'PATCH',
      baseURL: `${STOCK_MANAGEMENTS_URL}/${id}`,
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err
      })
  },
  getById: (id: string) => {
    return axiosService()({
      method: 'GET',
      baseURL: `${STOCK_MANAGEMENTS_URL}/${id}`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err
      })
  },
  delete: (id?: Key) => {
    return axiosService()({
      method: 'DELETE',
      baseURL: `${STOCK_MANAGEMENTS_URL}/${id}`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err
      })
  },
  invoice: (data: StockManagementInformation): Promise<void> => {
    return axiosService()({
      method: 'POST',
      baseURL: `${STOCK_MANAGEMENTS_URL}/invoice-export`,
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err
      })
  },
}

export default stockManagementService
