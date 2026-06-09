import { format, formatDistance, parseISO, isValid } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return 'N/A'
  try {
    const d = typeof date === 'string' ? parseISO(date) : new Date(date)
    if (!isValid(d)) return 'Invalid Date'
    return format(d, 'MMM dd, yyyy')
  } catch {
    return 'N/A'
  }
}

export const formatDateTime = (date) => {
  if (!date) return 'N/A'
  try {
    const d = typeof date === 'string' ? parseISO(date) : new Date(date)
    if (!isValid(d)) return 'Invalid Date'
    return format(d, 'MMM dd, yyyy hh:mm a')
  } catch {
    return 'N/A'
  }
}

export const formatTime = (date) => {
  if (!date) return 'N/A'
  try {
    const d = typeof date === 'string' ? parseISO(date) : new Date(date)
    if (!isValid(d)) return 'Invalid'
    return format(d, 'hh:mm a')
  } catch {
    return 'N/A'
  }
}

export const formatHours = (hours) => {
  if (!hours && hours !== 0) return '0h 0m'
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return `${h}h ${m}m`
}

export const formatRelativeTime = (date) => {
  if (!date) return 'N/A'
  try {
    const d = typeof date === 'string' ? parseISO(date) : new Date(date)
    return formatDistance(d, new Date(), { addSuffix: true })
  } catch {
    return 'N/A'
  }
}

export const formatDateForInput = (date) => {
  if (!date) return ''
  try {
    const d = typeof date === 'string' ? parseISO(date) : new Date(date)
    return format(d, 'yyyy-MM-dd')
  } catch {
    return ''
  }
}

export const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const truncateText = (text, maxLength = 50) => {
  if (!text) return ''
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}