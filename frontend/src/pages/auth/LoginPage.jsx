import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthLayout } from '../../layouts/AuthLayout'
import { Alert } from '../../components/ui/States'
import { authService } from '../../services/authService'
import { profileService } from '../../services/profileService'
import { useAuth } from '../../hooks/useAuth'

function BrandMark() {
  return (
    <svg className="h-7 w-7" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
        fill="currentColor"
      />
      <path
        d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </svg>
  )
}

function IconMail() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M4 6H20V18H4V6Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M4 7L12 13L20 7" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function IconLock() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 11V8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8V11" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function IconArrow() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M5 12H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconEye({ visible }) {
  if (visible) {
    return (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M2 12C3.9 8.5 7.4 6 12 6C16.6 6 20.1 8.5 22 12C20.1 15.5 16.6 18 12 18C7.4 18 3.9 15.5 2 12Z" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    )
  }

  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M10.8 6.2C11.2 6.1 11.6 6 12 6C16.6 6 20.1 8.5 22 12C21.1 13.7 19.9 15.1 18.4 16.2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M14.7 14.9C14 15.6 13.1 16 12 16C9.8 16 8 14.2 8 12C8 10.9 8.4 10 9.1 9.3" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6.1 7.6C4.4 8.7 3 10.2 2 12C3.9 15.5 7.4 18 12 18C12.8 18 13.6 17.9 14.3 17.7" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

function SocialButton({ children, onClick, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className="flex items-center justify-center gap-2 rounded-lg border-2 border-primary-500/10 px-4 py-3 text-sm font-semibold text-primary-500 transition-all hover:border-primary-500/30 hover:bg-primary-500/5"
    >
      {children}
    </button>
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.login({ email, password })
      login({ email }, response.access, response.refresh)

      try {
        const profile = await profileService.getProfile()
        login({ email, ...profile }, response.access, response.refresh)
      } catch (profileError) {
        console.warn('Logged in without profile hydration:', profileError)
      }

      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="relative w-full max-w-[440px]">
        <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-accent-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-primary-500/25 blur-3xl" />

        <div className="relative overflow-hidden rounded-xl border border-primary-500/10 bg-white shadow-2xl shadow-primary-500/20">
          <div className="p-6 sm:p-8 md:p-10">
            <div className="mb-8 flex items-center justify-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-500 text-accent-500">
                <BrandMark />
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-primary-500">GrowFolio</h1>
            </div>

            <h2 className="mb-1 text-center text-xl font-bold text-slate-900">Welcome Back</h2>
            <p className="mb-8 text-center text-sm text-slate-500">
              Enter your credentials to access your global portfolio.
            </p>

            {error && <Alert type="error" message={error} className="mb-4" />}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="ml-1 text-sm font-semibold text-primary-500">
                  Email Address
                </label>
                <div className="group relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-accent-500">
                    <IconMail />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 placeholder:text-slate-400 transition-all focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="ml-1 flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-semibold text-primary-500">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-xs font-bold text-primary-500 transition-colors hover:text-accent-600">
                    Forgot Password?
                  </Link>
                </div>

                <div className="group relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-accent-500">
                    <IconLock />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-12 placeholder:text-slate-400 transition-all focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-primary-500"
                  >
                    <IconEye visible={showPassword} />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-primary-500 py-4 font-bold text-white shadow-lg shadow-primary-500/25 transition-all hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && (
                  <span className="transition-transform group-hover:translate-x-1">
                    <IconArrow />
                  </span>
                )}
              </button>
            </form>

            <div className="my-8 flex items-center">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="px-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <SocialButton>
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#fbbc05] text-[11px] font-bold text-slate-900">
                  G
                </span>
                Google
              </SocialButton>

              <SocialButton>
                <svg className="h-4 w-4 fill-primary-500" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
                GitHub
              </SocialButton>
            </div>

            <p className="mt-10 text-center text-sm font-medium text-slate-500">
              New to GrowFolio?{' '}
              <Link
                to="/register"
                className="font-bold text-primary-500 underline decoration-accent-500 decoration-2 underline-offset-4 transition-colors hover:text-accent-600"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthLayout>
  )
}
