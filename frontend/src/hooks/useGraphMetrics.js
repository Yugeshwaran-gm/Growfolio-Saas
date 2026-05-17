import { useEffect, useState } from 'react'
import { graphService } from '../services/graphService'

export function useGraphMetrics({ userId, topN = 8, enabled = true } = {}) {
  const [metrics, setMetrics] = useState(null)
  const [loading, setLoading] = useState(Boolean(enabled))
  const [error, setError] = useState('')

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      setError('')
      return
    }

    let cancelled = false

    async function loadMetrics() {
      setLoading(true)
      setError('')

      try {
        const data = await graphService.getMetrics({ userId, topN })
        if (!cancelled) {
          setMetrics(data || null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.response?.data?.error || err.response?.data?.detail || 'Failed to load graph intelligence metrics.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadMetrics()

    return () => {
      cancelled = true
    }
  }, [enabled, topN, userId])

  return {
    metrics,
    loading,
    error,
  }
}
