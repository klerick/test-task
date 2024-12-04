'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@technical-test/utils';
import { useRouter } from 'next/navigation';

import { RowTable } from './row-table';
import { HeaderTable } from './header-table';

import { City, fetchCityData } from '../../server-action/fetch-city-data';
import { useTableList } from '../../hooks/table-list';

const HEIGHT_SIZE = 50;
const PAGE_SIZE = 100;

export function TableList(props: {
  list: City[];
  count: number;
  start: number;
  end: number;
}) {
  const [loadingRanges, setLoadingRanges] = useState<Set<string>>(new Set());
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();

  const { rowList, scrollRef, totalSize, setData } = useTableList<City>({
    count: props.count,
    start: props.start,
    end: props.end,
    list: props.list,
    heightSize: HEIGHT_SIZE,
    pageSize: PAGE_SIZE,
    loadMore: async (start, end) => {
      const rangeKey = `${start}-${end}`;
      if (loadingRanges.has(rangeKey)) return;
      setLoadingRanges((prev) => new Set(prev).add(rangeKey));
      const { items } = await fetchCityData(start, end);
      setLoadingRanges((prev) => {
        const newRanges = new Set(prev);
        newRanges.delete(rangeKey);
        return newRanges;
      });
      setData(
        start < end ? [...props.list, ...items] : [...items, ...props.list]
      );

      const params = new URLSearchParams();
      params.set('start', start.toString());
      params.set('end', end.toString());

      const newUrl = `?${params.toString()}`;

      router.push(newUrl, { scroll: false });
    },
  });

  const styleTable = cn(
    'w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-fixed'
  );

  useEffect(() => setIsHydrated(true), []);

  const resultRowList = isHydrated
    ? rowList
    : props.list.map((item, index) => ({
        index: item.id,
        size: HEIGHT_SIZE,
        start: index * HEIGHT_SIZE,
        end: props.end,
        item,
      }));

  return (
    <div>
      <HeaderTable />
      <div ref={scrollRef} style={{ height: '500px', overflow: 'auto' }}>
        <div
          style={{
            height: `${totalSize}px`,
          }}
        >
          <table className={styleTable}>
            <tbody>
              {resultRowList.map((row, index) => (
                <RowTable
                  key={row.index}
                  style={{
                    height: `${row.size}px`,
                    transform: `translateY(${row.start - index * row.size}px)`,
                  }}
                  item={row.item}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
