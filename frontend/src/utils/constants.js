export const ROLES = {
  EMPLOYEE: 'employee',
  MANAGER: 'manager',
  ADMIN: 'admin',
}

export const ATTENDANCE_STATUS = {
  COMPLETED: 'completed',
  INCOMPLETE: 'incomplete',
  ABSENT: 'absent',
  ON_LEAVE: 'on-leave',
}

export const VALIDATION_STATUS = {
  PENDING: 'pending',
  VALID: 'valid',
  INVALID: 'invalid',
}

export const OVERTIME_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
}

export const STANDARD_HOURS = 8

export const STATUS_COLORS = {
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  incomplete: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  absent: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  'on-leave': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  valid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  invalid: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  employee: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  manager: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  admin: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
}

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'