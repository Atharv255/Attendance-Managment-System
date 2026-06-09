import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { HiPlus, HiSearch } from 'react-icons/hi'
import Card from '../../components/common/Card'
import Table from '../../components/common/Table'
import StatusBadge from '../../components/common/StatusBadge'
import Button from '../../components/common/Button'
import Pagination from '../../components/common/Pagination'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import { userApi } from '../../services/userApi'
import { formatDate, formatRelativeTime } from '../../utils/formatters'
import { useNavigate } from 'react-router-dom'

const UsersPage = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ role: '', isActive: '', search: '' })
  const [selectedUser, setSelectedUser] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editLoading, setEditLoading] = useState(false)
  const [managers, setManagers] = useState([])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 10, ...filters }
      if (!params.role) delete params.role
      if (params.isActive === '') delete params.isActive
      const response = await userApi.getAllUsers(params)
      setUsers(response.data.data)
      setMeta(response.data.meta)
    } catch (error) {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const fetchManagers = async () => {
    try {
      const response = await userApi.getManagers()
      setManagers(response.data.data)
    } catch {}
  }

  useEffect(() => {
    fetchUsers()
  }, [page, filters])

  useEffect(() => {
    fetchManagers()
  }, [])

  const handleToggleActive = async (user) => {
    try {
      if (user.isActive) {
        await userApi.deleteUser(user._id)
        toast.success('User deactivated')
      } else {
        await userApi.activateUser(user._id)
        toast.success('User activated')
      }
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Action failed')
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    setEditLoading(true)
    try {
      const formData = new FormData(e.target)
      const data = Object.fromEntries(formData.entries())
      await userApi.updateUser(selectedUser._id, data)
      toast.success('User updated successfully')
      setEditModalOpen(false)
      fetchUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed')
    } finally {
      setEditLoading(false)
    }
  }

  const columns = [
    {
      header: 'Employee',
      render: (row) => (
        <div>
          <p className="font-medium text-gray-900 dark:text-white">{row.name}</p>
          <p className="text-xs text-gray-500">{row.employeeId}</p>
        </div>
      ),
    },
    {
      header: 'Email',
      render: (row) => (
        <span className="text-sm text-gray-600 dark:text-gray-400">{row.email}</span>
      ),
    },
    {
      header: 'Role',
      render: (row) => <StatusBadge status={row.role} />,
    },
    {
      header: 'Department',
      render: (row) => (
        <span className="text-sm">{row.department || '-'}</span>
      ),
    },
    {
      header: 'Status',
      render: (row) => (
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            row.isActive
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          {row.isActive ? 'Active' : 'Inactive'}
        </span>
      ),
    },
    {
      header: 'Joined',
      render: (row) => (
        <span className="text-xs text-gray-500">{formatDate(row.createdAt)}</span>
      ),
    },
    {
      header: 'Actions',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => { setSelectedUser(row); setEditModalOpen(true) }}
          >
            Edit
          </Button>
          <Button
            variant={row.isActive ? 'danger' : 'success'}
            size="sm"
            onClick={() => handleToggleActive(row)}
          >
            {row.isActive ? 'Deactivate' : 'Activate'}
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="page-title">User Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage all system users
        </p>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Name, email, employee ID..."
                value={filters.search}
                onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                className="input-field pl-9"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </label>
            <select
              value={filters.role}
              onChange={(e) => setFilters((p) => ({ ...p, role: e.target.value }))}
              className="input-field w-auto"
            >
              <option value="">All Roles</option>
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={filters.isActive}
              onChange={(e) => setFilters((p) => ({ ...p, isActive: e.target.value }))}
              className="input-field w-auto"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          <Button variant="secondary" onClick={() => setFilters({ role: '', isActive: '', search: '' })}>
            Clear
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card padding={false}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="section-title">All Users</h3>
        </div>
        <Table columns={columns} data={users} loading={loading} />
        <Pagination meta={meta} onPageChange={setPage} />
      </Card>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit User"
        size="md"
      >
        {selectedUser && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                name="name"
                defaultValue={selectedUser.name}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role
              </label>
              <select name="role" defaultValue={selectedUser.role} className="input-field">
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Department
              </label>
              <input
                name="department"
                defaultValue={selectedUser.department}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Manager
              </label>
              <select
                name="managerId"
                defaultValue={selectedUser.managerId?._id || ''}
                className="input-field"
              >
                <option value="">No Manager</option>
                {managers.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.role})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setEditModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={editLoading}>
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}

export default UsersPage