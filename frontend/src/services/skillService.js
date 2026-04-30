import apiClient from './api'

function normalizeResponse(data) {
  return data?.data || data || []
}

export const skillService = {
  extractSkills: async () => {
    const response = await apiClient.post('/skills/extract/')
    return normalizeResponse(response.data)
  },

  listSkills: async () => {
    const response = await apiClient.get('/skills/')
    // response is an array of { id, name }
    return response.data || []
  },

  updateSkill: async (id, payload) => {
    const response = await apiClient.patch(`/skills/${id}/`, payload)
    return response.data
  },

  deleteSkill: async (id) => {
    await apiClient.delete(`/skills/${id}/`)
  },
}
