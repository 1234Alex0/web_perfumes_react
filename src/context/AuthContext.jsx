import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { AUTH_TOKEN_STORAGE_KEY } from '../config/env'
import { authService } from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(AUTH_TOKEN_STORAGE_KEY))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
    setToken(null)
    setUser(null)
  }, [])

  const loadCurrentUser = useCallback(
    async (activeToken) => {
      if (!activeToken) return
      try {
        const me = await authService.getCurrentUser(activeToken)
        setUser(me)
      } catch {
        logout()
      }
    },
    [logout],
  )

  useEffect(() => {
    const initializeAuth = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      await loadCurrentUser(token)
      setLoading(false)
    }

    initializeAuth()
  }, [loadCurrentUser, token])

  const login = useCallback(async (credentials) => {
    const response = await authService.login(credentials)
    const receivedToken = response.accessToken || response.token
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, receivedToken)
    setToken(receivedToken)
    const me = await authService.getCurrentUser(receivedToken)
    setUser(me)
    return me
  }, [])

  const isAdmin = useMemo(() => {
    return user?.role === 'admin' || user?.role === 'superadmin'
  }, [user])

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isAdmin,
      loading,
      login,
      logout,
    }),
    [isAdmin, loading, login, logout, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
