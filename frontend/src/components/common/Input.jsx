import React, { forwardRef } from 'react'

const Input = forwardRef(
  (
    {
      label,
      type = 'text',
      placeholder,
      error,
      helperText,
      icon: Icon,
      rightIcon: RightIcon,
      onRightIconClick,
      required = false,
      disabled = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon className="h-4 w-4 text-gray-400" />
            </div>
          )}
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={`
              w-full px-3 py-2 border rounded-lg transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
              bg-white dark:bg-gray-800 
              text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500
              disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed
              ${Icon ? 'pl-10' : ''}
              ${RightIcon ? 'pr-10' : ''}
              ${
                error
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600'
              }
            `}
            {...props}
          />
          {RightIcon && (
            <div
              className={`absolute inset-y-0 right-0 pr-3 flex items-center ${
                onRightIconClick ? 'cursor-pointer' : 'pointer-events-none'
              }`}
              onClick={onRightIconClick}
            >
              <RightIcon className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </div>
          )}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input