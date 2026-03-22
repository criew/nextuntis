import { Container, Typography } from '@mui/material'

function App() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        NextUntis
      </Typography>
      <Typography variant="body1">
        Ein Verwaltungssystem für Schulen der neuen Generation.
      </Typography>
    </Container>
  )
}

export default App
