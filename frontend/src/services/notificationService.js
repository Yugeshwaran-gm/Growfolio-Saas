import apiClient from './api'
import { unwrapApiData, unwrapListData } from './api'

function unwrapListResponse(data) {
  return unwrapListData(data)
}

export const notificationService = {
  getNotifications: async () => {
    const response = await apiClient.get('/notifications/')
    return unwrapListResponse(response.data)
  },

  // reserved for future use: listNotifications alias

  markAsRead: async (notificationId) => {
    const response = await apiClient.patch(`/notifications/${notificationId}/read/`)
    return unwrapApiData(response.data)
  },
}