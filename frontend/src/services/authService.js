import apiClient, { clearAuthStorage } from './api'

export const authService = {
  login: async ({ email, password }) => {
    const response = await apiClient.post('/auth/login/', {
      email,
      password,
    })

    return response.data
  },

  register: async ({ email, username, password }) => {
    const response = await apiClient.post('/accounts/register/', {
      email,
      username,
      password,
    })

    return response.data
  },

  requestPasswordReset: async (email) => {
    const response = await apiClient.post('/accounts/forgot-password/', {
      email,
    })

    return response.data
  },

  resetPassword: async (token, password) => {
    const response = await apiClient.post(`/accounts/reset-password/${token}/`, {
      password,
    })

    return response.data
  },

  changePassword: async ({ old_password, new_password }) => {
    const response = await apiClient.post('/accounts/change-password/', {
      old_password,
      new_password,
    })

    return response.data
  },

  logout: () => {
    clearAuthStorage()
  },
}
