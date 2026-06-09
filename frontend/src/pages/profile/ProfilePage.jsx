import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { HiUser, HiMail, HiPhone, HiOfficeBuilding, HiLockClosed } from 'react-icons/hi'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import StatusBadge from '../../components/common/StatusBadge'
import { updateUserProfile } from '../../features/auth/authSlice'
import { authApi } from '../../services/authApi'
import { formatDate } from '../../utils/formatters'

const ProfilePage = () => {
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state) => state.auth)
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    department: user?.department || '',
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [pwLoading, setPwLoading] = useState(false)

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    const result = await dispatch(updateUserProfile(formData))
    if (updateUserProfile.fulfilled.match(result)) {
      toast.success('Profile updated successfully!')
      setEditMode(false)
    } else {
      toast.error('Update failed')
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    setPwLoading(true)
    try {
      await authApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      toast.success('Password changed successfully!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password')
    } finally {
      setPwLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 fade-in">
      <div>
        <h1 className="page-title">My Profile</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your account information
        </p>
      </div>

      {/* Avatar & Basic Info */}
      <Card>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            <span className="text-3xl font-bold text-primary-700 dark:text-primary-300">
              {user?.name?.charAt(0)?.toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {user?.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <StatusBadge status={user?.role} />
              <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full">
                {user?.employeeId}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Details */}
      <Card
        title="Profile Information"
        action={
          !editMode && (
            <Button variant="secondary" size="sm" onClick={() => setEditMode(true)}>
              Edit
            </Button>
          )
        }
      >
        {editMode ? (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Input
              label="Full Name"
              icon={HiUser}
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
            />
            <Input
              label="Phone"
              icon={HiPhone}
              value={formData.phone}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
              placeholder="+1 234 567 8900"
            />
            <Input
              label="Department"
              icon={HiOfficeBuilding}
              value={formData.department}
              onChange={(e) => setFormData((p) => ({ ...p, department: e.target.value }))}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="secondary"
                onClick={() => setEditMode(false)}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={loading}>
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <HiUser className="w-3 h-3" /> Name
              </p>
              <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">
                {user?.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <HiMail className="w-3 h-3" /> Email
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <HiPhone className="w-3 h-3" /> Phone
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                {user?.phone || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <HiOfficeBuilding className="w-3 h-3" /> Department
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                {user?.department || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Joined</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                {formatDate(user?.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Last Login</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                {formatDate(user?.lastLogin) || 'N/A'}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Change Password */}
      <Card title="Change Password">
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            icon={HiLockClosed}
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData((p) => ({ ...p, currentPassword: e.target.value }))
            }
            required
          />
          <Input
            label="New Password"
            type="password"
            icon={HiLockClosed}
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData((p) => ({ ...p, newPassword: e.target.value }))
            }
            required
            helperText="Min 6 chars with uppercase, lowercase, and number"
          />
          <Input
            label="Confirm New Password"
            type="password"
            icon={HiLockClosed}
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData((p) => ({ ...p, confirmPassword: e.target.value }))
            }
            required
          />
          <div className="flex justify-end">
            <Button type="submit" variant="primary" loading={pwLoading}>
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default ProfilePage