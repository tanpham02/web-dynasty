import { ListDataResponse, SearchParams } from "~/types";
import axiosService from "../axiosService";
import { Voucher, VoucherOverriding } from "~/models/voucher";
import { VOUCHER_URL } from "../apiUrl";
import qs from "qs";

export const voucherService = {
  searchVoucher: async (
    params: SearchParams,
  ): Promise<ListDataResponse<VoucherOverriding>> => {
    return axiosService()({
      url: `${VOUCHER_URL}/search`,
      method: "GET",
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  findVoucherById: async (id: string): Promise<VoucherOverriding> => {
    return axiosService()({
      url: `${VOUCHER_URL}/${id}`,
      method: "GET",
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  createVoucher: async (
    data: VoucherOverriding,
  ): Promise<VoucherOverriding> => {
    return axiosService()({
      url: `${VOUCHER_URL}/create`,
      method: "POST",
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  createIntroduceVoucher: async (
    data: VoucherOverriding,
  ): Promise<VoucherOverriding> => {
    return axiosService()({
      url: `${VOUCHER_URL}/introduce-voucher`,
      method: "POST",
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  updateVoucher: async (
    data: VoucherOverriding,
    id: string,
  ): Promise<VoucherOverriding> => {
    return axiosService()({
      url: `${VOUCHER_URL}/${id}`,
      method: "PATCH",
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  deleteVoucher: async (ids: number[]) => {
    return axiosService()({
      url: `${VOUCHER_URL}`,
      method: "DELETE",
      params: {
        ids,
      },
      paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "repeat" }),
    });
  },
};
