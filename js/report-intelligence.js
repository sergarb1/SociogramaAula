function generateGroupAnalysis(students, matrix, roles, metrics, predictions, choicesCount, rejectionsCount) {
  const summary = buildGroupSummary(students, metrics, roles)
  const studentProfiles = buildStudentProfiles(students, matrix, roles, choicesCount, rejectionsCount)
  const subgroups = detectSubgroups(students, matrix)
  const conflicts = analyzeConflicts(students, matrix, rejectionsCount)
  const recommendations = buildRecommendations(students, metrics, roles, choicesCount, rejectionsCount)
  const dynamics = analyzeDynamics(students, matrix, choicesCount, rejectionsCount)
  return { summary, studentProfiles, subgroups, conflicts, recommendations, dynamics }
}

function buildGroupSummary(students, metrics, roles) {
  const n = students.length
  const roleCounts = {}
  for (const r of Object.values(roles)) roleCounts[r] = (roleCounts[r] || 0) + 1
  const leaderCount = roleCounts['Líder'] || 0
  const rejectedCount = roleCounts['Rechazado'] || 0
  const isolatedCount = roleCounts['Aislado'] || 0
  const popularCount = roleCounts['Popular'] || 0
  const bridgeCount = roleCounts['Puente'] || 0

  let cohesionDesc, diversityDesc, riskLevel
  if (metrics.cohesion >= 50) { cohesionDesc = 'Alta cohesión grupal. El grupo se percibe unido y con relaciones positivas.'
    riskLevel = 'bajo' }
  else if (metrics.cohesion >= 25) { cohesionDesc = 'Cohesión media. Existe vínculo pero hay margen de mejora en las relaciones.'
    riskLevel = 'medio' }
  else { cohesionDesc = 'Cohesión baja. El grupo está fragmentado, hay poca reciprocidad.'
    riskLevel = 'alto' }

  if (leaderCount === 0) diversityDesc = 'No se detectan líderes claros. Conviene observar quién toma iniciativa.'
  else if (leaderCount === 1) diversityDesc = `Hay ${leaderCount} líder claro. Distribuir responsabilidades de forma equitativa.`
  else diversityDesc = `Hay ${leaderCount} líderes detectados. Aprovechar su influencia para dinámicas positivas.`

  if (rejectedCount > 0 && isolatedCount > 0) riskLevel = 'crítico'

  return {
    cohesionDesc, diversityDesc, riskLevel,
    size: n, answeredCount: metrics.answeredCount || 0,
    roleDistribution: roleCounts,
    cohesion: metrics.cohesion,
    density: metrics.density,
    isolationIndex: metrics.isolationIndex,
  }
}

function buildStudentProfiles(students, matrix, roles, choicesCount, rejectionsCount) {
  return students.map(s => {
    const c = choicesCount[s.id] || 0
    const r = rejectionsCount[s.id] || 0
    const role = roles[s.id] || 'Neutro'
    const receivedBy = []
    const rejectedBy = []
    for (const s2 of students) {
      if (s2.id === s.id) continue
      const rel = matrix[s2.id]?.[s.id]
      if (rel?.choice) receivedBy.push(s2)
      if (rel?.rejection) rejectedBy.push(s2)
    }
    const chooses = []
    const rejects = []
    for (const s2 of students) {
      if (s2.id === s.id) continue
      const rel = matrix[s.id]?.[s2.id]
      if (rel?.choice) chooses.push(s2)
      if (rel?.rejection) rejects.push(s2)
    }
    const needsAttention = role === 'Rechazado' || role === 'Aislado' || (r >= 2 && c === 0)

    let recommendation = ''
    if (role === 'Líder') recommendation = 'Canalizar su influencia positiva. Asignarle responsabilidades de mediación.'
    else if (role === 'Popular') recommendation = 'Reforzar su rol. Puede ser modelo para dinámicas de inclusión.'
    else if (role === 'Puente') recommendation = 'Valorar su capacidad de conectar subgrupos. Involucrarle en cohesión grupal.'
    else if (role === 'Rechazado') recommendation = 'Intervención prioritaria. Indagar causas, mentoría entre iguales, dinámicas de inclusión.'
    else if (role === 'Aislado') recommendation = 'Observación y acompañamiento. Asignar compañero tutor, integrar en trabajos cooperativos.'
    else if (c > 0 && r === 0) recommendation = 'Perfil integrado. Mantener su participación activa.'
    else recommendation = 'Seguimiento ordinario.'

    return {
      id: s.id, name: s.name, role, c, r,
      receivedBy: receivedBy.map(s => s.name),
      rejectedBy: rejectedBy.map(s => s.name),
      chooses: chooses.map(s => s.name),
      rejects: rejects.map(s => s.name),
      needsAttention, recommendation,
    }
  })
}

function detectSubgroups(students, matrix) {
  const subgroups = []
  const visited = new Set()
  for (const s of students) {
    if (visited.has(s.id)) continue
    const group = [s]
    visited.add(s.id)
    for (const s2 of students) {
      if (s2.id === s.id || visited.has(s2.id)) continue
      if (matrix[s.id]?.[s2.id]?.choice && matrix[s2.id]?.[s.id]?.choice) {
        group.push(s2)
        visited.add(s2.id)
      }
    }
    if (group.length >= 3) {
      const members = group.map(m => m.name)
      const isClosed = members.length >= 3
      subgroups.push({ members, size: members.length, isClosed })
    }
  }
  return subgroups.filter(g => g.isClosed)
}

function analyzeConflicts(students, matrix, rejectionsCount) {
  const conflicts = []
  for (const s of students) {
    if ((rejectionsCount[s.id] || 0) < 2) continue
    const rejectors = []
    for (const s2 of students) {
      if (s2.id === s.id) continue
      if (matrix[s2.id]?.[s.id]?.rejection) rejectors.push(s2.name)
    }
    conflicts.push({ student: s.name, rejectors, count: rejectors.length })
  }
  const mutual = []
  for (const s of students) {
    for (const s2 of students) {
      if (s2.id <= s.id) continue
      if (matrix[s.id]?.[s2.id]?.rejection && matrix[s2.id]?.[s.id]?.rejection)
        mutual.push({ a: s.name, b: s2.name })
    }
  }
  return { targeted: conflicts, mutual }
}

function buildRecommendations(students, metrics, roles, choicesCount, rejectionsCount) {
  const recs = []
  const isolated = students.filter(s => (choicesCount[s.id] || 0) === 0)
  const rejected = students.filter(s => (rejectionsCount[s.id] || 0) >= 2)
  const leaders = students.filter(s => roles[s.id] === 'Líder')
  const neutrals = students.filter(s => (roles[s.id] || 'Neutro') === 'Neutro')

  if (metrics.cohesion < 30) recs.push({
    priority: 'alta', icon: '🔴',
    title: 'Mejorar cohesión grupal',
    desc: `Cohesión del ${metrics.cohesion}%. Realizar dinámicas de conocimiento mutuo y confianza.`,
    actions: ['Presentación personal con intereses', 'Actividades cooperativas semanales', 'Asambleas de clase'],
  })
  if (isolated.length > 0) recs.push({
    priority: 'alta', icon: '⚠️',
    title: 'Atender alumnos aislados',
    desc: `${isolated.length} alumno(s) sin elecciones. ` + isolated.map(s => s.name).join(', '),
    actions: ['Asignar compañero tutor', 'Incluir en grupos con líderes positivos', 'Observación en recreos'],
  })
  if (rejected.length > 0) recs.push({
    priority: 'alta', icon: '⚡',
    title: 'Intervenir con alumnos rechazados',
    desc: `${rejected.length} alumno(s) con rechazos múltiples. ` + rejected.map(s => s.name).join(', '),
    actions: ['Mediación entre iguales', 'Reforzar habilidades sociales', 'Coordinación con familia'],
  })
  if (leaders.length > 0) recs.push({
    priority: 'media', icon: '🌟',
    title: 'Aprovechar liderazgo positivo',
    desc: `${leaders.length} líder(es) detectados. ` + leaders.map(s => s.name).join(', '),
    actions: ['Designar mediadores en conflictos', 'Responsabilidades en equipo', 'Mentoría de alumnos nuevos'],
  })
  if (metrics.density < 20) recs.push({
    priority: 'media', icon: '📉',
    title: 'Aumentar densidad relacional',
    desc: `Densidad del ${metrics.density}%. Pocas conexiones entre alumnos.`,
    actions: ['Rotar parejas de trabajo', 'Proyectos colaborativos diversos', 'Juegos de presentación'],
  })
  if (neutrals.length > students.length * 0.5) recs.push({
    priority: 'media', icon: '💡',
    title: 'Perfiles neutros mayoritarios',
    desc: `${neutrals.length} alumnos sin rol definido. Pueden tener relaciones no detectadas.`,
    actions: ['Ampliar preguntas del cuestionario', 'Observación directa complementaria'],
  })
  if (metrics.isolationIndex > 20) recs.push({
    priority: 'media', icon: '🔍',
    title: 'Índice de aislamiento elevado',
    desc: `Un ${metrics.isolationIndex}% del grupo está en riesgo de aislamiento.`,
    actions: ['Revisar distribución de equipos', 'Incentivar interacciones cruzadas'],
  })
  if (recs.length === 0) recs.push({
    priority: 'baja', icon: '✅',
    title: 'Grupo equilibrado',
    desc: 'No se detectan riesgos significativos. Mantener las dinámicas actuales.',
    actions: ['Seguimiento ordinario', 'Repetir sociograma en 2-3 meses'],
  })
  return recs.sort((a, b) => a.priority === 'alta' ? -1 : b.priority === 'alta' ? 1 : 0)
}

function analyzeDynamics(students, matrix, choicesCount, rejectionsCount) {
  const reciprocityPairs = []
  for (const s of students) {
    for (const s2 of students) {
      if (s2.id <= s.id) continue
      if (matrix[s.id]?.[s2.id]?.choice && matrix[s2.id]?.[s.id]?.choice)
        reciprocityPairs.push({ a: s.name, b: s2.name })
    }
  }
  const unrequited = []
  for (const s of students) {
    for (const s2 of students) {
      if (s2.id === s.id) continue
      if (matrix[s.id]?.[s2.id]?.choice && !matrix[s2.id]?.[s.id]?.choice)
        unrequited.push({ from: s.name, to: s2.name })
    }
  }
  return { reciprocityPairs, unrequited }
}
