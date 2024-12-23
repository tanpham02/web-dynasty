import { SearchParams } from '~/types'
import axiosService from '../axiosService'

import { OverViewModel } from '~/models/overview'
import { OVERVIEWS_URL } from '../apiUrl'
import { ProductMain } from '~/models/product'

const overviewService = {
  getOverview: async (params: SearchParams): Promise<OverViewModel> => {
    return axiosService()({
      method: 'GET',
      baseURL: `${OVERVIEWS_URL}/overview`,
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err
      })
  },
  getRevenueChart: async (
    params: SearchParams,
  ): Promise<{ date: string[]; data: number[] }> => {
    return axiosService()({
      method: 'GET',
      baseURL: `${OVERVIEWS_URL}/revenue-chart`,
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err
      })
  },
  getProfitChart: async (
    params: SearchParams,
  ): Promise<{ date: string[]; data: number[] }> => {
    return axiosService()({
      method: 'GET',
      baseURL: `${OVERVIEWS_URL}/profit-chart`,
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err
      })
  },
  getFiveProductsBestSelling: async (): Promise<ProductMain[]> => {
    return axiosService()({
      method: 'GET',
      baseURL: `${OVERVIEWS_URL}/top-best-selling`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err
      })
  },
}

export default overviewService
