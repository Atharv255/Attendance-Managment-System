import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import attendanceReducer from '../features/attendance/attendanceSlice'
import overtimeReducer from '../features/overtime/overtimeSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    attendance: attendanceReducer,
    overtime: overtimeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['auth/loginSuccess', 'attendance/setPunchPhoto'],
        ignoredPaths: ['attendance.capturedPhoto'],
      },
    }),
})

export default store