import { AdminLayout } from '../../layouts/AdminLayout'

export default function AdminSettingsPage() {
  return (
    <AdminLayout>
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="mt-2 text-slate-600">
          Global admin settings and system configuration controls will appear here.
        </p>
      </section>
    </AdminLayout>
  )
}
