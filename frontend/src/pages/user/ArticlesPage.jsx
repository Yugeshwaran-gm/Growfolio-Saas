import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Loading } from '../../components/ui/Loading'
import { ErrorState, EmptyState } from '../../components/ui/States'
import { articleService } from '../../services/articleService'

function getShortDescription(description) {
  if (!description) {
    return 'No description available.'
  }

  if (description.length <= 140) {
    return description
  }

  return `${description.slice(0, 140)}...`
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadArticles = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await articleService.listArticles()
      setArticles(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load articles.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadArticles()
  }, [])

  return (
    <DashboardLayout>
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Articles</h1>
        <p className="mt-2 text-slate-600">Browse and manage your synced articles.</p>
      </section>

      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-10">
          <Loading message="Loading articles..." />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <ErrorState message={error} onRetry={loadArticles} />
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <EmptyState message="No articles found. Connect integrations to fetch articles." />
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <Link
              key={article.id}
              to={`/dashboard/articles/${article.id}`}
              className="group rounded-xl border border-slate-200 bg-white p-5 transition hover:border-primary-300 hover:shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-900 transition group-hover:text-primary-600">
                {article.title}
              </h2>
              <p className="mt-3 text-sm text-slate-600">
                {getShortDescription(article.description)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
