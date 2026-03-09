import { Link, NavLink } from 'react-router-dom'

function AppNavbar() {
  return (
    <nav className="navbar navbar-expand-lg bg-dark navbar-dark sticky-top">
      <div className="container-xl">
        <Link className="navbar-brand fw-semibold" to="/">
          Perfume Atlas
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
          </div>
        </div>
      </div>
    </nav>
  )
}

export default AppNavbar
