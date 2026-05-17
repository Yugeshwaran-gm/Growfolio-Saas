import apiClient from './api'
import { unwrapApiData, unwrapListData } from './api'

function normalizeResponse(data) {
  return unwrapApiData(data) || []
}

export const skillService = {
  extractSkills: async () => {
    const response = await apiClient.post('/skills/extract/')
    return normalizeResponse(response.data)
  },

  listSkills: async () => {
    const response = await apiClient.get('/skills/')
    return unwrapListData(response.data)
  },

  updateSkill: async (id, payload) => {
    const response = await apiClient.patch(`/skills/${id}/`, payload)
    return unwrapApiData(response.data)
  },

  deleteSkill: async (id) => {
    await apiClient.delete(`/skills/${id}/`)
  },
}
