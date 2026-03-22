import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, beforeEach } from 'vitest'
import StudentListPage from './StudentListPage'
import { render } from '../../test/test-utils'
import { useStudentStore } from '../../stores/studentStore'

beforeEach(() => {
  useStudentStore.setState({ students: [], loading: false, error: null })
})

describe('StudentListPage', () => {
  it('renders the student table with data after loading', async () => {
    render(<StudentListPage />)

    await waitFor(() => {
      expect(screen.getByText('Mustermann')).toBeInTheDocument()
    })

    expect(screen.getByText('Max')).toBeInTheDocument()
    expect(screen.getByText('Schmidt')).toBeInTheDocument()
    expect(screen.getByText('Anna')).toBeInTheDocument()
    expect(screen.getByText('Müller')).toBeInTheDocument()
  })

  it('renders the "Neuer Schüler" button', async () => {
    render(<StudentListPage />)

    expect(screen.getByRole('button', { name: /neuer schüler/i })).toBeInTheDocument()
  })

  it('opens delete confirmation dialog when delete button is clicked', async () => {
    const user = userEvent.setup()
    render(<StudentListPage />)

    await waitFor(() => {
      expect(screen.getByText('Mustermann')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByRole('button', { name: /löschen/i })
    await user.click(deleteButtons[0])

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/möchten sie/i)).toBeInTheDocument()
  })

  it('closes delete dialog when Abbrechen is clicked', async () => {
    const user = userEvent.setup()
    render(<StudentListPage />)

    await waitFor(() => {
      expect(screen.getByText('Mustermann')).toBeInTheDocument()
    })

    const deleteButtons = screen.getAllByRole('button', { name: /löschen/i })
    await user.click(deleteButtons[0])

    const cancelButton = screen.getByRole('button', { name: /abbrechen/i })
    await user.click(cancelButton)

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })
  })
})
