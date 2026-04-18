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
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <Loading message="Loading..." />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export function AdminRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth()

  if (loading) {
    return <Loading message="Loading..." />
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
