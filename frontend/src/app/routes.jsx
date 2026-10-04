import { Routes, Route, Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import EventDetails from '../pages/EventDetails'
import MyTickets from '../pages/MyTickets'
import AdminPortal from '../pages/AdminPortal'
import Queue from '../pages/Queue'
import AllocationResult from '../pages/AllocationResult'
import ProtectedRoute from '../features/auth/ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Dynamic Event Browsing & Details */}
      <Route path="/" element={<Home />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/drop" element={<Navigate to="/events/event-001" replace />} />

      {/* User Bookings History & Scoped Tickets */}
      <Route path="/my-tickets" element={<MyTickets />} />
      <Route path="/my-entries" element={<MyTickets />} />

      {/* Admin Portal */}
      <Route path="/admin" element={<AdminPortal />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />

      {/* Legacy and fallback routes */}
      <Route path="/queue" element={<ProtectedRoute><Queue /></ProtectedRoute>} />
      <Route path="/allocation" element={<ProtectedRoute><AllocationResult /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
