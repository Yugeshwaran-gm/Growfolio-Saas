import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Card, CardHeader, CardBody, CardFooter } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/States'
import { Alert } from '../../components/ui/States'
import { projectService } from '../../services/projectService'
import { integrationService } from '../../services/integrationService'


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

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [githubIntegration, setGithubIntegration] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [importFeedback, setImportFeedback] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const [connecting, setConnecting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  const loadGithubIntegration = async () => {
    const integrations = await integrationService.getIntegrations()
    const github = integrations.find((item) => (item?.source_name || '').toLowerCase() === 'github')
    setGithubIntegration(github || null)
  }

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError('')

      try {
        const [projectsData, integrations] = await Promise.all([
          projectService.listProjects(),
          integrationService.getIntegrations(),
        ])

        setProjects(projectsData)

        const github = integrations.find((item) => (item?.source_name || '').toLowerCase() === 'github')
        setGithubIntegration(github || null)
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load projects.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const normalizeTags = (techStack) => {
    if (Array.isArray(techStack)) {
      return techStack
    }

    if (techStack && typeof techStack === 'object') {
      return Object.values(techStack)
    }

    return []
  }

  const reloadProjects = async () => {
    const data = await projectService.listProjects()
    setProjects(data)
  }

  const handleSyncGitHub = async () => {
    setSyncing(true)
    setError('')
    setImportFeedback(null)

    try {
      const response = await integrationService.syncIntegration('github')

      if (response?.status !== 'completed') {
        setError(response?.error || 'Failed to sync GitHub projects.')
        return
      }

      const createdCount = Number(response?.created || 0)
      const updatedCount = Number(response?.updated || 0)
      const totalChanged = createdCount + updatedCount

      await reloadProjects()

      if (totalChanged > 0) {
        setImportFeedback({
          type: 'success',
          message: `GitHub sync completed. Created ${createdCount} and updated ${updatedCount} project${totalChanged === 1 ? '' : 's'}.`,
        })
      } else {
        setImportFeedback({
          type: 'info',
          message: 'GitHub sync completed. No project changes were required.',
        })
      }

      await loadGithubIntegration()
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'Failed to sync GitHub projects.'
      )
    } finally {
      setSyncing(false)
    }
  }

  const handleConnectGitHub = async () => {
    setConnecting(true)
    setError('')
    setImportFeedback(null)

    try {
      const response = await integrationService.connectIntegration({
        source_name: 'github',
      })

      if (response?.success === false) {
        setError(response?.error || 'Failed to connect GitHub integration.')
        return
      }

      await loadGithubIntegration()
      await handleSyncGitHub()
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'Failed to connect GitHub integration.'
      )
    } finally {
      setConnecting(false)
    }
  }

  const handleDelete = async (projectId) => {
    const confirmed = window.confirm('Delete this project?')
    if (!confirmed) {
      return
    }

    setDeletingId(projectId)
    setError('')

    try {
      await projectService.deleteProject(projectId)
      setProjects((currentProjects) => currentProjects.filter((project) => project.id !== projectId))
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete project.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600">Manage your portfolio projects</p>
          <p className="mt-2 text-sm text-slate-500">
            Connection status:{' '}
            <span className="font-semibold text-slate-700">
              {githubIntegration ? 'Connected' : 'Not connected'}
            </span>
            {' | '}Sync status:{' '}
            <span className="font-semibold text-slate-700">
              {githubIntegration?.sync_status || 'Not synced'}
            </span>
            {' | '}Last sync:{' '}
            <span className="font-semibold text-slate-700">
              {formatDateTime(githubIntegration?.last_sync)}
            </span>
          </p>
        </div>
        {githubIntegration ? (
          <Button variant="primary" onClick={handleSyncGitHub} disabled={syncing || connecting}>
            {syncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        ) : (
          <Button variant="primary" onClick={handleConnectGitHub} disabled={connecting || syncing}>
            {connecting ? 'Connecting...' : 'Connect GitHub'}
          </Button>
        )}
      </div>

      {importFeedback && !error && (
        <div className="mb-6">
          <Alert type={importFeedback.type} message={importFeedback.message} />
        </div>
      )}

      {error && (
        <div className="mb-6">
          <Alert type="error" message={error} />
        </div>
      )}

      {loading ? (
        <Card>
          <CardBody>
            <p className="text-slate-500">Loading projects...</p>
          </CardBody>
        </Card>
      ) : projects.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-100 text-xl font-black text-primary-700">
                    {(project.title || 'P').charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
                    <p className="text-sm text-slate-600">{project.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  {normalizeTags(project.tech_stack).map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardBody>
              <CardFooter>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => window.open(project.project_url, '_blank', 'noreferrer')}
                  disabled={!project.project_url}
                >
                  Open
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(project.id)}
                  disabled={deletingId === project.id}
                >
                  {deletingId === project.id ? 'Deleting...' : 'Delete'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody>
            <EmptyState 
              message="No projects yet. Import from GitHub or create one in the backend."
              action={
                githubIntegration ? (
                  <Button variant="primary" onClick={handleSyncGitHub} disabled={syncing || connecting}>
                    {syncing ? 'Syncing...' : 'Sync GitHub Projects'}
                  </Button>
                ) : (
                  <Button variant="primary" onClick={handleConnectGitHub} disabled={connecting || syncing}>
                    {connecting ? 'Connecting...' : 'Connect GitHub'}
                  </Button>
                )
              }
            />
          </CardBody>
        </Card>
      )}
    </DashboardLayout>
  )
}
