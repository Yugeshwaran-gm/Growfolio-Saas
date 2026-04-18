import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function Header() {
  const { user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <nav className="container-custom h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-bold text-primary-500">
            GrowFolio
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user && (
            <>
              <span className="text-slate-700">{user.email}</span>
              <button
                onClick={() => {
                  logout()
                  window.location.href = '/login'
                }}
                className="px-4 py-2 text-accent-500 hover:text-accent-600 font-medium"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {isMenuOpen && (
          <div className="absolute top-16 right-0 bg-white shadow-lg rounded-lg p-4 md:hidden">
            {user && (
              <>
                <p className="text-slate-700 mb-3">{user.email}</p>
                <button
                  onClick={() => {
                    logout()
                    window.location.href = '/login'
                  }}
                  className="w-full text-left px-4 py-2 text-accent-500 hover:bg-slate-100 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}
