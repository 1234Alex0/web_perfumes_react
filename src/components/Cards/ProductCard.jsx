import { Link } from 'react-router-dom'

function ProductCard({ product }) {
  const imageUrl = product.thumbnail || 'https://via.placeholder.com/640x480?text=Sin+imagen'
  const hasPrice = typeof product.price === 'number'

  return (
    <div className="card shadow-sm card-equal">
      <img
        src={imageUrl}
        className="card-img-top"
        alt={product.title}
        style={{ objectFit: 'contain', objectPosition: 'center', height: 220, backgroundColor: '#f8f9fa' }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{product.title}</h5>
        <p className="card-text text-muted text-ellipsis-2">{product.description}</p>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="badge text-bg-primary">{product.brand || 'Perfume'}</span>
          <span className="fw-semibold">{hasPrice ? `$${product.price}` : 'Precio N/D'}</span>
        </div>
        <Link to={`/perfumes/${product.id}`} className="btn btn-outline-dark btn-sm mt-3">
          Ver perfume
        </Link>
      </div>
    </div>
  )
}

export default ProductCard
