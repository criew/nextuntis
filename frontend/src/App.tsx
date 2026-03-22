import { Navigate, Route, Routes } from 'react-router'
import StudentListPage from './features/students/StudentListPage'
import StudentFormPage from './features/students/StudentFormPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/students" replace />} />
      <Route path="/students" element={<StudentListPage />} />
      <Route path="/students/new" element={<StudentFormPage />} />
      <Route path="/students/:id/edit" element={<StudentFormPage />} />
    </Routes>
  )
}

export default App
