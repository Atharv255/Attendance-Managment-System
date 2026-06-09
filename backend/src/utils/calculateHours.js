/**
 * Calculate total working hours between punch in and punch out
 * @param {Date} punchIn - Punch in time
 * @param {Date} punchOut - Punch out time
 * @returns {number} Total hours worked (rounded to 2 decimal places)
 */
const calculateWorkingHours = (punchIn, punchOut) => {
  if (!punchIn || !punchOut) return 0;

  const diffMs = new Date(punchOut) - new Date(punchIn);
  if (diffMs < 0) return 0;

  const diffHours = diffMs / (1000 * 60 * 60);
  return Math.round(diffHours * 100) / 100;
};

/**
 * Get working status based on hours worked
 * @param {number} hours - Total hours worked
 * @returns {string} Status: 'completed' | 'incomplete'
 */
const getWorkingStatus = (hours) => {
  const STANDARD_HOURS = 8;
  return hours >= STANDARD_HOURS ? 'completed' : 'incomplete';
};

/**
 * Calculate overtime hours (hours beyond 8)
 * @param {number} totalHours - Total hours worked
 * @returns {number} Overtime hours
 */
const calculateOvertimeHours = (totalHours) => {
  const STANDARD_HOURS = 8;
  if (totalHours <= STANDARD_HOURS) return 0;
  return Math.round((totalHours - STANDARD_HOURS) * 100) / 100;
};

/**
 * Format hours to human readable string
 * @param {number} hours - Hours to format
 * @returns {string} Formatted string like "8h 30m"
 */
const formatHours = (hours) => {
  if (!hours || hours === 0) return '0h 0m';
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
};

/**
 * Get today's date in YYYY-MM-DD format
 * @returns {string} Today's date
 */
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get date string from a Date object
 * @param {Date} date - Date object
 * @returns {string} Date in YYYY-MM-DD format
 */
const getDateString = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

module.exports = {
  calculateWorkingHours,
  getWorkingStatus,
  calculateOvertimeHours,
  formatHours,
  getTodayDate,
  getDateString,
};