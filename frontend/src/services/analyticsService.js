import apiClient from './api'

export const analyticsService = {
  getDashboard: async () => {
    const response = await apiClient.get('/analytics/dashboard/')
    return response.data
  },

  getExploreProfiles: async (params = {}) => {
    const response = await apiClient.get('/explore/profiles/', { params })
    return response.data
  },
}