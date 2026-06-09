import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authApi } from '../../services/authApi'
import {
  setTokenToStorage,
  setUserToStorage,
  removeTokenFromStorage,
  removeUserFromStorage,
  getTokenFromStorage,
  getUserFromStorage,
} from '../../utils/helpers'

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authApi.login(credentials)
      const { token, user } = response.data.data
      setTokenToStorage(token)
      setUserToStorage(user)
      return { token, user }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      )
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authApi.register(userData)
      const { token, user } = response.data.data
      setTokenToStorage(token)
      setUserToStorage(user)
      return { token, user }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed'
      )
    }
  }
)

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authApi.getMe()
      const user = response.data.data.user
      setUserToStorage(user)
      return user
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user'
      )
    }
  }
)

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authApi.updateProfile(data)
      const user = response.data.data.user
      setUserToStorage(user)
      return user
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Update failed'
      )
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    darkMode: localStorage.getItem('darkMode') === 'true',
  },
  reducers: {
    loadUserFromStorage: (state) => {
      const token = getTokenFromStorage()
      const user = getUserFromStorage()
      if (token && user) {
        state.token = token
        state.user = user
        state.isAuthenticated = true
      }
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      removeTokenFromStorage()
      removeUserFromStorage()
    },
    clearError: (state) => {
      state.error = null
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
      localStorage.setItem('darkMode', state.darkMode)
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch Me
    builder
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload
      })

    // Update Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { loadUserFromStorage, logout, clearError, toggleDarkMode } =
  authSlice.actions

export default authSlice.reducer