import { useState } from 'react'
import { AdminLayout } from '../../layouts/AdminLayout'

// Status Badge Component
function StatusBadge({ status }) {
  if (status === 'Active') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-accent/20 text-accent ring-1 ring-inset ring-accent/30">
        Active
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-transparent text-primary dark:text-slate-300 ring-1 ring-inset ring-primary/40 dark:ring-slate-700">
      Suspended
    </span>
  )
}

// Action Buttons Component
function ActionButtons({ userId, isSuspended }) {
  const handleView = () => alert(`Viewing profile for user ${userId}`)
  const handleEdit = () => alert(`Editing user ${userId}`)
  const handleToggleBan = () => {
    if (isSuspended) {
      alert(`Unbanning user ${userId}`)
    } else {
      alert(`Banning user ${userId}`)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleView}
        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
        title="View Profile"
      >
        👁️
      </button>
      <button
        onClick={handleEdit}
        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
        title="Edit User"
      >
        ✏️
      </button>
      <button
        onClick={handleToggleBan}
        className={`p-2 rounded-lg transition-colors ${
          isSuspended
            ? 'text-red-500 hover:bg-red-50'
            : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
        }`}
        title={isSuspended ? 'Unban User' : 'Ban User'}
      >
        {isSuspended ? '↩️' : '🚫'}
      </button>
    </div>
  )
}

// User Row Component
function UserRow({ user }) {
  return (
    <tr>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-white font-bold text-sm">
            {user.name.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{user.name}</span>
            <span className="text-xs text-slate-500">{user.email}</span>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400 font-medium">{user.role}</td>
      <td className="px-6 py-4">
        <StatusBadge status={user.status} />
      </td>
      <td className="px-6 py-4 text-sm text-slate-500">{user.joinDate}</td>
      <td className="px-6 py-4">
        <ActionButtons userId={user.id} isSuspended={user.status === 'Suspended'} />
      </td>
    </tr>
  )
}

export default function UserManagementPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  const roles = ['Developer', 'Writer', 'Researcher', 'Creator']

  const allUsers = [
    {
      id: 1,
      name: 'Jordan Sinclair',
      email: 'jordan.s@growfolio.io',
      role: 'Developer',
      status: 'Active',
      joinDate: 'Oct 12, 2023',
    },
    {
      id: 2,
      name: 'Maya Sterling',
      email: 'm.sterling@agency.com',
      role: 'Writer',
      status: 'Suspended',
      joinDate: 'Nov 05, 2023',
    },
    {
      id: 3,
      name: 'Dr. Aris Thorne',
      email: 'a.thorne@research.net',
      role: 'Researcher',
      status: 'Active',
      joinDate: 'Dec 01, 2023',
    },
    {
      id: 4,
      name: 'Luka Vance',
      email: 'luka.creator@gmail.com',
      role: 'Creator',
      status: 'Active',
      joinDate: 'Jan 15, 2024',
    },
    {
      id: 5,
      name: 'Elena Rossi',
      email: 'rossi.elena@dev.it',
      role: 'Developer',
      status: 'Suspended',
      joinDate: 'Feb 20, 2024',
    },
  ]

  const handleInviteUser = () => {
    alert('Opening invite user dialog...')
  }

  const getFilteredUsers = () => {
    return allUsers.filter(user => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole = !selectedRole || user.role === selectedRole

      return matchesSearch && matchesRole
    })
  }

  const filteredUsers = getFilteredUsers()

  return (
    <AdminLayout>
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="px-8 pt-8 pb-4 flex flex-wrap justify-between items-end gap-4 shrink-0">
          <div>
            <h2 className="text-3xl font-extrabold text-primary dark:text-slate-100">User Management</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Total Users: <span className="text-primary dark:text-accent">12,450</span>
            </p>
          </div>
          <button
            onClick={handleInviteUser}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity"
          >
            <span>➕</span>
            <span>Invite User</span>
          </button>
        </header>

        {/* Search & Filter Section */}
        <section className="px-8 py-4 shrink-0">
          <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-background-dark/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex-1 min-w-[300px]">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-accent">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Search by name, email or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800/50 border-none rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-primary text-slate-900 dark:text-slate-100 placeholder:text-slate-400 outline-none transition-all"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-500">Role:</span>
              <div className="flex gap-2 flex-wrap">
                {roles.map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(selectedRole === role ? null : role)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                      selectedRole === role
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-primary hover:bg-slate-200'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Table Section */}
        <section className="px-8 py-4 flex-1 overflow-hidden flex flex-col">
          <div className="bg-white dark:bg-background-dark/50 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col h-full">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Join Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => <UserRow key={user.id} user={user} />)
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                        No users found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
              <p className="text-sm text-slate-500 font-medium">
                Showing 1 to {Math.min(5, filteredUsers.length)} of {filteredUsers.length} users
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center p-2 text-primary hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors font-bold disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="text-sm ml-1 pr-2">⬅️ Previous</span>
                </button>
                <div className="flex items-center px-2">
                  <button className="size-8 flex items-center justify-center rounded-lg bg-accent text-primary font-bold text-sm shadow-sm">
                    1
                  </button>
                  <button className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-bold text-sm mx-1">
                    2
                  </button>
                  <button className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-bold text-sm mx-1">
                    3
                  </button>
                  <span className="px-2 text-slate-400">...</span>
                  <button className="size-8 flex items-center justify-center rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 font-bold text-sm mx-1">
                    2490
                  </button>
                </div>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="flex items-center justify-center p-2 text-primary hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors font-bold"
                >
                  <span className="text-sm mr-1 pl-2">Next ➡️</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AdminLayout>
  )
}
