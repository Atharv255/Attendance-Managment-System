import axios from 'axios'
import { API_URL } from '../utils/constants'
import { getTokenFromStorage, removeTokenFromStorage, removeUserFromStorage } from '../utils/helpers'

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - attach token
api.interceptors.request.use(
  (config) => {
    const token = getTokenFromStorage()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeTokenFromStorage()
      removeUserFromStorage()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api