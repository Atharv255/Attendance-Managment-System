import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  HiHome,
  HiClock,
  HiCalendar,
  HiUsers,
  HiDocumentReport,
  HiClipboardList,
  HiUserGroup,
  HiX,
  HiChartBar,
} from 'react-icons/hi'
import { useAuth } from '../../hooks/useAuth'
import StatusBadge from '../common/StatusBadge'

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isEmployee, isManager, isAdmin, isManagerOrAdmin } = useAuth()
  const location = useLocation()

  const navItems = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: HiHome,
      roles: ['employee', 'manager', 'admin'],
    },
    {
      label: 'Punch In/Out',
      path: '/attendance',
      icon: HiClock,
      roles: ['employee', 'manager', 'admin'],
    },
    {
      label: 'My Attendance',
      path: '/my-attendance',
      icon: HiCalendar,
      roles: ['employee', 'manager', 'admin'],
    },
    {
      label: 'Team Attendance',
      path: '/team-attendance',
      icon: HiUserGroup,
      roles: ['manager', 'admin'],
    },
    {
      label: 'My Overtime',
      path: '/overtime',
      icon: HiClipboardList,
      roles: ['employee', 'manager', 'admin'],
    },
    {
      label: 'Overtime Review',
      path: '/overtime-review',
      icon: HiChartBar,
      roles: ['manager', 'admin'],
    },
    {
      label: 'Reports',
      path: '/reports',
      icon: HiDocumentReport,
      roles: ['employee', 'manager', 'admin'],
    },
    {
      label: 'Users',
      path: '/users',
      icon: HiUsers,
      roles: ['admin'],
    },
  ]

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role)
  )

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800
          border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto
        `}
      >
        {/* Mobile header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-gray-900 dark:text-white">
              AttendEase
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <HiX className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-700 dark:text-primary-300 font-bold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.employeeId}
              </p>
              <StatusBadge status={user?.role} className="mt-1" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-8rem)]">
          {filteredNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => onClose && onClose()}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar