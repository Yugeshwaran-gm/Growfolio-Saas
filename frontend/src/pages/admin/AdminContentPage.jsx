import { AdminLayout } from '../../layouts/AdminLayout'

export default function AdminContentPage() {
  return (
    <AdminLayout>
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900">Content</h2>
        <p className="mt-2 text-slate-600">
          Content moderation and publishing tools will be available here.
        </p>
      </section>
    </AdminLayout>
  )
}
