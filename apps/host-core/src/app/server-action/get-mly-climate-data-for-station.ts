'use server';

const NCEI_NOAA_TOKEN_ENV = process.env.NCEI_NOAA_TOKEN;
if (!NCEI_NOAA_TOKEN_ENV) throw new Error('NCEI_NOAA_TOKEN is not defined');

const NCEI_NOAA_TOKEN = NCEI_NOAA_TOKEN_ENV;

const apiUrl = new URL('https://www.ncei.noaa.gov/access/services/data/v1');
apiUrl.searchParams.set('dataset', 'global-summary-of-the-year');
apiUrl.searchParams.set('dataTypes', 'TMIN,TMAX,PRCP');
apiUrl.searchParams.set('format', 'json');
apiUrl.searchParams.set('units', 'standard');
apiUrl.searchParams.set('includeAttributes', 'false');
apiUrl.searchParams.set('startDate', '1950-01-01');
apiUrl.searchParams.set('endDate', '2022-12-31');

type ResultType = {
  DATE: string;
  STATION: string;
  TMAX: string;
  TMIN: string;
  PRCP: string;
};

export type Info = {
  year: number;
  min: number;
  max: number;
};

export async function getMlyClimateDataForStation(stationId: string) {
  apiUrl.searchParams.set('stations', stationId);
  const response = await fetch(apiUrl.toString(), {
    headers: {
      'Content-Type': 'application/json',
      token: NCEI_NOAA_TOKEN,
    },
  });
  const data = (await response.json()) as ResultType[];

  return data.map<Info>((item) => {
    return {
      year: parseInt(item.DATE, 10),
      min: parseFloat(item.TMIN),
      max: parseFloat(item.TMAX),
    };
  });
}
