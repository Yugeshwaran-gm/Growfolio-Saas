import { DashboardLayout } from '../../layouts/DashboardLayout'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'
import { useAuth } from '../../hooks/useAuth'

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600">Welcome back, {user?.first_name || 'User'}!</p>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="text-4xl font-bold text-primary-500 mb-2">5</div>
          <p className="text-slate-600">Projects</p>
        </Card>
        <Card className="p-6">
          <div className="text-4xl font-bold text-accent-500 mb-2">12</div>
          <p className="text-slate-600">Skills</p>
        </Card>
        <Card className="p-6">
          <div className="text-4xl font-bold text-primary-500 mb-2">8</div>
          <p className="text-slate-600">Articles</p>
        </Card>
        <Card className="p-6">
          <div className="text-4xl font-bold text-accent-500 mb-2">245</div>
          <p className="text-slate-600">Views</p>
        </Card>
      </div>

      <Card className="p-6">
        <CardHeader>
          <h2 className="text-xl font-bold text-slate-900">Recent Projects</h2>
        </CardHeader>
        <CardBody>
          <p className="text-slate-600">Your recent projects will appear here.</p>
        </CardBody>
      </Card>
    </DashboardLayout>
  )
}
