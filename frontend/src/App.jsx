import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Layout from './components/layout/Layout'
import ProtectedRoute from './components/layout/ProtectedRoute'

import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import AttendancePage from './pages/attendance/AttendancePage'
import MyAttendancePage from './pages/attendance/MyAttendancePage'
import TeamAttendancePage from './pages/attendance/TeamAttendancePage'
import OvertimePage from './pages/overtime/OvertimePage'
import OvertimeReviewPage from './pages/overtime/OvertimeReviewPage'
import ReportsPage from './pages/reports/ReportsPage'
import UsersPage from './pages/users/UsersPage'
import UserDetailPage from './pages/users/UserDetailPage'
import ProfilePage from './pages/profile/ProfilePage'
import NotFoundPage from './pages/NotFoundPage'

import { loadUserFromStorage } from './features/auth/authSlice'

function App() {
  const dispatch = useDispatch()
  const { darkMode } = useSelector((state) => state.auth)

  useEffect(() => {
    dispatch(loadUserFromStorage())
  }, [dispatch])

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/my-attendance" element={<MyAttendancePage />} />
            <Route
              path="/team-attendance"
              element={
                <ProtectedRoute allowedRoles={['manager', 'admin']}>
                  <TeamAttendancePage />
                </ProtectedRoute>
              }
            />
            <Route path="/overtime" element={<OvertimePage />} />
            <Route
              path="/overtime-review"
              element={
                <ProtectedRoute allowedRoles={['manager', 'admin']}>
                  <OvertimeReviewPage />
                </ProtectedRoute>
              }
            />
            <Route path="/reports" element={<ReportsPage />} />
            <Route
              path="/users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'manager']}>
                  <UserDetailPage />
                </ProtectedRoute>
              }
            />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App