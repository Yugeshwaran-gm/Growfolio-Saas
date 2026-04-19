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

const ACCESS_TOKEN_KEY = 'auth_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

function getAccessToken() {
  return sessionStorage.getItem(ACCESS_TOKEN_KEY)
}

function getRefreshToken() {
  return sessionStorage.getItem(REFRESH_TOKEN_KEY)
}

function setAccessToken(token) {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
}

function clearAuthStorage() {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  sessionStorage.removeItem('auth_user')
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

export { clearAuthStorage, getAccessToken, getRefreshToken, setAccessToken }
export default apiClient
