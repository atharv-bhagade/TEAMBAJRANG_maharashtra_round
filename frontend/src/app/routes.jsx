import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import DropDetails from '../pages/DropDetails'
import Queue from '../pages/Queue'
import AllocationResult from '../pages/AllocationResult'
import ProtectedRoute from '../features/auth/ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/drop" element={<ProtectedRoute><DropDetails /></ProtectedRoute>} />
      <Route path="/queue" element={<ProtectedRoute><Queue /></ProtectedRoute>} />
      <Route path="/my-entries" element={<ProtectedRoute><Queue /></ProtectedRoute>} />
      <Route path="/allocation" element={<ProtectedRoute><AllocationResult /></ProtectedRoute>} />
      <Route path="/my-tickets" element={<ProtectedRoute><AllocationResult /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
