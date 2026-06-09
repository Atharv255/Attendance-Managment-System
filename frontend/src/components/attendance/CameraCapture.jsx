import React from 'react'
import Webcam from 'react-webcam'
import { HiCamera, HiRefresh, HiSwitchHorizontal } from 'react-icons/hi'
import Button from '../common/Button'
import Alert from '../common/Alert'

const CameraCapture = ({
  webcamRef,
  capturedImage,
  isCameraReady,
  cameraError,
  facingMode,
  onCapture,
  onRetake,
  onSwitchCamera,
  onUserMedia,
  onUserMediaError,
}) => {
  const videoConstraints = {
    width: 400,
    height: 400,
    facingMode: facingMode,
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        📸 Live Selfie Required
      </p>

      {cameraError && (
        <Alert type="error" message={cameraError} />
      )}

      <div className="relative w-full max-w-sm">
        {!capturedImage ? (
          <div className="camera-container relative bg-gray-900 rounded-xl overflow-hidden">
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMedia={onUserMedia}
              onUserMediaError={onUserMediaError}
              className="w-full rounded-xl"
              mirrored={facingMode === 'user'}
            />
            {/* Camera overlay */}
            <div className="absolute inset-0 border-4 border-primary-400 rounded-xl opacity-50 pointer-events-none" />
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-primary-400" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-primary-400" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-primary-400" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-primary-400" />

            {!isCameraReady && !cameraError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                <div className="text-center text-white">
                  <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm">Starting camera...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="relative">
            <img
              src={capturedImage}
              alt="Captured selfie"
              className="w-full max-w-sm rounded-xl border-4 border-green-400"
            />
            <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <span>✓</span> Captured
            </div>
          </div>
        )}
      </div>

      {/* Camera controls */}
      <div className="flex items-center gap-3">
        {!capturedImage ? (
          <>
            <Button
              onClick={onCapture}
              variant="primary"
              icon={HiCamera}
              disabled={!isCameraReady || !!cameraError}
              size="lg"
            >
              Capture Photo
            </Button>
            <Button
              onClick={onSwitchCamera}
              variant="secondary"
              icon={HiSwitchHorizontal}
              size="lg"
              title="Switch camera"
            />
          </>
        ) : (
          <Button
            onClick={onRetake}
            variant="secondary"
            icon={HiRefresh}
          >
            Retake Photo
          </Button>
        )}
      </div>

      {capturedImage && (
        <p className="text-xs text-green-600 dark:text-green-400 text-center">
          ✓ Photo captured successfully. You can retake if needed.
        </p>
      )}
    </div>
  )
}

export default CameraCapture