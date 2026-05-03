import apiClient from './api'
import samplePortfolio from '../data/samplePortfolio.json'

export const publicPortfolioService = {
  getByUsername: async (username) => {
    if (username === 'sample') {
      return samplePortfolio
    }
    const response = await apiClient.get(`/portfolio/${username}/`)
    return response.data
  },
  getContributions: async (username) => {
    if (username === 'sample') {
      return samplePortfolio.contributions_sample
    }
    const response = await apiClient.get(`/portfolio/${username}/contributions/`)
    return response.data
  },
}
