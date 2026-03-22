import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useStudentStore } from '../../stores/studentStore'
import type { components } from '../../types/generated/api'

type StudentResponse = components['schemas']['StudentResponse']

function StudentListPage() {
  const navigate = useNavigate()
  const { students, loading, error, fetchStudents, deleteStudentById } = useStudentStore()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<StudentResponse | null>(null)

  useEffect(() => {
    void fetchStudents()
  }, [fetchStudents])

  const handleDeleteClick = (student: StudentResponse) => {
    setStudentToDelete(student)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (studentToDelete) {
      await deleteStudentById(studentToDelete.id)
      setDeleteDialogOpen(false)
      setStudentToDelete(null)
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setStudentToDelete(null)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Schüler
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/students/new')}
        >
          Neuer Schüler
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading && !students.length ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nachname</TableCell>
                <TableCell>Vorname</TableCell>
                <TableCell>Klassenstufe</TableCell>
                <TableCell>Geburtsdatum</TableCell>
                <TableCell>E-Mail</TableCell>
                <TableCell align="right">Aktionen</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.lastName}</TableCell>
                  <TableCell>{student.firstName}</TableCell>
                  <TableCell>{student.gradeLevel}</TableCell>
                  <TableCell>{student.dateOfBirth}</TableCell>
                  <TableCell>{student.email ?? '–'}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="Bearbeiten"
                      onClick={() => navigate(`/students/${student.id}/edit`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      aria-label="Löschen"
                      color="error"
                      onClick={() => handleDeleteClick(student)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Schüler löschen</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Möchten Sie{' '}
            <strong>
              {studentToDelete?.firstName} {studentToDelete?.lastName}
            </strong>{' '}
            wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Abbrechen</Button>
          <Button onClick={() => void handleDeleteConfirm()} color="error" variant="contained">
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default StudentListPage
