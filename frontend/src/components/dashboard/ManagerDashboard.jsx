import React from 'react'
import { HiUsers, HiCheckCircle, HiXCircle, HiClock, HiClipboardList } from 'react-icons/hi'
import StatsCard from './StatsCard'

const ManagerDashboard = ({ stats }) => {
  if (!stats) return null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title">Manager Dashboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Your team's attendance overview
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Team Size"
          value={stats.teamSize ?? 0}
          subtitle="Active members"
          icon={HiUsers}
          color="blue"
        />
        <StatsCard
          title="Present Today"
          value={stats.todayPresent ?? 0}
          subtitle="Punched in"
          icon={HiCheckCircle}
          color="green"
        />
        <StatsCard
          title="Absent Today"
          value={stats.todayAbsent ?? 0}
          subtitle="Not punched in"
          icon={HiXCircle}
          color="red"
        />
        <StatsCard
          title="Pending Validations"
          value={stats.pendingValidations ?? 0}
          subtitle="Need review"
          icon={HiClock}
          color="yellow"
        />
        <StatsCard
          title="Monthly Attendance"
          value={stats.monthlyTeamAttendance ?? 0}
          subtitle="Total records"
          icon={HiClipboardList}
          color="purple"
        />
      </div>

      {stats.pendingValidations > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
            ⚠️ You have {stats.pendingValidations} attendance record(s) pending validation.
          </p>
          <a
            href="/team-attendance"
            className="text-xs text-yellow-700 dark:text-yellow-300 hover:underline mt-1 block"
          >
            Go to Team Attendance →
          </a>
        </div>
      )}
    </div>
  )
}

export default ManagerDashboard