import React from 'react'
import Table from '../common/Table'
import StatusBadge from '../common/StatusBadge'
import { HiPhotograph, HiLocationMarker } from 'react-icons/hi'
import { formatTime, formatHours } from '../../utils/formatters'

const DailyReport = ({ data, loading }) => {
  const columns = [
    {
      header: 'Employee',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">
            {row.employeeName}
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
      header: 'Punch In',
      render: (row) => (
        <div className="flex items-center gap-1">
          <span className="text-sm">
            {row.punchInTime ? formatTime(row.punchInTime) : '-'}
          </span>
          {row.punchInSelfie && (
            <a
              href={row.punchInSelfie}
              target="_blank"
              rel="noopener noreferrer"
              title="View selfie"
            >
              <HiPhotograph className="w-4 h-4 text-primary-600 hover:text-primary-700" />
            </a>
          )}
          {row.punchInLocation && (
            <a
              href={`https://maps.google.com/?q=${row.punchInLocation.latitude},${row.punchInLocation.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              title="View location"
            >
              <HiLocationMarker className="w-4 h-4 text-blue-600 hover:text-blue-700" />
            </a>
          )}
        </div>
      ),
    },
    {
      header: 'Punch Out',
      render: (row) => (
        <div className="flex items-center gap-1">
          <span className="text-sm">
            {row.punchOutTime ? formatTime(row.punchOutTime) : '-'}
          </span>
          {row.punchOutSelfie && (
            <a
              href={row.punchOutSelfie}
              target="_blank"
              rel="noopener noreferrer"
              title="View selfie"
            >
              <HiPhotograph className="w-4 h-4 text-primary-600 hover:text-primary-700" />
            </a>
          )}
          {row.punchOutLocation && (
            <a
              href={`https://maps.google.com/?q=${row.punchOutLocation.latitude},${row.punchOutLocation.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              title="View location"
            >
              <HiLocationMarker className="w-4 h-4 text-blue-600 hover:text-blue-700" />
            </a>
          )}
        </div>
      ),
    },
    {
      header: 'Hours',
      render: (row) => (
        <span className="text-sm font-medium">{row.formattedHours}</span>
      ),
    },
    {
      header: 'Status',
      render: (row) => <StatusBadge status={row.workingStatus} />,
    },
    {
      header: 'Validation',
      render: (row) => <StatusBadge status={row.validationStatus} />,
    },
    {
      header: 'OT',
      render: (row) => (
        <span className="text-sm">
          {row.overtimeHours > 0 ? `+${formatHours(row.overtimeHours)}` : '-'}
        </span>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="No attendance records for this date"
    />
  )
}

export default DailyReport