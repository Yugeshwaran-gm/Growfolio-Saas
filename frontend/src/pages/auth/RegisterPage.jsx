import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthLayout } from '../../layouts/AuthLayout'
import { Alert } from '../../components/ui/States'
import { authService } from '../../services/authService'

const roleOptions = [
  { value: 'developer', label: 'Developer', icon: 'code' },
  { value: 'writer', label: 'Writer', icon: 'edit_note' },
  { value: 'creator', label: 'Creator', icon: 'palette' },
  { value: 'researcher', label: 'Researcher', icon: 'science' },
]

function RoleOption({ value, label, icon, selectedRole, onSelect }) {
  const isSelected = selectedRole === value

  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`group rounded-xl border p-4 text-center transition-all duration-200 ${
        isSelected
          ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
          : 'border-slate-200 bg-white hover:border-primary-500/40 hover:bg-primary-50/40'
      }`}
      aria-pressed={isSelected}
    >
      <span
        className={`mb-2 block text-2xl leading-none transition-colors ${
          isSelected ? 'text-primary-500' : 'text-slate-400 group-hover:text-primary-500'
        }`}
      >
        {icon}
      </span>
      <span
        className={`text-sm font-semibold ${
          isSelected ? 'text-primary-500' : 'text-slate-700'
        }`}
      >
        {label}
      </span>
    </button>
  )
}

function SocialButton({ children }) {
  return (
    <button
      type="button"
      className="flex h-12 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 transition-all hover:border-primary-500/30 hover:bg-primary-50/30"
    >
      {children}
    </button>
  )
}

function ArrowIcon() {
  return (
    <svg className="h-4 w-4 text-accent-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M5 12H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 10V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="7" r="1" fill="currentColor" />
    </svg>
  )
}

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    role: 'developer',
    username: '',
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    setLoading(true)

    try {
      const username = formData.username.trim() || formData.email.split('@')[0]

      await authService.register({
        email: formData.email,
        username,
        password: formData.password,
      })

      setSuccess('Account created successfully. Redirecting to login...')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="relative w-full max-w-[540px]">
        <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-primary-500/20 blur-3xl" />

        <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_8px_30px_rgb(59,30,84,0.08)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500/10 text-2xl text-primary-500">
                <span aria-hidden="true">◔</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-primary-500">GrowFolio</span>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              <span className="text-sm text-slate-500">Already a member?</span>
              <Link to="/login" className="text-sm font-semibold text-primary-500 transition-colors hover:text-primary-600">
                Sign In
              </Link>
            </div>
          </div>

          <div className="px-6 pb-4 pt-8 text-center sm:px-8 sm:pt-10">
            <h1 className="mb-3 text-2xl font-extrabold text-primary-500 sm:text-3xl">
              Claim your professional space
            </h1>
            <p className="text-base text-slate-500">
              Select your primary craft to get started with GrowFolio.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6 px-6 pb-8 sm:px-8 sm:pb-10">
            {error && <Alert type="error" message={error} />}
            {success && <Alert type="success" message={success} />}

            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((role) => (
                <RoleOption
                  key={role.value}
                  value={role.value}
                  label={role.label}
                  icon={role.icon}
                  selectedRole={formData.role}
                  onSelect={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                />
              ))}
            </div>

            <div className="space-y-4 pt-1">
              <div className="space-y-1.5">
                <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="alexsterling"
                  value={formData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-400 transition-all focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent-500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@work-email.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-400 transition-all focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent-500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-900 placeholder:text-slate-400 transition-all focus:border-accent-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-accent-500"
                />
                <p className="flex items-center gap-1 pt-1 text-xs text-slate-500">
                  <InfoIcon />
                  Must be at least 8 characters long.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary-500 font-bold text-white shadow-md shadow-primary-500/20 transition-all hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Creating account...' : 'Create Account'}
              {!loading && (
                <span className="transition-transform group-hover:translate-x-1">
                  <ArrowIcon />
                </span>
              )}
            </button>

            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-xs font-medium uppercase tracking-wider text-slate-500">
                  Or register with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <SocialButton>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                </svg>
                Google
              </SocialButton>

              <SocialButton>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </SocialButton>
            </div>
          </form>

          <div className="border-t border-slate-100 bg-primary-50/50 px-6 py-5 text-center sm:px-8">
            <p className="text-sm text-slate-500">
              By clicking "Create Account", you agree to our{' '}
              <a href="#" className="font-medium text-primary-500 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-primary-500 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>

          <div className="px-6 pb-6 text-center sm:hidden">
            <p className="text-sm text-slate-500">
              Already a member?{' '}
              <Link to="/login" className="font-semibold text-primary-500 hover:text-primary-600">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
