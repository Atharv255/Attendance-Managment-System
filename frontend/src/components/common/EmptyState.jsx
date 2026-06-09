import React from 'react'
import { HiInbox } from 'react-icons/hi'

const EmptyState = ({
  title = 'No data found',
  description = 'There are no records to display.',
  icon: Icon = HiInbox,
  action,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Icon className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
        {title}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
        {description}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export default EmptyState