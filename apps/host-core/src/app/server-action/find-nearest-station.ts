'use server';

type Coords = {
  lat: number;
  lng: number;
};

type Station = {
  latitude: number;
  longitude: number;
  id: string;
  mindate: string;
  maxdate: string;
};

export type NearestStation = {
  distance: number;
} & Station;

const NCEI_NOAA_TOKEN_ENV = process.env.NCEI_NOAA_TOKEN;
if (!NCEI_NOAA_TOKEN_ENV) throw new Error('NCEI_NOAA_TOKEN is not defined');

const NCEI_NOAA_TOKEN = NCEI_NOAA_TOKEN_ENV;

const apiUrl = new URL('https://www.ncdc.noaa.gov/cdo-web/api/v2/stations');
apiUrl.searchParams.set('datasetid', 'GSOY');
apiUrl.searchParams.set('datacategoryid', 'TEMP');
apiUrl.searchParams.set('limit', '50');
apiUrl.searchParams.set('offset', '1');
apiUrl.searchParams.set('startdate', '1950-01-01');
apiUrl.searchParams.set('enddate', '2023-01-31');

export async function findNearestStation(
  lat: number,
  lng: number,
  radiusKm = 50
): Promise<NearestStation | null> {
  const cityCoords: Coords = { lat: lat, lng: lng };

  const { west, east, south, north } = getBoundingBox(
    cityCoords.lat,
    cityCoords.lng,
    radiusKm
  );

  apiUrl.searchParams.set('extent', `${south},${east},${north},${west}`);

  const response = await fetch(apiUrl, {
    headers: {
      'Content-Type': 'application/json',
      token: NCEI_NOAA_TOKEN,
    },
  });
  const data = await response.json();

  if (!data.results || data.results.length === 0) return null;
  const result = data.results as Station[];

  const dataSet = result.filter(
    (i) =>
      parseInt(i.mindate.split('-')[0]) <= 1950 &&
      parseInt(i.maxdate.split('-')[0]) > 2023
  );

  if (dataSet.length === 0) return null;

  const nearestStation = dataSet.reduce(
    (closest, station: Station) => {
      const distance = haversineDistance(cityCoords, {
        lat: station.latitude,
        lng: station.longitude,
      });
      return distance < closest.distance ? { station, distance } : closest;
    },
    { station: null, distance: Infinity } as {
      station: Station | null;
      distance: number;
    }
  );

  if (!nearestStation.station) return null;

  return {
    ...nearestStation.station,
    distance: nearestStation.distance,
    id: nearestStation.station.id.split(':')[1],
  };
}

function haversineDistance(coord1: Coords, coord2: Coords) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371;

  const dLat = toRad(coord2.lat - coord1.lat);
  const dLon = toRad(coord2.lng - coord1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(coord1.lat)) *
      Math.cos(toRad(coord2.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getDelta(cityCoords: Coords, radiusKm = 100) {
  const degLat = radiusKm / 111;
  const degLon = radiusKm / (111 * Math.cos((cityCoords.lat * Math.PI) / 180));

  return { degLat, degLon };
}

function getBoundingBox(latitude: number, longitude: number, radiusKm: number) {
  const { degLat, degLon } = getDelta(
    { lng: longitude, lat: longitude },
    radiusKm
  );

  return {
    north: latitude + degLat,
    south: latitude - degLat,
    east: longitude + degLon,
    west: longitude - degLon,
  };
}
