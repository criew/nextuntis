import { ThemeProvider } from '@mui/material/styles'
import { render, fireEvent, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import theme from '../theme'
import NavBar from './NavBar'

const mocks = vi.hoisted(() => ({
  signoutRedirect: vi.fn(),
  signinRedirect: vi.fn(),
}))

vi.mock('react-oidc-context', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: { access_token: 'mock-token', profile: { sub: '1', name: 'Test User' } },
    signinRedirect: mocks.signinRedirect,
    signoutRedirect: mocks.signoutRedirect,
    error: null,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

function renderNavBar() {
  return render(
    <ThemeProvider theme={theme}>
      <NavBar />
    </ThemeProvider>,
  )
}

describe('NavBar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the app title', () => {
    renderNavBar()
    expect(screen.getByText('nextuntis')).toBeInTheDocument()
  })

  it('displays the username from auth profile', () => {
    renderNavBar()
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('calls signoutRedirect when logout button is clicked', () => {
    renderNavBar()
    fireEvent.click(screen.getByRole('button', { name: /abmelden/i }))
    expect(mocks.signoutRedirect).toHaveBeenCalledTimes(1)
  })

  it('does not call signinRedirect when logout button is clicked', () => {
    renderNavBar()
    fireEvent.click(screen.getByRole('button', { name: /abmelden/i }))
    expect(mocks.signinRedirect).not.toHaveBeenCalled()
  })
})
