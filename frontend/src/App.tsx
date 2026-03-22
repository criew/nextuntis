import { Navigate, Route, Routes } from 'react-router'
import StudentListPage from './features/students/StudentListPage'
import StudentFormPage from './features/students/StudentFormPage'
import LoginPage from './auth/LoginPage'
import AuthCallbackPage from './auth/AuthCallbackPage'
import ProtectedRoute from './auth/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/callback" element={<AuthCallbackPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/students" replace />} />
        <Route path="/students" element={<StudentListPage />} />
        <Route path="/students/new" element={<StudentFormPage />} />
        <Route path="/students/:id/edit" element={<StudentFormPage />} />
      </Route>
    </Routes>
  )
}

export default App
