import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <section className="container-xl py-5 text-center">
      <h1 className="display-6 fw-bold">404 - Página no encontrada</h1>
      <p className="text-muted">La ruta solicitada no existe.</p>
      <Link className="btn btn-dark" to="/">
        Volver al inicio
      </Link>
    </section>
  )
}

export default NotFoundPage
