import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { productsService } from '../../services/productsService'

function ProductDetailPage() {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await productsService.getProductById(productId)
        setProduct(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  }, [productId])

  if (loading) {
    return (
      <div className="container-xl py-5 text-center">
        <div className="spinner-border" role="status" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-xl py-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    )
  }

  if (!product) return null

  const imageUrl = product.thumbnail || 'https://via.placeholder.com/800x600?text=Sin+imagen'
  const hasRating = typeof product.rating === 'number'
  const hasPrice = typeof product.price === 'number'

  return (
    <section className="container-xl py-4 py-md-5">
      <div className="card border-0 shadow-sm overflow-hidden">
        <div className="row g-0">
          <div className="col-12 col-md-5">
            <img
              src={imageUrl}
              alt={product.title}
              className="w-100"
              style={{ objectFit: 'contain', objectPosition: 'center', maxHeight: 760, backgroundColor: 'var(--bs-light)' }}
            />
          </div>
          <div className="col-12 col-md-7">
            <div className="card-body p-4 p-lg-5">
              <h1 className="h3 fw-bold">{product.title}</h1>
              <p className="text-muted">{product.description}</p>
              <div className="d-flex gap-3 flex-wrap">
                <span className="badge text-bg-dark">{product.brand || 'Marca nicho'}</span>
                <span className="badge text-bg-success">Origen: Europeo / Dubai</span>
                {hasRating && <span className="badge text-bg-warning">Rating: {product.rating}</span>}
              </div>
              <h2 className="h4 mt-4">{hasPrice ? `$${product.price}` : 'Precio no disponible'}</h2>
              <Link to="/perfumes" className="btn btn-outline-dark mt-3">
                Volver a perfumes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductDetailPage
