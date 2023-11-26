import { BankAccount, FindAllBankFromThirdPartyVietQr } from '~/models/bankAccount';
import { SearchParams } from '~/types';
import axiosService from '../axiosService';
import { BANK_ACCOUNT, FIND_ALL_BANK_FROM_THIRD_PARTY_VIETQR } from '../apiUrl';
import qs from 'qs';


export const bankAccountService = {
  getBankAccountByStatus: async (params: SearchParams): Promise<BankAccount[]> => {
    return axiosService()({
      baseURL: `${BANK_ACCOUNT}/status`,
      method: 'GET',
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  findAllBankFromThirdPartyVietQr: async (): Promise<FindAllBankFromThirdPartyVietQr> => {
    return axiosService()({
      baseURL: `${FIND_ALL_BANK_FROM_THIRD_PARTY_VIETQR}`,
      method: 'GET',
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  createBankAccount: async (data: BankAccount): Promise<BankAccount> => {
    return axiosService()({
      baseURL: `${BANK_ACCOUNT}`,
      method: 'POST',
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  updateBankAccount: async (data: BankAccount, id: number): Promise<BankAccount> => {
    return axiosService()({
      baseURL: `${BANK_ACCOUNT}/${id}`,
      method: 'PATCH',
      data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getBankAccountById: async (id: number): Promise<BankAccount> => {
    return axiosService()({
      baseURL: `${BANK_ACCOUNT}/${id}`,
      method: 'GET',
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },

  deleteBankAccount: async (ids: number[]): Promise<BankAccount> => {
    return axiosService()({
      baseURL: `${BANK_ACCOUNT}`,
      method: 'DELETE',
      params: {
        ids,
      },
      paramsSerializer: (params) => qs.stringify(params, { arrayFormat: 'repeat' }),
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
};
