import { createSlice } from '@reduxjs/toolkit'
import { ProductMain } from '~/models/product'

export interface ProductInitialState {
  productListSelected: ProductMain[]
}

const initialState: ProductInitialState = {
  productListSelected: [],
}

const productSlice = createSlice({
  name: 'productSlice',
  initialState: initialState,
  reducers: {
    setProductList: (state, action) => {
      state.productListSelected = action.payload
    },
  },
})

const { actions, reducer } = productSlice

export default reducer
export const { setProductList } = actions
