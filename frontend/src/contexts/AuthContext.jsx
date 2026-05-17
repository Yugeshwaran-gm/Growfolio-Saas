import { createContext, useState, useCallback, useEffect } from 'react'
import {
  AUTH_STORAGE_KEYS,
  clearAuthStorage,
  restoreAuthSession,
  getRefreshToken as getStoredRefreshToken,
  setAccessToken,
} from '../services/api'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state from sessionStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const session = restoreAuthSession()

        if (session.token && session.user) {
          setToken(session.token)
          setUser(session.user)
        }
      } catch (err) {
        console.error('Failed to initialize auth:', err)
        setError('Failed to restore session')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = useCallback((userData, authToken, refreshToken) => {
    try {
      setUser(userData)
      setToken(authToken)
      setError(null)

      // Store in sessionStorage (cleared on browser close)
      setAccessToken(authToken)
      sessionStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(userData))

      // Store refresh token in a more secure way (httpOnly cookies would be ideal in production)
      if (refreshToken) {
        sessionStorage.setItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken)
      }
    } catch (err) {
      setError('Failed to login')
      console.error('Login error:', err)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    setError(null)

    // Keep storage clearing centralized with transport/interceptor layer.
    clearAuthStorage()
  }, [])

  const updateUser = useCallback((updatedUserData) => {
    const nextUser = { ...(user || {}), ...updatedUserData }
    setUser(nextUser)
    sessionStorage.setItem(AUTH_STORAGE_KEYS.USER, JSON.stringify(nextUser))
  }, [user])

  const getToken = useCallback(() => {
    return token
  }, [token])

  const getRefreshToken = useCallback(() => {
    return getStoredRefreshToken()
  }, [])

  const isAuthenticated = !!token && !!user

  const value = {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login,
    logout,
    updateUser,
    getToken,
    getRefreshToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
