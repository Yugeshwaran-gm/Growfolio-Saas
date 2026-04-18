import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'

export function DashboardLayout({ children }) {
  const dashboardItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/dashboard/projects', label: 'Projects' },
    { path: '/dashboard/skills', label: 'Skills' },
    { path: '/dashboard/articles', label: 'Articles' },
    { path: '/dashboard/profile', label: 'Profile' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar items={dashboardItems} />
        <main className="flex-1 md:ml-64 pt-4 pb-4 px-4">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
