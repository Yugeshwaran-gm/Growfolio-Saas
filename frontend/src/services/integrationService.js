import apiClient from './api'

export const integrationService = {
  listIntegrations: async () => {
    const response = await apiClient.get('/integrations/')
    return response.data
  },

  connectIntegration: async (payload) => {
    const response = await apiClient.post('/integrations/connect/', payload)
    return response.data
  },

  syncIntegration: async (source) => {
    const response = await apiClient.post(`/integrations/${source}/sync/`)
    return response.data
  },

  disconnectIntegration: async (source) => {
    const response = await apiClient.delete(`/integrations/${source}/disconnect/`)
    return response.data
  },
}