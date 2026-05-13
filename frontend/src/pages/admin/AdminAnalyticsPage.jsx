import { useEffect, useMemo, useState } from 'react'
import { AdminLayout } from '../../layouts/AdminLayout'
import { Loading } from '../../components/ui/Loading'
import { ErrorState, EmptyState } from '../../components/ui/States'
import { adminService } from '../../services/adminService'

function StatCard({ label, value }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <h3 className="mt-2 text-3xl font-bold text-slate-900">{Number(value || 0).toLocaleString()}</h3>
    </article>
  )
}

export default function AdminAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadAnalytics = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await adminService.getAnalyticsOverview()
      setAnalyticsData(data || null)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load analytics overview.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [])

  const totalStats = useMemo(
    () => [
      { label: 'Total Users', value: analyticsData?.totals?.users || 0 },
      { label: 'Total Projects', value: analyticsData?.totals?.projects || 0 },
      { label: 'Profile Views', value: analyticsData?.totals?.profile_views || 0 },
      { label: 'Project Views', value: analyticsData?.totals?.project_views || 0 },
      { label: 'Article Views', value: analyticsData?.totals?.article_views || 0 },
    ],
    [analyticsData]
  )

  const weeklyStats = useMemo(
    () => [
      { label: 'New Users (7 days)', value: analyticsData?.last_7_days?.new_users || 0 },
      { label: 'New Projects (7 days)', value: analyticsData?.last_7_days?.new_projects || 0 },
      { label: 'Profile Views (7 days)', value: analyticsData?.last_7_days?.profile_views || 0 },
      { label: 'Project Views (7 days)', value: analyticsData?.last_7_days?.project_views || 0 },
      { label: 'Article Views (7 days)', value: analyticsData?.last_7_days?.article_views || 0 },
    ],
    [analyticsData]
  )

  const topProjects = analyticsData?.top_viewed_projects || []

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header>
          <h2 className="text-2xl font-bold text-slate-900">Platform Analytics</h2>
          <p className="mt-1 text-sm text-slate-500">Live admin analytics from backend APIs.</p>
        </header>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10">
            <Loading message="Loading analytics overview..." />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <ErrorState message={error} onRetry={loadAnalytics} />
          </div>
        ) : !analyticsData ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <EmptyState message="No analytics data available." />
          </div>
        ) : (
          <>
            <section>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Totals</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                {totalStats.map((stat) => (
                  <StatCard key={stat.label} label={stat.label} value={stat.value} />
                ))}
              </div>
            </section>

            <section>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Last 7 Days</h3>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
                {weeklyStats.map((stat) => (
                  <StatCard key={stat.label} label={stat.label} value={stat.value} />
                ))}
              </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-6 py-4">
                <h3 className="text-lg font-semibold text-slate-900">Top Viewed Projects</h3>
              </div>

              {topProjects.length === 0 ? (
                <div className="p-6">
                  <EmptyState message="No project view data yet." />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Project</th>
                        <th className="px-6 py-3 font-semibold">Owner</th>
                        <th className="px-6 py-3 font-semibold">Views</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {topProjects.map((project) => (
                        <tr key={project.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-medium text-slate-900">{project.title}</td>
                          <td className="px-6 py-4 text-slate-600">{project.user__email || '-'}</td>
                          <td className="px-6 py-4 text-slate-600">{Number(project.view_count || 0).toLocaleString()}</td>
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
