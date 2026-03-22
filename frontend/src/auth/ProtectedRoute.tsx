import { Box, CircularProgress } from '@mui/material'
import { useAuth } from 'react-oidc-context'
import { Navigate, Outlet } from 'react-router'
import NavBar from '../components/NavBar'

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

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  )
}
