import apiClient from './api'

export const authService = {
  login: async (email, password) => {
    const response = await apiClient.post('/auth/login/', {
      email,
      password,
    })
    return response.data
  },

  register: async (email, password, firstName, lastName) => {
    const response = await apiClient.post('/auth/register/', {
      email,
      password,
      first_name: firstName,
      last_name: lastName,
    })
    return response.data
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout/')
    return response.data
  },

  refreshToken: async (refreshToken) => {
    const response = await apiClient.post('/auth/refresh/', {
      refresh: refreshToken,
    })
    return response.data
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me/')
    return response.data
  },

  updateProfile: async (data) => {
    const response = await apiClient.put('/auth/profile/', data)
    return response.data
  },

  requestPasswordReset: async (email) => {
    const response = await apiClient.post('/auth/password-reset-request/', {
      email,
    })
    return response.data
  },

  resetPassword: async (token, password) => {
    const response = await apiClient.post('/auth/password-reset/', {
      token,
      password,
    })
    return response.data
  },
}
