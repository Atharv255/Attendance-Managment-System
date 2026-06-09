import React from 'react'
import { HiClock, HiLocationMarker, HiPhotograph, HiCheckCircle, HiXCircle } from 'react-icons/hi'
import StatusBadge from '../common/StatusBadge'
import { formatDate, formatTime, formatHours } from '../../utils/formatters'

const AttendanceCard = ({ attendance, onClick, showUser = false }) => {
  if (!attendance) return null

  const {
    userId,
    date,
    punchIn,
    punchOut,
    totalWorkingHours,
    workingStatus,
    validationStatus,
    overtimeHours,
    overtimeRequested,
    isPunchedIn,
  } = attendance

  return (
    <div
      onClick={onClick}
      className={`
        card hover:shadow-md transition-all duration-200
        ${onClick ? 'cursor-pointer hover:border-primary-300 dark:hover:border-primary-700' : ''}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          {showUser && userId && (
            <div className="mb-2">
              <p className="font-semibold text-gray-900 dark:text-white">
                {userId.name || 'N/A'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {userId.employeeId} · {userId.department}
              </p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <HiClock className="w-4 h-4 text-primary-500" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {formatDate(date)}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StatusBadge status={workingStatus} />
          <StatusBadge status={validationStatus} />
        </div>
      </div>

      {/* Punch In/Out Times */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Punch In */}
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-100 dark:border-green-800">
          <div className="flex items-center gap-1 mb-1">
            <HiCheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
            <p className="text-xs font-medium text-green-700 dark:text-green-400">
              Punch In
            </p>
          </div>
          <p className="text-sm font-bold text-green-800 dark:text-green-300">
            {punchIn?.time ? formatTime(punchIn.time) : 'Not yet'}
          </p>
          {/* Quick links */}
          {punchIn?.time && (
            <div className="flex items-center gap-2 mt-1">
              {punchIn?.selfie?.url && (
                <a
                  href={punchIn.selfie.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-green-600 hover:text-green-700"
                  title="View selfie"
                >
                  <HiPhotograph className="w-3 h-3" />
                </a>
              )}
              {punchIn?.location && (
                <a
                  href={`https://maps.google.com/?q=${punchIn.location.latitude},${punchIn.location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-600 hover:text-blue-700"
                  title="View location"
                >
                  <HiLocationMarker className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Punch Out */}
        <div
          className={`rounded-lg p-3 border ${
            punchOut?.time
              ? 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'
              : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
          }`}
        >
          <div className="flex items-center gap-1 mb-1">
            <HiXCircle
              className={`w-3 h-3 ${
                punchOut?.time
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-400'
              }`}
            />
            <p
              className={`text-xs font-medium ${
                punchOut?.time
                  ? 'text-red-700 dark:text-red-400'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Punch Out
            </p>
          </div>
          <p
            className={`text-sm font-bold ${
              punchOut?.time
                ? 'text-red-800 dark:text-red-300'
                : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            {punchOut?.time ? formatTime(punchOut.time) : 'Not yet'}
          </p>
          {/* Quick links */}
          {punchOut?.time && (
            <div className="flex items-center gap-2 mt-1">
              {punchOut?.selfie?.url && (
                <a
                  href={punchOut.selfie.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-red-600 hover:text-red-700"
                  title="View selfie"
                >
                  <HiPhotograph className="w-3 h-3" />
                </a>
              )}
              {punchOut?.location && (
                <a
                  href={`https://maps.google.com/?q=${punchOut.location.latitude},${punchOut.location.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-600 hover:text-blue-700"
                  title="View location"
                >
                  <HiLocationMarker className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer - Working Hours and Overtime */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <HiClock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Working Hours
            </p>
            <p className="text-sm font-bold text-gray-900 dark:text-white">
              {formatHours(totalWorkingHours)}
            </p>
          </div>
        </div>

        {overtimeHours > 0 && (
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Overtime
            </p>
            <p className="text-sm font-bold text-orange-600 dark:text-orange-400">
              +{formatHours(overtimeHours)}
            </p>
          </div>
        )}

        {overtimeRequested && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
            OT Requested
          </span>
        )}

        {isPunchedIn && !punchOut?.time && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 animate-pulse">
            ● Active
          </span>
        )}
      </div>
    </div>
  )
}

export default AttendanceCard