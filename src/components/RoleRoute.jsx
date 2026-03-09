import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function RoleRoute({ children }) {
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return <Navigate to="/user" replace />
  }

  return children
}

export default RoleRoute
