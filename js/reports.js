async function exportGraphPNG(containerId, lang) {
  const el = document.getElementById(containerId)
  if (!el) return
  try {
    const canvas = await html2canvas(el, { backgroundColor: '#ffffff', scale: 2, useCORS: true })
    const link = document.createElement('a')
    link.download = 'sociograma-grafo.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  } catch { alert(t('toast.pngError', lang)) }
}

function exportReportHTML(group, metrics, roles, predictions, matrix, responses, lang) {
  const students = group.students
  const date = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  const t = (key) => window.t ? window.t(key, lang) : key
  const analysis = generateGroupAnalysis(students, matrix, roles, metrics, predictions, {}, {})

  const choicesCount = {}; const rejectionsCount = {}
  for (const s of students) { choicesCount[s.id] = 0; rejectionsCount[s.id] = 0 }
  for (const s of students)
    for (const [id, v] of Object.entries(matrix[s.id] || {})) {
      if (v?.choice) choicesCount[s.id]++
      if (v?.rejection) rejectionsCount[s.id]++
    }

  const roleRows = students.map(s => {
    const roleTrans = t('role.' + (ROLE_KEY_MAP[roles[s.id]] || 'neutral'), lang)
    return `<tr><td style="border-bottom:1px solid #e2e8f0;padding:6px 10px">${s.name}</td><td style="border-bottom:1px solid #e2e8f0;padding:6px 10px"><span style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:12px;background:${roleBg(roles[s.id])};color:${roleText(roles[s.id])}">${roleTrans}</span></td></tr>`
  }).join('')

  const preds = predictions.map(p => `<div style="margin-bottom:8px;padding:10px 14px;border-radius:10px;font-size:13px;${p.type==='risk'?'background:#fef2f2;border-left:3px solid #ef4444':p.type==='opportunity'?'background:#f0fdf4;border-left:3px solid #22c55e':'background:#eff6ff;border-left:3px solid #6366f1'}"><strong>${p.icon} ${p.label}</strong><br>${p.desc}${p.action ? '<br><em style="color:#64748b">→ '+p.action+'</em>' : ''}</div>`).join('')

  const riskColor = analysis.summary.riskLevel === 'crítico' ? '#ef4444' : analysis.summary.riskLevel === 'alto' ? '#f97316' : analysis.summary.riskLevel === 'medio' ? '#eab308' : '#22c55e'

  const profileRows = analysis.studentProfiles.map(p => {
    const badge = p.needsAttention ? `<span style="display:inline-block;padding:1px 6px;border-radius:999px;font-size:10px;background:#fef2f2;color:#ef4444;margin-left:4px">⚠️</span>` : ''
    const statusIcon = p.sociometricStatus === 'popular' ? '🌟' : p.sociometricStatus === 'polarizador' ? '🔄' : p.sociometricStatus === 'rechazado' ? '⚡' : p.sociometricStatus === 'ignorado' ? '👻' : ''
    return `<tr><td style="border-bottom:1px solid #e2e8f0;padding:6px 10px;font-size:13px">${p.name}${badge}</td>
      <td style="border-bottom:1px solid #e2e8f0;padding:6px 10px;font-size:12px">${t('role.'+ROLE_KEY_MAP[p.role]||'neutral')}</td>
      <td style="border-bottom:1px solid #e2e8f0;padding:6px 10px;font-size:11px;text-align:center">${statusIcon}</td>
      <td style="border-bottom:1px solid #e2e8f0;padding:6px 10px;font-size:12px;text-align:center">${p.c}</td>
      <td style="border-bottom:1px solid #e2e8f0;padding:6px 10px;font-size:12px;text-align:center;${p.r>0?'color:#ef4444':''}">${p.r}</td>
      <td style="border-bottom:1px solid #e2e8f0;padding:6px 10px;font-size:11px;color:#64748b">${p.recommendation}</td></tr>`
  }).join('')

  const recCards = analysis.recommendations.map(r => {
    const borderColor = r.priority === 'alta' ? '#ef4444' : r.priority === 'media' ? '#f97316' : '#22c55e'
    const bg = r.priority === 'alta' ? '#fef2f2' : r.priority === 'media' ? '#fff7ed' : '#f0fdf4'
    const actions = r.actions.map(a => `<li style="margin-bottom:4px">→ ${a}</li>`).join('')
    return `<div style="margin-bottom:12px;padding:12px 14px;border-radius:10px;font-size:13px;background:${bg};border-left:3px solid ${borderColor}">
      <strong style="font-size:14px">${r.icon} ${r.title}</strong><br>${r.desc}
      <ul style="margin-top:6px;font-size:12px;color:#64748b;list-style:none;padding-left:0">${actions}</ul></div>`
  }).join('')

  const sub = analysis.subgroups
  const subgroupSection = sub.subgroups.length ? `<h2>🔗 Subgrupos detectados</h2>
    ${sub.subgroups.map(g => `<div style="margin-bottom:8px;padding:8px 12px;border-radius:8px;background:#f8fafc;border:1px solid #e2e8f0;font-size:13px"><strong>${g.size} alumnos</strong> (densidad ${g.density}%): ${g.members.join(', ')}</div>`).join('')}
    ${sub.bridges.length ? `<div style="margin-top:8px;padding:8px 12px;border-radius:8px;background:#eff6ff;border:1px solid #bfdbfe;font-size:13px"><strong>🌉 Alumnos puente:</strong> ${sub.bridges.map(b => `${b.student}`).join(', ')}</div>` : ''}` : ''

  const conf = analysis.conflicts
  const conflictSection = conf.targeted.length ? `<h2>⚡ Conflictos</h2>
    ${conf.targeted.map(c => `<div style="margin-bottom:8px;padding:8px 12px;border-radius:8px;background:#fef2f2;border:1px solid #fecaca;font-size:13px"><strong>${c.student}</strong> rechazado por ${c.count} compañero(s): ${c.rejectors.join(', ')}</div>`).join('')}
    ${conf.mutual.length ? `<div style="margin-top:8px;padding:8px 12px;border-radius:8px;background:#fff7ed;border:1px solid #fed7aa;font-size:13px"><strong>Rechazos mutuos:</strong> ${conf.mutual.map(m => `${m.a} ↔ ${m.b}`).join(', ')}</div>` : ''}
    ${conf.rejectionChains.length ? `<div style="margin-top:8px;padding:8px 12px;border-radius:8px;background:#fef2f2;border:1px solid #fecaca;font-size:12px;color:#64748b"><strong>🔗 Cadenas de rechazo:</strong> ${conf.rejectionChains.slice(0,5).map(ch => `${ch.from} → ${ch.via} → ${ch.to}`).join(' | ')}</div>` : ''}` : ''

  return `<!DOCTYPE html><html lang="${lang||'es'}"><head><meta charset="UTF-8"><title>${t('report.title')} - ${group.name}</title><style>
  body{font-family:system-ui,sans-serif;color:#1e293b;max-width:800px;margin:auto;padding:40px}
  h1{font-size:22px;margin-bottom:4px} h2{font-size:16px;margin-top:24px;color:#4f46e5}
  table{width:100%;border-collapse:collapse;margin-top:8px}
  th{text-align:left;padding:8px 10px;border-bottom:2px solid #e2e8f0;font-size:11px;text-transform:uppercase;color:#64748b}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:12px 0}
  .card{padding:14px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0}
  .val{font-size:24px;font-weight:700;color:#4f46e5}
  .lbl{font-size:10px;color:#64748b;text-transform:uppercase}
</style></head><body>
<h1>${t('report.title')}</h1>
<p style="color:#64748b;font-size:14px">${t('report.header').replace('{name}', group.name).replace('{date}', date).replace('{n}', students.length).replace('{answered}', metrics.answeredCount)}</p>

<div style="padding:12px 16px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0;font-size:13px;margin-bottom:20px">
  <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
    <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${riskColor}"></span>
    <strong style="font-size:14px">${t('report.cohesion')}: ${metrics.cohesion}%</strong>
    <span style="color:#64748b">·</span>
    <span style="color:#64748b">${analysis.summary.cohesionDesc}</span>
  </div>
  <div style="color:#64748b;font-size:12px">${analysis.summary.diversityDesc}</div>
  <div style="margin-top:6px;display:flex;gap:12px;font-size:11px;color:#64748b">
    <span>📊 ${t('report.density')}: ${metrics.density}%</span>
    <span>🔍 ${t('report.isolation')}: ${metrics.isolationIndex}%</span>
    <span>👥 ${students.length} ${t('group.students')}</span>
  </div>
</div>

<h2>📊 ${t('report.cohesion')}</h2>
<div class="grid">
  <div class="card"><div class="val">${metrics.cohesion}%</div><div class="lbl">${t('report.cohesion')}</div></div>
  <div class="card"><div class="val">${metrics.density}%</div><div class="lbl">${t('report.density')}</div></div>
  <div class="card"><div class="val">${metrics.isolationIndex}%</div><div class="lbl">${t('report.isolation')}</div></div>
</div>
<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:12px 0">
  <div class="card"><div class="val" style="font-size:20px">${analysis.summary.reciprocityRate}%</div><div class="lbl">Reciprocidad</div></div>
  <div class="card"><div class="val" style="font-size:20px">${analysis.summary.centralization}%</div><div class="lbl">Centralización</div></div>
  <div class="card"><div class="val" style="font-size:20px">${analysis.dynamics.totalChoices}</div><div class="lbl">Total elecciones</div></div>
</div>

<h2>📋 ${t('report.roles')}</h2>
<table style="margin-bottom:16px"><thead><tr>
  <th>${t('report.student')}</th><th>${t('report.role')}</th><th style="text-align:center">Estatus</th><th style="text-align:center">Elec.</th><th style="text-align:center">Rech.</th><th>Recomendación</th>
</tr></thead><tbody>${profileRows}</tbody></table>

${conflictSection}
${subgroupSection}

<h2>💡 Recomendaciones para orientación</h2>
${recCards}

<h2>🔮 ${t('results.predictions')}</h2>${preds||'<p style="color:#94a3b8">'+t('report.noData')+'</p>'}

<h2>👥 Roles del grupo</h2>
<table><thead><tr><th>${t('report.student')}</th><th>${t('report.role')}</th></tr></thead><tbody>${roleRows}</tbody></table>
<p style="margin-top:40px;font-size:11px;color:#94a3b8">${t('report.generated').replace('{date}', date)}</p>
</body></html>`
}

function roleBg(r) { return ROLE_BG[r] || '#f3e8ff' }
function roleText(r) { return ROLE_TEXT[r] || '#6b21a8' }

function anonymizeData(group, metrics, roles, predictions, matrix, responses, lang) {
  const mapping = {}
  group.students.forEach((s, i) => { mapping[s.id] = 'S_' + String(i + 1).padStart(2, '0') })

  const anonStudents = group.students.map((s, i) => ({ id: s.id, name: mapping[s.id] }))
  const anonRoles = {}
  for (const [id, r] of Object.entries(roles)) anonRoles[id] = r

  const anonMatrix = {}
  for (const [id, row] of Object.entries(matrix)) {
    anonMatrix[id] = {}
    for (const [id2, val] of Object.entries(row)) anonMatrix[id][id2] = { ...val }
  }

  const anonResponses = {}
  for (const [id, ans] of Object.entries(responses)) {
    const anonAns = {}
    for (const [qi, ids] of Object.entries(ans)) anonAns[qi] = ids
    anonResponses[id] = anonAns
  }

  const anonMetrics = { ...metrics }
  if (metrics.mostPopular) anonMetrics.mostPopular = mapping[group.students.find(s => s.name === metrics.mostPopular)?.id] || metrics.mostPopular
  if (metrics.mostRejected) anonMetrics.mostRejected = mapping[group.students.find(s => s.name === metrics.mostRejected)?.id] || metrics.mostRejected

  return { mapping, students: anonStudents, roles: anonRoles, matrix: anonMatrix, responses: anonResponses, metrics: anonMetrics, predictions }
}

function downloadAnonymizedJSON(group, metrics, roles, predictions, matrix, responses, lang) {
  const anon = anonymizeData(group, metrics, roles, predictions, matrix, responses, lang)
  const data = {
    _anonimizado: true,
    _generado: new Date().toISOString(),
    _nota: 'Exportación anonimizada para análisis externo o IA. Los nombres originales se han sustituido por códigos.',
    mapeo: anon.mapping,
    grupo: anon.students.map(s => s.name),
    roles: Object.fromEntries(Object.entries(anon.roles).map(([id, r]) => [anon.mapping[id] || id, r])),
    metrica: anon.metrics,
    predicciones: anon.predictions.map(p => ({ tipo: p.type, icono: p.icon, etiqueta: p.label, descripcion: p.desc, accion: p.action })),
    matriz: Object.fromEntries(Object.entries(anon.matrix).map(([id, row]) => [
      anon.mapping[id] || id,
      Object.fromEntries(Object.entries(row).map(([id2, v]) => [anon.mapping[id2] || id2, v.choice > 0 ? 'E' : v.rejection > 0 ? 'R' : null]).filter(e => e[1]))
    ])),
  }
  downloadJSON(data, `sociograma-anonimizado-${group.name}-${new Date().toISOString().slice(0,10)}.json`)
}

function downloadAnonymizedReportHTML(group, metrics, roles, predictions, matrix, responses, lang) {
  const anon = anonymizeData(group, metrics, roles, predictions, matrix, responses, lang)
  const t = (key) => window.t ? window.t(key, lang) : key
  const date = new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'es-ES', { year: 'numeric', month: 'long', day: 'numeric' })

  const rows = anon.students.map(s => {
    const roleTrans = t('role.' + (ROLE_KEY_MAP[anon.roles[s.id]] || 'neutral'), lang)
    return `<tr><td style="border-bottom:1px solid #e2e8f0;padding:6px 10px">${s.name}</td><td style="border-bottom:1px solid #e2e8f0;padding:6px 10px"><span style="display:inline-block;padding:2px 10px;border-radius:999px;font-size:12px;background:${roleBg(roles[s.id])};color:${roleText(roles[s.id])}">${roleTrans}</span></td></tr>`
  }).join('')

  const preds = anon.predictions.map(p => `<div style="margin-bottom:8px;padding:10px 14px;border-radius:10px;font-size:13px;${p.type==='risk'?'background:#fef2f2;border-left:3px solid #ef4444':p.type==='opportunity'?'background:#f0fdf4;border-left:3px solid #22c55e':'background:#eff6ff;border-left:3px solid #6366f1'}"><strong>${p.icon} ${p.label}</strong><br>${p.desc}${p.action ? '<br><em style="color:#64748b">→ '+p.action+'</em>' : ''}</div>`).join('')

  const html = `<!DOCTYPE html><html lang="${lang||'es'}"><head><meta charset="UTF-8"><title>Informe Anonimizado - ${group.name}</title><style>
  body{font-family:system-ui,sans-serif;color:#1e293b;max-width:800px;margin:auto;padding:40px}
  h1{font-size:22px;margin-bottom:4px} h2{font-size:16px;margin-top:28px;color:#4f46e5}
  table{width:100%;border-collapse:collapse;margin-top:8px}
  th{text-align:left;padding:8px 10px;border-bottom:2px solid #e2e8f0;font-size:11px;text-transform:uppercase;color:#64748b}
  .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:12px 0}
  .card{padding:14px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0}
  .val{font-size:28px;font-weight:700;color:#4f46e5}
  .lbl{font-size:11px;color:#64748b;text-transform:uppercase}
  .anon-badge{display:inline-block;padding:4px 12px;border-radius:999px;font-size:11px;background:#fef3c7;color:#92400e;font-weight:600;margin-bottom:12px}
</style></head><body>
<div class="anon-badge">🤖 ${t('results.exportAnon')}</div>
<h1>${t('report.title')} (Anonimizado)</h1>
<p style="color:#64748b;font-size:13px">${t('report.header').replace('{name}', group.name).replace('{date}', date).replace('{n}', anon.students.length).replace('{answered}', anon.metrics.answeredCount)}</p>
<p style="color:#94a3b8;font-size:11px;margin-top:-4px">${t('results.anonDesc')}</p>
<h2>📊 ${t('report.cohesion')}</h2>
<div class="grid">
  <div class="card"><div class="val">${anon.metrics.cohesion}%</div><div class="lbl">${t('report.cohesion')}</div></div>
  <div class="card"><div class="val">${anon.metrics.density}%</div><div class="lbl">${t('report.density')}</div></div>
  <div class="card"><div class="val">${anon.metrics.isolationIndex}%</div><div class="lbl">${t('report.isolation')}</div></div>
</div>
<h2>🔮 ${t('results.predictions')}</h2>${preds||'<p style="color:#94a3b8">'+t('report.noData')+'</p>'}
<h2>👥 ${t('report.roles')}</h2>
<table><thead><tr><th>${t('report.student')}</th><th>${t('report.role')}</th></tr></thead><tbody>${rows}</tbody></table>
<p style="margin-top:30px;font-size:10px;color:#94a3b8;border-top:1px solid #e2e8f0;padding-top:12px">${t('results.anonDesc')}</p>
<p style="font-size:11px;color:#94a3b8">${t('report.generated').replace('{date}', date)}</p>
</body></html>`

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `sociograma-anonimizado-${group.name}-${new Date().toISOString().slice(0,10)}.html`; a.click()
  URL.revokeObjectURL(url)
}

function downloadStudentsCSV(group) {
  const header = 'Nombre,ID\n'
  const rows = group.students.map(s => `${s.name},${s.id}`).join('\n')
  const blob = new Blob(['\ufeff' + header + rows], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `alumnos-${group.name}-${new Date().toISOString().slice(0,10)}.csv`; a.click()
  URL.revokeObjectURL(url)
}

function downloadMatrixCSV(group, matrix) {
  const students = group.students
  const header = 'Nombre,' + students.map(s => s.name).join(',') + '\n'
  const rows = students.map(s => {
    const vals = students.map(s2 => {
      if (s.id === s2.id) return ''
      const m = matrix[s.id]?.[s2.id]
      if (!m) return ''
      if (m.choice && m.rejection) return 'A'
      if (m.choice) return 'E'
      if (m.rejection) return 'R'
      return ''
    })
    return `${s.name},${vals.join(',')}`
  }).join('\n')
  const blob = new Blob(['\ufeff' + header + rows], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `matriz-${group.name}-${new Date().toISOString().slice(0,10)}.csv`; a.click()
  URL.revokeObjectURL(url)
}

function downloadReportHTML(group, metrics, roles, predictions, matrix, responses, lang) {
  const html = exportReportHTML(group, metrics, roles, predictions, matrix, responses, lang)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = `sociograma-${group.name}-${new Date().toISOString().slice(0,10)}.html`; a.click()
  URL.revokeObjectURL(url)
}
