import React from 'react'
import Table from '../common/Table'
import StatusBadge from '../common/StatusBadge'
import { formatDate, formatHours, formatRelativeTime } from '../../utils/formatters'

const OvertimeTable = ({ data, loading, showEmployee = false, onReview }) => {
  const columns = [
    ...(showEmployee
      ? [
          {
            header: 'Employee',
            render: (row) => (
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {row.userId?.name}
                </p>
                <p className="text-xs text-gray-500">{row.userId?.employeeId}</p>
              </div>
            ),
          },
        ]
      : []),
    {
      header: 'Date',
      render: (row) => <span className="text-sm">{formatDate(row.date)}</span>,
    },
    {
      header: 'Requested Hours',
      render: (row) => (
        <span className="text-sm font-medium">
          {formatHours(row.requestedHours)}
        </span>
      ),
    },
    {
      header: 'Reason',
      render: (row) => (
        <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
          {row.reason}
        </p>
      ),
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Submitted',
      render: (row) => (
        <span className="text-xs text-gray-500">
          {formatRelativeTime(row.createdAt)}
        </span>
      ),
    },
    {
      header: 'Reviewed By',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {row.reviewedBy?.name || '-'}
        </span>
      ),
    },
    ...(onReview
      ? [
          {
            header: 'Actions',
            render: (row) =>
              row.status === 'pending' ? (
                <button
                  onClick={() => onReview(row)}
                  className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium hover:underline"
                >
                  Review
                </button>
              ) : (
                <span className="text-xs text-gray-400">
                  {row.reviewRemarks || 'Reviewed'}
                </span>
              ),
          },
        ]
      : []),
  ]

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="No overtime requests found"
    />
  )
}

export default OvertimeTable