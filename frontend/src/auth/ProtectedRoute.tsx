import { Box, CircularProgress } from '@mui/material'
import { useAuth } from 'react-oidc-context'
import { Navigate, Outlet } from 'react-router'

export default function ProtectedRoute() {
  const auth = useAuth()

  if (auth.isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
