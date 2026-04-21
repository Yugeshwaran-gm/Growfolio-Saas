import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Loading } from '../../components/ui/Loading'
import { ErrorState, EmptyState } from '../../components/ui/States'
import { articleService } from '../../services/articleService'

function formatDate(dateValue) {
  if (!dateValue) {
    return 'N/A'
  }

  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) {
    return 'N/A'
  }

  return parsed.toLocaleDateString()
}

export default function ArticleDetailPage() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadArticle = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await articleService.getArticle(id)
      setArticle(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load article.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadArticle()
    }
  }, [id])

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between gap-3">
        <Link
          to="/dashboard/articles"
          className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Back to Articles
        </Link>
      </div>

      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-10">
          <Loading message="Loading article..." />
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <ErrorState message={error} onRetry={loadArticle} />
        </div>
      )}

      {!loading && !error && !article && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <EmptyState message="Article not found." />
        </div>
      )}

      {!loading && !error && article && (
        <article className="rounded-xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-bold text-slate-900">{article.title}</h1>
          <p className="mt-2 text-sm text-slate-500">
            Source: {article.source || 'N/A'} • Published: {formatDate(article.published_at)}
          </p>

          <p className="mt-5 whitespace-pre-line text-slate-700">
            {article.description || 'No description available.'}
          </p>

          {article.url && (
            <a
              href={article.url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-600"
            >
              Open Original Article
            </a>
          )}
        </article>
      )}
    </DashboardLayout>
  )
}
