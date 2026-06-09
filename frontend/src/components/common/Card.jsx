import React from 'react'

const Card = ({ children, className = '', title, subtitle, action, padding = true }) => {
  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-xl shadow-sm 
        border border-gray-200 dark:border-gray-700
        ${padding ? 'p-6' : ''}
        ${className}
      `}
    >
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  )
}

export default Card