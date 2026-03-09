import { Navigate, Route, Routes } from 'react-router-dom'
import AppNavbar from '../components/layout/AppNavbar'
import HomePage from '../pages/HomePage'
import NotFoundPage from '../pages/NotFoundPage'
import ProductDetailPage from '../pages/ProductDetailPage'
import ProductsPage from '../pages/ProductsPage'

function AppRouter() {
  return (
    <>
      <AppNavbar />
      <main className="app-wrapper">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/perfumes" element={<ProductsPage />} />
          <Route path="/perfumes/:productId" element={<ProductDetailPage />} />
          <Route path="/products" element={<Navigate to="/perfumes" replace />} />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
    </>
  )
}

export default AppRouter
