import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { HiPlus } from 'react-icons/hi'
import { fetchMyOvertimeRequests } from '../../features/overtime/overtimeSlice'
import OvertimeTable from '../../components/overtime/OvertimeTable'
import OvertimeRequestForm from '../../components/overtime/OvertimeRequestForm'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Pagination from '../../components/common/Pagination'

const OvertimePage = () => {
  const dispatch = useDispatch()
  const { myRequests, loading, meta } = useSelector((state) => state.overtime)
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')

  const fetchData = () => {
    dispatch(fetchMyOvertimeRequests({ page, limit: 10, status: statusFilter || undefined }))
  }

  useEffect(() => {
    fetchData()
  }, [page, statusFilter])

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">My Overtime Requests</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your overtime requests
          </p>
        </div>
        <Button
          variant="primary"
          icon={HiPlus}
          onClick={() => setModalOpen(true)}
        >
          New Request
        </Button>
      </div>

      {/* Filter */}
      <Card>
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              className="input-field w-auto"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card padding={false}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="section-title">Overtime Requests</h3>
        </div>
        <OvertimeTable data={myRequests} loading={loading} showEmployee={false} />
        <Pagination meta={meta} onPageChange={setPage} />
      </Card>

      <OvertimeRequestForm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
      />
    </div>
  )
}

export default OvertimePage