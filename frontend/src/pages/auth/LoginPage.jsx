import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi'
import toast from 'react-hot-toast'
import { loginUser, clearError } from '../../features/auth/authSlice'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm()

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
    return () => dispatch(clearError())
  }, [isAuthenticated, navigate, dispatch])

  const onSubmit = async (data) => {
    const result = await dispatch(loginUser(data))
    if (loginUser.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.user.name}!`)
      navigate('/dashboard')
    }
  }

  const fillDemo = (role) => {
    const demos = {
      admin: { email: 'admin@test.com', password: 'Admin123' },
      manager: { email: 'manager@test.com', password: 'Manager123' },
      employee: { email: 'employee@test.com', password: 'Employee123' },
    }
    setValue('email', demos[role].email)
    setValue('password', demos[role].password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            AttendEase
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Attendance Management System
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Welcome back
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Sign in to your account
          </p>

          {error && <Alert type="error" message={error} className="mb-4" />}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              icon={HiMail}
              placeholder="you@example.com"
              error={errors.email?.message}
              required
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                  message: 'Invalid email address',
                },
              })}
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={HiLockClosed}
              rightIcon={showPassword ? HiEyeOff : HiEye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              placeholder="••••••••"
              error={errors.password?.message}
              required
              {...register('password', {
                required: 'Password is required',
              })}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              size="lg"
              loading={loading}
            >
              Sign In
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mb-3">
              Demo credentials
            </p>
            <div className="flex gap-2">
              {['admin', 'manager', 'employee'].map((role) => (
                <button
                  key={role}
                  onClick={() => fillDemo(role)}
                  className="flex-1 text-xs py-2 px-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 capitalize transition-colors"
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage