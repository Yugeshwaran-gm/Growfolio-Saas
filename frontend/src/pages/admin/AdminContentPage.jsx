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

export default function AdminContentPage() {
  const [contentData, setContentData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadContent = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await adminService.getContentOverview()
      setContentData(data || null)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load content overview.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContent()
  }, [])

  const stats = useMemo(
    () => [
      { label: 'Total Articles', value: contentData?.totals?.articles || 0 },
      { label: 'Total Projects', value: contentData?.totals?.projects || 0 },
      { label: 'Total Skills', value: contentData?.totals?.skills || 0 },
      { label: 'Connected Integrations', value: contentData?.totals?.integrations || 0 },
    ],
    [contentData]
  )

  const latestArticles = contentData?.latest_articles || []
  const latestProjects = contentData?.latest_projects || []

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header>
          <h2 className="text-2xl font-bold text-slate-900">Content Overview</h2>
          <p className="mt-1 text-sm text-slate-500">Live content data from admin APIs.</p>
        </header>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10">
            <Loading message="Loading content overview..." />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <ErrorState message={error} onRetry={loadContent} />
          </div>
        ) : !contentData ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <EmptyState message="No content overview data available." />
          </div>
        ) : (
          <>
            <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <StatCard key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </section>

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h3 className="text-lg font-semibold text-slate-900">Latest Articles</h3>
                </div>
                {latestArticles.length === 0 ? (
                  <div className="p-6">
                    <EmptyState message="No articles found." />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-6 py-3 font-semibold">Title</th>
                          <th className="px-6 py-3 font-semibold">Source</th>
                          <th className="px-6 py-3 font-semibold">Owner</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {latestArticles.map((article) => (
                          <tr key={article.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">{article.title}</td>
                            <td className="px-6 py-4 text-slate-600">{article.source || '-'}</td>
                            <td className="px-6 py-4 text-slate-600">{article.user__email || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-6 py-4">
                  <h3 className="text-lg font-semibold text-slate-900">Latest Projects</h3>
                </div>
                {latestProjects.length === 0 ? (
                  <div className="p-6">
                    <EmptyState message="No projects found." />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-6 py-3 font-semibold">Title</th>
                          <th className="px-6 py-3 font-semibold">Owner</th>
                          <th className="px-6 py-3 font-semibold">Visibility</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {latestProjects.map((project) => (
                          <tr key={project.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4 font-medium text-slate-900">{project.title}</td>
                            <td className="px-6 py-4 text-slate-600">{project.user__email || '-'}</td>
                            <td className="px-6 py-4 text-slate-600">{project.is_visible ? 'Visible' : 'Hidden'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
