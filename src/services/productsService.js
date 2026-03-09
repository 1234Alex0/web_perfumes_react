import { apiClient } from './apiClient'
import { PERFUM_API_BASE_URL } from '../config/env'

const PERFUM_API_LIST_URL = `${PERFUM_API_BASE_URL}/perfumes?limit=200&offset=0`
const PERFUM_API_SEARCH_URL = (query) =>
  `${PERFUM_API_BASE_URL}/perfumes/search/${encodeURIComponent(query)}?limit=200`
const PERFUM_API_DETAIL_URL = (id) => `${PERFUM_API_BASE_URL}/perfumes/${encodeURIComponent(id)}`
const PERFUM_API_TIMEOUT_MS = 12000
const PERFUMES_CACHE_KEY = 'perfumes_catalog_cache_v1'

function isBrowser() {
  return typeof window !== 'undefined'
}

function readCachedPerfumes() {
  if (!isBrowser()) return []

  try {
    const raw = window.sessionStorage.getItem(PERFUMES_CACHE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeCachedPerfumes(products) {
  if (!isBrowser() || !Array.isArray(products) || !products.length) return

  try {
    window.sessionStorage.setItem(PERFUMES_CACHE_KEY, JSON.stringify(products))
  } catch {
    // no-op
  }
}

async function fetchJsonWithTimeout(url, timeoutMs = PERFUM_API_TIMEOUT_MS) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, { signal: controller.signal })

    if (!response.ok) {
      throw new Error(`PerfumAPI no disponible (${response.status})`)
    }

    return await response.json()
  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error('PerfumAPI tardó demasiado en responder')
    }

    throw new Error(error?.message || 'No se pudo conectar con PerfumAPI')
  } finally {
    clearTimeout(timeoutId)
  }
}

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

function normalizeDummyJsonProduct(item) {
  const id = String(item.id || '').trim()
  const title = item.title?.trim()

  if (!id || !title) return null

  return {
    id,
    title,
    description: item.description?.trim() || 'Perfume sin descripción disponible.',
    brand: item.brand?.trim() || 'Perfume',
    gender: 'Unisex',
    releaseYear: null,
    price: typeof item.price === 'number' ? Number(item.price) : estimatePerfumePrice(id),
    rating: item.rating ? Number(item.rating) : null,
    thumbnail: item.thumbnail || item.images?.[0] || '',
    category: item.category || 'perfumes',
    source: 'dummyjson-fallback',
  }
}

async function getDummyJsonPerfumesFallback() {
  const data = await apiClient('/products/category/fragrances?limit=100')
  const products = (data.products || []).map(normalizeDummyJsonProduct).filter(Boolean)

  return {
    products,
    total: data.total || products.length,
      source: 'dummyjson-fallback',
  }
}

async function getPerfumApiPerfumes() {
  try {
    const data = await fetchJsonWithTimeout(PERFUM_API_LIST_URL)
    const normalizedProducts = (data.perfumes || []).map(normalizePerfumApiProduct).filter(Boolean)

    if (!normalizedProducts.length) {
      throw new Error('PerfumAPI respondió sin perfumes')
    }

    writeCachedPerfumes(normalizedProducts)

    return {
      products: normalizedProducts,
      total: data.total || normalizedProducts.length,
      source: 'perfumapi',
    }
  } catch {
    const cachedProducts = readCachedPerfumes()
    if (cachedProducts.length) {
      return {
        products: cachedProducts,
        total: cachedProducts.length,
        source: 'cache',
        warning: 'Se muestran datos en caché por demora o error de la API de perfumes.',
      }
    }

    const fallback = await getDummyJsonPerfumesFallback()
    return {
      products: fallback.products,
      total: fallback.total,
      source: 'dummyjson-fallback',
      warning: 'Se muestran perfumes de respaldo (DummyJSON) por error temporal de PerfumAPI.',
    }
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

    try {
      const data = await fetchJsonWithTimeout(PERFUM_API_SEARCH_URL(normalized))
      const baseItems = Array.isArray(data) ? data : data?.perfumes || []
      const filtered = baseItems.map(normalizePerfumApiProduct).filter(Boolean)

      if (filtered.length) {
        return {
          products: filtered,
          total: filtered.length,
          source: 'perfumapi',
        }
      }
    } catch {
      // fallback below
    }

    const fallbackCatalog = await getPerfumApiPerfumes()
    const filteredFallback = fallbackCatalog.products.filter((item) => {
      const haystack = [item.title, item.description, item.brand, item.gender].join(' ').toLowerCase()
      return haystack.includes(normalized)
    })

    return {
      products: filteredFallback,
      total: filteredFallback.length,
      source: fallbackCatalog.source || 'unknown',
      ...(fallbackCatalog.warning ? { warning: fallbackCatalog.warning } : {}),
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
