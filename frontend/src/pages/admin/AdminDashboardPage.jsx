import { useEffect, useMemo, useState } from 'react'
import { AdminLayout } from '../../layouts/AdminLayout'
import { Loading } from '../../components/ui/Loading'
import { ErrorState, EmptyState } from '../../components/ui/States'
import { adminService } from '../../services/adminService'

function StatCard({ label, value }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <h3 className="mt-2 text-3xl font-bold text-slate-900">{value.toLocaleString()}</h3>
    </article>
  )
}

function getDisplayName(user) {
  const email = user?.email || ''
  if (!email.includes('@')) {
    return 'Unknown User'
  }
  return email.split('@')[0]
}

export default function AdminDashboardPage() {
  const [dashboard, setDashboard] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAdminData = async () => {
    setLoading(true)
    setError('')

    try {
      const [dashboardData, usersData] = await Promise.all([
        adminService.getDashboard(),
        adminService.listUsers(),
      ])

      setDashboard(dashboardData || null)
      setUsers(Array.isArray(usersData) ? usersData : [])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load admin dashboard data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAdminData()
  }, [])

  const stats = useMemo(() => {
    return [
      { label: 'Total Users', value: Number(dashboard?.total_users || 0) },
      { label: 'Active Users (7 Days)', value: Number(dashboard?.active_users_last_7_days || 0) },
      { label: 'Total Projects', value: Number(dashboard?.total_projects || 0) },
      { label: 'Total Profile Views', value: Number(dashboard?.total_profile_views || 0) },
    ]
  }, [dashboard])

  const recentUsers = useMemo(() => users.slice(0, 5), [users])

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header>
          <h2 className="text-2xl font-bold text-slate-900">Platform Overview</h2>
          <p className="mt-1 text-sm text-slate-500">Live metrics from the admin backend.</p>
        </header>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10">
            <Loading message="Loading admin dashboard..." />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <ErrorState message={error} onRetry={loadAdminData} />
          </div>
        ) : !dashboard && users.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <EmptyState message="No admin dashboard data available." />
          </div>
        ) : (
          <>
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </section>

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="text-lg font-semibold text-slate-900">Recent Users</h3>
              </div>

              {recentUsers.length === 0 ? (
                <div className="p-6">
                  <EmptyState message="No users found." />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-6 py-3 font-semibold">User</th>
                        <th className="px-6 py-3 font-semibold">Email</th>
                        <th className="px-6 py-3 font-semibold">Account Type</th>
                        <th className="px-6 py-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-medium text-slate-900">{getDisplayName(user)}</td>
                          <td className="px-6 py-4 text-slate-600">{user.email || '-'}</td>
                          <td className="px-6 py-4 text-slate-600">
                            {user.is_recruiter ? 'Recruiter' : user.is_creator ? 'Creator' : 'User'}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                                user.is_active
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
