import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'
import { render } from './test/test-utils'

describe('App', () => {
  it('redirects to /students and renders the student list', async () => {
    render(<App />)
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /neuer schüler/i })).toBeInTheDocument()
    })
  })
})
