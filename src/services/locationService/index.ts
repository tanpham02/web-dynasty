import axiosService from '../axiosService';
import { LOCATION_URL } from '../apiUrl';
import { LocationResponseType, LocationType } from '~/types';

const locationService = {
  searchLocationByCriteria: async (params: LocationType): Promise<LocationResponseType> => {
    return axiosService()({
      method: 'GET',
      url: `${LOCATION_URL}`,
      params: params,
    })
      .then((res) => res.data)
      .catch((error) => {
        throw error;
      });
  },
};

export default locationService;
