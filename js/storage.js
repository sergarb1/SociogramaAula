const db = idbKeyval

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

async function loadGroups() {
  return (await db.get('sociogram-groups')) || []
}

async function saveGroups(groups) {
  const clean = JSON.parse(JSON.stringify(groups))
  await db.set('sociogram-groups', clean)
}

async function loadResponses(groupId) {
  return (await db.get(`sociogram-responses-${groupId}`)) || {}
}

async function saveResponses(groupId, responses) {
  const clean = JSON.parse(JSON.stringify(responses))
  await db.set(`sociogram-responses-${groupId}`, clean)
}

async function loadTemplates() {
  const custom = (await db.get('sociogram-templates')) || []
  return [...BUILTIN_TEMPLATES, ...custom]
}

async function saveCustomTemplates(templates) {
  await db.set('sociogram-templates', templates)
}

async function exportAllData() {
  const groups = await loadGroups()
  const allResponses = {}
  for (const g of groups) allResponses[g.id] = await loadResponses(g.id)
  const data = { version: 1, exportDate: new Date().toISOString(), groups, responses: allResponses }
  downloadJSON(data, `sociograma-${new Date().toISOString().slice(0, 10)}.json`)
}

async function importFromFile(file) {
  const text = await file.text()
  const data = JSON.parse(text)
  if (!data.groups) throw new Error('Formato inválido')
  await saveGroups(data.groups)
  if (data.responses) {
    for (const [gid, responses] of Object.entries(data.responses))
      await saveResponses(gid, responses)
  }
  return data.groups
}

function downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

async function saveDistribution(groupId, distGrid, distSize, distCols) {
  const gridIds = distGrid.map(row => row.map(table => table.map(s => s.id)))
  await db.set(`sociogram-dist-${groupId}`, { grid: gridIds, size: distSize, cols: distCols })
}

async function loadDistribution(groupId, students) {
  const data = await db.get(`sociogram-dist-${groupId}`)
  if (!data) return null
  const map = Object.fromEntries(students.map(s => [s.id, s]))
  const grid = data.grid.map(row => row.map(ids => ids.map(id => map[id]).filter(Boolean)))
  return { grid: grid.filter(row => row.some(t => t.length)), size: data.size, cols: data.cols }
}