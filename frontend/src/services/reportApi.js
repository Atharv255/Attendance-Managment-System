import api from './api'

export const reportApi = {
  getDailyReport: (params) => api.get('/reports/daily', { params }),
  getSummaryReport: (params) => api.get('/reports/summary', { params }),
  getOvertimeReport: (params) => api.get('/reports/overtime', { params }),
  getEmployeeReport: (userId, params) =>
    api.get(`/reports/employee/${userId}`, { params }),
}