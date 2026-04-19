import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { Alert } from '../../components/ui/States'
import { authService } from '../../services/authService'
import { validatePasswordStrength } from '../../utils/helpers'

export default function SetNewPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const token = searchParams.get('token')

  const handlePasswordChange = (e) => {
    const password = e.target.value
    setFormData({ ...formData, password })

    // Calculate password strength
    const { strength } = validatePasswordStrength(password)
    setPasswordStrength(strength * 25)
  }

  const handleConfirmPasswordChange = (e) => {
    setFormData({ ...formData, confirmPassword: e.target.value })
  }

  const getPasswordStrengthColor = (strength) => {
    if (strength < 25) return 'bg-red-500'
    if (strength < 50) return 'bg-yellow-500'
    if (strength < 75) return 'bg-blue-500'
    return 'bg-green-500'
  }

  const getPasswordStrengthText = (strength) => {
    if (strength < 25) return 'Weak'
    if (strength < 50) return 'Fair'
    if (strength < 75) return 'Good'
    return 'Strong'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validation
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (!token) {
      setError('Invalid reset token. Please request a new password reset.')
      return
    }

    setLoading(true)

    try {
      await authService.resetPassword(token, formData.password)
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-slate-50">
      {/* Header */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-primary-500/10 px-6 md:px-10 py-4 bg-white backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-500 text-white font-bold">
            💼
          </div>
          <h2 className="text-slate-900 text-xl font-bold leading-tight tracking-tight">GrowFolio</h2>
        </Link>

        <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
          <nav className="flex items-center gap-8">
            <a href="#" className="text-slate-600 hover:text-primary-500 transition-colors text-sm font-medium">
              Dashboard
            </a>
            <a href="#" className="text-slate-600 hover:text-primary-500 transition-colors text-sm font-medium">
              Portfolios
            </a>
            <a href="#" className="text-slate-600 hover:text-primary-500 transition-colors text-sm font-medium">
              Market
            </a>
          </nav>
          <div className="w-10 h-10 rounded-full border-2 border-primary-500/20 bg-primary-500/10 flex items-center justify-center overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-primary-500 to-accent-500" />
          </div>
        </div>

        <div className="md:hidden text-slate-900">
          ☰
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6 bg-gradient-to-tr from-slate-50 to-primary-500/5">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl shadow-primary-500/5 border border-primary-500/10 p-8">
          {/* Icon and Title */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-500/10 text-accent-500 mb-4">
              <span className="text-3xl">🔐</span>
            </div>
            <h1 className="text-slate-900 text-3xl font-extrabold tracking-tight mb-2">
              Set New Password
            </h1>
            <p className="text-slate-500 text-base">
              Secure your GrowFolio account with a high-strength password.
            </p>
          </div>

          {error && (
            <Alert type="error" message={error} className="mb-6" />
          )}

          {success && (
            <Alert type="success" message="Password updated successfully! Redirecting to login..." className="mb-6" />
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  New Password
                </label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    value={formData.password}
                    onChange={handlePasswordChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-4 pr-12 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors"
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-3 p-4 bg-primary-500/5 rounded-lg border border-primary-500/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">Password Strength</span>
                    <span className="text-sm font-bold text-accent-500">
                      {getPasswordStrengthText(passwordStrength)}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${getPasswordStrengthColor(passwordStrength)}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <span>✓</span>
                    Contains numbers, symbols, and mixed case.
                  </p>
                </div>
              )}

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700">
                  Confirm New Password
                </label>
                <div className="relative group">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repeat your password"
                    value={formData.confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-3.5 px-4 pr-12 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-500/50 focus:border-accent-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-500 transition-colors"
                  >
                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white font-bold rounded-lg shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>{loading ? 'Updating Password...' : 'Update Password'}</span>
                <span>{loading ? '⏳' : '→'}</span>
              </button>
            </form>
          )}

          {/* Return to Sign In */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary-500 transition-colors">
              <span>←</span>
              <span>Return to Sign In</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-10 flex flex-col md:flex-row justify-between items-center bg-white border-t border-primary-500/5">
        <p className="text-slate-400 text-xs">© 2026 GrowFolio. All rights reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <a href="#" className="text-slate-400 hover:text-primary-500 text-xs transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="text-slate-400 hover:text-primary-500 text-xs transition-colors">
            Terms of Service
          </a>
          <a href="#" className="text-slate-400 hover:text-primary-500 text-xs transition-colors">
            Support
          </a>
        </div>
      </footer>
    </div>
  )
}
