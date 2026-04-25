import apiClient from './api'

function unwrapListResponse(data) {
  return data?.results ?? data ?? []
}

export const projectService = {
  listProjects: async () => {
    const response = await apiClient.get('/projects/')
    return unwrapListResponse(response.data)
  },

  createProject: async (payload) => {
    const response = await apiClient.post('/projects/', payload)
    return response.data
  },

  getProject: async (projectId) => {
    const response = await apiClient.get(`/projects/${projectId}/`)
    return response.data
  },

  updateProject: async (projectId, payload) => {
    const response = await apiClient.patch(`/projects/${projectId}/`, payload)
    return response.data
  },

  deleteProject: async (projectId) => {
    const response = await apiClient.delete(`/projects/${projectId}/`)
    return response.data
  },

  importGithubProjects: async () => {
    const response = await apiClient.post('/integrations/github/sync/')
    return response.data
  },

  // reserved for future use: public project detail and visibility toggle endpoints
}