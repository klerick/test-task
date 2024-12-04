import { findNearestStation } from '../server-action/find-nearest-station';
import {
  getClimateDataForStation,
  Info,
} from '../server-action/get-climate-data-for-station';
import { StationInfo } from '../components/station-info';
import { Chart } from '../components/chart';
import { Card } from '@tremor/react';

export default async function Weather({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const station = await findNearestStation(
    parseFloat(searchParams['lat']),
    parseFloat(searchParams['lng'])
  );
  let data: Info[] = [];
  if (station) {
    data = await getClimateDataForStation(station.id);
  }

  return (
    <Card>
      <StationInfo station={station} />
      {station && <Chart data={data} />}
    </Card>
  );
}
