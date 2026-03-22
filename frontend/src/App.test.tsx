import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'
import { render } from './test/test-utils'

describe('App', () => {
  it('renders the application title', () => {
    render(<App />)
    expect(screen.getByText('NextUntis')).toBeInTheDocument()
  })
})
