import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchTodayAttendance } from '../../features/attendance/attendanceSlice'
import PunchCard from '../../components/attendance/PunchCard'
import Card from '../../components/common/Card'
import StatusBadge from '../../components/common/StatusBadge'
import { formatTime, formatHours } from '../../utils/formatters'
import { HiInformationCircle } from 'react-icons/hi'

const AttendancePage = () => {
  const dispatch = useDispatch()
  const { todayAttendance, loading } = useSelector((state) => state.attendance)

  useEffect(() => {
    dispatch(fetchTodayAttendance())
  }, [dispatch])

  const handleSuccess = () => {
    dispatch(fetchTodayAttendance())
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-in">
      <div>
        <h1 className="page-title">Attendance</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Mark your attendance for today
        </p>
      </div>

      {/* Punch Card */}
      <PunchCard
        todayAttendance={todayAttendance}
        onSuccess={handleSuccess}
      />

      {/* Instructions */}
      <Card>
        <div className="flex items-start gap-3">
          <HiInformationCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              How to mark attendance
            </h4>
            <ul className="text-sm text-gray-500 dark:text-gray-400 mt-2 space-y-1 list-disc list-inside">
              <li>Click Punch In to start your work day</li>
              <li>Allow camera access and take a live selfie</li>
              <li>Allow location access for verification</li>
              <li>Click Punch Out when you finish</li>
              <li>Standard shift is 8 hours</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Today's summary */}
      {todayAttendance && (
        <Card title="Today's Summary">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Punch In</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                {formatTime(todayAttendance.punchIn?.time) || 'Not yet'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Punch Out</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                {formatTime(todayAttendance.punchOut?.time) || 'Not yet'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Hours Worked</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                {formatHours(todayAttendance.totalWorkingHours)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
              <StatusBadge status={todayAttendance.workingStatus} />
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default AttendancePage