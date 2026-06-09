import React from 'react'
import Loader from './Loader'
import EmptyState from './EmptyState'

const Table = ({ columns, data, loading, emptyMessage = 'No records found' }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader size="lg" text="Loading..." />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return <EmptyState description={emptyMessage} />
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            {columns.map((col, i) => (
              <th
                key={i}
                className={`
                  py-3 px-4 font-semibold text-gray-600 dark:text-gray-400
                  whitespace-nowrap
                  ${col.className || ''}
                `}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className={`
                    py-3 px-4 text-gray-700 dark:text-gray-300
                    ${col.cellClassName || ''}
                  `}
                >
                  {col.render ? col.render(row) : row[col.key] ?? '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table