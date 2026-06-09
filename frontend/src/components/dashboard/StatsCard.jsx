import React from 'react'

const StatsCard = ({ title, value, subtitle, icon: Icon, color = 'blue', trend }) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      icon: 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400',
      text: 'text-blue-600 dark:text-blue-400',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      icon: 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400',
      text: 'text-green-600 dark:text-green-400',
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      icon: 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400',
      text: 'text-red-600 dark:text-red-400',
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      icon: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-600 dark:text-yellow-400',
      text: 'text-yellow-600 dark:text-yellow-400',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      icon: 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400',
      text: 'text-purple-600 dark:text-purple-400',
    },
  }

  const colors = colorMap[color] || colorMap.blue

  return (
    <div className={`card ${colors.bg} border-0`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className={`text-3xl font-bold mt-1 ${colors.text}`}>{value ?? '-'}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <p className={`text-xs mt-1 ${trend.positive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.positive ? '↑' : '↓'} {trend.text}
            </p>
          )}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.icon}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  )
}

export default StatsCard