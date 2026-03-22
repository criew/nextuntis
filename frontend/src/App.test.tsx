import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'
import { render } from './test/test-utils'

vi.mock('react-oidc-context', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: { access_token: 'mock-token', profile: { sub: '1', name: 'Test User' } },
    signinRedirect: vi.fn(),
    signoutRedirect: vi.fn(),
    error: null,
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('App', () => {
  it('redirects to /students and renders the student list', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /neuer schüler/i })).toBeInTheDocument()
    })
  })
})
