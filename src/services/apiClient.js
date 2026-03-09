import { DUMMYJSON_API_BASE_URL } from '../config/env'

export async function apiClient(endpoint, options = {}) {
  const { method = 'GET', body, token, headers = {} } = options

  const response = await fetch(`${DUMMYJSON_API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })

  let data = null
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Error inesperado en la petición')
  }

  return data
}
