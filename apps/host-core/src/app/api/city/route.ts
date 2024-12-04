import { fetchCityData } from '../../server-action/fetch-city-data';

export async function GET(request: Request) {
  const queryParam = new URL(request.url).searchParams;
  const start = queryParam.get('start');
  const end = queryParam.get('end');

  let startForFetch: number | undefined = undefined;
  let endForFetch: number | undefined = undefined;

  // Need more validation for production
  if (start && !isNaN(parseInt(start))) {
    startForFetch = parseInt(start);
  }

  if (end && !isNaN(parseInt(end))) {
    endForFetch = parseInt(end);
  }

  const data = await fetchCityData(startForFetch, endForFetch);

  return Response.json({ data });
}
