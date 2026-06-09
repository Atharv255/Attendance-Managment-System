import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import Modal from '../common/Modal'
import Button from '../common/Button'
import { createOvertimeRequest } from '../../features/overtime/overtimeSlice'
import { attendanceApi } from '../../services/attendanceApi'
import { formatDate, formatHours } from '../../utils/formatters'

const OvertimeRequestForm = ({ isOpen, onClose, onSuccess }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.overtime)
  const [recentAttendance, setRecentAttendance] = useState([])
  const [fetching, setFetching] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    if (isOpen) {
      fetchRecentAttendance()
    }
  }, [isOpen])

  const fetchRecentAttendance = async () => {
    setFetching(true)
    try {
      const response = await attendanceApi.getMyAttendance({ limit: 7 })
      const completed = response.data.data.filter(
        (a) => a.punchOut?.time && !a.overtimeRequested
      )
      setRecentAttendance(completed)
    } catch {
      toast.error('Failed to load attendance records')
    } finally {
      setFetching(false)
    }
  }

  const onSubmit = async (data) => {
    const result = await dispatch(createOvertimeRequest(data))
    if (createOvertimeRequest.fulfilled.match(result)) {
      toast.success('Overtime request submitted successfully!')
      reset()
      onSuccess && onSuccess()
      onClose()
    } else {
      toast.error(result.payload || 'Failed to submit request')
    }
  }

  const handleClose = () => {
    reset()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Request Overtime" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Attendance selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Select Attendance Record <span className="text-red-500">*</span>
          </label>
          {fetching ? (
            <p className="text-sm text-gray-500">Loading attendance records...</p>
          ) : recentAttendance.length === 0 ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                No eligible attendance records found. Make sure you've punched out and haven't already requested overtime.
              </p>
            </div>
          ) : (
            <select
              {...register('attendanceId', {
                required: 'Please select an attendance record',
              })}
              className="input-field"
            >
              <option value="">Select attendance date...</option>
              {recentAttendance.map((att) => (
                <option key={att._id} value={att._id}>
                  {formatDate(att.date)} — {formatHours(att.totalWorkingHours)} worked
                </option>
              ))}
            </select>
          )}
          {errors.attendanceId && (
            <p className="text-sm text-red-500 mt-1">{errors.attendanceId.message}</p>
          )}
        </div>

        {/* Requested hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Overtime Hours Requested <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.5"
            min="0.5"
            max="6"
            {...register('requestedHours', {
              required: 'Overtime hours are required',
              min: { value: 0.5, message: 'Minimum 0.5 hours' },
              max: { value: 6, message: 'Maximum 6 hours' },
            })}
            placeholder="e.g. 2"
            className="input-field"
          />
          {errors.requestedHours && (
            <p className="text-sm text-red-500 mt-1">{errors.requestedHours.message}</p>
          )}
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Minimum: 0.5h | Maximum: 6h
          </p>
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register('reason', {
              required: 'Reason is required',
              minLength: { value: 10, message: 'Reason must be at least 10 characters' },
              maxLength: { value: 500, message: 'Reason cannot exceed 500 characters' },
            })}
            rows={4}
            placeholder="Describe why you need overtime..."
            className="input-field resize-none"
          />
          {errors.reason && (
            <p className="text-sm text-red-500 mt-1">{errors.reason.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" onClick={handleClose} type="button">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            disabled={recentAttendance.length === 0}
          >
            Submit Request
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default OvertimeRequestForm