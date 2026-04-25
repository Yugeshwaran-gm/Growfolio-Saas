import { AdminLayout } from '../../layouts/AdminLayout'

export default function AdminAnalyticsPage() {
  return (
    <AdminLayout>
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
        <p className="mt-2 text-slate-600">
          Admin-level analytics and system insights will be shown on this page.
        </p>
      </section>
    </AdminLayout>
  )
}
