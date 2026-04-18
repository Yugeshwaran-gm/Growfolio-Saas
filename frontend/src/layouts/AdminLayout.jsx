import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'

export function AdminLayout({ children }) {
  const adminItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/users', label: 'Users' },
    { path: '/admin/content', label: 'Content' },
    { path: '/admin/analytics', label: 'Analytics' },
    { path: '/admin/settings', label: 'Settings' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar items={adminItems} />
        <main className="flex-1 md:ml-64 pt-4 pb-4 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-slate-900">Admin Panel</h1>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
