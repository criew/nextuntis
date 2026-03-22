import { Box, CircularProgress, Typography } from '@mui/material'
import { useAuth } from 'react-oidc-context'
import { Navigate } from 'react-router'

export default function AuthCallbackPage() {
  const auth = useAuth()

  if (auth.error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">Anmeldefehler: {auth.error.message}</Typography>
      </Box>
    )
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      gap={2}
    >
      <CircularProgress />
      <Typography>Anmeldung wird verarbeitet...</Typography>
    </Box>
  )
}
