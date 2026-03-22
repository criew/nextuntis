import { create } from 'zustand'
import { getStudents, deleteStudent } from '../api/studentsApi'
import type { components } from '../types/generated/api'

type StudentResponse = components['schemas']['StudentResponse']

interface StudentState {
  students: StudentResponse[]
  loading: boolean
  error: string | null
  fetchStudents: () => Promise<void>
  deleteStudentById: (id: number) => Promise<void>
}

export const useStudentStore = create<StudentState>((set) => ({
  students: [],
  loading: false,
  error: null,

  fetchStudents: async () => {
    set({ loading: true, error: null })
    try {
      const students = await getStudents()
      set({ students, loading: false })
    } catch {
      set({ error: 'Fehler beim Laden der Schüler.', loading: false })
    }
  },

  deleteStudentById: async (id: number) => {
    set({ loading: true, error: null })
    try {
      await deleteStudent(id)
      set((state) => ({
        students: state.students.filter((s) => s.id !== id),
        loading: false,
      }))
    } catch {
      set({ error: 'Fehler beim Löschen des Schülers.', loading: false })
    }
  },
}))
