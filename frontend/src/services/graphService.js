import apiClient, { unwrapApiData } from './api'

export const graphVisualizationReadiness = {
  reactFlowInstalled: false,
  foundationOnly: true,
}

export const graphService = {
  getMetrics: async ({ userId, topN = 8 } = {}) => {
    const params = {}

    if (Number.isInteger(userId)) {
      params.user_id = userId
    }

    if (Number.isInteger(topN)) {
      params.top_n = Math.max(1, Math.min(topN, 20))
    }

    const response = await apiClient.get('/graph/metrics/', { params })
    return unwrapApiData(response.data)
  },

  getGraph: async ({ limit = 250 } = {}) => {
    const params = {}

    if (Number.isInteger(limit)) {
      params.limit = Math.max(1, Math.min(limit, 500))
    }

    const response = await apiClient.get('/graph/', { params })
    return response.data
  },
}
