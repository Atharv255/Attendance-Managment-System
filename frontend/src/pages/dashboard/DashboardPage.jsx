import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDashboardStats } from '../../features/attendance/attendanceSlice'
import { useAuth } from '../../hooks/useAuth'
import EmployeeDashboard from '../../components/dashboard/EmployeeDashboard'
import ManagerDashboard from '../../components/dashboard/ManagerDashboard'
import AdminDashboard from '../../components/dashboard/AdminDashboard'
import Loader from '../../components/common/Loader'

const DashboardPage = () => {
  const dispatch = useDispatch()
  const { user, isEmployee, isManager, isAdmin } = useAuth()
  const { dashboardStats, loading } = useSelector((state) => state.attendance)

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  if (loading && !dashboardStats) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    )
  }

  return (
    <div className="space-y-6 fade-in">
      {isEmployee && <EmployeeDashboard stats={dashboardStats} />}
      {isManager && <ManagerDashboard stats={dashboardStats} />}
      {isAdmin && <AdminDashboard stats={dashboardStats} />}
    </div>
  )
}

export default DashboardPage