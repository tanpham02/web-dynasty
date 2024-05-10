import { useMemo } from 'react';
import {
  getDistricts,
  getProvinces,
  getWards,
  Province,
  District,
  Ward,
} from 'vietnam-provinces';

interface AddressState {
  cityId?: string;
  districtId?: string;
  wardId?: string;
  location?: string;
}

export interface AddressInfo {
  ward: string;
  district: string;
  city: string;
  fullAddress: string;
}

const useAddress = ({ cityId, districtId, wardId, location }: AddressState) => {
  const cityOptions = useMemo(
    () =>
      getProvinces()?.map((city) => ({
        label: city.name as string,
        value: city.code,
      })),
    [],
  ).sort((a, b) => a?.label?.localeCompare(b?.label));

  const districtOptions = useMemo(() => {
    if (!cityId) return [];

    return getDistricts(cityId)
      ?.map((district) => ({
        label: district.name as string,
        value: district.code,
      }))
      .sort((a, b) => a?.label?.localeCompare(b?.label));
  }, [cityId]);

  const wardOptions = useMemo(() => {
    if (!districtId) return [];

    return getWards(districtId)
      ?.map((ward) => ({ label: ward.name as string, value: ward.code }))
      .sort((a, b) => a?.label?.localeCompare(b?.label));
  }, [districtId]);

  const addressInfo = useMemo<AddressInfo>(() => {
    if (!cityId || !districtId || !wardId)
      return {
        ward: '',
        district: '',
        city: '',
        fullAddress: '',
      };

    const province = getProvinces()?.find(
      (city: Province) => city.code === cityId,
    );
    const district = getDistricts(cityId)?.find(
      (district: District) => district.code === districtId,
    );
    const ward = getWards(districtId)?.find(
      (ward: Ward) => ward.code === wardId,
    );

    return {
      ward: ward?.name || '',
      district: district?.name || '',
      city: province?.name || '',
      fullAddress:
        [location, ward?.name, district?.name, province?.name]
          ?.filter((value) => Boolean(value))
          .join(', ') || '',
    };
  }, [cityId, districtId, wardId, location]);

  return { cityOptions, districtOptions, wardOptions, addressInfo } as const;
};

export default useAddress;
