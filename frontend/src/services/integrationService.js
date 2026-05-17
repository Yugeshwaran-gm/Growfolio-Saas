import apiClient from './api'
import { unwrapApiData, unwrapListData } from './api'

function normalizeConnectResponse(data) {
  const payload = unwrapApiData(data)

  if (!payload || typeof payload !== 'object') {
    return { source: '', status: '' }
  }

  if ('source' in payload && 'status' in payload) {
    return {
      source: payload.source || '',
      status: payload.status || '',
      ...payload,
    }
  }

  return {
    source: payload.source_name || '',
    status: payload.sync_status || payload.status || '',
    ...payload,
  }
}

export const integrationService = {
  getIntegrations: async () => {
    const response = await apiClient.get('/integrations/')
    return unwrapListData(response.data)
  },

  // reserved for future use: listIntegrations alias

  connectIntegration: async (payload) => {
    if (!payload || typeof payload !== 'object') {
      throw new Error('connectIntegration payload must be an object.')
    }

    if (!payload.source_name || typeof payload.source_name !== 'string') {
      throw new Error('source_name is required.')
    }

    const response = await apiClient.post('/integrations/connect/', payload)
    return normalizeConnectResponse(response.data)
  },

  syncIntegration: async (source) => {
    const response = await apiClient.post(`/integrations/${source}/sync/`)
    return unwrapApiData(response.data)
  },

  disconnectIntegration: async (source) => {
    const response = await apiClient.delete(`/integrations/${source}/disconnect/`)
    return unwrapApiData(response.data)
  },
}