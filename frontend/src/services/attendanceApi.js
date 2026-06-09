import api from './api'

export const attendanceApi = {
  punchIn: (formData) =>
    api.post('/attendance/punch-in', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  punchOut: (formData) =>
    api.post('/attendance/punch-out', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  getTodayAttendance: () => api.get('/attendance/today'),

  getMyAttendance: (params) => api.get('/attendance/my-attendance', { params }),

  getAllAttendance: (params) => api.get('/attendance/all', { params }),

  getTeamAttendance: (params) => api.get('/attendance/team', { params }),

  getAttendanceById: (id) => api.get(`/attendance/${id}`),

  validateAttendance: (id, data) => api.patch(`/attendance/${id}/validate`, data),

  getDashboardStats: () => api.get('/attendance/dashboard/stats'),
}