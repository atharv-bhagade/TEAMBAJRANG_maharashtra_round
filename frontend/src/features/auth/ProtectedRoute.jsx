import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, reAuthRequired } = useAuth()
  const location = useLocation()
  if (!isAuthenticated || reAuthRequired) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}
