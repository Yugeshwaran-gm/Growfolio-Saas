import { AdminLayout } from '../../layouts/AdminLayout'
import { Card, CardHeader, CardBody } from '../../components/ui/Card'

export default function AdminDashboardPage() {
  return (
    <AdminLayout>
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="text-4xl font-bold text-primary-500 mb-2">1,234</div>
          <p className="text-slate-600">Total Users</p>
        </Card>
        <Card className="p-6">
          <div className="text-4xl font-bold text-accent-500 mb-2">567</div>
          <p className="text-slate-600">Active Users</p>
        </Card>
        <Card className="p-6">
          <div className="text-4xl font-bold text-primary-500 mb-2">2,890</div>
          <p className="text-slate-600">Projects</p>
        </Card>
        <Card className="p-6">
          <div className="text-4xl font-bold text-accent-500 mb-2">12.4K</div>
          <p className="text-slate-600">Total Views</p>
        </Card>
      </div>

      <Card className="p-6">
        <CardHeader>
          <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
        </CardHeader>
        <CardBody>
          <p className="text-slate-600">Activity logs will appear here.</p>
        </CardBody>
      </Card>
    </AdminLayout>
  )
}
