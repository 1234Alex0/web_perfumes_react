const API_BASE_URL = 'https://dummyjson.com'

export async function apiClient(endpoint, options = {}) {
  const { method = 'GET', body, token, headers = {} } = options

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
