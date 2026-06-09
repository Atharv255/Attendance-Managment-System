import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { HiArrowLeft } from 'react-icons/hi'
import Card from '../../components/common/Card'
import StatusBadge from '../../components/common/StatusBadge'
import Button from '../../components/common/Button'
import Loader from '../../components/common/Loader'
import { userApi } from '../../services/userApi'
import { reportApi } from '../../services/reportApi'
import { formatDate, formatHours } from '../../utils/formatters'

const UserDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, reportRes] = await Promise.all([
          userApi.getUserById(id),
          reportApi.getEmployeeReport(id),
        ])
        setUser(userRes.data.data.user)
        setReport(reportRes.data.data)
      } catch (error) {
        toast.error('Failed to load user details')
        navigate(-1)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) return <Loader fullScreen text="Loading user details..." />
  if (!user) return null

  return (
    <div className="space-y-6 fade-in max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" icon={HiArrowLeft} onClick={() => navigate(-1)} />
        <div>
          <h1 className="page-title">User Details</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.employeeId}
          </p>
        </div>
      </div>

      {/* User Info */}
      <Card title="Employee Information">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
              {user.name}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{user.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
            <StatusBadge status={user.role} className="mt-1" />
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              {user.department || '-'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Manager</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              {user.managerId?.name || '-'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Joined</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              {formatDate(user.createdAt)}
            </p>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      {report?.summary && (
        <Card title="Attendance Summary">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{report.summary.totalDays}</p>
              <p className="text-xs text-gray-500 mt-1">Total Days</p>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{report.summary.completedDays}</p>
              <p className="text-xs text-gray-500 mt-1">Completed</p>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-xl font-bold text-purple-600">{report.summary.formattedTotalHours}</p>
              <p className="text-xs text-gray-500 mt-1">Total Hours</p>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-xl font-bold text-yellow-600">
                {formatHours(report.summary.totalOvertimeHours)}
              </p>
              <p className="text-xs text-gray-500 mt-1">OT Hours</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}

export default UserDetailPage