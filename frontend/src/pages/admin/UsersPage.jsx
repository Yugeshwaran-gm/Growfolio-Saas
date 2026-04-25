import { useEffect, useMemo, useState } from 'react'
import { AdminLayout } from '../../layouts/AdminLayout'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { Loading } from '../../components/ui/Loading'
import { ErrorState, EmptyState } from '../../components/ui/States'
import { adminService } from '../../services/adminService'

function getDisplayName(user) {
  const email = user?.email || ''
  if (!email.includes('@')) {
    return 'Unknown User'
  }
  return email.split('@')[0]
}

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [togglingUserId, setTogglingUserId] = useState(null)

  const loadUsers = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await adminService.listUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleToggleStatus = async (userId) => {
    setTogglingUserId(userId)
    setError('')

    try {
      const result = await adminService.toggleUserStatus(userId)
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === userId
            ? { ...user, is_active: result?.is_active ?? !user.is_active }
            : user
        )
      )
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update user status.')
    } finally {
      setTogglingUserId(null)
    }
  }

  const hasUsers = useMemo(() => users.length > 0, [users])

  return (
    <AdminLayout>
      <div className="mb-8">
        <h2 className="mb-1 text-2xl font-bold text-slate-900">Users</h2>
        <p className="text-sm text-slate-500">Manage user account status from backend data.</p>
      </div>

      <Card className="p-6">
        <CardHeader>
          <h3 className="text-lg font-bold text-slate-900">All Users</h3>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="py-10">
              <Loading message="Loading users..." />
            </div>
          ) : error ? (
            <ErrorState message={error} onRetry={loadUsers} />
          ) : !hasUsers ? (
            <EmptyState message="No users available." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Role</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{getDisplayName(user)}</td>
                      <td className="px-4 py-3 text-slate-600">{user.email || '-'}</td>
                      <td className="px-4 py-3 text-slate-600">
                        {user.is_recruiter ? 'Recruiter' : user.is_creator ? 'Creator' : 'User'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            user.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Button
                          variant={user.is_active ? 'danger' : 'secondary'}
                          size="sm"
                          onClick={() => handleToggleStatus(user.id)}
                          disabled={togglingUserId === user.id}
                        >
                          {togglingUserId === user.id
                            ? 'Updating...'
                            : user.is_active
                            ? 'Deactivate'
                            : 'Activate'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </AdminLayout>
  )
}
