import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

function AppNavbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()

  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark sticky-top">
      <div className="container-xl">
        <Link className="navbar-brand fw-semibold app-navbar-brand" to="/">
          Perfumeria Europea y Arabe
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Alternar navegación"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <div className="navbar-nav me-auto mb-2 mb-lg-0">
            <NavLink className="nav-link" to="/">
              Inicio
            </NavLink>
            <NavLink className="nav-link" to="/perfumes">
              Perfumes
            </NavLink>

            {isAuthenticated && (
              <NavLink className="nav-link" to="/user">
                Usuario
              </NavLink>
            )}

            {isAuthenticated && isAdmin && (
              <NavLink className="nav-link" to="/admin">
                Admin
              </NavLink>
            )}
          </div>

          <div className="navbar-nav ms-lg-auto">
            {!isAuthenticated ? (
              <NavLink className="nav-link" to="/login">
                Login
              </NavLink>
            ) : (
              <button className="btn btn-outline-light btn-sm" type="button" onClick={logout}>
                Salir ({user?.username})
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AppNavbar
