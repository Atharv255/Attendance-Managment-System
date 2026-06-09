import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../common/Loader'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useSelector((state) => state.auth)
  const location = useLocation()

  if (loading) {
    return <Loader fullScreen text="Loading..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children ? children : <Outlet />
}

export default ProtectedRoute