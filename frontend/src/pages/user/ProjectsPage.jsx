import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Card, CardHeader, CardBody, CardFooter } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/States'
import { Alert } from '../../components/ui/States'
import { projectService } from '../../services/projectService'

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [importing, setImporting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true)
      setError('')

      try {
        const data = await projectService.listProjects()
        setProjects(data)
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to load projects.')
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
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

  const handleImportGitHub = async () => {
    setImporting(true)
    setError('')

    try {
      await projectService.importGithubProjects()
      await reloadProjects()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to import GitHub projects.')
    } finally {
      setImporting(false)
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
        </div>
        <Button variant="primary" onClick={handleImportGitHub} disabled={importing}>
          {importing ? 'Importing...' : 'Import from GitHub'}
        </Button>
      </div>

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
              action={<Button variant="primary" onClick={handleImportGitHub} disabled={importing}>{importing ? 'Importing...' : 'Import GitHub Projects'}</Button>}
            />
          </CardBody>
        </Card>
      )}
    </DashboardLayout>
  )
}
