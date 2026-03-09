import { apiClient } from './apiClient'
import { PERFUM_API_BASE_URL } from '../config/env'

const PERFUM_API_LIST_URL = `${PERFUM_API_BASE_URL}/perfumes?limit=200&offset=0`
const PERFUM_API_SEARCH_URL = (query) =>
  `${PERFUM_API_BASE_URL}/perfumes/search/${encodeURIComponent(query)}?limit=200`
const PERFUM_API_DETAIL_URL = (id) => `${PERFUM_API_BASE_URL}/perfumes/${encodeURIComponent(id)}`

function estimatePerfumePrice(productId) {
  const value = String(productId)
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0)

  const base = 24
  const spread = 156
  const estimated = base + (value % spread)

  return Number((estimated + 0.99).toFixed(2))
}

function normalizePerfumApiProduct(item) {
  const id = String(item.id || '').trim()
  const title = item.name?.trim()

  if (!id || !title) return null

  const notes = [...(item.notes_top || []), ...(item.notes_middle || []), ...(item.notes_base || [])]
  const shortDescription =
    item.description?.trim() ||
    (notes.length ? `Notas destacadas: ${notes.slice(0, 6).join(', ')}` : 'Perfume sin descripción disponible.')

  return {
    id,
    title,
    description: shortDescription,
    brand: item.brand?.trim() || 'Perfume',
    gender: item.gender?.trim() || 'Unisex',
    releaseYear: item.release_year || null,
    price: estimatePerfumePrice(id),
    rating: item.rating ? Number(item.rating) : null,
    thumbnail: item.image_url || '',
    category: 'perfumes',
    source: 'perfumapi',
  }
}

async function getPerfumApiPerfumes() {
  const response = await fetch(PERFUM_API_LIST_URL)
  const data = await response.json()

  const normalizedProducts = (data.perfumes || []).map(normalizePerfumApiProduct).filter(Boolean)

  return {
    products: normalizedProducts,
    total: data.total || normalizedProducts.length,
  }
}

export const productsService = {
  getProducts(limit = 12, skip = 0) {
    return apiClient(`/products?limit=${limit}&skip=${skip}`)
  },

  getPerfumes() {
    return getPerfumApiPerfumes()
  },

  async searchPerfumes(query) {
    const normalized = query.trim().toLowerCase()

    if (!normalized) return getPerfumApiPerfumes()

    const response = await fetch(PERFUM_API_SEARCH_URL(normalized))
    const data = await response.json()
    const filtered = (Array.isArray(data) ? data : []).map(normalizePerfumApiProduct).filter(Boolean)

    return {
      products: filtered,
      total: filtered.length,
    }
  },

  async getProductById(productId) {
    try {
      const response = await fetch(PERFUM_API_DETAIL_URL(productId))
      const data = await response.json()

      const normalized = normalizePerfumApiProduct(data)
      if (normalized) return normalized
    } catch {
      // Silent fallback to DummyJSON for compatibility
    }

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
