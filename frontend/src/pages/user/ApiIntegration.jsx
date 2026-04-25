import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import Button from '../../components/ui/Button'
import IntegrationSetupModal from '../../components/integrations/IntegrationSetupModal'
import { Loading } from '../../components/ui/Loading'
import { Alert, ErrorState, EmptyState } from '../../components/ui/States'
import { integrationService } from '../../services/integrationService'

const navLinks = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Portfolio', path: '/dashboard/projects' },
  { label: 'Analytics', path: '/dashboard/analytics' },
  { label: 'Settings', path: '/dashboard/settings' },
]

const INTEGRATION_DEFINITIONS = [
  { source: 'github', label: 'GitHub' },
  { source: 'gitlab', label: 'GitLab' },
  { source: 'devto', label: 'Dev.to' },
  { source: 'youtube', label: 'YouTube' },
  { source: 'stackexchange', label: 'StackExchange' },
  { source: 'codeforces', label: 'Codeforces' },
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

function getStatusStyles(isConnected) {
  if (isConnected) {
    return 'bg-emerald-50 text-emerald-700 ring-emerald-200'
  }

  return 'bg-slate-100 text-slate-600 ring-slate-200'
}

function capitalizeStatus(status) {
  if (!status) {
    return 'Unknown'
  }

  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

function IntegrationCard({ definition, integration, onOpenSetup, onSync, onDisconnect, actionLoading, refreshLoading }) {
  const sourceKey = definition.source
  const isConnected = Boolean(integration)
  const isSyncing = actionLoading.sync === sourceKey
  const isDisconnecting = actionLoading.disconnect === sourceKey
  const isBusy = isSyncing || isDisconnecting || refreshLoading

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{definition.label}</h2>
          <p className="mt-1 text-sm text-slate-500">Integration status and sync details</p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusStyles(isConnected)}`}
        >
          {isConnected ? 'Connected' : 'Not connected'}
        </span>
      </div>

      <dl className="mt-5 space-y-4 text-sm">
        <div className="flex items-start justify-between gap-4">
          <dt className="text-slate-500">Status</dt>
          <dd className="text-right font-medium text-slate-800">{isConnected ? 'Connected' : 'Not connected'}</dd>
        </div>

        {isConnected ? (
          <div className="flex items-start justify-between gap-4">
            <dt className="text-slate-500">Username</dt>
            <dd className="text-right font-medium text-slate-800">{integration.external_username || 'Not set'}</dd>
          </div>
        ) : null}

        <div className="flex items-start justify-between gap-4">
          <dt className="text-slate-500">Last sync</dt>
          <dd className="text-right font-medium text-slate-800">
            {formatDateTime(integration?.last_sync)}
          </dd>
        </div>

        <div className="flex items-start justify-between gap-4">
          <dt className="text-slate-500">Source</dt>
          <dd className="text-right font-medium text-slate-800">{definition.source}</dd>
        </div>

        <div className="flex items-start justify-between gap-4">
          <dt className="text-slate-500">Sync status</dt>
          <dd className="text-right font-medium text-slate-800">{isConnected ? capitalizeStatus(integration?.sync_status) : 'Not connected'}</dd>
        </div>
      </dl>

      {integration?.error_message ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-semibold">Error</p>
          <p className="mt-1 whitespace-pre-line">{integration.error_message}</p>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap gap-3">
        {isConnected ? (
          <>
            <Button
              variant="secondary"
              size="sm"
              disabled={isBusy}
              onClick={() => onOpenSetup(definition.source)}
            >
              Edit
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={isBusy}
              onClick={() => onSync(definition.source)}
            >
              {isSyncing ? 'Syncing...' : 'Sync'}
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={isBusy}
              onClick={() => onDisconnect(definition.source)}
            >
              {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
            </Button>
          </>
        ) : (
          <Button
            variant="primary"
            size="sm"
            disabled={isBusy}
            onClick={() => onOpenSetup(definition.source)}
          >
            Connect
          </Button>
        )}
      </div>
    </article>
  )
}

export default function ApiIntegration() {
  const [integrations, setIntegrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshLoading, setRefreshLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [actionError, setActionError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [actionLoading, setActionLoading] = useState({ sync: '', disconnect: '' })
  const [activeSource, setActiveSource] = useState('')
  const [isSetupOpen, setIsSetupOpen] = useState(false)

  const loadIntegrations = async (showLoader = true) => {
    if (showLoader) {
      setLoading(true)
    } else {
      setRefreshLoading(true)
    }
    setLoadError('')

    try {
      const data = await integrationService.getIntegrations()
      setIntegrations(data)
    } catch (err) {
      setLoadError(err.response?.data?.error || 'Failed to load integrations.')
    } finally {
      if (showLoader) {
        setLoading(false)
      } else {
        setRefreshLoading(false)
      }
    }
  }

  useEffect(() => {
    loadIntegrations()
  }, [])

  const getIntegrationBySource = (source) => {
    return integrations.find((item) => (item.source_name || '').toLowerCase() === source)
  }

  const activeIntegration = getIntegrationBySource(activeSource)

  const openSetupModal = (source) => {
    setActionError('')
    setActiveSource(source)
    setIsSetupOpen(true)
  }

  const closeSetupModal = () => {
    setIsSetupOpen(false)
  }

  const handleSetupSubmit = async (payload) => {
    setActionError('')
    setSuccessMessage('')

    const definition = INTEGRATION_DEFINITIONS.find((item) => item.source === payload.source_name)
    const existingIntegration = getIntegrationBySource(payload.source_name)
    const actionLabel = existingIntegration ? 'updated' : 'connected'

    try {
      await integrationService.connectIntegration(payload)
      closeSetupModal()
      setSuccessMessage(`${definition?.label || payload.source_name} ${actionLabel} successfully.`)
      await loadIntegrations(false)
    } catch (err) {
      setActionError(err.response?.data?.error || `Failed to connect ${definition?.label || payload.source_name}.`)
    }
  }

  const handleSync = async (sourceName) => {
    const sourceKey = (sourceName || '').toLowerCase()
    setActionLoading((prev) => ({ ...prev, sync: sourceKey }))
    setSuccessMessage('')
    setActionError('')

    try {
      const response = await integrationService.syncIntegration(sourceName)

      if (response?.status !== 'completed') {
        setActionError(response?.error || `Failed to sync ${sourceName}.`)
        return
      }

      const createdCount = Number(response?.created || 0)
      const updatedCount = Number(response?.updated || 0)
      const totalChanged = createdCount + updatedCount

      setSuccessMessage(
        `${sourceName} sync completed. Created ${createdCount}, updated ${updatedCount}, total changes ${totalChanged}.`
      )
      await loadIntegrations(false)
    } catch (err) {
      setActionError(err.response?.data?.error || `Failed to sync ${sourceName}.`)
    } finally {
      setActionLoading((prev) => ({ ...prev, sync: '' }))
    }
  }

  const handleDisconnect = async (sourceName) => {
    const sourceKey = (sourceName || '').toLowerCase()
    setActionLoading((prev) => ({ ...prev, disconnect: sourceKey }))
    setSuccessMessage('')
    setActionError('')

    try {
      await integrationService.disconnectIntegration(sourceName)
      setSuccessMessage(`${sourceName} disconnected successfully.`)
      await loadIntegrations(false)
    } catch (err) {
      setActionError(err.response?.data?.error || `Failed to disconnect ${sourceName}.`)
    } finally {
      setActionLoading((prev) => ({ ...prev, disconnect: '' }))
    }
  }

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
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Integrations</h1>
              <p className="mt-2 text-slate-600">Review your connected sources and their latest sync status.</p>
            </div>
            <Button variant="secondary" onClick={() => loadIntegrations(false)} disabled={refreshLoading}>
              {refreshLoading ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
      </section>

        {successMessage ? <div className="mb-4"><Alert type="success" message={successMessage} /></div> : null}
        {actionError ? <div className="mb-4"><Alert type="error" message={actionError} /></div> : null}

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-10">
          <Loading message="Loading integrations..." />
        </div>
      ) : loadError ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <ErrorState message={loadError} onRetry={loadIntegrations} />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {INTEGRATION_DEFINITIONS.map((definition) => {
            const integration = getIntegrationBySource(definition.source)
            return (
            <IntegrationCard
              key={definition.source}
              definition={definition}
              integration={integration}
              onOpenSetup={openSetupModal}
              onSync={handleSync}
              onDisconnect={handleDisconnect}
              actionLoading={actionLoading}
              refreshLoading={refreshLoading}
            />
            )
          })}
        </div>
      )}

      {!loading && !loadError && integrations.length === 0 ? (
        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
          <EmptyState message="No integrations connected yet. Configure and connect a source to start syncing." />
        </div>
      ) : null}

      <IntegrationSetupModal
        isOpen={isSetupOpen}
        onClose={closeSetupModal}
        sourceName={activeSource}
        initialValues={{
          external_username: activeIntegration?.external_username || '',
        }}
        onSubmit={handleSetupSubmit}
      />
    </DashboardLayout>
  )
}
