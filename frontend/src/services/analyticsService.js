import apiClient from './api'
import { unwrapApiData } from './api'

export const analyticsService = {
  getDashboard: async () => {
    const response = await apiClient.get('/analytics/dashboard/')
    return unwrapApiData(response.data)
  },

  getExploreProfiles: async (params = {}) => {
    const response = await apiClient.get('/explore/profiles/', { params })
    return unwrapApiData(response.data)
  },
}