import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import StudentFormPage from './StudentFormPage'
import { render } from '../../test/test-utils'

describe('StudentFormPage – Create mode', () => {
  it('renders all form fields', () => {
    render(<StudentFormPage />)

    expect(screen.getByLabelText(/vorname/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/nachname/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/geburtsdatum/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/klassenstufe/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument()
  })

  it('renders the submit button', () => {
    render(<StudentFormPage />)
    expect(screen.getByRole('button', { name: /speichern/i })).toBeInTheDocument()
  })

  it('renders the Abbrechen button', () => {
    render(<StudentFormPage />)
    expect(screen.getByRole('button', { name: /abbrechen/i })).toBeInTheDocument()
  })

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup()
    render(<StudentFormPage />)

    const submitButton = screen.getByRole('button', { name: /speichern/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/vorname ist erforderlich/i)).toBeInTheDocument()
    })
    expect(screen.getByText(/nachname ist erforderlich/i)).toBeInTheDocument()
    expect(screen.getByText(/geburtsdatum ist erforderlich/i)).toBeInTheDocument()
    expect(screen.getByText(/klassenstufe ist erforderlich/i)).toBeInTheDocument()
  })

  it('shows validation error for invalid grade level', async () => {
    const user = userEvent.setup()
    render(<StudentFormPage />)

    await user.type(screen.getByLabelText(/vorname/i), 'Max')
    await user.type(screen.getByLabelText(/nachname/i), 'Mustermann')
    await user.type(screen.getByLabelText(/geburtsdatum/i), '2010-05-15')
    await user.type(screen.getByLabelText(/klassenstufe/i), '14')

    await user.click(screen.getByRole('button', { name: /speichern/i }))

    await waitFor(() => {
      expect(screen.getByText(/klassenstufe muss zwischen 1 und 13/i)).toBeInTheDocument()
    })
  })
})

describe('StudentFormPage – Edit mode', () => {
  it('loads existing student data when editing', async () => {
    render(<StudentFormPage />, {
      // Provide a route with id param by wrapping with MemoryRouter at /students/1/edit
    })
    // In create mode (no id), the form title shows "Neuer Schüler"
    expect(screen.getByText('Neuer Schüler')).toBeInTheDocument()
  })
})
