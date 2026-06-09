import React, { useState } from 'react'
import { HiPhotograph, HiLocationMarker, HiClock } from 'react-icons/hi'
import Modal from '../common/Modal'
import Button from '../common/Button'
import StatusBadge from '../common/StatusBadge'
import Alert from '../common/Alert'
import { formatDateTime, formatTime, formatHours } from '../../utils/formatters'
import { attendanceApi } from '../../services/attendanceApi'
import toast from 'react-hot-toast'

const ValidationModal = ({ isOpen, onClose, attendance, onValidated }) => {
  const [validationStatus, setValidationStatus] = useState('')
  const [remarks, setRemarks] = useState('')
  const [loading, setLoading] = useState(false)
  const [previewSelfie, setPreviewSelfie] = useState(null)

  if (!attendance) return null

  const handleValidate = async () => {
    if (!validationStatus) {
      toast.error('Please select a validation status')
      return
    }

    setLoading(true)
    try {
      await attendanceApi.validateAttendance(attendance._id, {
        validationStatus,
        remarks,
      })
      toast.success(`Attendance marked as ${validationStatus}`)
      onValidated && onValidated()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Validation failed')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setValidationStatus('')
    setRemarks('')
    setPreviewSelfie(null)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Validate Attendance"
      size="lg"
    >
      <div className="space-y-6">
        {/* Employee Info */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Employee</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {attendance.userId?.name}
              </p>
              <p className="text-xs text-gray-500">{attendance.userId?.employeeId}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {attendance.date}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Working Hours</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {formatHours(attendance.totalWorkingHours)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
              <StatusBadge status={attendance.workingStatus} />
            </div>
          </div>
        </div>

        {/* Selfies */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <HiPhotograph className="w-4 h-4" /> Selfies
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {/* Punch In Selfie */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Punch In ({formatTime(attendance.punchIn?.time)})
              </p>
              {attendance.punchIn?.selfie?.url ? (
                <img
                  src={attendance.punchIn.selfie.url}
                  alt="Punch in selfie"
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-90"
                  onClick={() => setPreviewSelfie(attendance.punchIn.selfie.url)}
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-xs text-gray-400">No selfie</p>
                </div>
              )}
            </div>

            {/* Punch Out Selfie */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Punch Out ({formatTime(attendance.punchOut?.time) || 'N/A'})
              </p>
              {attendance.punchOut?.selfie?.url ? (
                <img
                  src={attendance.punchOut.selfie.url}
                  alt="Punch out selfie"
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600 cursor-pointer hover:opacity-90"
                  onClick={() => setPreviewSelfie(attendance.punchOut.selfie.url)}
                />
              ) : (
                <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-xs text-gray-400">No selfie</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Locations */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <HiLocationMarker className="w-4 h-4" /> Locations
          </h4>
          <div className="grid grid-cols-2 gap-3">
            {attendance.punchIn?.location && (
              <a
                href={`https://maps.google.com/?q=${attendance.punchIn.location.latitude},${attendance.punchIn.location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:underline bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg block"
              >
                📍 Punch In Location<br />
                {attendance.punchIn.location.latitude.toFixed(4)}, {attendance.punchIn.location.longitude.toFixed(4)}
              </a>
            )}
            {attendance.punchOut?.location && (
              <a
                href={`https://maps.google.com/?q=${attendance.punchOut.location.latitude},${attendance.punchOut.location.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary-600 hover:underline bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg block"
              >
                📍 Punch Out Location<br />
                {attendance.punchOut.location.latitude.toFixed(4)}, {attendance.punchOut.location.longitude.toFixed(4)}
              </a>
            )}
          </div>
        </div>

        {/* Existing remarks */}
        {attendance.remarks && (
          <Alert type="info" message={`Previous remarks: ${attendance.remarks}`} />
        )}

        {/* Validation form */}
        {attendance.validationStatus === 'pending' ? (
          <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Validation Decision
            </h4>

            <div className="flex gap-3">
              <button
                onClick={() => setValidationStatus('valid')}
                className={`flex-1 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                  validationStatus === 'valid'
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-green-300'
                }`}
              >
                ✓ Mark as Valid
              </button>
              <button
                onClick={() => setValidationStatus('invalid')}
                className={`flex-1 py-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                  validationStatus === 'invalid'
                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-red-300'
                }`}
              >
                ✕ Mark as Invalid
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Remarks (optional)
              </label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                rows={3}
                placeholder="Add any notes or observations..."
                className="input-field resize-none"
                maxLength={500}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant={validationStatus === 'valid' ? 'success' : 'danger'}
                onClick={handleValidate}
                loading={loading}
                disabled={!validationStatus}
              >
                Confirm Validation
              </Button>
            </div>
          </div>
        ) : (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already validated as:
                </p>
                <StatusBadge status={attendance.validationStatus} className="mt-1" />
              </div>
              {attendance.validatedBy && (
                <p className="text-xs text-gray-500">
                  by {attendance.validatedBy.name}
                </p>
              )}
            </div>
            {attendance.remarks && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                Remarks: {attendance.remarks}
              </p>
            )}
            <div className="flex justify-end mt-4">
              <Button variant="secondary" onClick={handleClose}>Close</Button>
            </div>
          </div>
        )}
      </div>

      {/* Selfie Preview Modal */}
      {previewSelfie && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewSelfie(null)}
        >
          <img
            src={previewSelfie}
            alt="Selfie preview"
            className="max-w-lg max-h-[80vh] object-contain rounded-xl"
          />
        </div>
      )}
    </Modal>
  )
}

export default ValidationModal