import { useSelector, useDispatch } from 'react-redux'
import { logout, toggleDarkMode } from '../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export const useAuth = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token, isAuthenticated, loading, error, darkMode } = useSelector(
    (state) => state.auth
  )

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode())
  }

  const isEmployee = user?.role === 'employee'
  const isManager = user?.role === 'manager'
  const isAdmin = user?.role === 'admin'
  const isManagerOrAdmin = isManager || isAdmin

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    darkMode,
    handleLogout,
    handleToggleDarkMode,
    isEmployee,
    isManager,
    isAdmin,
    isManagerOrAdmin,
  }
}