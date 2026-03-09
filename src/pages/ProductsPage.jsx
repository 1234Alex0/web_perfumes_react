import { useEffect, useState } from 'react'
import ProductCard from '../components/products/ProductCard'
import { productsService } from '../services/productsService'

function ProductsPage() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
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

  return (
    <section className="container-xl py-4 py-md-5">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <h1 className="page-title fw-bold m-0">Catálogo de perfumes</h1>
        <input
          className="form-control"
          placeholder="Buscar perfume, marca o aroma..."
          style={{ maxWidth: 320 }}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading && (
        <div className="text-center py-5">
          <div className="spinner-border" role="status" />
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && (
        <>
          {!products.length ? (
            <div className="alert alert-secondary">No se encontraron perfumes con ese criterio.</div>
          ) : (
            <div className="row g-3 g-md-4">
              {products.map((product) => (
                <div key={product.id} className="col-12 col-sm-6 col-lg-4 col-xxl-3">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}

export default ProductsPage
