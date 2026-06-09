import { useState, useRef, useCallback } from 'react'

export const useCamera = () => {
  const webcamRef = useRef(null)
  const [capturedImage, setCapturedImage] = useState(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [cameraError, setCameraError] = useState(null)
  const [facingMode, setFacingMode] = useState('user')

  const handleUserMedia = useCallback(() => {
    setIsCameraReady(true)
    setCameraError(null)
  }, [])

  const handleUserMediaError = useCallback((error) => {
    setCameraError(
      'Camera access denied. Please allow camera access and try again.'
    )
    setIsCameraReady(false)
    console.error('Camera error:', error)
  }, [])

  const capturePhoto = useCallback(() => {
    if (!webcamRef.current) return null
    const imageSrc = webcamRef.current.getScreenshot()
    if (imageSrc) {
      setCapturedImage(imageSrc)
      return imageSrc
    }
    return null
  }, [webcamRef])

  const retakePhoto = useCallback(() => {
    setCapturedImage(null)
  }, [])

  const switchCamera = useCallback(() => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
  }, [])

  const resetCamera = useCallback(() => {
    setCapturedImage(null)
    setCameraError(null)
    setIsCameraReady(false)
  }, [])

  return {
    webcamRef,
    capturedImage,
    isCameraReady,
    cameraError,
    facingMode,
    handleUserMedia,
    handleUserMediaError,
    capturePhoto,
    retakePhoto,
    switchCamera,
    resetCamera,
    setCapturedImage,
  }
}