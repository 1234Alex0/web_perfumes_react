import { Link } from 'react-router-dom'

function HomePage() {
  return (
    <section className="container-xl py-4 py-md-5">
      <div className="p-4 p-md-5 bg-white rounded-4 shadow-sm">
        <h1 className="page-title fw-bold">Buscador de perfumes europeos y orientales (Dubai)</h1>
        <p className="lead mt-3 mb-4">
          Catálogo centrado únicamente en fragancias. Busca por nombre, marca o descripción y consulta fichas detalladas.
        </p>

        <div className="d-flex gap-2 flex-wrap">
          <Link to="/perfumes" className="btn btn-dark">
            Buscar perfumes
          </Link>
        </div>

        <hr className="my-4" />

        <ul className="mb-0">
          <li>Perfumes filtrados desde la categoría `fragrances` de DummyJSON.</li>
          <li>Inspirado en perfiles olfativos europeos y árabes modernos.</li>
          <li>Interfaz responsive para escritorio, tablet y móvil.</li>
        </ul>
      </div>
    </section>
  )
}

export default HomePage
