import apiClient from './api'

export const publicPortfolioService = {
  getByUsername: async (username) => {
    const response = await apiClient.get(`/portfolio/${username}/`)
    return response.data
  },
}
