import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { HiDocumentReport } from 'react-icons/hi'

import Card from '../../components/common/Card'
import Pagination from '../../components/common/Pagination'
import DailyReport from '../../components/reports/DailyReport'
import SummaryReport from '../../components/reports/SummaryReport'
import ReportFilters from '../../components/reports/ReportFilters'

import { reportApi } from '../../services/reportApi'
import { formatDate } from '../../utils/formatters'
import { getTodayDate } from '../../utils/helpers'

const ReportsPage = () => {
  const { user } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState('daily')
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState(null)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    date: getTodayDate(),
    startDate: '',
    endDate: '',
  })

  const isManagerOrAdmin = ['manager', 'admin'].includes(user?.role)

  const fetchReport = async () => {
    setLoading(true)
    try {
      let response
      if (activeTab === 'daily') {
        response = await reportApi.getDailyReport({
          date: filters.date,
          page,
          limit: 10,
        })
      } else if (activeTab === 'summary') {
        if (!filters.startDate || !filters.endDate) {
          toast.error('Please select both start and end dates')
          setLoading(false)
          return
        }
        response = await reportApi.getSummaryReport({
          startDate: filters.startDate,
          endDate: filters.endDate,
        })
      }
      if (response) {
        setData(response.data.data)
        setMeta(response.data.meta)
      }
    } catch (error) {
      toast.error('Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'daily') {
      fetchReport()
    } else {
      // Reset data when switching to summary
      setData([])
    }
  }, [activeTab, page, filters.date])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
    if (name === 'date') {
      setPage(1)
    }
  }

  const handleReset = () => {
    setFilters({
      date: getTodayDate(),
      startDate: '',
      endDate: '',
    })
    setPage(1)
  }

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <HiDocumentReport className="w-7 h-7 text-primary-600" />
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Generate and view attendance reports
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={() => {
            setActiveTab('daily')
            setPage(1)
          }}
          className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'daily'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
          }`}
        >
          Daily Report
        </button>
        {isManagerOrAdmin && (
          <button
            onClick={() => {
              setActiveTab('summary')
              setPage(1)
            }}
            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'summary'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            Summary Report
          </button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <ReportFilters
          filters={filters}
          onChange={handleFilterChange}
          onApply={activeTab === 'summary' ? fetchReport : null}
          onReset={handleReset}
          showSingleDate={activeTab === 'daily'}
          showDateRange={activeTab === 'summary'}
          loading={loading}
        />
      </Card>

      {/* Report Table */}
      <Card padding={false}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="section-title">
            {activeTab === 'daily'
              ? `Daily Report — ${formatDate(filters.date)}`
              : 'Summary Report'}
          </h3>
        </div>

        {activeTab === 'daily' ? (
          <DailyReport data={data} loading={loading} />
        ) : (
          <SummaryReport data={data} loading={loading} />
        )}

        {activeTab === 'daily' && (
          <Pagination meta={meta} onPageChange={setPage} />
        )}
      </Card>
    </div>
  )
}

export default ReportsPage