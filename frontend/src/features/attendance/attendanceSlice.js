import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { attendanceApi } from '../../services/attendanceApi'

export const fetchTodayAttendance = createAsyncThunk(
  'attendance/fetchToday',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getTodayAttendance()
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch')
    }
  }
)

export const punchInAction = createAsyncThunk(
  'attendance/punchIn',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.punchIn(formData)
      return response.data.data.attendance
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Punch in failed')
    }
  }
)

export const punchOutAction = createAsyncThunk(
  'attendance/punchOut',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.punchOut(formData)
      return response.data.data.attendance
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Punch out failed')
    }
  }
)

export const fetchDashboardStats = createAsyncThunk(
  'attendance/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await attendanceApi.getDashboardStats()
      return response.data.data.stats
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats')
    }
  }
)

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    todayAttendance: null,
    myAttendance: [],
    teamAttendance: [],
    allAttendance: [],
    dashboardStats: null,
    capturedPhoto: null,
    loading: false,
    punchLoading: false,
    error: null,
    meta: null,
  },
  reducers: {
    setCapturedPhoto: (state, action) => {
      state.capturedPhoto = action.payload
    },
    clearCapturedPhoto: (state) => {
      state.capturedPhoto = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodayAttendance.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchTodayAttendance.fulfilled, (state, action) => {
        state.loading = false
        state.todayAttendance = action.payload.attendance
      })
      .addCase(fetchTodayAttendance.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    builder
      .addCase(punchInAction.pending, (state) => {
        state.punchLoading = true
        state.error = null
      })
      .addCase(punchInAction.fulfilled, (state, action) => {
        state.punchLoading = false
        state.todayAttendance = action.payload
      })
      .addCase(punchInAction.rejected, (state, action) => {
        state.punchLoading = false
        state.error = action.payload
      })

    builder
      .addCase(punchOutAction.pending, (state) => {
        state.punchLoading = true
        state.error = null
      })
      .addCase(punchOutAction.fulfilled, (state, action) => {
        state.punchLoading = false
        state.todayAttendance = action.payload
      })
      .addCase(punchOutAction.rejected, (state, action) => {
        state.punchLoading = false
        state.error = action.payload
      })

    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.loading = false
        state.dashboardStats = action.payload
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setCapturedPhoto, clearCapturedPhoto, clearError } =
  attendanceSlice.actions

export default attendanceSlice.reducer