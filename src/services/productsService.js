import { apiClient } from './apiClient'

export const productsService = {
  getPerfumes() {
    return apiClient('/products/category/fragrances')
  },

  async searchPerfumes(query) {
    const data = await apiClient('/products/category/fragrances')
    const normalized = query.trim().toLowerCase()

    if (!normalized) return data

    const filtered = (data.products || []).filter((item) => {
      const text = `${item.title} ${item.description} ${item.brand || ''}`.toLowerCase()
      return text.includes(normalized)
    })

    return { ...data, products: filtered }
  },

  getProductById(productId) {
    return apiClient(`/products/${productId}`)
  },

  createProduct(product, token) {
    return apiClient('/products/add', {
      method: 'POST',
      body: product,
      token,
    })
  },

  replaceProduct(productId, product, token) {
    return apiClient(`/products/${productId}`, {
      method: 'PUT',
      body: product,
      token,
    })
  },

  updateProduct(productId, product, token) {
    return apiClient(`/products/${productId}`, {
      method: 'PATCH',
      body: product,
      token,
    })
  },

  deleteProduct(productId, token) {
    return apiClient(`/products/${productId}`, {
      method: 'DELETE',
      token,
    })
  },
}
