import { Box, Button, Card, CardContent, CircularProgress, Typography } from '@mui/material'
import { useAuth } from 'react-oidc-context'
import { Navigate } from 'react-router'

export default function LoginPage() {
  const auth = useAuth()

  if (auth.isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    )
  }

  if (auth.isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Card sx={{ minWidth: 340, p: 2 }}>
        <CardContent
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
        >
          <Typography variant="h4" component="h1" fontWeight="bold">
            nextuntis
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" textAlign="center">
            Schulverwaltung der neuen Generation
          </Typography>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => auth.signinRedirect()}
            sx={{ mt: 2 }}
          >
            Mit Keycloak anmelden
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}
