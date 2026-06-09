import React, { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { HiClock, HiCheckCircle, HiXCircle } from 'react-icons/hi'

import { punchInAction, punchOutAction } from '../../features/attendance/attendanceSlice'
import { useCamera } from '../../hooks/useCamera'
import { useLocation } from '../../hooks/useLocation'
import { dataURLtoBlob, blobToFile } from '../../utils/helpers'
import { formatTime, formatHours } from '../../utils/formatters'
import CameraCapture from './CameraCapture'
import LocationCapture from './LocationCapture'
import Button from '../common/Button'
import StatusBadge from '../common/StatusBadge'

const PunchCard = ({ todayAttendance, onSuccess }) => {
  const dispatch = useDispatch()
  const { punchLoading } = useSelector((state) => state.attendance)
  const [step, setStep] = useState('idle') // idle | camera | location | confirm
  const [action, setAction] = useState(null) // 'in' | 'out'

  const camera = useCamera()
  const locationHook = useLocation()

  const isPunchedIn = todayAttendance?.isPunchedIn
  const isPunchedOut = todayAttendance?.punchOut?.time
  const isCompleted = isPunchedIn === false && isPunchedOut

  const handleStartPunch = (type) => {
    setAction(type)
    setStep('camera')
    camera.resetCamera()
    locationHook.clearLocation()
  }

  const handleCapturePhoto = () => {
    const photo = camera.capturePhoto()
    if (!photo) {
      toast.error('Failed to capture photo. Please try again.')
      return
    }
    setStep('location')
    locationHook.getLocation()
  }

  const handleSubmit = useCallback(async () => {
    if (!camera.capturedImage) {
      toast.error('Please capture your selfie first')
      return
    }
    if (!locationHook.location) {
      toast.error('Please capture your location first')
      return
    }

    try {
      const blob = dataURLtoBlob(camera.capturedImage)
      const file = blobToFile(blob, `selfie_${Date.now()}.jpg`)

      const formData = new FormData()
      formData.append('selfie', file)
      formData.append('latitude', locationHook.location.latitude)
      formData.append('longitude', locationHook.location.longitude)
      formData.append('address', '')

      let result
      if (action === 'in') {
        result = await dispatch(punchInAction(formData))
        if (punchInAction.fulfilled.match(result)) {
          toast.success('Punched in successfully! 🎉')
          setStep('idle')
          onSuccess && onSuccess()
        } else {
          toast.error(result.payload || 'Punch in failed')
        }
      } else {
        result = await dispatch(punchOutAction(formData))
        if (punchOutAction.fulfilled.match(result)) {
          toast.success('Punched out successfully! 👋')
          setStep('idle')
          onSuccess && onSuccess()
        } else {
          toast.error(result.payload || 'Punch out failed')
        }
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.')
    }
  }, [camera.capturedImage, locationHook.location, action, dispatch, onSuccess])

  const handleCancel = () => {
    setStep('idle')
    setAction(null)
    camera.resetCamera()
    locationHook.clearLocation()
  }

  // Completed state
  if (isCompleted) {
    return (
      <div className="card text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <HiCheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Attendance Completed!
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            You've completed your attendance for today
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Punch In</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatTime(todayAttendance?.punchIn?.time)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Punch Out</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatTime(todayAttendance?.punchOut?.time)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Hours</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {formatHours(todayAttendance?.totalWorkingHours)}
            </p>
          </div>
        </div>
        <StatusBadge status={todayAttendance?.workingStatus} />
      </div>
    )
  }

  // Camera step
  if (step === 'camera') {
    return (
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="section-title">
            {action === 'in' ? '🟢 Punch In' : '🔴 Punch Out'} - Step 1: Selfie
          </h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <CameraCapture
          webcamRef={camera.webcamRef}
          capturedImage={camera.capturedImage}
          isCameraReady={camera.isCameraReady}
          cameraError={camera.cameraError}
          facingMode={camera.facingMode}
          onCapture={handleCapturePhoto}
          onRetake={camera.retakePhoto}
          onSwitchCamera={camera.switchCamera}
          onUserMedia={camera.handleUserMedia}
          onUserMediaError={camera.handleUserMediaError}
        />

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
          {camera.capturedImage && (
            <Button
              variant="primary"
              onClick={() => setStep('location')}
            >
              Next: Get Location →
            </Button>
          )}
        </div>
      </div>
    )
  }

  // Location step
  if (step === 'location') {
    return (
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="section-title">
            {action === 'in' ? '🟢 Punch In' : '🔴 Punch Out'} - Step 2: Location
          </h3>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Selfie preview */}
        {camera.capturedImage && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <img
              src={camera.capturedImage}
              alt="Captured"
              className="w-12 h-12 rounded-lg object-cover border-2 border-green-400"
            />
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                ✓ Selfie captured
              </p>
              <button
                onClick={() => setStep('camera')}
                className="text-xs text-primary-600 hover:underline"
              >
                Retake photo
              </button>
            </div>
          </div>
        )}

        <LocationCapture
          location={locationHook.location}
          locationError={locationHook.locationError}
          locationLoading={locationHook.locationLoading}
          onGetLocation={locationHook.getLocation}
          onClearLocation={locationHook.clearLocation}
        />

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setStep('camera')}>
            ← Back
          </Button>
          <Button
            variant={action === 'in' ? 'success' : 'danger'}
            onClick={handleSubmit}
            loading={punchLoading}
            disabled={!locationHook.location || !camera.capturedImage}
          >
            {action === 'in' ? '✓ Confirm Punch In' : '✓ Confirm Punch Out'}
          </Button>
        </div>
      </div>
    )
  }

  // Default idle state
  return (
    <div className="card space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
          <HiClock className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 className="section-title">Today's Attendance</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Current status */}
      {todayAttendance ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">
              Punch In
            </p>
            <p className="text-base font-bold text-green-800 dark:text-green-200">
              {formatTime(todayAttendance.punchIn?.time)}
            </p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Status
            </p>
            <div className="mt-1">
              <StatusBadge
                status={isPunchedIn ? 'incomplete' : todayAttendance.workingStatus}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ You haven't punched in yet today
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {!isPunchedIn && !isCompleted && (
          <Button
            onClick={() => handleStartPunch('in')}
            variant="success"
            fullWidth
            size="lg"
          >
            🟢 Punch In
          </Button>
        )}
        {isPunchedIn && !isPunchedOut && (
          <Button
            onClick={() => handleStartPunch('out')}
            variant="danger"
            fullWidth
            size="lg"
          >
            🔴 Punch Out
          </Button>
        )}
      </div>
    </div>
  )
}

export default PunchCard