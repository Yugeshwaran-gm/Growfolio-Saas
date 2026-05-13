import apiClient from './api'

function normalizeResponse(data) {
  return data?.data || data || []
}

export const adminService = {
  getDashboard: async () => {
    const response = await apiClient.get('/admin/dashboard/')
    return normalizeResponse(response.data)
  },

  listUsers: async () => {
    const response = await apiClient.get('/admin/users/')
    const payload = normalizeResponse(response.data)
    return Array.isArray(payload) ? payload : []
  },

  toggleUserStatus: async (userId) => {
    const response = await apiClient.patch(`/admin/users/${userId}/toggle/`)
    return normalizeResponse(response.data)
  },

  getContentOverview: async () => {
    const response = await apiClient.get('/admin/content/')
    return normalizeResponse(response.data)
  },

  getAnalyticsOverview: async () => {
    const response = await apiClient.get('/admin/analytics/')
    return normalizeResponse(response.data)
  },

  getSettingsOverview: async () => {
    const response = await apiClient.get('/admin/settings/')
    return normalizeResponse(response.data)
  },
}
