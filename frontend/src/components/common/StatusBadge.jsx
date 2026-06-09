import React from 'react'
import { STATUS_COLORS } from '../../utils/constants'
import { capitalizeFirst } from '../../utils/formatters'

const StatusBadge = ({ status, className = '' }) => {
  if (!status) return null

  const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800'

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${colorClass}
        ${className}
      `}
    >
      {capitalizeFirst(status)}
    </span>
  )
}

export default StatusBadge