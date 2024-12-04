import { cn } from '@technical-test/utils';

export const HeaderTable = () => {
  const styleThead = cn(
    'text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'
  );

  const styleTable = cn(
    'w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 table-fixed'
  );
  return (
    <table className={styleTable}>
      <thead className={styleThead}>
        <tr>
          <th className="px-4 py-2 sticky top-0" style={{ width: '100px' }}>
            ID
          </th>
          <th className="px-4 py-2 sticky top-0" style={{ width: '300px' }}>
            Name
          </th>
          <th className="px-4 py-2 sticky top-0" style={{ width: '300px' }}>
            State
          </th>
          <th className="px-4 py-2 sticky top-0" style={{ width: '200px' }}>
            Lat
          </th>
          <th className="px-4 py-2 sticky top-0" style={{ width: '200px' }}>
            Lng
          </th>
          <th
            className="px-4 py-2 sticky top-0"
            style={{ width: '100px' }}
          ></th>
        </tr>
      </thead>
    </table>
  );
};
