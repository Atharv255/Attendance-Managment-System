import api from './api'

export const overtimeApi = {
  createRequest: (data) => api.post('/overtime/request', data),
  getMyRequests: (params) => api.get('/overtime/my-requests', { params }),
  getPendingRequests: (params) => api.get('/overtime/pending', { params }),
  getAllRequests: (params) => api.get('/overtime/all', { params }),
  reviewRequest: (id, data) => api.patch(`/overtime/${id}/review`, data),
  getRequestById: (id) => api.get(`/overtime/${id}`),
}