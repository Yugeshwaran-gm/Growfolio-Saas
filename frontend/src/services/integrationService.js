import apiClient from './api'

function unwrapApiData(data) {
  if (data && typeof data === 'object' && 'data' in data) {
    return data.data
  }

  return data
}

export const integrationService = {
  getIntegrations: async () => {
    const response = await apiClient.get('/integrations/')
    const payload = unwrapApiData(response.data)
    return Array.isArray(payload) ? payload : []
  },

  listIntegrations: async () => {
    return integrationService.getIntegrations()
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