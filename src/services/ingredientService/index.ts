import { Ingredients } from '~/models/ingredients'
import { ListDataResponse, SearchParams } from '~/types'
import { INGREDIENT_URL } from '../apiUrl'
import axiosService from '../axiosService'

const ingredientService = {
  searchPagination: (
    params: SearchParams,
  ): Promise<ListDataResponse<Ingredients>> => {
    return axiosService()({
      method: 'GET',
      baseURL: `${INGREDIENT_URL}/search`,
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err
      })
  },
}

export default ingredientService
