import React from 'react'
import Loader from './Loader'

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className = '',
  icon: Icon,
  fullWidth = false,
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary:
      'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary:
      'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 focus:ring-gray-400',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    warning:
      'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400',
    outline:
      'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900 focus:ring-primary-500',
    ghost:
      'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 focus:ring-gray-400',
  }

  const sizes = {
    sm: 'text-sm py-1.5 px-3',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-2.5 px-5',
    xl: 'text-base py-3 px-6',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <Loader size="sm" color="white" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  )
}

export default Button