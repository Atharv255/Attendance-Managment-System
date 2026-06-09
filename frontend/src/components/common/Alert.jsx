import React from 'react'
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiInformationCircle,
  HiXCircle,
  HiX,
} from 'react-icons/hi'

const Alert = ({ type = 'info', message, onClose, className = '' }) => {
  const config = {
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-800 dark:text-green-200',
      icon: HiCheckCircle,
      iconColor: 'text-green-500',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-800 dark:text-red-200',
      icon: HiXCircle,
      iconColor: 'text-red-500',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-800 dark:text-yellow-200',
      icon: HiExclamationCircle,
      iconColor: 'text-yellow-500',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-800 dark:text-blue-200',
      icon: HiInformationCircle,
      iconColor: 'text-blue-500',
    },
  }

  const { bg, border, text, icon: Icon, iconColor } = config[type]

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${bg} ${border} ${className}`}
    >
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconColor}`} />
      <p className={`text-sm flex-1 ${text}`}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${text} hover:opacity-70 transition-opacity`}
        >
          <HiX className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default Alert