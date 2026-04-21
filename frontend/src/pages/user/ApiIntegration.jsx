import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Loading } from '../../components/ui/Loading'
import { ErrorState, EmptyState } from '../../components/ui/States'
import { integrationService } from '../../services/integrationService'

const navLinks = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Portfolio', path: '/dashboard/projects' },
  { label: 'Analytics', path: '/dashboard/analytics' },
  { label: 'Settings', path: '/dashboard/settings' },
]

function formatDateTime(value) {
  if (!value) {
    return 'Not synced yet'
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return 'Not synced yet'
  }

  return parsed.toLocaleString()
}

function getStatusStyles(status) {
  const normalizedStatus = (status || '').toLowerCase()

  if (normalizedStatus === 'connected') {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
  }

  if (normalizedStatus === 'pending') {
    return 'bg-amber-50 text-amber-700 ring-amber-200'
  }

  if (normalizedStatus === 'failed') {
    return 'bg-red-50 text-red-700 ring-red-200'
  }

  return 'bg-slate-100 text-slate-600 ring-slate-200'
}

function capitalizeStatus(status) {
  if (!status) {
    return 'Unknown'
  }

  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

function IntegrationCard({ integration }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{integration.source_name}</h2>
          <p className="mt-1 text-sm text-slate-500">Integration status and sync details</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusStyles(integration.sync_status)}`}
        >
          {capitalizeStatus(integration.sync_status)}
        </span>
      </div>

      <dl className="mt-5 space-y-4 text-sm">
        <div className="flex items-start justify-between gap-4">
          <dt className="text-slate-500">Last sync</dt>
          <dd className="text-right font-medium text-slate-800">
            {formatDateTime(integration.last_sync)}
          </dd>
        </div>

        <div className="flex items-start justify-between gap-4">
          <dt className="text-slate-500">Source</dt>
          <dd className="text-right font-medium text-slate-800">{integration.source_name}</dd>
        </div>
      </dl>

      {integration.error_message ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-semibold">Error</p>
          <p className="mt-1 whitespace-pre-line">{integration.error_message}</p>
        </div>
      ) : null}
    </article>
  )
}

export default function ApiIntegration() {
  const [integrations, setIntegrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadIntegrations = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await integrationService.getIntegrations()
      setIntegrations(data)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load integrations.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadIntegrations()
  }, [])

  return (
    <DashboardLayout>
      <section className="mb-8">
        <div className="mb-4 flex flex-wrap items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-plum-700 dark:text-slate-300 dark:hover:text-amber-400"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Integrations</h1>
        <p className="mt-2 text-slate-600">Review your connected sources and their latest sync status.</p>
      </section>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10">
          <Loading message="Loading integrations..." />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <ErrorState message={error} onRetry={loadIntegrations} />
        </div>
      ) : integrations.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <EmptyState message="No integrations connected yet." />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {integrations.map((integration) => (
            <IntegrationCard key={integration.id} integration={integration} />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
