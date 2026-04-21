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
    // Backend API for listing skills does not exist yet.
    // Returning mock data keeps the UI functional until the API is implemented.
    return [
      { id: 1, name: 'React', proficiency: 90 },
      { id: 2, name: 'Python', proficiency: 85 },
      { id: 3, name: 'Django', proficiency: 85 },
      { id: 4, name: 'JavaScript', proficiency: 90 },
      { id: 5, name: 'SQL', proficiency: 80 },
      { id: 6, name: 'Tailwind CSS', proficiency: 95 },
    ]
  },
}
