import { User } from "~/models/user";
import axiosService from "../axiosService";
import { FIND_USER_BY_CRITERIA_URL, USER_URL } from "../apiUrl";
import { ListDataResponse, SearchParams } from "~/types";
import qs from "qs";

const userService = {
  getUserInfo: async (userId: string): Promise<User> => {
    return axiosService()({
      url: `${USER_URL}/${userId}`,
      method: "GET",
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  searchUserByCriteria: async (
    params: SearchParams,
  ): Promise<ListDataResponse<User>> => {
    return axiosService()({
      url: `${FIND_USER_BY_CRITERIA_URL}`,
      method: "GET",
      params,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  getUserByUserID: async (id: string): Promise<User> => {
    return axiosService()({
      url: `${USER_URL}/${id}`,
      method: "GET",
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  createUser: async (data: User): Promise<User> => {
    return axiosService()({
      headers: {
        "Content-Type": "multipart/form-data",
      },
      url: `${USER_URL}/create`,
      method: "POST",
      data: data,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  updateUser: async (data: User, userId: string): Promise<User> => {
    return axiosService()({
      headers: {
        "Content-Type": "multipart/form-data",
      },
      url: `${USER_URL}/${userId}`,
      method: "PATCH",
      data: data,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
  deleteUser: async (ids: number[]) => {
    return axiosService()({
      url: `${USER_URL}`,
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

export default userService;
