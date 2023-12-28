import { ListResponse } from "~/types";
import axiosService from "../axiosService";
import { STORE_INFORMATION_URL } from "../apiUrl";
import { StoreIntroductionInformation } from "~/models/storeIntroductionInformation";

export const storeService = {
  createStoreInformation: async (
    data?: StoreIntroductionInformation,
  ): Promise<ListResponse<StoreIntroductionInformation>> => {
    return axiosService()({
      baseURL: `${STORE_INFORMATION_URL}`,
      method: "POST",
      data: data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getStoreInformation: (): Promise<StoreIntroductionInformation> => {
    return axiosService()({
      method: "GET",
      baseURL: `${STORE_INFORMATION_URL}`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
};
