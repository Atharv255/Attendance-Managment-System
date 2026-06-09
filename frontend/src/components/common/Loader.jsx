import React from 'react'

const Loader = ({ size = 'md', color = 'primary', fullScreen = false, text = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  }

  const colors = {
    primary: 'border-primary-600',
    white: 'border-white',
    gray: 'border-gray-400',
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`
          ${sizes[size]}
          border-4 border-t-transparent rounded-full animate-spin
          ${colors[color]}
        `}
      />
      {text && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}

export default Loader