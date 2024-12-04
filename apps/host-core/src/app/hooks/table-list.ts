import { defaultRangeExtractor, useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef, useState } from 'react';

type DefaultType = {
  id: number;
};

export type TableListProps<T extends DefaultType> = {
  count: number;
  start?: number;
  end?: number;
  list: T[];
  heightSize: number;
  pageSize: number;
  loadMore: (start: number, end: number) => void;
};

export const useTableList = <T extends DefaultType>(
  props: TableListProps<T>
) => {
  const [data, setData] = useState<T[]>(props.list);
  const dataObject = data.reduce((acc, item, index) => {
    acc[item.id] = item;
    return acc;
  }, {} as Record<number, T>);

  const parentRef = useRef(null);
  const [isInit, setIsInit] = useState(false);
  const [startIndex, setStartIndex] = useState(0);
  const [range, setRange] = useState({
    start: props.start || 0,
    end: props.end || 0,
  });

  const rowVirtualizer = useVirtualizer({
    getScrollElement: () => parentRef.current,
    count: props.count,
    estimateSize: () => props.heightSize,
    overscan: 10,
    rangeExtractor: (rangeExtractor) =>
      defaultRangeExtractor({
        ...rangeExtractor,
        startIndex: !isInit ? props.start || 0 : rangeExtractor.startIndex,
      }),
  });

  const virtualItems = rowVirtualizer.getVirtualItems();

  useEffect(() => {
    setIsInit(true);
    rowVirtualizer.scrollToIndex(props.start || 0, { align: 'start' });
  }, []);

  useEffect(() => {
    if (virtualItems.length === 0) return;

    const firstItem = virtualItems[0];
    const lastItem = virtualItems[virtualItems.length - 1];
    if (firstItem.index === startIndex) return;

    let newStart: number | undefined = undefined;
    let newEnd: number | undefined = undefined;
    if (
      startIndex > firstItem.index &&
      firstItem.index < range.start &&
      range.start > 0
    ) {
      newStart = Math.max(0, range.start - props.pageSize);
      newEnd = range.start;
    }
    if (startIndex < firstItem.index && lastItem.index >= range.end - 1) {
      newStart = range.end;
      newEnd = newStart + props.pageSize;
    }
    if (newStart === range.start && newEnd === range.end) return;
    setStartIndex(firstItem.index);

    if (newStart === undefined || newEnd === undefined) return;

    setRange({ start: newStart, end: newEnd });
    props.loadMore(newStart, newEnd);
  }, [virtualItems]);

  return {
    scrollRef: parentRef,
    rowList: virtualItems.map((virtualRow) => {
      const row = dataObject[virtualRow.index];

      return {
        item: row,
        index: virtualRow.index,
        start: virtualRow.start,
        size: virtualRow.size,
      };
    }),
    totalSize: rowVirtualizer.getTotalSize(),
    setData,
  };
};
