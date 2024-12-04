import { NearestStation } from '../server-action/find-nearest-station';
import { Title } from '@tremor/react';

export const StationInfo = ({
  station,
}: {
  station: NearestStation | null;
}) => {
  return (
    <Title>
      {station
        ? `Nearest station: ${station.id} (${Math.round(station.distance || 0)}
      km)`
        : 'Nearest station is not found'}
    </Title>
  );
};
