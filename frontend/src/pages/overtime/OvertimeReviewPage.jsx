import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPendingRequests } from '../../features/overtime/overtimeSlice'
import OvertimeTable from '../../components/overtime/OvertimeTable'
import ReviewModal from '../../components/overtime/ReviewModal'
import Card from '../../components/common/Card'
import Pagination from '../../components/common/Pagination'

const OvertimeReviewPage = () => {
  const dispatch = useDispatch()
  const { pendingRequests, loading, meta } = useSelector((state) => state.overtime)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('pending')

  const fetchData = () => {
    dispatch(fetchPendingRequests({ page, limit: 10, status: statusFilter }))
  }

  useEffect(() => {
    fetchData()
  }, [page, statusFilter])

  const handleReview = (request) => {
    setSelectedRequest(request)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="page-title">Overtime Review</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Review and approve/reject overtime requests
        </p>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Filter by Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              className="input-field w-auto"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </Card>

      {pendingRequests.length > 0 && statusFilter === 'pending' && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ You have <strong>{meta?.totalItems || pendingRequests.length}</strong> pending overtime request(s) to review
          </p>
        </div>
      )}

      <Card padding={false}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="section-title">Overtime Requests</h3>
        </div>
        <OvertimeTable
          data={pendingRequests}
          loading={loading}
          showEmployee={true}
          onReview={handleReview}
        />
        <Pagination meta={meta} onPageChange={setPage} />
      </Card>

      <ReviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        request={selectedRequest}
        onReviewed={fetchData}
      />
    </div>
  )
}

export default OvertimeReviewPage