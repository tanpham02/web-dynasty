import axiosService from "../axiosService";
import {
  PRODUCT_CATEGORY_FROM_THIRD_PARTY_URL,
  PRODUCT_CATEGORY_IN_ZALO_MINI_APP_URL,
  PRODUCT_CATEGORY_URL,
} from "../apiUrl";
import qs from "qs";
import { ProductCategory } from "~/models/productCategory";

const productCategoryService = {
  getAllProductCategoryInZaloMiniApp: async (
    limitProduct: number,
  ): Promise<ProductCategory[]> => {
    return axiosService()({
      url: `${PRODUCT_CATEGORY_IN_ZALO_MINI_APP_URL}`,
      method: "GET",
      params: {
        limitProduct,
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getAllProductCategoryFromThirdParty: async (): Promise<ProductCategory[]> => {
    return axiosService()({
      url: `${PRODUCT_CATEGORY_FROM_THIRD_PARTY_URL}`,
      method: "GET",
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getProductCategoryById: async (id: number): Promise<ProductCategory> => {
    return axiosService()({
      url: `${PRODUCT_CATEGORY_URL}`,
      method: "GET",
      params: {
        id,
      },
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getParentProductCategoryByThirdPartyID: async (
    nhanhVnId: string,
  ): Promise<ProductCategory> => {
    return axiosService()({
      url: `${PRODUCT_CATEGORY_URL}/${nhanhVnId}`,
      method: "GET",
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getChildProductCategoryByThirdPartyID: async (
    nhanhVnId: string,
  ): Promise<ProductCategory[]> => {
    return axiosService()({
      url: `${PRODUCT_CATEGORY_URL}/${nhanhVnId}/childs`,
      method: "GET",
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  deleteProductCategoryInZaloMiniApp: async (nhanhVnIds: number[]) => {
    return axiosService()({
      url: `${PRODUCT_CATEGORY_URL}`,
      method: "DELETE",
      params: {
        nhanhVnIds: nhanhVnIds,
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  addProductCategoryFromThirdPartyToZaloMiniApp: async (
    productCategories: ProductCategory[],
  ): Promise<ProductCategory[]> => {
    return axiosService()({
      url: `${PRODUCT_CATEGORY_URL}`,
      method: "POST",
      data: productCategories,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  updateBannerProductCategory: async (
    id: number,
    image: FormData,
  ): Promise<ProductCategory> => {
    return axiosService()({
      headers: {
        "Content-Type": "multipart/form-data",
      },
      url: `${PRODUCT_CATEGORY_URL}/${id}`,
      method: "PATCH",
      data: image,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
};

export default productCategoryService;
