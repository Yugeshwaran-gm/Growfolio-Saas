import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Loading } from '../components/ui/Loading'

export function ProtectedRoute({ children, requiredRole = null }) {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return <Loading message="Loading..." />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export function PublicRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return <Loading message="Loading..." />
  }

  if (isAuthenticated) {
    // Redirect admins to admin dashboard, regular users to user dashboard
    const redirectPath = (user?.is_staff || user?.is_superuser) ? '/admin' : '/dashboard'
    return <Navigate to={redirectPath} replace />
  }

  return children
}

export function AdminRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return <Loading message="Loading..." />
  }

  if (!isAuthenticated || (!user?.is_staff && !user?.is_superuser)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
