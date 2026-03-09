import { apiClient } from './apiClient'

export const authService = {
  login(credentials) {
    return apiClient('/auth/login', {
      method: 'POST',
      body: {
        username: credentials.username,
        password: credentials.password,
        expiresInMins: 60,
      },
    })
  },

  getCurrentUser(token) {
    return apiClient('/auth/me', { token })
  },
}
