import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import clsx from 'clsx'

export function Sidebar({ items = [] }) {
  const [isOpen, setIsOpen] = useState(true)
  const location = useLocation()

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 md:hidden p-2 bg-primary-500 text-white rounded-lg z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <aside
        className={clsx(
          'fixed left-0 top-0 h-screen bg-slate-900 text-white transition-all duration-300 z-40 pt-20',
          isOpen ? 'w-64' : 'w-0 overflow-hidden'
        )}
      >
        <nav className="p-4 space-y-2">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={clsx(
                'block px-4 py-2 rounded-lg transition-colors',
                location.pathname === item.path
                  ? 'bg-primary-500 text-white'
                  : 'text-slate-300 hover:bg-slate-800'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
