import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "sonner"
import { useAuth } from "./lib/auth-context"
import HomePage from "./pages/HomePage"
import PropertiesPage from "./pages/PropertiesPage"
import PropertyDetailPage from "./pages/PropertyDetailPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ForgotPasswordPage from "./pages/ForgotPasswordPage"
import OwnerDashboard from "./pages/owner/Dashboard"
import OwnerPropertiesPage from "./pages/owner/PropertiesPage"
import OwnerAddPropertyPage from "./pages/owner/AddPropertyPage"
import OwnerBookingsPage from "./pages/owner/BookingsPage"
import AdminDashboard from "./pages/admin/Dashboard"
import AdminUsersPage from "./pages/admin/UsersPage"
import AdminPropertiesPage from "./pages/admin/PropertiesPage"
import AdminBookingsPage from "./pages/admin/BookingsPage"

function ProtectedRoute({ children, requiredType }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requiredType && user?.type !== requiredType) return <Navigate to="/" replace />
  return children
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        <Route path="/owner" element={<ProtectedRoute requiredType="owner"><OwnerDashboard /></ProtectedRoute>} />
        <Route path="/owner/properties" element={<ProtectedRoute requiredType="owner"><OwnerPropertiesPage /></ProtectedRoute>} />
        <Route path="/owner/add-property" element={<ProtectedRoute requiredType="owner"><OwnerAddPropertyPage /></ProtectedRoute>} />
        <Route path="/owner/bookings" element={<ProtectedRoute requiredType="owner"><OwnerBookingsPage /></ProtectedRoute>} />

        <Route path="/admin" element={<ProtectedRoute requiredType="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute requiredType="admin"><AdminUsersPage /></ProtectedRoute>} />
        <Route path="/admin/properties" element={<ProtectedRoute requiredType="admin"><AdminPropertiesPage /></ProtectedRoute>} />
        <Route path="/admin/bookings" element={<ProtectedRoute requiredType="admin"><AdminBookingsPage /></ProtectedRoute>} />
      </Routes>
      <Toaster position="top-right" richColors closeButton />
    </>
  )
}

export default App
