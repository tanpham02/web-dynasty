import { FrequentlyAskedQuestion, SystemConfigs } from "~/models/systemConfig";
import {
  FIND_FREQUENTLY_ASKED_QUESTION_BY_CRITERIA_URL,
  FREQUENTLY_ASKED_QUESTION_URL,
  SYSTEM_CONFIG_URL,
} from "../apiUrl";
import axiosService from "../axiosService";
import { ListResponse, SearchParams } from "~/types";
import qs from "qs";

const systemConfigService = {
  getSystemConfig: async (): Promise<SystemConfigs> => {
    return axiosService()({
      url: `${SYSTEM_CONFIG_URL}`,
      method: "GET",
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  updateSystemConfig: async (data: SystemConfigs): Promise<SystemConfigs> => {
    return axiosService()({
      url: `${SYSTEM_CONFIG_URL}`,
      method: "PATCH",
      data: data,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
};

const frequentlyAskedQuestionService = {
  getFrequentlyAskedQuestion: async (
    params: SearchParams,
  ): Promise<ListResponse<FrequentlyAskedQuestion>> => {
    return axiosService()({
      baseURL: `${FIND_FREQUENTLY_ASKED_QUESTION_BY_CRITERIA_URL}`,
      method: "GET",
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getAllFrequentlyAskedQuestion: async (): Promise<
    FrequentlyAskedQuestion[]
  > => {
    return axiosService()({
      baseURL: `${FREQUENTLY_ASKED_QUESTION_URL}/get-all`,
      method: "GET",
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  createFrequentlyAskedQuestion: async (
    data: FrequentlyAskedQuestion,
  ): Promise<FrequentlyAskedQuestion> => {
    return axiosService()({
      url: `${FREQUENTLY_ASKED_QUESTION_URL}`,
      method: "POST",
      data: data,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  updateFrequentlyAskedQuestion: async (
    data: FrequentlyAskedQuestion,
  ): Promise<FrequentlyAskedQuestion> => {
    return axiosService()({
      url: `${FREQUENTLY_ASKED_QUESTION_URL}`,
      method: "PATCH",
      data: data,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  deleteFrequentlyAskedQuestion: async (ids: number[]) => {
    return axiosService()({
      url: `${FREQUENTLY_ASKED_QUESTION_URL}`,
      method: "DELETE",
      params: {
        ids: ids,
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
};

export default { systemConfigService, frequentlyAskedQuestionService };
