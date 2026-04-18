import { createContext, useState, useCallback, useEffect } from 'react'

export const AuthContext = createContext(null)

const TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'auth_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Initialize auth state from sessionStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedToken = sessionStorage.getItem(TOKEN_KEY)
        const storedUser = sessionStorage.getItem(USER_KEY)

        if (storedToken && storedUser) {
          setToken(storedToken)
          setUser(JSON.parse(storedUser))
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
      sessionStorage.setItem(TOKEN_KEY, authToken)
      sessionStorage.setItem(USER_KEY, JSON.stringify(userData))

      // Store refresh token in a more secure way (httpOnly cookies would be ideal in production)
      if (refreshToken) {
        sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
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

    // Clear all auth-related data
    sessionStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(USER_KEY)
    sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  }, [])

  const updateUser = useCallback((updatedUserData) => {
    setUser(prev => ({ ...prev, ...updatedUserData }))
    sessionStorage.setItem(USER_KEY, JSON.stringify({ ...user, ...updatedUserData }))
  }, [user])

  const getToken = useCallback(() => {
    return token
  }, [token])

  const getRefreshToken = useCallback(() => {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY)
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
