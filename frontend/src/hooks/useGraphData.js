import { useState, useEffect } from 'react'
import { graphService } from '../services/graphService'

export const useGraphData = (limit = 250, enabled = true) => {
  const [nodes, setNodes] = useState([])
  const [edges, setEdges] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!enabled) return

    const fetchGraphData = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await graphService.getGraph({ limit })

        if (response?.nodes) {
          setNodes(response.nodes)
          setEdges(response.edges || [])
        }
      } catch (err) {
        setError(err.response?.data?.detail || err.response?.data?.message || 'Failed to load graph data')
        setNodes([])
        setEdges([])
      } finally {
        setLoading(false)
      }
    }

    fetchGraphData()
  }, [limit, enabled])

  return { nodes, edges, loading, error }
}
