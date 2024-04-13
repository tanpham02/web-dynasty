import { useMemo } from 'react';
import { getDistricts, getProvinces, getWards, getProvincesWithDetail, } from 'vietnam-provinces';

interface AddressState {
    cityId?: string;
    districtId?: string;
    wardId?: string
}

const useAddress = ({ cityId, districtId, wardId }: AddressState) => {
    const cityOptions = useMemo(() => getProvinces()?.map((city) => ({ label: city.name, value: city.code })), []);

    const districtOptions = useMemo(() => {
        if (!cityId) return [];

        return getDistricts(cityId)?.map((district) => ({ label: district.name, value: district.code }));
    }, [cityId]);

    const wardOptions = useMemo(() => {
        if (!districtId) return [];

        return getWards(districtId)?.map((ward) => ({ label: ward.name, value: ward.code }));
    }, [districtId]);

    const fullAddress = useMemo(() => {
        if (!cityId || !districtId || !wardId) return ''

        const province = getProvincesWithDetail(cityId)
        const district = getDistricts(cityId)
        const ward = getWards(districtId)

        return ''

    }, [cityId, districtId, wardId])

    return { cityOptions, districtOptions, wardOptions, fullAddress } as const;
};

export default useAddress;
