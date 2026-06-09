import React from 'react'
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi'
import Button from './Button'

const Pagination = ({ meta, onPageChange }) => {
  if (!meta || meta.totalPages <= 1) return null

  const { currentPage, totalPages, totalItems, itemsPerPage } = meta

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const getPageNumbers = () => {
    const pages = []
    const delta = 2
    const start = Math.max(1, currentPage - delta)
    const end = Math.min(totalPages, currentPage + delta)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing {startItem} to {endItem} of {totalItems} results
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!meta.hasPrevPage}
          icon={HiChevronLeft}
        />

        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`
              w-8 h-8 text-sm rounded-lg font-medium transition-colors
              ${
                page === currentPage
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            {page}
          </button>
        ))}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!meta.hasNextPage}
          icon={HiChevronRight}
        />
      </div>
    </div>
  )
}

export default Pagination