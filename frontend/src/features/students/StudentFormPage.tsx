import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Box, Button, CircularProgress, Stack, TextField, Typography } from '@mui/material'
import { createStudent, getStudent, updateStudent } from '../../api/studentsApi'
import type { components } from '../../types/generated/api'

type StudentRequest = components['schemas']['StudentRequest']

interface FormErrors {
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  gradeLevel?: string
}

function StudentFormPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEdit = id !== undefined

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [gradeLevel, setGradeLevel] = useState<string>('')
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true)
      getStudent(Number(id))
        .then((student) => {
          setFirstName(student.firstName)
          setLastName(student.lastName)
          setDateOfBirth(student.dateOfBirth)
          setGradeLevel(String(student.gradeLevel))
          setEmail(student.email ?? '')
          setLoading(false)
        })
        .catch(() => {
          setApiError('Schüler konnte nicht geladen werden.')
          setLoading(false)
        })
    }
  }, [id, isEdit])

  const validate = (): boolean => {
    const newErrors: FormErrors = {}
    if (!firstName.trim()) newErrors.firstName = 'Vorname ist erforderlich.'
    if (!lastName.trim()) newErrors.lastName = 'Nachname ist erforderlich.'
    if (!dateOfBirth) newErrors.dateOfBirth = 'Geburtsdatum ist erforderlich.'
    if (!gradeLevel) {
      newErrors.gradeLevel = 'Klassenstufe ist erforderlich.'
    } else {
      const level = Number(gradeLevel)
      if (!Number.isInteger(level) || level < 1 || level > 13) {
        newErrors.gradeLevel = 'Klassenstufe muss zwischen 1 und 13 liegen.'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const data: StudentRequest = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      dateOfBirth,
      gradeLevel: Number(gradeLevel),
      email: email.trim() || null,
    }

    setSubmitting(true)
    setApiError(null)
    try {
      if (isEdit && id) {
        await updateStudent(Number(id), data)
      } else {
        await createStudent(data)
      }
      navigate('/students')
    } catch {
      setApiError('Fehler beim Speichern des Schülers.')
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {isEdit ? 'Schüler bearbeiten' : 'Neuer Schüler'}
      </Typography>

      {apiError && (
        <Typography color="error" sx={{ mb: 2 }}>
          {apiError}
        </Typography>
      )}

      <Box component="form" onSubmit={(e) => void handleSubmit(e)} noValidate>
        <Stack spacing={3}>
          <TextField
            label="Vorname"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            error={!!errors.firstName}
            helperText={errors.firstName}
            required
            fullWidth
            inputProps={{ maxLength: 100 }}
          />
          <TextField
            label="Nachname"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            error={!!errors.lastName}
            helperText={errors.lastName}
            required
            fullWidth
            inputProps={{ maxLength: 100 }}
          />
          <TextField
            label="Geburtsdatum"
            type="date"
            value={dateOfBirth}
            onChange={(e) => setDateOfBirth(e.target.value)}
            error={!!errors.dateOfBirth}
            helperText={errors.dateOfBirth}
            required
            fullWidth
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Klassenstufe"
            type="number"
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            error={!!errors.gradeLevel}
            helperText={errors.gradeLevel}
            required
            fullWidth
            inputProps={{ min: 1, max: 13 }}
          />
          <TextField
            label="E-Mail (optional)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? 'Speichern...' : 'Speichern'}
            </Button>
            <Button variant="outlined" onClick={() => navigate('/students')} disabled={submitting}>
              Abbrechen
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}

export default StudentFormPage
