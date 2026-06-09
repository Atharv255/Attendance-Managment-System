import React from 'react'
import { HiUsers, HiCheckCircle, HiXCircle, HiClock, HiCalendar, HiBadgeCheck } from 'react-icons/hi'
import StatsCard from './StatsCard'

const AdminDashboard = ({ stats }) => {
  if (!stats) return null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="page-title">Admin Dashboard</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          System-wide attendance overview
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers ?? 0}
          subtitle="Active users"
          icon={HiUsers}
          color="blue"
        />
        <StatsCard
          title="Present Today"
          value={stats.todayAttendance ?? 0}
          subtitle="Punched in today"
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
          subtitle="Awaiting review"
          icon={HiClock}
          color="yellow"
        />
        <StatsCard
          title="Monthly Records"
          value={stats.totalAttendanceThisMonth ?? 0}
          subtitle="This month"
          icon={HiCalendar}
          color="purple"
        />
      </div>

      {/* Users by Role */}
      {stats.usersByRole && (
        <div className="card">
          <h3 className="section-title mb-4">Users by Role</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.usersByRole.employee ?? 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Employees</p>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.usersByRole.manager ?? 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Managers</p>
            </div>
            <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {stats.usersByRole.admin ?? 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Admins</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard