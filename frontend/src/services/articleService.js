import apiClient from './api'

function normalizeResponse(data) {
  return data?.data || data || []
}

export const articleService = {
  listArticles: async () => {
    const response = await apiClient.get('/articles/')
    return normalizeResponse(response.data)
  },

  getArticle: async (articleId) => {
    const response = await apiClient.get(`/articles/${articleId}/`)
    return normalizeResponse(response.data)
  },

  deleteArticle: async (articleId) => {
    const response = await apiClient.delete(`/articles/${articleId}/`)
    return normalizeResponse(response.data)
  },
}
