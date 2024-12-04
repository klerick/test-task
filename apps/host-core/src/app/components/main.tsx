import { TableList } from './table/table-list';
import { fetchCityData } from '../server-action/fetch-city-data';

interface MainPageProps {
  searchParams: { [key: string]: string };
}

const START = 0;
const END = 100;

export default async function MainPage({ searchParams }: MainPageProps) {
  const start = Number(searchParams.start);
  const end = Number(searchParams.end);

  const resultStart = isNaN(start) ? START : start;
  const resultEnd = isNaN(end) ? END : end;

  const { items, count } = await fetchCityData(resultStart, resultEnd);
  return (
    <TableList list={items} count={count} start={resultStart} end={resultEnd} />
  );
}
