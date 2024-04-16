import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from 'react-google-maps';
import { useFormContext } from 'react-hook-form';

import { StoreModel } from '~/models/store';

const GoogleMaps = () => {
  const { setValue, watch } = useFormContext<StoreModel>();

  const longitudeSelected = watch('longitude');
  const latitudeSelected = watch('latitude');

  const handleSelectLocation = (e: any) => {
    const latitude = e?.latLng?.lat();
    const longitude = e?.latLng?.lng();
    setValue('longitude', String(longitude));
    setValue('latitude', String(latitude));
  };

  return (
    <GoogleMap
      defaultZoom={13}
      defaultCenter={{ lat: 10.782148, lng: 106.706088 }}
      onClick={handleSelectLocation}
    >
      <Marker
        position={{
          lat: latitudeSelected || 10.782148,
          lng: longitudeSelected || 106.706088,
        }}
      />
    </GoogleMap>
  );
};

export default withScriptjs(withGoogleMap(GoogleMaps));
