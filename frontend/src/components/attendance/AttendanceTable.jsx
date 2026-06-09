import React from 'react'
import { HiEye, HiPhotograph, HiLocationMarker } from 'react-icons/hi'
import Table from '../common/Table'
import StatusBadge from '../common/StatusBadge'
import Button from '../common/Button'
import { formatDate, formatTime, formatHours } from '../../utils/formatters'

const AttendanceTable = ({
  data,
  loading,
  onView,
  onValidate,
  showUser = false,
  showValidation = false,
}) => {
  const columns = [
    ...(showUser
      ? [
          {
            header: 'Employee',
            key: 'userId',
            render: (row) => (
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {row.userId?.name || 'N/A'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {row.userId?.employeeId}
                </p>
              </div>
            ),
          },
        ]
      : []),
    {
      header: 'Date',
      key: 'date',
      render: (row) => (
        <span className="text-sm">{formatDate(row.date)}</span>
      ),
    },
    {
      header: 'Punch In',
      key: 'punchIn',
      render: (row) => (
        <div className="flex items-center gap-1">
          <span className="text-sm">
            {row.punchIn?.time ? formatTime(row.punchIn.time) : '-'}
          </span>
          {row.punchIn?.selfie?.url && (
            <a
              href={row.punchIn.selfie.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700"
              title="View selfie"
            >
              <HiPhotograph className="w-4 h-4" />
            </a>
          )}
          {row.punchIn?.location && (
            <a
              href={`https://maps.google.com/?q=${row.punchIn.location.latitude},${row.punchIn.location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700"
              title="View location"
            >
              <HiLocationMarker className="w-4 h-4" />
            </a>
          )}
        </div>
      ),
    },
    {
      header: 'Punch Out',
      key: 'punchOut',
      render: (row) => (
        <div className="flex items-center gap-1">
          <span className="text-sm">
            {row.punchOut?.time ? formatTime(row.punchOut.time) : '-'}
          </span>
          {row.punchOut?.selfie?.url && (
            <a
              href={row.punchOut.selfie.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700"
              title="View selfie"
            >
              <HiPhotograph className="w-4 h-4" />
            </a>
          )}
          {row.punchOut?.location && (
            <a
              href={`https://maps.google.com/?q=${row.punchOut.location.latitude},${row.punchOut.location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700"
              title="View location"
            >
              <HiLocationMarker className="w-4 h-4" />
            </a>
          )}
        </div>
      ),
    },
    {
      header: 'Hours',
      key: 'totalWorkingHours',
      render: (row) => (
        <span className="text-sm font-medium">
          {formatHours(row.totalWorkingHours)}
        </span>
      ),
    },
    {
      header: 'Status',
      key: 'workingStatus',
      render: (row) => <StatusBadge status={row.workingStatus} />,
    },
    {
      header: 'Validation',
      key: 'validationStatus',
      render: (row) => <StatusBadge status={row.validationStatus} />,
    },
    {
      header: 'OT',
      key: 'overtimeHours',
      render: (row) => (
        <span className="text-sm">
          {row.overtimeHours > 0 ? `+${formatHours(row.overtimeHours)}` : '-'}
        </span>
      ),
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          {onView && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(row)}
              icon={HiEye}
              title="View details"
            />
          )}
          {showValidation && onValidate && row.validationStatus === 'pending' && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onValidate(row)}
            >
              Validate
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <Table
      columns={columns}
      data={data}
      loading={loading}
      emptyMessage="No attendance records found"
    />
  )
}

export default AttendanceTable