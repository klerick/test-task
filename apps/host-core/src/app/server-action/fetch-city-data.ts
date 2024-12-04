'use server';

import process from 'node:process';

export type City = {
  name: string;
  lat: number;
  lng: number;
  state: string;
  id: number;
};

const geoUrl = new URL('searchJSON', 'http://api.geonames.org/');
geoUrl.searchParams.set('country', 'US');
geoUrl.searchParams.set('featureClass', 'P');
geoUrl.searchParams.set('maxRows', '100');
geoUrl.searchParams.set('startRow', '0');
const GEO_USERNAME = process.env.GEO_USERNAME;

if (!GEO_USERNAME) {
  throw new Error('GEO_USERNAME is not defined');
}

geoUrl.searchParams.set('username', GEO_USERNAME);

export const fetchCityData = async (
  start = 0,
  end = 100
): Promise<{
  items: City[];
  count: number;
}> => {
  geoUrl.searchParams.set('startRow', start.toString());
  geoUrl.searchParams.set('maxRows', (end - start).toString());

  const response = await fetch(geoUrl);
  const responseJson = await response.json();

  const { geonames, totalResultsCount } = responseJson;
  const items = (Array.isArray(geonames) ? geonames : []).map(
    (r: any, index: number) => ({
      id: index + start,
      name: r['name'],
      lat: parseFloat(r['lat']),
      lng: parseFloat(r['lng']),
      state: r['adminName1'],
    })
  );
  return {
    items,
    count: totalResultsCount,
  };
};
