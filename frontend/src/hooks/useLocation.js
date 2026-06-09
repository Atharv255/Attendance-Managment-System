import { useState, useCallback } from 'react'

export const useLocation = () => {
  const [location, setLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser')
      return
    }

    setLocationLoading(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
        setLocationLoading(false)
      },
      (error) => {
        setLocationLoading(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError(
              'Location access denied. Please allow location access.'
            )
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.')
            break
          case error.TIMEOUT:
            setLocationError('Location request timed out.')
            break
          default:
            setLocationError('An unknown error occurred getting location.')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  }, [])

  const clearLocation = useCallback(() => {
    setLocation(null)
    setLocationError(null)
  }, [])

  return {
    location,
    locationError,
    locationLoading,
    getLocation,
    clearLocation,
  }
}