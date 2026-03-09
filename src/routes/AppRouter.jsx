import { Navigate, Route, Routes } from 'react-router-dom'
import { AppNavbar, ProtectedRoute, RoleRoute } from '../components'
import {
  AdminPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  ProductDetailPage,
  ProductsPage,
  UserPage,
} from '../pages'

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
