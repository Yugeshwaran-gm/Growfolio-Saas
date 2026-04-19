import apiClient from './api'

function unwrapListResponse(data) {
  return data?.results ?? data ?? []
}

export const notificationService = {
  listNotifications: async () => {
    const response = await apiClient.get('/notifications/')
    return unwrapListResponse(response.data)
  },

  markAsRead: async (notificationId) => {
    const response = await apiClient.patch(`/notifications/${notificationId}/read/`)
    return response.data
  },
}