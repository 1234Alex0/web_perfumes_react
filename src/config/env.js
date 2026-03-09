const env = import.meta.env

export const DUMMYJSON_API_BASE_URL = env.VITE_DUMMYJSON_API_URL || 'https://dummyjson.com'
export const PERFUM_API_BASE_URL = env.VITE_PERFUM_API_URL || 'https://perfumapidatabase.onrender.com'
export const AUTH_TOKEN_STORAGE_KEY = env.VITE_AUTH_TOKEN_KEY || 'app_public_api_token'
