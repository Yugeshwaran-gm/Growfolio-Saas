import React, { useCallback, useMemo } from 'react'
import ReactFlow, { 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  Position,
  MarkerType
} from 'reactflow'
import 'reactflow/dist/style.css'

const NODE_WIDTH = 120
const NODE_HEIGHT = 50

export const GraphVisualization = ({ nodes: dataNodes, edges: dataEdges, loading, error }) => {
  // Transform API nodes to React Flow format
  const nodes = useMemo(() => {
    if (!dataNodes || dataNodes.length === 0) return []

    // Separate skills from other nodes
    const skillNodes = dataNodes.filter(n => n.type === 'skill')
    const otherNodes = dataNodes.filter(n => n.type !== 'skill')

    // Arrange skills in a circle
    const skillCount = skillNodes.length
    const radius = Math.max(200, skillCount * 40)

    const transformedNodes = skillNodes.map((node, index) => {
      const angle = (index / skillCount) * 2 * Math.PI
      return {
        id: String(node.id),
        data: { label: node.name },
        position: {
          x: Math.cos(angle) * radius,
          y: Math.sin(angle) * radius
        },
        style: {
          background: '#10b981',
          color: '#fff',
          border: '2px solid #059669',
          borderRadius: '8px',
          padding: '10px',
          fontSize: '12px',
          fontWeight: 'bold',
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          wordWrap: 'break-word'
        }
      }
    })

    // Add other nodes (projects, etc.) around skills
    otherNodes.forEach((node, index) => {
      const skillIndex = index % Math.max(1, skillCount)
      const angle = (skillIndex / skillCount) * 2 * Math.PI
      const projectRadius = radius * 1.5

      transformedNodes.push({
        id: String(node.id),
        data: { label: node.name },
        position: {
          x: Math.cos(angle) * projectRadius + Math.cos(angle + 0.5) * 60,
          y: Math.sin(angle) * projectRadius + Math.sin(angle + 0.5) * 60
        },
        style: {
          background: '#6366f1',
          color: '#fff',
          border: '2px solid #4f46e5',
          borderRadius: '8px',
          padding: '8px',
          fontSize: '11px',
          width: NODE_WIDTH,
          height: NODE_HEIGHT,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          wordWrap: 'break-word'
        }
      })
    })

    return transformedNodes
  }, [dataNodes])

  // Transform API edges to React Flow format
  const edges = useMemo(() => {
    if (!dataEdges) return []

    return dataEdges.map((edge, index) => ({
      id: `edge-${edge.source}-${edge.target}-${index}`,
      source: String(edge.source),
      target: String(edge.target),
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
      animated: false,
      style: { stroke: '#94a3b8', strokeWidth: 2 }
    }))
  }, [dataEdges])

  const [flowNodes, setNodes, onNodesChange] = useNodesState(nodes)
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState(edges)

  // Update flow nodes/edges when data changes
  React.useEffect(() => {
    setNodes(nodes)
  }, [nodes, setNodes])

  React.useEffect(() => {
    setEdges(edges)
  }, [edges, setEdges])

  if (error) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600">Error loading graph: {error}</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-50 rounded-lg">
        <p className="text-gray-500">Loading graph visualization...</p>
      </div>
    )
  }

  if (!flowNodes || flowNodes.length === 0) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No graph data available. Create projects and skills to build your graph.</p>
      </div>
    )
  }

  return (
    <div className="w-full h-[500px] border border-gray-200 rounded-lg overflow-hidden bg-white">
      <ReactFlow 
        nodes={flowNodes} 
        edges={flowEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
      >
        <Background color="#aaa" gap={16} />
        <Controls />
      </ReactFlow>
    </div>
  )
}
