import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import toast from 'react-hot-toast'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { reviewOvertimeRequest } from '../../features/overtime/overtimeSlice'
import { formatDate, formatHours } from '../../utils/formatters'

const ReviewModal = ({ isOpen, onClose, request, onReviewed }) => {
  const dispatch = useDispatch()
  const [status, setStatus] = useState('')
  const [reviewRemarks, setReviewRemarks] = useState('')
  const [loading, setLoading] = useState(false)

  if (!request) return null

  const handleReview = async () => {
    if (!status) {
      toast.error('Please select approve or reject')
      return
    }

    setLoading(true)
    const result = await dispatch(
      reviewOvertimeRequest({ id: request._id, data: { status, reviewRemarks } })
    )

    if (reviewOvertimeRequest.fulfilled.match(result)) {
      toast.success(`Overtime request ${status} successfully`)
      onReviewed && onReviewed()
      handleClose()
    } else {
      toast.error(result.payload || 'Review failed')
    }
    setLoading(false)
  }

  const handleClose = () => {
    setStatus('')
    setReviewRemarks('')
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Review Overtime Request" size="md">
      <div className="space-y-5">
        {/* Request details */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Employee</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {request.userId?.name}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatDate(request.date)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Department</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {request.userId?.department}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Requested Hours</p>
              <p className="text-sm font-bold text-primary-600 dark:text-primary-400">
                {formatHours(request.requestedHours)}
              </p>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Reason</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg p-2">
              {request.reason}
            </p>
          </div>
        </div>

        {/* Decision */}
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Decision
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setStatus('approved')}
              className={`flex-1 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                status === 'approved'
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-green-300'
              }`}
            >
              ✓ Approve
            </button>
            <button
              onClick={() => setStatus('rejected')}
              className={`flex-1 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                status === 'rejected'
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                  : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-red-300'
              }`}
            >
              ✕ Reject
            </button>
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Remarks {status === 'rejected' && <span className="text-red-500">*</span>}
          </label>
          <textarea
            value={reviewRemarks}
            onChange={(e) => setReviewRemarks(e.target.value)}
            rows={3}
            placeholder={
              status === 'rejected'
                ? 'Please provide a reason for rejection...'
                : 'Optional remarks...'
            }
            className="input-field resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant={status === 'approved' ? 'success' : status === 'rejected' ? 'danger' : 'primary'}
            onClick={handleReview}
            loading={loading}
            disabled={!status || (status === 'rejected' && !reviewRemarks)}
          >
            Confirm Decision
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default ReviewModal