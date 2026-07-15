import type { Student, Matrix, Metrics, Prediction } from '@/constants'

export interface StudentProfile {
  id: string; name: string; role: string;
  c: number; r: number;
  choicesMade: number; rejectionsMade: number;
  receivedBy: string[]; rejectedBy: string[]; chooses: string[]; rejects: string[];
  socialImpact: number; socialPreference: number; sociometricStatus: string;
  isPolarizing: boolean; hasUnrequited: boolean; isAboveAvg: boolean; isBelowAvg: boolean;
  needsAttention: boolean; recommendation: string;
}

export interface GroupAnalysis {
  summary: {
    cohesionDesc: string; diversityDesc: string; riskLevel: string; structureType: string;
    size: number; answeredCount: number; roleDistribution: Record<string, number>;
    cohesion: number; density: number; isolationIndex: number;
    avgChoices: number; reciprocityRate: number; centralization: number;
  }
  studentProfiles: StudentProfile[]
  subgroups: { subgroups: Array<{ members: string[]; size: number; density: number; isClosed: boolean }>; allComponents: number; bridges: Array<{ student: string; connects: string[] }> }
  conflicts: { targeted: Array<{ student: string; rejectors: string[]; count: number }>; mutual: Array<{ a: string; b: string }>; rejectionChains: Array<{ from: string; via: string; to: string }> }
  recommendations: Array<{ priority: string; icon: string; title: string; desc: string; actions: string[] }>
  dynamics: {
    reciprocityPairs: Array<{ a: string; b: string }>
    unrequited: Array<{ from: string; to: string }>
    totalChoices: number; totalRejections: number; reciprocityRate: number
    choiceConcentration: number; rejectionConcentration: number
  }
}

export function generateGroupAnalysis(
  students: Student[],
  matrix: Matrix,
  roles: Record<string, string>,
  metrics: Metrics,
  choicesCount: Record<string, number>,
  rejectionsCount: Record<string, number>
): GroupAnalysis {
  const counts = computeCounts(students, matrix, choicesCount, rejectionsCount)
  const summary = buildGroupSummary(students, metrics, roles, counts, matrix)
  const studentProfiles = buildStudentProfiles(students, matrix, roles, counts)
  const subgroups = detectSubgroups(students, matrix)
  const conflicts = analyzeConflicts(students, matrix, counts)
  const recommendations = buildRecommendations(students, metrics, roles, counts, matrix)
  const dynamics = analyzeDynamics(students, matrix, counts)
  return { summary, studentProfiles, subgroups, conflicts, recommendations, dynamics }
}

function computeCounts(students: Student[], matrix: Matrix, choicesCount: Record<string, number>, rejectionsCount: Record<string, number>) {
  const c: Record<string, number> = {}
  const r: Record<string, number> = {}
  for (const s of students) { c[s.id] = 0; r[s.id] = 0 }
  for (const s of students)
    for (const [id, v] of Object.entries(matrix[s.id] || {})) {
      if (v?.choice) c[s.id]++
      if (v?.rejection) r[s.id]++
    }
  if (Object.keys(choicesCount).length) Object.assign(c, choicesCount)
  if (Object.keys(rejectionsCount).length) Object.assign(r, rejectionsCount)
  return { choicesCount: c, rejectionsCount: r }
}

function buildGroupSummary(students: Student[], metrics: Metrics, roles: Record<string, string>, counts: ReturnType<typeof computeCounts>, matrix: Matrix) {
  const { choicesCount: c, rejectionsCount: r } = counts
  const n = students.length
  const totalEdges = Object.values(c).reduce((s, v) => s + v, 0)
  const avgChoices = n > 0 ? totalEdges / n : 0

  const roleCounts: Record<string, number> = {}
  for (const role of Object.values(roles)) roleCounts[role] = (roleCounts[role] || 0) + 1
  const leaderCount = roleCounts['Líder'] || 0
  const rejectedCount = roleCounts['Rechazado'] || 0
  const isolatedCount = roleCounts['Aislado'] || 0

  let cohesionDesc: string, diversityDesc: string, riskLevel: string
  if (metrics.cohesion >= 50) {
    cohesionDesc = 'Alta cohesión grupal. El grupo se percibe unido y con relaciones positivas.'
    riskLevel = 'bajo'
  } else if (metrics.cohesion >= 25) {
    cohesionDesc = 'Cohesión media. Existe vínculo pero hay margen de mejora en las relaciones.'
    riskLevel = 'medio'
  } else {
    cohesionDesc = 'Cohesión baja. El grupo está fragmentado, hay poca reciprocidad.'
    riskLevel = 'alto'
  }

  if (leaderCount === 0) diversityDesc = 'No se detectan líderes claros. Conviene observar quién toma iniciativa.'
  else if (leaderCount === 1) diversityDesc = `Hay ${leaderCount} líder claro. Distribuir responsabilidades de forma equitativa.`
  else diversityDesc = `Hay ${leaderCount} líderes detectados. Aprovechar su influencia para dinámicas positivas.`

  if (rejectedCount > 0 && isolatedCount > 0) riskLevel = 'crítico'

  let structureType = 'integrado'
  if (metrics.isolationIndex > 30) structureType = 'fragmentado'
  else if (metrics.isolationIndex > 15) structureType = 'disperso'

  const reciprocityRate = computeReciprocityRate(students, matrix)
  const centralization = computeCentralization(students, matrix)

  return {
    cohesionDesc, diversityDesc, riskLevel, structureType,
    size: n, answeredCount: metrics.answeredCount || 0,
    roleDistribution: roleCounts,
    cohesion: metrics.cohesion, density: metrics.density,
    isolationIndex: metrics.isolationIndex,
    avgChoices, reciprocityRate, centralization,
  }
}

function computeReciprocityRate(students: Student[], matrix: Matrix): number {
  let mutual = 0, total = 0
  for (const s of students)
    for (const s2 of students) {
      if (s2.id <= s.id) continue
      const a = matrix[s.id]?.[s2.id]?.choice
      const b = matrix[s2.id]?.[s.id]?.choice
      if (a || b) total++
      if (a && b) mutual++
    }
  return total > 0 ? Math.round((mutual / total) * 100) : 0
}

function computeCentralization(students: Student[], matrix: Matrix): number {
  const degrees = students.map(s => {
    let deg = 0
    for (const s2 of students)
      if (s2.id !== s.id && matrix[s.id]?.[s2.id]?.choice) deg++
    return deg
  })
  if (!degrees.length) return 0
  const maxDeg = Math.max(...degrees)
  if (maxDeg === 0) return 0
  const n = students.length
  const maxPossible = (n - 1) * (n - 2)
  let sumDiff = 0
  for (const d of degrees) sumDiff += maxDeg - d
  return maxPossible > 0 ? Math.round((sumDiff / maxPossible) * 100) : 0
}

function buildStudentProfiles(students: Student[], matrix: Matrix, roles: Record<string, string>, counts: ReturnType<typeof computeCounts>): StudentProfile[] {
  const { choicesCount: c, rejectionsCount: r } = counts
  const n = students.length
  const avgC = students.reduce((s, st) => s + (c[st.id] || 0), 0) / n

  const indegrees: Record<string, { choices: number; rejections: number }> = {}
  const outdegrees: Record<string, { choices: number; rejections: number }> = {}
  for (const s of students) {
    let inC = 0, inR = 0, outC = 0, outR = 0
    for (const s2 of students) {
      if (s2.id === s.id) continue
      if (matrix[s2.id]?.[s.id]?.choice) inC++
      if (matrix[s2.id]?.[s.id]?.rejection) inR++
      if (matrix[s.id]?.[s2.id]?.choice) outC++
      if (matrix[s.id]?.[s2.id]?.rejection) outR++
    }
    indegrees[s.id] = { choices: inC, rejections: inR }
    outdegrees[s.id] = { choices: outC, rejections: outR }
  }

  return students.map(s => {
    const choicesMade = c[s.id] || 0
    const rejectionsMade = r[s.id] || 0
    const role = roles[s.id] || 'Neutro'
    const indeg = indegrees[s.id]
    const outdeg = outdegrees[s.id]

    const socialImpact = indeg.choices + indeg.rejections
    const socialPreference = indeg.choices - indeg.rejections

    let sociometricStatus: string
    if (indeg.choices >= 2 && indeg.rejections === 0) sociometricStatus = 'popular'
    else if (indeg.choices >= 2 && indeg.rejections >= 2) sociometricStatus = 'polarizador'
    else if (indeg.choices === 0 && indeg.rejections >= 2) sociometricStatus = 'rechazado'
    else if (indeg.choices === 0 && indeg.rejections === 0) sociometricStatus = 'ignorado'
    else if (indeg.choices >= 1) sociometricStatus = 'aceptado'
    else sociometricStatus = 'neutro'

    const receivedBy: string[] = []; const rejectedBy: string[] = []; const chooses: string[] = []; const rejects: string[] = []
    for (const s2 of students) {
      if (s2.id === s.id) continue
      if (matrix[s2.id]?.[s.id]?.choice) receivedBy.push(s2.name)
      if (matrix[s2.id]?.[s.id]?.rejection) rejectedBy.push(s2.name)
      if (matrix[s.id]?.[s2.id]?.choice) chooses.push(s2.name)
      if (matrix[s.id]?.[s2.id]?.rejection) rejects.push(s2.name)
    }

    const isPolarizing = indeg.choices >= 2 && indeg.rejections >= 2
    const hasUnrequited = chooses.length > 0 && receivedBy.length === 0
    const isAboveAvg = choicesMade > avgC
    const isBelowAvg = choicesMade < avgC * 0.5
    const needsAttention = role === 'Rechazado' || role === 'Aislado' || (indeg.rejections >= 2 && indeg.choices === 0) || isPolarizing

    let recommendation = ''
    if (role === 'Líder') recommendation = 'Canalizar su influencia positiva. Asignarle responsabilidades de mediación.'
    else if (role === 'Popular') recommendation = 'Reforzar su rol. Puede ser modelo para dinámicas de inclusión.'
    else if (role === 'Puente') recommendation = 'Valorar su capacidad de conectar subgrupos. Involucrarle en cohesión grupal.'
    else if (role === 'Rechazado') recommendation = 'Intervención prioritaria. Indagar causas, mentoría entre iguales, dinámicas de inclusión.'
    else if (role === 'Aislado') recommendation = 'Observación y acompañamiento. Asignar compañero tutor, integrar en trabajos cooperativos.'
    else if (isPolarizing) recommendation = 'Perfil polarizador. Genera opiniones divididas. Observar su integración y mediar si es necesario.'
    else if (hasUnrequited) recommendation = 'Elige sin ser correspondido. Reforzar su autoestima y fomentar relaciones recíprocas.'
    else if (choicesMade > 0 && rejectionsMade === 0) recommendation = 'Perfil integrado. Mantener su participación activa.'
    else recommendation = 'Seguimiento ordinario.'

    return {
      id: s.id, name: s.name, role, c: indeg.choices, r: indeg.rejections,
      choicesMade, rejectionsMade,
      receivedBy, rejectedBy, chooses, rejects,
      socialImpact, socialPreference, sociometricStatus,
      isPolarizing, hasUnrequited, isAboveAvg, isBelowAvg,
      needsAttention, recommendation,
    }
  })
}

function detectSubgroups(students: Student[], matrix: Matrix) {
  const adj: Record<string, Set<string>> = {}
  for (const s of students) {
    adj[s.id] = new Set()
    for (const s2 of students) {
      if (s2.id === s.id) continue
      if (matrix[s.id]?.[s2.id]?.choice || matrix[s2.id]?.[s.id]?.choice)
        adj[s.id].add(s2.id)
    }
  }

  const visited = new Set<string>()
  const components: string[][] = []
  for (const s of students) {
    if (visited.has(s.id)) continue
    const comp: string[] = []
    const queue = [s.id]
    visited.add(s.id)
    while (queue.length) {
      const cur = queue.shift()!
      comp.push(cur)
      for (const nb of (adj[cur] || [])) {
        if (!visited.has(nb)) { visited.add(nb); queue.push(nb) }
      }
    }
    if (comp.length >= 3) components.push(comp)
  }

  const subgroups = components.map(comp => {
    const members = comp.map(id => students.find(s => s.id === id)?.name || id)
    let internalEdges = 0, possibleInternal = 0
    for (const a of comp)
      for (const b of comp) {
        if (a === b) continue
        possibleInternal++
        if (adj[a]?.has(b)) internalEdges++
      }
    const density = possibleInternal > 0 ? Math.round((internalEdges / possibleInternal) * 100) : 0
    return { members, size: comp.length, density, isClosed: density >= 30 }
  })

  const bridges: Array<{ student: string; connects: string[] }> = []
  for (const s of students) {
    const connectedTo = [...adj[s.id]].filter(nb => {
      const nbComp = components.find(c => c.includes(nb))
      const sComp = components.find(c => c.includes(s.id))
      return nbComp && sComp && nbComp !== sComp
    })
    if (connectedTo.length >= 2) {
      bridges.push({
        student: s.name,
        connects: [...new Set(connectedTo.map(nb => {
          const c = components.find(c => c.includes(nb))
          return c ? c.map(id => students.find(s2 => s2.id === id)?.name || id).join(', ') : ''
        }))],
      })
    }
  }

  return { subgroups: subgroups.filter(g => g.isClosed), allComponents: components.length, bridges }
}

function analyzeConflicts(students: Student[], matrix: Matrix, counts: ReturnType<typeof computeCounts>) {
  const { rejectionsCount } = counts
  const targeted: Array<{ student: string; rejectors: string[]; count: number }> = []
  for (const s of students) {
    if ((rejectionsCount[s.id] || 0) < 2) continue
    const rejectors: string[] = []
    for (const s2 of students) {
      if (s2.id === s.id) continue
      if (matrix[s2.id]?.[s.id]?.rejection) rejectors.push(s2.name)
    }
    targeted.push({ student: s.name, rejectors, count: rejectors.length })
  }

  const mutual: Array<{ a: string; b: string }> = []
  for (const s of students)
    for (const s2 of students) {
      if (s2.id <= s.id) continue
      if (matrix[s.id]?.[s2.id]?.rejection && matrix[s2.id]?.[s.id]?.rejection)
        mutual.push({ a: s.name, b: s2.name })
    }

  const chains: Array<{ from: string; via: string; to: string }> = []
  for (const s of students)
    for (const s2 of students) {
      if (s2.id === s.id) continue
      if (!matrix[s.id]?.[s2.id]?.rejection) continue
      for (const s3 of students) {
        if (s3.id === s.id || s3.id === s2.id) continue
        if (matrix[s2.id]?.[s3.id]?.rejection && !matrix[s.id]?.[s3.id]?.rejection)
          chains.push({ from: s.name, via: s2.name, to: s3.name })
      }
    }
  const uniqueChains = chains.filter((c, i) => chains.findIndex(x => x.from === c.from && x.via === c.via && x.to === c.to) === i)

  return { targeted, mutual, rejectionChains: uniqueChains.slice(0, 10) }
}

function buildRecommendations(students: Student[], metrics: Metrics, roles: Record<string, string>, counts: ReturnType<typeof computeCounts>, matrix: Matrix) {
  const { choicesCount: c, rejectionsCount: r } = counts
  const recs: Array<{ priority: string; icon: string; title: string; desc: string; actions: string[] }> = []
  const n = students.length

  const isolated = students.filter(s => (c[s.id] || 0) === 0)
  const rejected = students.filter(s => (r[s.id] || 0) >= 2)
  const leaders = students.filter(s => roles[s.id] === 'Líder')
  const neutrals = students.filter(s => (roles[s.id] || 'Neutro') === 'Neutro')
  const polarizing = students.filter(s => {
    let inC = 0, inR = 0
    for (const s2 of students) {
      if (s2.id === s.id) continue
      if (matrix?.[s2.id]?.[s.id]?.choice) inC++
      if (matrix?.[s2.id]?.[s.id]?.rejection) inR++
    }
    return inC >= 2 && inR >= 2
  })

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
  if (polarizing.length > 0) recs.push({
    priority: 'alta', icon: '🔄',
    title: 'Figuras polarizadoras',
    desc: `${polarizing.length} alumno(s) que generan opiniones divididas. ` + polarizing.map(s => s.name).join(', '),
    actions: ['Observar su integración', 'Mediar si generan conflicto', 'Reforzar vínculos positivos'],
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
  if (neutrals.length > n * 0.5) recs.push({
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
  if (n >= 20 && metrics.density < 15) recs.push({
    priority: 'media', icon: '🧩',
    title: 'Grupo numeroso con baja conexión',
    desc: `${n} alumnos pero pocas relaciones entre ellos. Riesgo de subgrupos aislados.`,
    actions: ['Fragmentar en equipos pequeños rotativos', 'Presentaciones cruzadas periódicas'],
  })
  if (recs.length === 0) recs.push({
    priority: 'baja', icon: '✅',
    title: 'Grupo equilibrado',
    desc: 'No se detectan riesgos significativos. Mantener las dinámicas actuales.',
    actions: ['Seguimiento ordinario', 'Repetir sociograma en 2-3 meses'],
  })
  return recs.sort((a, b) => a.priority === 'alta' ? -1 : b.priority === 'alta' ? 1 : 0)
}

function analyzeDynamics(students: Student[], matrix: Matrix, counts: ReturnType<typeof computeCounts>) {
  const { choicesCount: c, rejectionsCount: r } = counts

  const reciprocityPairs: Array<{ a: string; b: string }> = []
  for (const s of students)
    for (const s2 of students) {
      if (s2.id <= s.id) continue
      if (matrix[s.id]?.[s2.id]?.choice && matrix[s2.id]?.[s.id]?.choice)
        reciprocityPairs.push({ a: s.name, b: s2.name })
    }

  const unrequited: Array<{ from: string; to: string }> = []
  for (const s of students)
    for (const s2 of students) {
      if (s2.id === s.id) continue
      if (matrix[s.id]?.[s2.id]?.choice && !matrix[s2.id]?.[s.id]?.choice)
        unrequited.push({ from: s.name, to: s2.name })
    }

  const totalChoices = Object.values(c).reduce((s, v) => s + v, 0)
  const totalRejections = Object.values(r).reduce((s, v) => s + v, 0)
  const n = students.length
  const reciprocityRate = totalChoices > 0
    ? Math.round((reciprocityPairs.length * 2 / totalChoices) * 100)
    : 0

  const choiceGini = computeGini(students.map(s => c[s.id] || 0))
  const rejectionGini = computeGini(students.map(s => r[s.id] || 0))

  return {
    reciprocityPairs, unrequited,
    totalChoices, totalRejections,
    reciprocityRate,
    choiceConcentration: choiceGini,
    rejectionConcentration: rejectionGini,
  }
}

function computeGini(values: number[]): number {
  const n = values.length
  if (n === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  let sum = 0
  for (let i = 0; i < n; i++) sum += (i + 1) * sorted[i]
  const mean = values.reduce((s, v) => s + v, 0) / n
  if (mean === 0) return 0
  return ((2 * sum) / (n * mean)) - (n + 1) / n
}
