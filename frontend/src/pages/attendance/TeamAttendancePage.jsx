import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import Card from '../../components/common/Card'
import AttendanceTable from '../../components/attendance/AttendanceTable'
import ValidationModal from '../../components/attendance/ValidationModal'
import Pagination from '../../components/common/Pagination'
import Button from '../../components/common/Button'
import { attendanceApi } from '../../services/attendanceApi'
import { getTodayDate } from '../../utils/helpers'

const TeamAttendancePage = () => {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    validationStatus: '',
  })
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const fetchTeamAttendance = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 10, ...filters }
      const response = await attendanceApi.getTeamAttendance(params)
      setAttendance(response.data.data)
      setMeta(response.data.meta)
    } catch (error) {
      toast.error('Failed to load team attendance')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTeamAttendance()
  }, [page, filters])

  const handleValidate = (record) => {
    setSelectedRecord(record)
    setModalOpen(true)
  }

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({ startDate: '', endDate: '', validationStatus: '' })
    setPage(1)
  }

  const pendingCount = attendance.filter((a) => a.validationStatus === 'pending').length

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="page-title">Team Attendance</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Monitor and validate your team's attendance
        </p>
      </div>

      {pendingCount > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ <strong>{pendingCount}</strong> record(s) on this page need validation
          </p>
        </div>
      )}

      {/* Filters */}
      <Card>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              max={getTodayDate()}
              className="input-field w-auto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              max={getTodayDate()}
              className="input-field w-auto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Validation Status
            </label>
            <select
              name="validationStatus"
              value={filters.validationStatus}
              onChange={handleFilterChange}
              className="input-field w-auto"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="valid">Valid</option>
              <option value="invalid">Invalid</option>
            </select>
          </div>
          <Button variant="secondary" onClick={clearFilters}>Clear</Button>
        </div>
      </Card>

      {/* Table */}
      <Card padding={false}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="section-title">Team Attendance Records</h3>
        </div>
        <AttendanceTable
          data={attendance}
          loading={loading}
          onValidate={handleValidate}
          showUser={true}
          showValidation={true}
        />
        <Pagination meta={meta} onPageChange={setPage} />
      </Card>

      <ValidationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        attendance={selectedRecord}
        onValidated={fetchTeamAttendance}
      />
    </div>
  )
}

export default TeamAttendancePage