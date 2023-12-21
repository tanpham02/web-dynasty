import { SearchParams } from "~/types";
import axiosService from "../axiosService";
import { STATISTIC_URL } from "../apiUrl";
import { Statistic } from "~/models/statistic";

export const statisticService = {
  getStatisticData: async (params: SearchParams): Promise<Statistic[]> => {
    return axiosService()({
      baseURL: `${STATISTIC_URL}`,
      method: "GET",
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
};
