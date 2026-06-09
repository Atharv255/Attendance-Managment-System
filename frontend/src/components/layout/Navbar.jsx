import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  HiMenu,
  HiMoon,
  HiSun,
  HiLogout,
  HiUser,
  HiBell,
} from 'react-icons/hi'
import { useAuth } from '../../hooks/useAuth'
import { capitalizeFirst } from '../../utils/formatters'

const Navbar = ({ onMenuClick }) => {
  const { user, handleLogout, handleToggleDarkMode, darkMode } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors lg:hidden"
        >
          <HiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-bold text-gray-900 dark:text-white hidden sm:block">
            AttendEase
          </span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Dark mode toggle */}
        <button
          onClick={handleToggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? (
            <HiSun className="w-5 h-5 text-yellow-500" />
          ) : (
            <HiMoon className="w-5 h-5 text-gray-600" />
          )}
        </button>

        {/* User dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
              <span className="text-primary-700 dark:text-primary-300 font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white leading-none">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {capitalizeFirst(user?.role)}
              </p>
            </div>
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-20 py-1">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <HiUser className="w-4 h-4" />
                  My Profile
                </Link>
                <button
                  onClick={() => {
                    setDropdownOpen(false)
                    handleLogout()
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <HiLogout className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar