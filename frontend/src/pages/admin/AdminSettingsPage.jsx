import { useEffect, useMemo, useState } from 'react'
import { AdminLayout } from '../../layouts/AdminLayout'
import { Loading } from '../../components/ui/Loading'
import { ErrorState, EmptyState } from '../../components/ui/States'
import { adminService } from '../../services/adminService'

function StatCard({ label, value }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <h3 className="mt-2 text-3xl font-bold text-slate-900">{String(value)}</h3>
    </article>
  )
}

export default function AdminSettingsPage() {
  const [settingsData, setSettingsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadSettings = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await adminService.getSettingsOverview()
      setSettingsData(data || null)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load system overview.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  const userSummary = useMemo(
    () => [
      { label: 'Admin Accounts', value: settingsData?.user_summary?.admins || 0 },
      { label: 'Creator Accounts', value: settingsData?.user_summary?.creators || 0 },
      { label: 'Recruiter Accounts', value: settingsData?.user_summary?.recruiters || 0 },
      { label: 'Inactive Accounts', value: settingsData?.user_summary?.inactive || 0 },
    ],
    [settingsData]
  )

  const integrationSummary = useMemo(
    () => [
      { label: 'Total Integrations', value: settingsData?.integration_summary?.total || 0 },
      { label: 'Connected', value: settingsData?.integration_summary?.connected || 0 },
      { label: 'Pending', value: settingsData?.integration_summary?.pending || 0 },
      { label: 'Failed', value: settingsData?.integration_summary?.failed || 0 },
    ],
    [settingsData]
  )

  const system = settingsData?.system || {}

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header>
          <h2 className="text-2xl font-bold text-slate-900">System Overview</h2>
          <p className="mt-1 text-sm text-slate-500">Platform monitoring dashboard with account types, integration status, and system configuration.</p>
        </header>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10">
            <Loading message="Loading system overview..." />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <ErrorState message={error} onRetry={loadSettings} />
          </div>
        ) : !settingsData ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <EmptyState message="No system overview data available." />
          </div>
        ) : (
          <>
            <section>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">User Summary</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {userSummary.map((item) => (
                  <StatCard key={item.label} label={item.label} value={Number(item.value || 0).toLocaleString()} />
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Integration Summary</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {integrationSummary.map((item) => (
                  <StatCard key={item.label} label={item.label} value={Number(item.value || 0).toLocaleString()} />
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="text-lg font-semibold text-slate-900">System Configuration</h3>
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
                <StatCard label="Debug Mode" value={system.debug ? 'Enabled' : 'Disabled'} />
                <StatCard label="Timezone" value={system.timezone || '-'} />
                <StatCard label="Language" value={system.language_code || '-'} />
                <StatCard label="Media URL" value={system.media_url || '-'} />
                <StatCard label="Allowed Hosts" value={Number(system.allowed_hosts_count || 0).toLocaleString()} />
                <StatCard label="Installed Apps" value={Number(system.installed_apps_count || 0).toLocaleString()} />
                <StatCard label="Unread Notifications" value={Number(settingsData?.notification_summary?.unread || 0).toLocaleString()} />
                <StatCard label="Total Notifications" value={Number(settingsData?.notification_summary?.total || 0).toLocaleString()} />
              </div>
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
