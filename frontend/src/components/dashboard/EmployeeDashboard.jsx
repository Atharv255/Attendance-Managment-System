import React from 'react'
import { HiCalendar, HiClock, HiCheckCircle, HiTrendingUp } from 'react-icons/hi'
import StatsCard from './StatsCard'
import { formatHours } from '../../utils/formatters'

const EmployeeDashboard = ({ stats }) => {
  if (!stats) return null

  const { monthlyStats, todayAttendance } = stats

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title">My Dashboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Your attendance overview for this month
        </p>
      </div>

      {/* Today's Status */}
      {todayAttendance && (
        <div className="card bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
          <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
            📅 Today's Status
          </p>
          <div className="flex items-center gap-4 mt-2">
            <div>
              <p className="text-xs text-gray-500">Punched In</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">
                {todayAttendance.isPunchedIn ? '✅ Yes' : '❌ No'}
              </p>
            </div>
            {todayAttendance.totalWorkingHours > 0 && (
              <div>
                <p className="text-xs text-gray-500">Hours Today</p>
                <p className="text-sm font-bold text-gray-900 dark:text-white">
                  {formatHours(todayAttendance.totalWorkingHours)}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Monthly Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Days"
          value={monthlyStats?.totalDays ?? 0}
          subtitle="This month"
          icon={HiCalendar}
          color="blue"
        />
        <StatsCard
          title="Completed Days"
          value={monthlyStats?.completedDays ?? 0}
          subtitle="≥ 8 hours"
          icon={HiCheckCircle}
          color="green"
        />
        <StatsCard
          title="Incomplete Days"
          value={monthlyStats?.incompleteDays ?? 0}
          subtitle="< 8 hours"
          icon={HiClock}
          color="yellow"
        />
        <StatsCard
          title="Total Hours"
          value={formatHours(monthlyStats?.totalWorkingHours ?? 0)}
          subtitle="This month"
          icon={HiTrendingUp}
          color="purple"
        />
      </div>
    </div>
  )
}

export default EmployeeDashboard