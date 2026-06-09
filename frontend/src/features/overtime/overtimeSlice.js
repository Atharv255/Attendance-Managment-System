import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { overtimeApi } from '../../services/overtimeApi'

export const fetchMyOvertimeRequests = createAsyncThunk(
  'overtime/fetchMine',
  async (params, { rejectWithValue }) => {
    try {
      const response = await overtimeApi.getMyRequests(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch')
    }
  }
)

export const fetchPendingRequests = createAsyncThunk(
  'overtime/fetchPending',
  async (params, { rejectWithValue }) => {
    try {
      const response = await overtimeApi.getPendingRequests(params)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch')
    }
  }
)

export const createOvertimeRequest = createAsyncThunk(
  'overtime/create',
  async (data, { rejectWithValue }) => {
    try {
      const response = await overtimeApi.createRequest(data)
      return response.data.data.overtimeRequest
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Request failed')
    }
  }
)

export const reviewOvertimeRequest = createAsyncThunk(
  'overtime/review',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await overtimeApi.reviewRequest(id, data)
      return response.data.data.overtimeRequest
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Review failed')
    }
  }
)

const overtimeSlice = createSlice({
  name: 'overtime',
  initialState: {
    myRequests: [],
    pendingRequests: [],
    allRequests: [],
    loading: false,
    error: null,
    meta: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOvertimeRequests.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchMyOvertimeRequests.fulfilled, (state, action) => {
        state.loading = false
        state.myRequests = action.payload.data
        state.meta = action.payload.meta
      })
      .addCase(fetchMyOvertimeRequests.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    builder
      .addCase(fetchPendingRequests.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPendingRequests.fulfilled, (state, action) => {
        state.loading = false
        state.pendingRequests = action.payload.data
        state.meta = action.payload.meta
      })
      .addCase(fetchPendingRequests.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    builder
      .addCase(createOvertimeRequest.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOvertimeRequest.fulfilled, (state, action) => {
        state.loading = false
        state.myRequests = [action.payload, ...state.myRequests]
      })
      .addCase(createOvertimeRequest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    builder
      .addCase(reviewOvertimeRequest.pending, (state) => {
        state.loading = true
      })
      .addCase(reviewOvertimeRequest.fulfilled, (state, action) => {
        state.loading = false
        state.pendingRequests = state.pendingRequests.filter(
          (r) => r._id !== action.payload._id
        )
      })
      .addCase(reviewOvertimeRequest.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = overtimeSlice.actions
export default overtimeSlice.reducer