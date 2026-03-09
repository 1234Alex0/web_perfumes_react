import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import RoleRoute from '../components/RoleRoute'
import AppNavbar from '../components/AppNavbar'
import AdminPage from '../pages/AdminPage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import ProductsPage from '../pages/ProductsPage'
import UserPage from '../pages/UserPage'

function AppRouter() {
  return (
    <>
      <AppNavbar />
      <main className="app-wrapper">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/perfumes" element={<ProductsPage />} />
          <Route path="/perfumes/:productId" element={<ProductDetailPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleRoute>
                  <AdminPage />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
          <Route path="/products" element={<Navigate to="/perfumes" replace />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}

export default AppRouter
