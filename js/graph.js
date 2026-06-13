const ROLE_STYLES = {
  Líder:      { bg: '#16a34a', border: '#15803d', highlight: '#14532d', glow: 'rgba(22,163,74,0.3)' },
  Popular:    { bg: '#6366f1', border: '#4f46e5', highlight: '#4338ca', glow: 'rgba(99,102,241,0.3)' },
  Puente:     { bg: '#f59e0b', border: '#d97706', highlight: '#b45309', glow: 'rgba(245,158,11,0.3)' },
  Rechazado:  { bg: '#ef4444', border: '#dc2626', highlight: '#b91c1c', glow: 'rgba(239,68,68,0.3)' },
  Aislado:    { bg: '#94a3b8', border: '#64748b', highlight: '#475569', glow: 'rgba(148,163,184,0.3)' },
  Neutro:     { bg: '#8b5cf6', border: '#7c3aed', highlight: '#6d28d9', glow: 'rgba(139,92,246,0.3)' },
}

let networkInstance = null

function renderGraph(containerId, students, matrix, roles, onNodeClick) {
  const container = document.getElementById(containerId)
  if (!container) return
  if (networkInstance) { networkInstance.destroy(); networkInstance = null }

  const choicesCount = {}
  for (const s of students) {
    choicesCount[s.id] = 0
    for (const s2 of students) {
      if (s.id !== s2.id && matrix[s.id]?.[s2.id]?.choice > 0) choicesCount[s.id]++
    }
  }
  const maxChoices = Math.max(...Object.values(choicesCount), 1)

  const nodes = students.map(s => {
    const style = ROLE_STYLES[roles[s.id]] || ROLE_STYLES.Neutro
    const centrality = choicesCount[s.id] || 0
    const size = 28 + (centrality / maxChoices) * 20
    return {
      id: s.id,
      label: s.name,
      title: `<strong>${s.name}</strong><br>Rol: ${roles[s.id] || 'Neutro'}<br>Elecciones recibidas: ${centrality}`,
      color: { background: style.bg, border: style.border, highlight: { background: style.highlight, border: style.highlight } },
      size,
      font: { size: Math.max(11, 12 + (centrality / maxChoices) * 6), color: '#1e293b', face: 'Inter, system-ui, sans-serif', strokeWidth: 2, strokeColor: '#ffffff' },
      borderWidth: centrality > maxChoices * 0.5 ? 3 : 2,
      shadow: { enabled: true, color: style.glow, size: 10, x: 0, y: 2 },
      shape: 'dot',
      scaling: { label: { enabled: false } },
    }
  })

  const edges = []
  const seen = new Set()
  const edgeColors = { choice: '#6366f1', rejection: '#ef4444', mutual: '#16a34a' }

  for (const s1 of students) {
    for (const s2 of students) {
      if (s1.id === s2.id) continue
      const m = matrix[s1.id]?.[s2.id]
      if (!m || (!m.choice && !m.rejection)) continue
      const key = `${s1.id}-${s2.id}`
      if (seen.has(key)) continue
      const rev = matrix[s2.id]?.[s1.id]
      const hasC = m.choice > 0, hasR = m.rejection > 0
      const revC = rev?.choice > 0

      if (hasC && revC) {
        edges.push({
          from: s1.id, to: s2.id,
          color: { color: edgeColors.mutual, highlight: '#15803d', hover: edgeColors.mutual },
          width: 3,
          arrows: { to: { enabled: true, scaleFactor: 0.6 } },
          smooth: { type: 'curvedCW', roundness: 0.1 },
          title: `${s1.name} ↔ ${s2.name} (mutua)`,
        })
        seen.add(key); seen.add(`${s2.id}-${s1.id}`)
        continue
      }

      if (hasC) {
        edges.push({
          from: s1.id, to: s2.id,
          color: { color: edgeColors.choice, highlight: '#4f46e5', hover: edgeColors.choice },
          width: 1.5 + m.choice * 0.5,
          arrows: { to: { enabled: true, scaleFactor: 0.6 } },
          smooth: { type: 'curvedCW', roundness: 0.15 },
          title: `${s1.name} → ${s2.name}`,
        })
        seen.add(key)
      }

      if (hasR) {
        edges.push({
          from: s1.id, to: s2.id,
          color: { color: edgeColors.rejection, highlight: '#dc2626', hover: edgeColors.rejection },
          width: 1.5,
          dashes: [6, 4],
          arrows: { to: { enabled: true, scaleFactor: 0.6 } },
          smooth: { type: 'curvedCW', roundness: 0.15 },
          title: `${s1.name} ⊘ ${s2.name}`,
        })
        seen.add(key)
      }
    }
  }

  networkInstance = new vis.Network(container,
    { nodes: new vis.DataSet(nodes), edges: new vis.DataSet(edges) },
    {
      physics: {
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -60,
          centralGravity: 0.008,
          springLength: 180,
          springConstant: 0.06,
          damping: 0.5,
          avoidOverlap: 0.5,
        },
        stabilization: { iterations: 300, updateInterval: 25 },
      },
      interaction: {
        dragNodes: true, dragView: true, zoomView: true, hover: true,
        tooltipDelay: 150, hoverConnectedEdges: true,
        navigationButtons: true, keyboard: true,
      },
      edges: {
        smooth: { type: 'continuous' },
        font: { size: 10, color: '#64748b', strokeWidth: 2, strokeColor: '#ffffff' },
      },
      nodes: {
        borderWidthSelected: 3,
      },
      groups: { useDefaultGroups: false },
      layout: { improvedLayout: true },
    }
  )

  if (onNodeClick) {
    networkInstance.on('click', p => {
      if (p.nodes.length) onNodeClick(p.nodes[0])
    })
  }

  networkInstance.once('stabilizationIterationsDone', () => {
    networkInstance.setOptions({ physics: { enabled: false } })
  })

  return networkInstance
}

function destroyGraph() {
  if (networkInstance) { networkInstance.destroy(); networkInstance = null }
}