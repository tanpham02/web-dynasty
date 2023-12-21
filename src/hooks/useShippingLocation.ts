import { useState, useEffect } from "react";
import locationService from "~/services/locationService";
import {
  LocationItemType,
  LocationResponseType,
  SelectOptionType,
} from "~/types";

const useShippingLocation = (
  cityID: string | number,
  districtID: string | number,
) => {
  const [cities, setCities] = useState<SelectOptionType[]>([
    { value: 0, label: "Chưa có địa chỉ" },
  ]);
  const [districts, setDistricts] = useState<SelectOptionType[]>([
    { value: 0, label: "Chưa có địa chỉ" },
  ]);
  const [wards, setWards] = useState<SelectOptionType[]>([
    { value: 0, label: "Chưa có địa chỉ" },
  ]);

  const convertResponseDataToSelectOptionType = (
    responseData: LocationResponseType,
  ) => {
    const dataAfterConvert: SelectOptionType[] = [];
    if (responseData.data) {
      responseData.data.forEach((locationItem: LocationItemType) => {
        dataAfterConvert.push({
          value: locationItem.id,
          label: locationItem.name,
        });
      });
    }
    return dataAfterConvert;
  };

  const handleGetCities = async () => {
    const res = await locationService.searchLocationByCriteria({
      type: "CITY",
    });
    setCities(convertResponseDataToSelectOptionType(res));
  };

  const handleGetDistricts = async (cityId: string | number) => {
    const res = await locationService.searchLocationByCriteria({
      type: "DISTRICT",
      parentId: cityId,
    });
    setDistricts(convertResponseDataToSelectOptionType(res));
  };

  const handleGetWards = async (districtId: string | number) => {
    const res = await locationService.searchLocationByCriteria({
      type: "WARD",
      parentId: districtId,
    });
    setWards(convertResponseDataToSelectOptionType(res));
  };

  useEffect(() => {
    handleGetCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (cityID) {
      handleGetDistricts(cityID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cityID]);

  useEffect(() => {
    if (districtID) {
      handleGetWards(districtID);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtID]);

  return {
    cities,
    districts,
    wards,
  };
};

export default useShippingLocation;
