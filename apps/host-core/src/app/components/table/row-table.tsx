import React from 'react';
import { City } from '../../server-action/fetch-city-data';
import Link from 'next/link';

export type TitleTypeProps = {
  item: City;
} & React.ThHTMLAttributes<HTMLTableCellElement>;

export function RowTable(props: TitleTypeProps) {
  return (
    <tr style={props.style}>
      <td className="px-4 py-2" style={{ width: '100px' }}>
        {props.item?.id}
      </td>
      <td className="px-4 py-2" style={{ width: '300px' }}>
        {props.item?.name || 'Loading...'}
      </td>
      <td className="px-4 py-2" style={{ width: '300px' }}>
        {props.item?.state}
      </td>
      <td className="px-4 py-2" style={{ width: '200px' }}>
        {props.item?.lat}
      </td>
      <td className="px-4 py-2" style={{ width: '200px' }}>
        {props.item?.lng}
      </td>
      <td style={{ width: '100px' }}>
        <Link href={`/weather?lat=${props.item?.lat}&lng=${props.item?.lng}`}>
          Show statistics
        </Link>
      </td>
    </tr>
  );
}
