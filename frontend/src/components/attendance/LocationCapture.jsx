import React from 'react'
import { HiLocationMarker, HiRefresh } from 'react-icons/hi'
import Button from '../common/Button'
import Alert from '../common/Alert'
import Loader from '../common/Loader'

const LocationCapture = ({
  location,
  locationError,
  locationLoading,
  onGetLocation,
  onClearLocation,
}) => {
  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        📍 Location Required
      </p>

      {locationError && (
        <Alert type="error" message={locationError} />
      )}

      {location ? (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <HiLocationMarker className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Location captured
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">
                  Lat: {location.latitude.toFixed(6)}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400">
                  Long: {location.longitude.toFixed(6)}
                </p>
                {location.accuracy && (
                  <p className="text-xs text-green-500 dark:text-green-500">
                    Accuracy: ±{Math.round(location.accuracy)}m
                  </p>
                )}
              </div>
            </div>
            <Button
              onClick={onGetLocation}
              variant="ghost"
              size="sm"
              icon={HiRefresh}
              title="Refresh location"
            />
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
          {locationLoading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader size="sm" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Getting your location...
              </p>
            </div>
          ) : (
            <>
              <HiLocationMarker className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                Location not captured yet
              </p>
              <Button
                onClick={onGetLocation}
                variant="primary"
                icon={HiLocationMarker}
                size="sm"
              >
                Get My Location
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default LocationCapture