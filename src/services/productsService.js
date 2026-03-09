import { PERFUM_API_BASE_URL } from '../config/env'
import { apiClient } from './apiClient'

const PERFUM_API_LIST_URL = `${PERFUM_API_BASE_URL}/perfumes?limit=200&offset=0`
const PERFUM_API_SEARCH_URL = (query) =>
  `${PERFUM_API_BASE_URL}/perfumes/search/${encodeURIComponent(query)}?limit=200`
const PERFUM_API_DETAIL_URL = (id) => `${PERFUM_API_BASE_URL}/perfumes/${encodeURIComponent(id)}`
const PERFUM_API_TIMEOUT_MS = 30000
const PERFUMES_CACHE_KEY = 'perfumes_catalog_cache_v1'
const PERFUMES_ADMIN_MUTATIONS_KEY = 'perfumes_admin_mutations_v1'

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

function readAdminMutations() {
  if (!isBrowser()) {
    return { created: {}, updated: {}, deletedIds: [] }
  }

  try {
    const raw = window.localStorage.getItem(PERFUMES_ADMIN_MUTATIONS_KEY)
    if (!raw) {
      return { created: {}, updated: {}, deletedIds: [] }
    }

    const parsed = JSON.parse(raw)

    return {
      created: parsed?.created && typeof parsed.created === 'object' ? parsed.created : {},
      updated: parsed?.updated && typeof parsed.updated === 'object' ? parsed.updated : {},
      deletedIds: Array.isArray(parsed?.deletedIds) ? parsed.deletedIds.map((item) => String(item)) : [],
    }
  } catch {
    return { created: {}, updated: {}, deletedIds: [] }
  }
}

function writeAdminMutations(nextMutations) {
  if (!isBrowser()) return

  try {
    window.localStorage.setItem(PERFUMES_ADMIN_MUTATIONS_KEY, JSON.stringify(nextMutations))
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

function normalizeAdminPerfumePayload(payload, base = {}) {
  const baseId = String(base.id || '').trim()

  return {
    id: baseId,
    title: payload.title?.trim() || base.title || 'Perfume',
    description: payload.description?.trim() || base.description || 'Perfume sin descripción disponible.',
    brand: payload.brand?.trim() || base.brand || 'Perfume',
    gender: payload.gender?.trim() || base.gender || 'Unisex',
    releaseYear: payload.releaseYear || base.releaseYear || null,
    price:
      typeof payload.price === 'number' && Number.isFinite(payload.price)
        ? Number(payload.price)
        : typeof base.price === 'number'
          ? base.price
          : estimatePerfumePrice(baseId || `tmp-${Date.now()}`),
    rating: typeof base.rating === 'number' ? base.rating : null,
    thumbnail: payload.thumbnail?.trim() || base.thumbnail || '',
    category: payload.category?.trim() || base.category || 'perfumes',
    source: 'perfumapi-admin-local',
  }
}

function applyAdminMutations(baseProducts) {
  const mutations = readAdminMutations()
  const deletedSet = new Set(mutations.deletedIds)

  const mergedBase = baseProducts
    .filter((item) => !deletedSet.has(String(item.id)))
    .map((item) => {
      const override = mutations.updated[String(item.id)]
      return override ? { ...item, ...override, source: 'perfumapi-admin-local' } : item
    })

  const createdItems = Object.values(mutations.created)
    .filter(Boolean)
    .filter((item) => !deletedSet.has(String(item.id)))

  return [...createdItems, ...mergedBase]
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
      warning: 'PerfumAPI no estuvo disponible. Se muestran perfumes de respaldo (DummyJSON).',
    }
  }
}

async function getAdminPerfumes(limit = 12, skip = 0) {
  const catalog = await getPerfumApiPerfumes()
  const mergedProducts = applyAdminMutations(catalog.products || [])

  return {
    products: mergedProducts.slice(skip, skip + limit),
    total: mergedProducts.length,
    source: catalog.source,
    ...(catalog.warning ? { warning: catalog.warning } : {}),
  }
}

function createAdminPerfume(product) {
  const mutations = readAdminMutations()
  const newId = `local-${Date.now()}`
  const created = normalizeAdminPerfumePayload(product, { id: newId })

  mutations.created[newId] = created
  mutations.deletedIds = mutations.deletedIds.filter((item) => item !== newId)
  writeAdminMutations(mutations)

  return created
}

function replaceAdminPerfume(productId, product) {
  const id = String(productId)
  const mutations = readAdminMutations()

  if (mutations.created[id]) {
    const replacedCreated = normalizeAdminPerfumePayload(product, mutations.created[id])
    mutations.created[id] = { ...replacedCreated, id }
    writeAdminMutations(mutations)
    return mutations.created[id]
  }

  const previousOverride = mutations.updated[id] || { id }
  const replaced = normalizeAdminPerfumePayload(product, previousOverride)
  mutations.updated[id] = { ...replaced, id }
  writeAdminMutations(mutations)

  return mutations.updated[id]
}

function patchAdminPerfume(productId, product) {
  const id = String(productId)
  const mutations = readAdminMutations()

  if (mutations.created[id]) {
    const nextCreated = normalizeAdminPerfumePayload({ ...mutations.created[id], ...product }, mutations.created[id])
    mutations.created[id] = { ...nextCreated, id }
    writeAdminMutations(mutations)
    return mutations.created[id]
  }

  const previousOverride = mutations.updated[id] || { id }
  const nextPatch = normalizeAdminPerfumePayload({ ...previousOverride, ...product }, previousOverride)
  mutations.updated[id] = { ...nextPatch, id }
  writeAdminMutations(mutations)

  return mutations.updated[id]
}

function deleteAdminPerfume(productId) {
  const id = String(productId)
  const mutations = readAdminMutations()

  delete mutations.created[id]
  delete mutations.updated[id]

  if (!mutations.deletedIds.includes(id)) {
    mutations.deletedIds.push(id)
  }

  writeAdminMutations(mutations)
  return { id, isDeleted: true }
}

export const productsService = {
  getCachedPerfumesSnapshot() {
    return readCachedPerfumes()
  },

  getProducts(limit = 12, skip = 0) {
    return getAdminPerfumes(limit, skip)
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
      const data = await fetchJsonWithTimeout(PERFUM_API_DETAIL_URL(productId))

      const normalized = normalizePerfumApiProduct(data)
      if (normalized) return normalized
    } catch {
      const cached = readCachedPerfumes().find((item) => String(item.id) === String(productId))
      if (cached) return cached

      const adminOnly = applyAdminMutations([]).find((item) => String(item.id) === String(productId))
      if (adminOnly) return adminOnly

      try {
        const dummy = await apiClient(`/products/${productId}`)
        const normalizedDummy = normalizeDummyJsonProduct(dummy)
        if (normalizedDummy) return normalizedDummy
      } catch {
        // continue to final error
      }
    }

    throw new Error('No se pudo obtener el detalle del perfume en PerfumAPI.')
  },

  createProduct(product, _token) {
    return Promise.resolve(createAdminPerfume(product))
  },

  replaceProduct(productId, product, _token) {
    return Promise.resolve(replaceAdminPerfume(productId, product))
  },

  updateProduct(productId, product, _token) {
    return Promise.resolve(patchAdminPerfume(productId, product))
  },

  deleteProduct(productId, _token) {
    return Promise.resolve(deleteAdminPerfume(productId))
  },
}
