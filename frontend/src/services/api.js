import axios from 'axios'

const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
export const API_BASE_URL = RAW_API_BASE_URL.replace(/\/+$/, '')

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
})

export const AUTH_STORAGE_KEYS = {
  ACCESS_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'auth_user',
}

const ACCESS_TOKEN_KEY = AUTH_STORAGE_KEYS.ACCESS_TOKEN
const REFRESH_TOKEN_KEY = AUTH_STORAGE_KEYS.REFRESH_TOKEN

function getAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY)
}

function getRefreshToken() {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY)
}

function restoreAuthSession() {
  const storedToken = getAccessToken()
  const storedUserRaw = sessionStorage.getItem(AUTH_STORAGE_KEYS.USER)

  if (!storedToken || !storedUserRaw) {
    return { token: null, user: null, refreshToken: null }
  }

  try {
    return {
      token: storedToken,
      user: JSON.parse(storedUserRaw),
      refreshToken: getRefreshToken(),
    }
  } catch {
    return { token: null, user: null, refreshToken: null }
  }
}

function setAccessToken(token) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
}

function clearAuthStorage() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  sessionStorage.removeItem(AUTH_STORAGE_KEYS.USER)
}

function unwrapApiData(data) {
  if (data && typeof data === 'object' && 'data' in data) {
    return data.data
  }

  return data
}

function unwrapListData(data) {
  const payload = unwrapApiData(data)

  if (payload && typeof payload === 'object' && 'results' in payload) {
    return Array.isArray(payload.results) ? payload.results : []
  }

  return Array.isArray(payload) ? payload : []
}

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken()

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }

    return config
  },
  (error) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const status = error.response?.status
    const method = originalRequest?.method?.toLowerCase()

    if (
      originalRequest &&
      method === 'get' &&
      [502, 503, 504].includes(status) &&
      (originalRequest.__retryCount || 0) < 2
    ) {
      originalRequest.__retryCount = (originalRequest.__retryCount || 0) + 1
      return apiClient(originalRequest)
    }

    if (status === 401 && originalRequest && !originalRequest._retry) {
      const refreshToken = getRefreshToken()

      if (refreshToken) {
        originalRequest._retry = true

        try {
          const refreshResponse = await axios.post(
            `${API_BASE_URL}/api/auth/refresh/`,
            { refresh: refreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          )

          const newAccessToken = refreshResponse.data?.access

          if (newAccessToken) {
            setAccessToken(newAccessToken)
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return apiClient(originalRequest)
          }
        } catch (refreshError) {
          clearAuthStorage()
          if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
            window.location.href = '/login'
          }
          return Promise.reject(refreshError)
        }
      }

      clearAuthStorage()
      if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export { clearAuthStorage, getAccessToken, getRefreshToken, restoreAuthSession, setAccessToken, unwrapApiData, unwrapListData }
export default apiClient
