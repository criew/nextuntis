import { AppBar, Button, Toolbar, Typography } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import { useAuth } from 'react-oidc-context'

export default function NavBar() {
  const auth = useAuth()
  const username = auth.user?.profile?.name ?? auth.user?.profile?.preferred_username ?? 'Benutzer'

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          nextuntis
        </Typography>
        <Typography variant="body2" sx={{ mr: 2 }}>
          {username}
        </Typography>
        <Button color="inherit" startIcon={<LogoutIcon />} onClick={() => auth.signoutRedirect()}>
          Abmelden
        </Button>
      </Toolbar>
    </AppBar>
  )
}
