function computeSociogram(students, responses, activeQuestions) {
  const n = students.length
  const matrix = {}
  for (const s of students) {
    matrix[s.id] = {}
    for (const s2 of students) {
      if (s.id !== s2.id) matrix[s.id][s2.id] = { choice: 0, rejection: 0 }
    }
  }

  for (const [respondentId, answers] of Object.entries(responses)) {
    const respondent = students.find(s => s.id === respondentId)
    if (!respondent) continue
    for (const [qi, chosenIds] of Object.entries(answers)) {
      const q = activeQuestions[parseInt(qi)]
      if (!q) continue
      const isRejection = (q.type || '').includes('Rechazo')
      for (const chosenId of chosenIds) {
        if (matrix[respondentId]?.[chosenId]) {
          if (isRejection) matrix[respondentId][chosenId].rejection += 1
          else matrix[respondentId][chosenId].choice += 1
        }
      }
    }
  }

  const choicesCount = Object.fromEntries(students.map(s => [s.id, 0]))
  const rejectionsCount = Object.fromEntries(students.map(s => [s.id, 0]))
  let reciprocityCount = 0, reciprocityPossible = 0
  let totalChoices = 0

  for (const s1 of students) {
    for (const s2 of students) {
      if (s1.id === s2.id) continue
      const m = matrix[s1.id][s2.id]
      if (m.choice > 0) { choicesCount[s2.id] += m.choice; totalChoices++ }
      if (m.rejection > 0) rejectionsCount[s2.id] += m.rejection
    }
  }

  for (let i = 0; i < students.length; i++) {
    for (let j = i + 1; j < students.length; j++) {
      const a = students[i].id, b = students[j].id
      reciprocityPossible++
      if (matrix[a][b].choice > 0 && matrix[b][a].choice > 0) reciprocityCount++
    }
  }

  const totalPossible = n * (n - 1)
  const cohesion = reciprocityPossible ? (reciprocityCount / reciprocityPossible) * 100 : 0
  const density = totalPossible ? (totalChoices / totalPossible) * 100 : 0
  const isolated = students.filter(s => choicesCount[s.id] === 0)
  const isolationIndex = n ? (isolated.length / n) * 100 : 0

  const popular = [...students].sort((a, b) => choicesCount[b.id] - choicesCount[a.id])
  const rejected = [...students].sort((a, b) => rejectionsCount[b.id] - rejectionsCount[a.id])

  const roles = {}
  for (const s of students) {
    const c = choicesCount[s.id], r = rejectionsCount[s.id]
    if (c === 0 && r === 0) roles[s.id] = 'Aislado'
    else if (c >= 3 && (c / (c + r || 1)) > 0.65) roles[s.id] = 'Líder'
    else if (c >= 2 && (c / (c + r || 1)) > 0.5) roles[s.id] = 'Popular'
    else if (r >= 2 && r >= c) roles[s.id] = 'Rechazado'
    else if (c > 0 && r > 0 && Math.abs(c - r) <= 1) roles[s.id] = 'Puente'
    else roles[s.id] = 'Neutro'
  }

  const metrics = {
    cohesion: Math.round(cohesion),
    density: Math.round(density),
    isolationIndex: Math.round(isolationIndex),
    reciprocity: reciprocityPossible ? Math.round((reciprocityCount / reciprocityPossible) * 100) : 0,
    mostPopular: popular[0] && choicesCount[popular[0].id] > 0 ? popular[0].name : '-',
    mostRejected: rejected[0] && rejectionsCount[rejected[0].id] > 0 ? rejected[0].name : '-',
    isolatedCount: isolated.length,
    totalStudents: n,
    answeredCount: Object.keys(responses).length,
  }

  const predictions = generatePredictions(students, choicesCount, rejectionsCount, roles, metrics)
  return { matrix, choicesCount, rejectionsCount, roles, metrics, predictions }
}

function computeFromMatrix(students, matrix) {
  const choicesCount = Object.fromEntries(students.map(s => [s.id, 0]))
  const rejectionsCount = Object.fromEntries(students.map(s => [s.id, 0]))

  for (const s1 of students) {
    for (const s2 of students) {
      if (s1.id === s2.id) continue
      const m = matrix[s1.id]?.[s2.id]
      if (!m) continue
      if (m.choice > 0) choicesCount[s2.id] += m.choice
      if (m.rejection > 0) rejectionsCount[s2.id] += m.rejection
    }
  }

  let reciprocityCount = 0, reciprocityPossible = 0
  for (let i = 0; i < students.length; i++) {
    for (let j = i + 1; j < students.length; j++) {
      const a = students[i].id, b = students[j].id
      reciprocityPossible++
      if (matrix[a]?.[b]?.choice > 0 && matrix[b]?.[a]?.choice > 0) reciprocityCount++
    }
  }

  const n = students.length
  let totalChoices = Object.values(choicesCount).reduce((a, b) => a + b, 0)
  const totalPossible = n * (n - 1)
  const cohesion = reciprocityPossible ? (reciprocityCount / reciprocityPossible) * 100 : 0
  const density = totalPossible ? (totalChoices / totalPossible) * 100 : 0
  const isolated = students.filter(s => choicesCount[s.id] === 0)
  const isolationIndex = n ? (isolated.length / n) * 100 : 0

  const roles = {}
  for (const s of students) {
    const c = choicesCount[s.id], r = rejectionsCount[s.id]
    if (c === 0 && r === 0) roles[s.id] = 'Aislado'
    else if (c >= 3 && (c / (c + r || 1)) > 0.65) roles[s.id] = 'Líder'
    else if (c >= 2 && (c / (c + r || 1)) > 0.5) roles[s.id] = 'Popular'
    else if (r >= 2 && r >= c) roles[s.id] = 'Rechazado'
    else if (c > 0 && r > 0 && Math.abs(c - r) <= 1) roles[s.id] = 'Puente'
    else roles[s.id] = 'Neutro'
  }

  const popular = [...students].sort((a, b) => choicesCount[b.id] - choicesCount[a.id])
  const rejected = [...students].sort((a, b) => rejectionsCount[b.id] - rejectionsCount[a.id])

  const metrics = {
    cohesion: Math.round(cohesion),
    density: Math.round(density),
    isolationIndex: Math.round(isolationIndex),
    reciprocity: reciprocityPossible ? Math.round((reciprocityCount / reciprocityPossible) * 100) : 0,
    mostPopular: popular[0] && choicesCount[popular[0].id] > 0 ? popular[0].name : '-',
    mostRejected: rejected[0] && rejectionsCount[rejected[0].id] > 0 ? rejected[0].name : '-',
    isolatedCount: isolated.length,
    totalStudents: n,
    answeredCount: totalChoices > 0 ? n : 0,
  }

  const predictions = generatePredictions(students, choicesCount, rejectionsCount, roles, metrics)
  return { matrix, choicesCount, rejectionsCount, roles, metrics, predictions }
}

function generatePredictions(students, choicesCount, rejectionsCount, roles, metrics) {
  const preds = []
  const isolated = students.filter(s => (choicesCount[s.id] || 0) === 0)
  const rejected = students.filter(s => (rejectionsCount[s.id] || 0) >= 2)
  const leaders = students.filter(s => roles[s.id] === 'Líder')

  if (isolated.length > 0) {
    preds.push({
      type: 'risk', icon: '⚠️',
      label: 'Riesgo de aislamiento',
      desc: `${isolated.length} alumno(s) sin elecciones. Podrían sentirse excluidos.`,
      action: 'Asignar compañero tutor, dinámicas de inclusión.',
    })
    if (isolated.length >= 3) preds.push({
      type: 'risk', icon: '🔴',
      label: 'Subgrupo excluido',
      desc: `${isolated.length} alumnos aislados pueden formar un grupo marginado.`,
      action: 'Intervención grupal temprana recomendada.',
    })
  }
  if (rejected.length >= 2) {
    preds.push({
      type: 'risk', icon: '⚡',
      label: 'Conflicto potencial',
      desc: `${rejected.length} alumno(s) con rechazos altos.`,
      action: 'Monitorear interacciones, mediación si es necesario.',
    })
  }
  if (leaders.length > 0) {
    preds.push({
      type: 'opportunity', icon: '🌟',
      label: 'Líderes positivos',
      desc: `${leaders.map(s => s.name).join(', ')} pueden ser mediadores.`,
      action: 'Designar como apoyo en trabajos cooperativos.',
    })
    if (leaders.length >= 2) preds.push({
      type: 'opportunity', icon: '📋',
      label: 'Distribuir líderes',
      desc: `Separar a ${leaders[0].name} y ${leaders[1].name} en distintos equipos.`,
      action: 'Equilibrar dinámicas de grupo.',
    })
  }
  if (metrics.cohesion < 20) preds.push({
    type: 'risk', icon: '📉',
    label: 'Cohesión muy baja',
    desc: 'Apenas hay reciprocidad en el grupo.',
    action: 'Dinámicas de cohesión grupal (ver proyecto #12).',
  })
  if (metrics.cohesion > 60) preds.push({
    type: 'opportunity', icon: '💪',
    label: 'Alta cohesión',
    desc: 'El grupo funciona bien, hay confianza mutua.',
    action: 'Aprovechar para proyectos colaborativos complejos.',
  })
  if (isolated.length > 0 || rejected.length > 0) preds.push({
    type: 'info', icon: '💡',
    label: 'Intervención recomendada',
    desc: 'Combinar dinámicas de inclusión con mentoría entre iguales.',
    action: 'Ver dinámicas en el banco de recursos.',
  })
  return preds
}