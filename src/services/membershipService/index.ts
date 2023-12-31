import { Membership } from '~/models/membership';
import { MEMBERSHIP_URL } from '../apiUrl';
import axiosService from '../axiosService';
import { ListResponse, SearchParams } from '~/types';

export const membershipService = {
  searchMembershipByCriteria: async (params: SearchParams): Promise<ListResponse<Membership>> => {
    return axiosService()({
      method: 'GET',
      url: `${MEMBERSHIP_URL}/search`,
      params,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  createMembership: async (data: FormData): Promise<Membership> => {
    return axiosService()({
      method: 'POST',
      url: `${MEMBERSHIP_URL}`,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data: data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  getMembershipByID: async (id: number): Promise<Membership> => {
    return axiosService()({
      method: 'GET',
      url: `${MEMBERSHIP_URL}/${id}`,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
  updateMembership: async (data: FormData, id: number): Promise<Membership> => {
    return axiosService()({
      method: 'PATCH',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      url: `${MEMBERSHIP_URL}/${id}`,
      data: data,
    })
      .then((res) => res.data)
      .catch((err) => {
        throw err;
      });
  },
};
