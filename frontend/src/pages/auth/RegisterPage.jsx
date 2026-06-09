import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { HiMail, HiLockClosed, HiUser, HiEye, HiEyeOff, HiOfficeBuilding } from 'react-icons/hi'
import toast from 'react-hot-toast'
import { registerUser, clearError } from '../../features/auth/authSlice'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Alert from '../../components/common/Alert'

const RegisterPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { role: 'employee' } })

  useEffect(() => {
    if (isAuthenticated) navigate('/dashboard')
    return () => dispatch(clearError())
  }, [isAuthenticated, navigate, dispatch])

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data))
    if (registerUser.fulfilled.match(result)) {
      toast.success('Account created successfully!')
      navigate('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            AttendEase
          </h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Join the attendance management system
          </p>

          {error && <Alert type="error" message={error} className="mb-4" />}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              icon={HiUser}
              placeholder="John Doe"
              error={errors.name?.message}
              required
              {...register('name', {
                required: 'Name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
              })}
            />

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
              label="Department"
              type="text"
              icon={HiOfficeBuilding}
              placeholder="Engineering"
              error={errors.department?.message}
              {...register('department')}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                {...register('role', { required: 'Role is required' })}
                className="input-field"
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role && (
                <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>
              )}
            </div>

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={HiLockClosed}
              rightIcon={showPassword ? HiEyeOff : HiEye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              placeholder="Min. 6 characters"
              error={errors.password?.message}
              required
              helperText="Must contain uppercase, lowercase, and number"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Must contain uppercase, lowercase, and number',
                },
              })}
            />

            <Button type="submit" variant="primary" fullWidth size="lg" loading={loading}>
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage