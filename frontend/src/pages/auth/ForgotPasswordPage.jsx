import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { Alert } from '../../components/ui/States'
import { authService } from '../../services/authService'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      await authService.requestPasswordReset(email)
      setMessage('Check your email for password reset instructions.')
      setSubmitted(true)
      setEmail('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to request password reset.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 lg:px-20 border-b border-primary-500/10 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center bg-primary-500 rounded-lg text-white font-bold text-lg">
            💼
          </div>
          <h2 className="text-slate-900 text-xl font-extrabold tracking-tight">GrowFolio</h2>
        </Link>
        
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex items-center gap-8">
            <a href="#" className="text-slate-600 hover:text-primary-500 text-sm font-semibold transition-colors">
              Features
            </a>
            <a href="#" className="text-slate-600 hover:text-primary-500 text-sm font-semibold transition-colors">
              Pricing
            </a>
            <a href="#" className="text-slate-600 hover:text-primary-500 text-sm font-semibold transition-colors">
              About
            </a>
          </nav>
          <Link to="/login">
            <button className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-2 rounded-lg text-sm font-bold transition-all shadow-md shadow-primary-500/20">
              Sign In
            </button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          {/* Branding Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary-500/5 flex items-center justify-center text-primary-500 shadow-inner">
              <span className="text-4xl">🔐</span>
            </div>
          </div>

          {/* Card */}
          <Card className="overflow-hidden">
            {/* Gradient Header */}
            <div className="h-32 bg-gradient-to-br from-primary-500 via-primary-500 to-accent-500 relative overflow-hidden">
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-accent-500/30 rounded-full blur-2xl" />
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
            </div>

            {/* Form Content */}
            <div className="p-8 pt-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-extrabold text-primary-500 mb-2">Reset your password</h1>
                <p className="text-slate-500 text-sm leading-relaxed">
                  No worries! Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>
              </div>

              {message && (
                <Alert type="success" message={message} className="mb-6" />
              )}

              {error && (
                <Alert type="error" message={error} className="mb-6" />
              )}

              {!submitted ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-slate-400 group-focus-within:text-accent-500 transition-colors text-lg">
                          ✉️
                        </span>
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="e.g. alex@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="block w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white py-4 rounded-lg font-bold text-base transition-all transform active:scale-98 shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 group"
                  >
                    <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </form>
              ) : (
                <div className="text-center py-4">
                  <p className="text-green-600 text-sm font-medium mb-4">✓ Reset link sent successfully!</p>
                  <p className="text-slate-600 text-sm mb-6">Check your email for further instructions.</p>
                </div>
              )}

              <div className="mt-8 text-center">
                <Link to="/login" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary-500 transition-colors">
                  <span>←</span>
                  <span>Back to Login</span>
                </Link>
              </div>
            </div>
          </Card>

          {/* Footer Help */}
          <p className="mt-8 text-center text-slate-400 text-sm">
            Need more help?{' '}
            <a href="#" className="text-primary-500 font-semibold hover:underline">
              Contact Support
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 text-center border-t border-primary-500/5">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-6">
            <a href="#" className="text-xs text-slate-400 hover:text-primary-500 font-medium transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-slate-400 hover:text-primary-500 font-medium transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-slate-400 hover:text-primary-500 font-medium transition-colors">
              Security
            </a>
          </div>
          <p className="text-xs text-slate-400">© 2026 GrowFolio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
