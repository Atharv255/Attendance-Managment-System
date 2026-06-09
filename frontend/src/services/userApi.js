import api from './api'

export const userApi = {
  getAllUsers: (params) => api.get('/users', { params }),
  getTeamMembers: () => api.get('/users/team/members'),
  getUserById: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data),
  deleteUser: (id) => api.delete(`/users/${id}`),
  activateUser: (id) => api.patch(`/users/${id}/activate`),
  getManagers: () => api.get('/users/list/managers'),
}