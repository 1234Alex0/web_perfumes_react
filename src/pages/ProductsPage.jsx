import { useEffect, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard'
import { productsService } from '../services/productsService'

function ProductsPage() {
  const ITEMS_PER_PAGE = 50
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [brandFilter, setBrandFilter] = useState('all')
  const [genderFilter, setGenderFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const data = search.trim()
          ? await productsService.searchPerfumes(search.trim())
          : await productsService.getPerfumes()
        setProducts(data.products || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(load, 250)
    return () => clearTimeout(timeoutId)
  }, [search])

  const brandOptions = useMemo(() => {
    return [...new Set(products.map((item) => item.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b))
  }, [products])

  const genderOptions = useMemo(() => {
    return [...new Set(products.map((item) => item.gender).filter(Boolean))].sort((a, b) => a.localeCompare(b))
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesBrand = brandFilter === 'all' || item.brand === brandFilter
      const matchesGender = genderFilter === 'all' || item.gender === genderFilter
      return matchesBrand && matchesGender
    })
  }, [brandFilter, genderFilter, products])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, brandFilter, genderFilter])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE))

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    const end = start + ITEMS_PER_PAGE
    return filteredProducts.slice(start, end)
  }, [currentPage, filteredProducts, ITEMS_PER_PAGE])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  return (
    <section className="container-xl py-4 py-md-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h1 className="page-title fw-bold m-0">Catálogo de perfumes</h1>
        <div className="d-flex gap-2 flex-wrap mobile-stack catalog-filters">
          <input
            className="form-control"
            placeholder="Buscar perfume, marca o aroma..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            className="form-select"
            value={brandFilter}
            onChange={(event) => setBrandFilter(event.target.value)}
          >
            <option value="all">Todas las marcas</option>
            {brandOptions.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <select
            className="form-select"
            value={genderFilter}
            onChange={(event) => setGenderFilter(event.target.value)}
          >
            <option value="all">Todos los géneros</option>
            {genderOptions.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          {!filteredProducts.length ? (
            <div className="alert alert-secondary">No se encontraron perfumes con ese criterio.</div>
          ) : (
            <>
              <div className="row g-3 g-md-4">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="col-12 col-sm-6 col-lg-4 col-xxl-3">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
                <button
                  className="btn btn-outline-dark btn-sm"
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                >
                  Anterior
                </button>

                <span className="small text-muted">
                  Página {currentPage} de {totalPages}
                </span>

                <button
                  className="btn btn-outline-dark btn-sm"
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  Siguiente
                </button>
              </div>
            </>
          )}
        </>
      )}
    </section>
  )
}

export default ProductsPage
