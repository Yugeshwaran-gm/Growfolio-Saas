import { useEffect, useMemo, useState } from 'react'
import { AdminLayout } from '../../layouts/AdminLayout'
import { Loading } from '../../components/ui/Loading'
import { ErrorState, EmptyState } from '../../components/ui/States'
import { adminService } from '../../services/adminService'

function resolveRole(user) {
  if (user.is_recruiter) {
    return 'Recruiter'
  }
  if (user.is_creator) {
    return 'Creator'
  }
  return 'User'
}

function getDisplayName(user) {
  const email = user?.email || ''
  if (!email.includes('@')) {
    return 'Unknown User'
  }
  return email.split('@')[0]
}

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [togglingUserId, setTogglingUserId] = useState(null)

  const usersPerPage = 10

  const loadUsers = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await adminService.listUsers()
      setUsers(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load user management data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const roles = useMemo(() => {
    const roleSet = new Set(users.map((user) => resolveRole(user)))
    return Array.from(roleSet)
  }, [users])

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchTerm.trim().toLowerCase()

    return users.filter((user) => {
      const name = getDisplayName(user).toLowerCase()
      const email = (user.email || '').toLowerCase()
      const role = resolveRole(user)

      const matchesSearch = !normalizedQuery || name.includes(normalizedQuery) || email.includes(normalizedQuery)
      const matchesRole = !selectedRole || role === selectedRole

      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, selectedRole])

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / usersPerPage))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * usersPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedRole])

  const handleToggleUser = async (userId) => {
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

  return (
    <AdminLayout>
      <div className="flex h-full flex-col overflow-hidden">
        <header className="flex shrink-0 flex-wrap items-end justify-between gap-4 px-8 pb-4 pt-8">
          <div>
            <h2 className="text-3xl font-extrabold text-primary dark:text-slate-100">User Management</h2>
            <p className="mt-1 font-medium text-slate-500 dark:text-slate-400">
              Total Users: <span className="text-primary dark:text-accent">{users.length.toLocaleString()}</span>
            </p>
          </div>
        </header>

        <section className="shrink-0 px-8 py-4">
          <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-background-dark/50">
            <div className="min-w-[300px] flex-1">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-accent">🔍</span>
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border-none bg-slate-100 py-3 pl-12 pr-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:ring-2 focus:ring-primary dark:bg-slate-800/50 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-500">Role:</span>
              <div className="flex flex-wrap gap-2">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(selectedRole === role ? null : role)}
                    className={`rounded-lg px-4 py-2 text-sm font-bold transition-colors ${
                      selectedRole === role
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 text-primary hover:bg-slate-200 dark:bg-slate-800'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="flex flex-1 flex-col overflow-hidden px-8 py-4">
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-background-dark/50">
            {loading ? (
              <div className="p-10">
                <Loading message="Loading users..." />
              </div>
            ) : error ? (
              <div className="p-6">
                <ErrorState message={error} onRetry={loadUsers} />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-6">
                <EmptyState message="No users found matching your criteria." />
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="sticky top-0 border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/50">
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">User</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Role</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Status</th>
                        <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {paginatedUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{getDisplayName(user)}</span>
                              <span className="text-xs text-slate-500">{user.email || '-'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-400">
                            {resolveRole(user)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                                user.is_active
                                  ? 'bg-accent/20 text-accent ring-1 ring-inset ring-accent/30'
                                  : 'bg-red-100 text-red-700 ring-1 ring-inset ring-red-200'
                              }`}
                            >
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleToggleUser(user.id)}
                              disabled={togglingUserId === user.id}
                              className={`rounded-lg px-3 py-2 text-xs font-bold transition-colors ${
                                user.is_active
                                  ? 'bg-red-50 text-red-700 hover:bg-red-100'
                                  : 'bg-primary text-white hover:bg-primary/90'
                              } disabled:cursor-not-allowed disabled:opacity-50`}
                            >
                              {togglingUserId === user.id
                                ? 'Updating...'
                                : user.is_active
                                ? 'Deactivate'
                                : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex shrink-0 items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-800/30">
                  <p className="text-sm font-medium text-slate-500">
                    Showing {startIndex + 1} to {Math.min(startIndex + usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, safeCurrentPage - 1))}
                      disabled={safeCurrentPage === 1}
                      className="rounded-lg px-3 py-2 text-sm font-bold text-primary transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-700"
                    >
                      Previous
                    </button>
                    <span className="rounded-lg bg-accent px-3 py-2 text-sm font-bold text-primary">
                      {safeCurrentPage} / {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(Math.min(totalPages, safeCurrentPage + 1))}
                      disabled={safeCurrentPage === totalPages}
                      className="rounded-lg px-3 py-2 text-sm font-bold text-primary transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-slate-700"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}
