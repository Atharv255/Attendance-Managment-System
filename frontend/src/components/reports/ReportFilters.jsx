import React from 'react'
import Button from '../common/Button'
import { HiFilter, HiRefresh } from 'react-icons/hi'
import { getTodayDate } from '../../utils/helpers'

const ReportFilters = ({
  filters,
  onChange,
  onApply,
  onReset,
  showDateRange = false,
  showSingleDate = true,
  showStatus = false,
  loading = false,
}) => {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <HiFilter className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Filters
        </h3>
      </div>

      <div className="flex flex-wrap gap-4 items-end">
        {/* Single date filter */}
        {showSingleDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={filters.date || ''}
              max={getTodayDate()}
              onChange={onChange}
              className="input-field w-auto"
            />
          </div>
        )}

        {/* Date range filters */}
        {showDateRange && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={filters.startDate || ''}
                max={getTodayDate()}
                onChange={onChange}
                className="input-field w-auto"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={filters.endDate || ''}
                max={getTodayDate()}
                onChange={onChange}
                className="input-field w-auto"
              />
            </div>
          </>
        )}

        {/* Status filter */}
        {showStatus && (
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status || ''}
              onChange={onChange}
              className="input-field w-auto"
            >
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="valid">Valid</option>
              <option value="invalid">Invalid</option>
            </select>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2">
          {onApply && (
            <Button
              variant="primary"
              onClick={onApply}
              loading={loading}
              icon={HiFilter}
            >
              Apply
            </Button>
          )}
          {onReset && (
            <Button variant="secondary" onClick={onReset} icon={HiRefresh}>
              Reset
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReportFilters