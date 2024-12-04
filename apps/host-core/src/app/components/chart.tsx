'use client';

import { type Info } from '../server-action/get-mly-climate-data-for-station';
import { AreaChart } from '@tremor/react';

const format = (number: number): any => (isNaN(number) ? '-' : number);

export const Chart = ({ data }: { data: Info[] }) => {
  return (
    <AreaChart
      className="h-72 mt-4"
      data={data}
      index="year"
      categories={['min', 'max']}
      colors={['indigo', 'cyan']}
      valueFormatter={format}
    />
  );
};
