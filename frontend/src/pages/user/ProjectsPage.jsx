import { useState } from 'react'
import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Card, CardHeader, CardBody, CardFooter } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/States'

export default function ProjectsPage() {
  const [projects] = useState([
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution with React and Django',
      image: '🛒',
      tags: ['React', 'Django', 'PostgreSQL'],
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Collaborative task management application',
      image: '✅',
      tags: ['React', 'Firebase', 'Tailwind CSS'],
    },
  ])

  return (
    <DashboardLayout>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-600">Manage your portfolio projects</p>
        </div>
        <Button variant="primary">
          Add Project
        </Button>
      </div>

      {projects.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{project.image}</span>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{project.title}</h3>
                    <p className="text-sm text-slate-600">{project.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardBody>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </CardBody>
              <CardFooter>
                <Button variant="secondary" size="sm">
                  Edit
                </Button>
                <Button variant="danger" size="sm">
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody>
            <EmptyState 
              message="No projects yet. Create your first project to get started!"
              action={<Button variant="primary">Create Project</Button>}
            />
          </CardBody>
        </Card>
      )}
    </DashboardLayout>
  )
}
