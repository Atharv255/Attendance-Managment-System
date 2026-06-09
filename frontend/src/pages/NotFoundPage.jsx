import React from 'react'
import { Link } from 'react-router-dom'
import { HiHome } from 'react-icons/hi'
import Button from '../components/common/Button'

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-black text-primary-600 dark:text-primary-400">
            404
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Page Not Found
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/dashboard">
          <Button variant="primary" icon={HiHome} size="lg">
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage