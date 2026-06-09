import React from 'react'
import Table from '../common/Table'
import { formatHours } from '../../utils/formatters'

const SummaryReport = ({ data, loading }) => {
  const columns = [
    {
      header: 'Employee',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {row.name}
          </p>
          <p className="text-xs text-gray-500">{row.employeeId}</p>
        </div>
      ),
    },
    {
      header: 'Department',
      render: (row) => <span className="text-sm">{row.department || '-'}</span>,
    },
    {
      header: 'Total Days',
      render: (row) => (
        <span className="text-sm font-medium">{row.totalDays}</span>
      ),
    },
    {
      header: 'Completed',
      render: (row) => (
        <span className="text-sm font-medium text-green-600 dark:text-green-400">
          {row.completedDays}
        </span>
      ),
    },
    {
      header: 'Incomplete',
      render: (row) => (
        <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
          {row.incompleteDays}
        </span>
      ),
    },
    {
      header: 'Total Hours',
      render: (row) => (
        <span className="text-sm font-bold text-gray-900 dark:text-white">
          {row.formattedTotalHours}
        </span>
      ),
    },
    {
      header: 'OT Hours',
      render: (row) => (
        <span className="text-sm text-orange-600 dark:text-orange-400">
          {formatHours(row.totalOvertimeHours)}
        </span>
      ),
    },
    {
      header: 'Valid / Invalid',
      render: (row) => (
        <span className="text-sm">
          <span className="text-green-600 dark:text-green-400 font-medium">
            {row.validAttendance}
          </span>
          <span className="text-gray-400 mx-1">/</span>
          <span className="text-red-600 dark:text-red-400 font-medium">
            {row.invalidAttendance}
          </span>
        </span>
      ),
    },
    {
      header: 'Pending',
      render: (row) => (
        <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
          {row.pendingValidation}
        </span>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="No summary data available for selected period"
    />
  )
}

export default SummaryReport