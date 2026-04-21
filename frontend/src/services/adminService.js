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
    return normalizeResponse(response.data)
  },

  toggleUserStatus: async (userId) => {
    const response = await apiClient.patch(`/admin/users/${userId}/toggle/`)
    return normalizeResponse(response.data)
  },
}
