import apiClient from './api'

function buildProfilePayload(data) {
  if (data instanceof FormData) {
    return data
  }

  const payload = new FormData()

  Object.entries(data || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return

    // Serialize arrays or objects so backend JSONFields can parse them when using FormData
    if (Array.isArray(value) || (typeof value === 'object' && !(value instanceof File))) {
      payload.append(key, JSON.stringify(value))
      return
    }

    payload.append(key, value)
  })

  return payload
}

export const profileService = {
  getProfile: async () => {
    const response = await apiClient.get('/profile/')
    return response.data
  },

  updateProfile: async (data) => {
    const payload = buildProfilePayload(data)
    const response = await apiClient.patch('/profile/update/', payload)
    return response.data
  },
}