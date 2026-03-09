import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import ProductForm from '../components/products/ProductForm'
import { useAuth } from '../hooks/useAuth'
import { productsService } from '../services/productsService'

function AdminDashboardPage() {
  const { token } = useAuth()
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [loading, setLoading] = useState(false)

  const formTitle = useMemo(
    () => (selectedProduct ? `Editar producto #${selectedProduct.id}` : 'Crear producto nuevo'),
    [selectedProduct],
  )

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await productsService.getProducts(12, 0)
        setProducts(data.products || [])
      } catch (error) {
        toast.error(error.message)
      }
    }

    loadProducts()
  }, [])

  const handleCreate = async (payload) => {
    setLoading(true)
    try {
      const created = await productsService.createProduct(payload, token)
      setProducts((prev) => [created, ...prev])
      toast.success('Producto creado (POST)')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePut = async () => {
    if (!selectedProduct) return
    setLoading(true)
    try {
      const replaced = await productsService.replaceProduct(
        selectedProduct.id,
        {
          title: `${selectedProduct.title} (PUT)`,
          description: selectedProduct.description,
          price: selectedProduct.price,
          category: selectedProduct.category,
          thumbnail: selectedProduct.thumbnail,
        },
        token,
      )

      setProducts((prev) => prev.map((item) => (item.id === replaced.id ? replaced : item)))
      setSelectedProduct(replaced)
      toast.success('Producto actualizado por PUT')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePatch = async () => {
    if (!selectedProduct) return
    setLoading(true)
    try {
      const patched = await productsService.updateProduct(
        selectedProduct.id,
        { price: Number(selectedProduct.price) + 1 },
        token,
      )
      setProducts((prev) => prev.map((item) => (item.id === patched.id ? { ...item, ...patched } : item)))
      setSelectedProduct((prev) => (prev ? { ...prev, ...patched } : prev))
      toast.success('Producto actualizado por PATCH')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId) => {
    setLoading(true)
    try {
      await productsService.deleteProduct(productId, token)
      setProducts((prev) => prev.filter((item) => item.id !== productId))
      if (selectedProduct?.id === productId) {
        setSelectedProduct(null)
      }
      toast.success('Producto eliminado (DELETE)')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitForm = async (formValues) => {
    if (!selectedProduct) {
      await handleCreate(formValues)
      return
    }

    setLoading(true)
    try {
      const updated = await productsService.updateProduct(selectedProduct.id, formValues, token)
      setProducts((prev) => prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item)))
      setSelectedProduct((prev) => (prev ? { ...prev, ...updated } : prev))
      toast.success('Producto editado desde formulario (PATCH)')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="container-xl py-4 py-md-5">
      <h1 className="page-title fw-bold mb-4">Panel de administración</h1>

      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm border-0 sticky-tools">
            <div className="card-body">
              <h2 className="h5 mb-3">{formTitle}</h2>
              <ProductForm
                initialData={selectedProduct}
                onSubmit={handleSubmitForm}
                submitLabel={selectedProduct ? 'Guardar cambios' : 'Crear'}
                loading={loading}
              />

              {selectedProduct && (
                <div className="mt-3 d-flex gap-2 flex-wrap">
                  <button className="btn btn-outline-primary btn-sm" type="button" onClick={handlePut} disabled={loading}>
                    Probar PUT
                  </button>
                  <button className="btn btn-outline-secondary btn-sm" type="button" onClick={handlePatch} disabled={loading}>
                    Probar PATCH
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    type="button"
                    onClick={() => handleDelete(selectedProduct.id)}
                    disabled={loading}
                  >
                    Eliminar
                  </button>
                  <button className="btn btn-light btn-sm" type="button" onClick={() => setSelectedProduct(null)}>
                    Limpiar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h2 className="h5 mb-3">Productos cargados (GET)</h2>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Título</th>
                      <th>Precio</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((item) => (
                      <tr key={item.id}>
                        <td>{item.id}</td>
                        <td>{item.title}</td>
                        <td>${item.price}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-outline-dark"
                            type="button"
                            onClick={() => setSelectedProduct(item)}
                          >
                            Editar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AdminDashboardPage
