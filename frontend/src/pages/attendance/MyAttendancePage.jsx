import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { HiPlus, HiViewGrid, HiViewList } from 'react-icons/hi'
import Card from '../../components/common/Card'
import AttendanceTable from '../../components/attendance/AttendanceTable'
import AttendanceCard from '../../components/attendance/AttendanceCard'
import ValidationModal from '../../components/attendance/ValidationModal'
import OvertimeRequestForm from '../../components/overtime/OvertimeRequestForm'
import Pagination from '../../components/common/Pagination'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import Loader from '../../components/common/Loader'
import { attendanceApi } from '../../services/attendanceApi'
import { getTodayDate } from '../../utils/helpers'

const MyAttendancePage = () => {
  const { user } = useSelector((state) => state.auth)
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({ startDate: '', endDate: '' })
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [overtimeModalOpen, setOvertimeModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState('card') // 'card' or 'table'

  const fetchAttendance = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 10, ...filters }
      const response = await attendanceApi.getMyAttendance(params)
      setAttendance(response.data.data)
      setMeta(response.data.meta)
    } catch (error) {
      toast.error('Failed to load attendance records')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAttendance()
  }, [page, filters])

  const handleView = (record) => {
    setSelectedRecord(record)
    setViewModalOpen(true)
  }

  const handleFilterChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({ startDate: '', endDate: '' })
    setPage(1)
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">My Attendance</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            View your attendance history
          </p>
        </div>
        <Button
          variant="primary"
          icon={HiPlus}
          onClick={() => setOvertimeModalOpen(true)}
        >
          Request Overtime
        </Button>
      </div>

      {/* Filters with View Toggle */}
      <Card>
        <div className="flex flex-wrap gap-4 items-end justify-between">
          {/* Date Filters */}
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
            <Button variant="secondary" onClick={clearFilters}>
              Clear
            </Button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('card')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'card'
                  ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="Card view"
            >
              <HiViewGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-md transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
              title="Table view"
            >
              <HiViewList className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Attendance Display */}
      {viewMode === 'card' ? (
        // Card View
        <>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader size="lg" text="Loading..." />
            </div>
          ) : attendance.length === 0 ? (
            <Card>
              <EmptyState
                title="No attendance records"
                description="You haven't punched in yet. Go to Attendance page to start."
              />
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {attendance.map((record) => (
                <AttendanceCard
                  key={record._id}
                  attendance={record}
                  onClick={() => handleView(record)}
                />
              ))}
            </div>
          )}
          {meta && (
            <Card padding={false}>
              <Pagination meta={meta} onPageChange={setPage} />
            </Card>
          )}
        </>
      ) : (
        // Table View
        <Card padding={false}>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="section-title">Attendance Records</h3>
          </div>
          <AttendanceTable
            data={attendance}
            loading={loading}
            onView={handleView}
            showUser={false}
          />
          <Pagination meta={meta} onPageChange={setPage} />
        </Card>
      )}

      {/* Modals */}
      <ValidationModal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        attendance={selectedRecord}
        onValidated={fetchAttendance}
      />

      <OvertimeRequestForm
        isOpen={overtimeModalOpen}
        onClose={() => setOvertimeModalOpen(false)}
        onSuccess={fetchAttendance}
      />
    </div>
  )
}

export default MyAttendancePage