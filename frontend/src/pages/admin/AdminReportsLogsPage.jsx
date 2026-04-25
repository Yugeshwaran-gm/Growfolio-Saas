import { useEffect, useMemo, useState } from 'react'
import { AdminLayout } from '../../layouts/AdminLayout'
import { Loading } from '../../components/ui/Loading'
import { ErrorState, EmptyState } from '../../components/ui/States'
import { adminService } from '../../services/adminService'

function KPICard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-3xl">{icon}</div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-tight text-slate-500">{label}</p>
        <p className="text-3xl font-black text-accent">{value.toLocaleString()}</p>
      </div>
    </div>
  )
}

function StatusBadge({ active }) {
  if (active) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/20 px-3 py-1 text-xs font-bold text-primary">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent"></span>
        ACTIVE
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
      INACTIVE
    </span>
  )
}

function resolveRole(user) {
  if (user.is_recruiter) {
    return 'Recruiter'
  }
  if (user.is_creator) {
    return 'Creator'
  }
  return 'User'
}

function getDisplayName(user) {
  const email = user?.email || ''
  if (!email.includes('@')) {
    return 'Unknown User'
  }
  return email.split('@')[0]
}

export default function AdminReportsLogsPage() {
  const [dashboard, setDashboard] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadData = async () => {
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
      setError(err.response?.data?.error || 'Failed to load governance data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const inactiveUsers = useMemo(() => users.filter((user) => !user.is_active), [users])
  const activeUsers = useMemo(() => users.filter((user) => user.is_active), [users])

  const kpis = useMemo(
    () => [
      { icon: '👥', label: 'Total Users', value: Number(dashboard?.total_users || 0) },
      {
        icon: '✅',
        label: 'Active Users (7 Days)',
        value: Number(dashboard?.active_users_last_7_days || 0),
      },
      { icon: '🚫', label: 'Inactive Users', value: inactiveUsers.length },
    ],
    [dashboard, inactiveUsers.length]
  )

  const operationalLogs = useMemo(
    () => [
      {
        timestamp: new Date().toLocaleString(),
        level: 'INFO',
        message: `Total projects in platform: ${Number(dashboard?.total_projects || 0)}`,
      },
      {
        timestamp: new Date().toLocaleString(),
        level: 'INFO',
        message: `Total profile views tracked: ${Number(dashboard?.total_profile_views || 0)}`,
      },
      {
        timestamp: new Date().toLocaleString(),
        level: inactiveUsers.length > 0 ? 'WARN' : 'INFO',
        message:
          inactiveUsers.length > 0
            ? `${inactiveUsers.length} inactive user account(s) detected.`
            : 'No inactive user accounts detected.',
      },
    ],
    [dashboard, inactiveUsers.length]
  )

  return (
    <AdminLayout>
      <div className="flex h-full flex-col overflow-y-auto bg-slate-50">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8">
          <h2 className="text-xl font-bold text-primary">Governance Oversight</h2>
          <span className="text-sm font-medium text-slate-500">Live admin backend data</span>
        </header>

        <div className="space-y-8 p-8">
          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10">
              <Loading message="Loading governance data..." />
            </div>
          ) : error ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <ErrorState message={error} onRetry={loadData} />
            </div>
          ) : !dashboard && users.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <EmptyState message="No governance data available." />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {kpis.map((kpi) => (
                  <KPICard key={kpi.label} icon={kpi.icon} label={kpi.label} value={kpi.value} />
                ))}
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h3 className="text-lg font-semibold text-slate-900">Inactive Accounts Review Queue</h3>
                </div>

                {inactiveUsers.length === 0 ? (
                  <div className="p-6">
                    <EmptyState message="No inactive accounts to review." />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                      <thead>
                        <tr className="bg-slate-50/50">
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">User</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Email</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Role</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {inactiveUsers.map((user) => (
                          <tr key={user.id} className="transition-colors hover:bg-slate-50/50">
                            <td className="px-6 py-4 text-sm font-medium text-slate-900">{getDisplayName(user)}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{user.email || '-'}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{resolveRole(user)}</td>
                            <td className="px-6 py-4">
                              <StatusBadge active={user.is_active} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="flex h-96 flex-col overflow-hidden rounded-xl border border-primary bg-primary shadow-2xl">
                <div className="flex shrink-0 items-center justify-between border-b border-white/10 bg-white/5 px-6 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">💻</span>
                    <span className="text-sm font-bold uppercase tracking-wide text-white">Operational Snapshot Logs</span>
                  </div>
                  <span className="text-xs text-white/70">Active users loaded: {activeUsers.length}</span>
                </div>

                <div className="flex-1 space-y-2 overflow-y-auto bg-[#1A0D26] p-6 font-mono text-sm">
                  {operationalLogs.map((log, index) => (
                    <div key={index} className="flex gap-4">
                      <span className="shrink-0 text-white/30">{log.timestamp}</span>
                      <span className={`shrink-0 font-bold ${log.level === 'WARN' ? 'text-accent' : 'text-green-400'}`}>
                        [{log.level}]
                      </span>
                      <span className="text-white/80">{log.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
