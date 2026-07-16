import type { Student, Matrix } from '@/constants'

export type TeamStrategy = 'balanced' | 'random' | 'mix' | 'cluster' | 'scatter'

const STRATEGY_LABELS: Record<TeamStrategy, string> = {
  balanced: 'teams.strategy.balanced',
  random: 'teams.strategy.random',
  mix: 'teams.strategy.mix',
  cluster: 'teams.strategy.cluster',
  scatter: 'teams.strategy.scatter',
}

export function getTeamStrategies(): { id: TeamStrategy; labelKey: string }[] {
  return (Object.keys(STRATEGY_LABELS) as TeamStrategy[]).map(id => ({ id, labelKey: STRATEGY_LABELS[id] }))
}

function seededRand(seed: number): () => number {
  let s = seed
  return () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff }
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const roleOrder: Record<string, number> = { Líder: 0, Popular: 1, Puente: 2, Neutro: 3, Aislado: 4, Rechazado: 5 }

function getChoicesCount(matrix: Matrix, id: string): number {
  let n = 0
  for (const [, row] of Object.entries(matrix)) {
    if (row[id]?.choice > 0) n++
  }
  return n
}

function getRejectionsCount(matrix: Matrix, id: string): number {
  let n = 0
  for (const [, row] of Object.entries(matrix)) {
    if (row[id]?.rejection > 0) n++
  }
  return n
}

function hasChoice(matrix: Matrix, a: string, b: string): boolean {
  return (matrix[a]?.[b]?.choice > 0) || (matrix[b]?.[a]?.choice > 0)
}

function hasRejection(matrix: Matrix, a: string, b: string): boolean {
  return (matrix[a]?.[b]?.rejection > 0) || (matrix[b]?.[a]?.rejection > 0)
}

function roundRobinAssign<T>(items: T[], numTeams: number): T[][] {
  const teams: T[][] = Array.from({ length: numTeams }, () => [])
  items.forEach((item, i) => teams[i % numTeams].push(item))
  return teams
}

function formTeamsBalanced(
  students: Student[],
  matrix: Matrix,
  roles: Record<string, string>,
  teamSize: number,
  rand: () => number
): Student[][] {
  const n = students.length
  if (n < 2) return []
  const numTeams = Math.max(1, Math.round(n / teamSize))
  const sorted = [...students].sort((a, b) => (roleOrder[roles[a.id]] ?? 9) - (roleOrder[roles[b.id]] ?? 9))
  const shuffled = shuffle(sorted, rand)
  const teams: Student[][] = Array.from({ length: numTeams }, () => [])
  let ti = 0
  for (const s of shuffled) {
    let best = ti % numTeams
    let bestScore = -Infinity
    for (let t = 0; t < numTeams; t++) {
      if (teams[t].length >= Math.ceil(n / numTeams)) continue
      const team = teams[t]
      let score = 0
      for (const m of team) {
        if (matrix[s.id]?.[m.id]?.choice > 0) score += 3
        if (matrix[m.id]?.[s.id]?.choice > 0) score += 2
        if (matrix[s.id]?.[m.id]?.rejection > 0) score -= 10
        if (matrix[m.id]?.[s.id]?.rejection > 0) score -= 10
      }
      const roleCount = team.filter(m => (roleOrder[roles[m.id]] ?? 9) < 2).length
      if ((roleOrder[roles[s.id]] ?? 9) < 2 && roleCount >= 1) score -= 5
      if (score > bestScore) { bestScore = score; best = t }
    }
    teams[best].push(s)
    ti++
  }
  return teams.filter(t => t.length > 0)
}

function formTeamsRandom(
  students: Student[],
  teamSize: number,
  rand: () => number
): Student[][] {
  const n = students.length
  if (n < 2) return []
  const numTeams = Math.max(1, Math.round(n / teamSize))
  const shuffled = shuffle(students, rand)
  return roundRobinAssign(shuffled, numTeams).filter(t => t.length > 0)
}

function formTeamsMix(
  students: Student[],
  matrix: Matrix,
  teamSize: number,
  rand: () => number
): Student[][] {
  const n = students.length
  if (n < 2) return []
  const numTeams = Math.max(1, Math.round(n / teamSize))
  const scored = students.map(s => {
    const others = students.filter(o => o.id !== s.id)
    const connected = others.filter(o => hasChoice(matrix, s.id, o.id) || hasRejection(matrix, s.id, o.id))
    return { student: s, score: -connected.length }
  })
  scored.sort((a, b) => a.score - b.score)
  const sorted = scored.map(s => s.student)
  const shuffled = shuffle(sorted, rand)
  const teams: Student[][] = Array.from({ length: numTeams }, () => [])
  for (const s of shuffled) {
    let best = -1
    let bestScore = Infinity
    for (let t = 0; t < numTeams; t++) {
      if (teams[t].length >= Math.ceil(n / numTeams)) continue
      const team = teams[t]
      const overlap = team.filter(m => hasChoice(matrix, s.id, m.id) || hasRejection(matrix, s.id, m.id)).length
      if (overlap < bestScore) { bestScore = overlap; best = t }
    }
    if (best >= 0) teams[best].push(s)
    else teams[teams.findIndex(t => t.length < Math.ceil(n / numTeams))]?.push(s)
  }
  return teams.filter(t => t.length > 0)
}

function formTeamsCluster(
  students: Student[],
  matrix: Matrix,
  teamSize: number,
  rand: () => number
): Student[][] {
  const n = students.length
  if (n < 2) return []
  const numTeams = Math.max(1, Math.round(n / teamSize))
  const scored = students.map(s => {
    const others = students.filter(o => o.id !== s.id)
    const choices = others.filter(o => hasChoice(matrix, s.id, o.id))
    return { student: s, score: -choices.length }
  })
  scored.sort((a, b) => a.score - b.score)
  const sorted = scored.map(s => s.student)
  const shuffled = shuffle(sorted, rand)
  const teams: Student[][] = Array.from({ length: numTeams }, () => [])
  for (const s of shuffled) {
    let best = -1
    let bestScore = -Infinity
    for (let t = 0; t < numTeams; t++) {
      if (teams[t].length >= Math.ceil(n / numTeams)) continue
      const team = teams[t]
      const overlap = team.filter(m => hasChoice(matrix, s.id, m.id)).length
      if (overlap > bestScore) { bestScore = overlap; best = t }
    }
    if (best >= 0) teams[best].push(s)
    else teams[teams.findIndex(t => t.length < Math.ceil(n / numTeams))]?.push(s)
  }
  return teams.filter(t => t.length > 0)
}

function formTeamsScatter(
  students: Student[],
  matrix: Matrix,
  roles: Record<string, string>,
  teamSize: number,
  rand: () => number
): Student[][] {
  const n = students.length
  if (n < 2) return []
  const numTeams = Math.max(1, Math.round(n / teamSize))
  const rejected = students.filter(s => getRejectionsCount(matrix, s.id) > 0)
  const popular = students.filter(s => getChoicesCount(matrix, s.id) > 1 && getRejectionsCount(matrix, s.id) === 0)
  const others = students.filter(s => !rejected.includes(s) && !popular.includes(s))
  const pool = [...shuffle(rejected, rand), ...shuffle(others, rand), ...shuffle(popular, rand)]
  const teams: Student[][] = Array.from({ length: numTeams }, () => [])
  for (const s of pool) {
    let best = -1
    let bestScore = -Infinity
    for (let t = 0; t < numTeams; t++) {
      if (teams[t].length >= Math.ceil(n / numTeams)) continue
      const team = teams[t]
      let score = 0
      const rejInTeam = team.filter(m => hasRejection(matrix, s.id, m.id)).length
      score -= rejInTeam * 20
      const choicesInTeam = team.filter(m => hasChoice(matrix, s.id, m.id)).length
      score += choicesInTeam * 2
      if (rejected.includes(s)) {
        const leaders = team.filter(m => (roleOrder[roles[m.id]] ?? 9) < 2).length
        score += leaders * 5
      }
      if (score > bestScore) { bestScore = score; best = t }
    }
    if (best >= 0) teams[best].push(s)
    else teams[teams.findIndex(t => t.length < Math.ceil(n / numTeams))]?.push(s)
  }
  return teams.filter(t => t.length > 0)
}

export function formTeams(
  students: Student[],
  matrix: Matrix,
  roles: Record<string, string>,
  teamSize: number,
  seed?: number,
  strategy: TeamStrategy = 'balanced'
): Student[][] {
  const rand = seed !== undefined ? seededRand(seed) : () => Math.random()
  switch (strategy) {
    case 'random':
      return formTeamsRandom(students, teamSize, rand)
    case 'mix':
      return formTeamsMix(students, matrix, teamSize, rand)
    case 'cluster':
      return formTeamsCluster(students, matrix, teamSize, rand)
    case 'scatter':
      return formTeamsScatter(students, matrix, roles, teamSize, rand)
    case 'balanced':
    default:
      return formTeamsBalanced(students, matrix, roles, teamSize, rand)
  }
}

// --- Distribution (classroom seating) ---

export type DistStrategy = 'balanced' | 'random' | 'mix' | 'separate-conflicts'

const DIST_STRATEGY_LABELS: Record<DistStrategy, string> = {
  balanced: 'dist.strategy.balanced',
  random: 'dist.strategy.random',
  mix: 'dist.strategy.mix',
  'separate-conflicts': 'dist.strategy.separate',
}

export function getDistStrategies(): { id: DistStrategy; labelKey: string }[] {
  return (Object.keys(DIST_STRATEGY_LABELS) as DistStrategy[]).map(id => ({ id, labelKey: DIST_STRATEGY_LABELS[id] }))
}

export interface DistGrid {
  rows: number
  cols: number
  tables: Student[][][]
}

function assignToTable(
  students: Student[],
  grid: DistGrid,
  matrix: Matrix,
  roles: Record<string, string>,
  strategy: DistStrategy,
  rand: () => number
): DistGrid {
  const positions: { r: number; c: number }[] = []
  for (let r = 0; r < grid.rows; r++)
    for (let c = 0; c < grid.cols; c++)
      positions.push({ r, c })

  if (positions.length === 0) return grid
  if (students.length === 0) return grid

  const sorted = [...students]
  if (strategy === 'balanced') {
    sorted.sort((a, b) => getRejectionsCount(matrix, b.id) - getRejectionsCount(matrix, a.id))
  } else if (strategy === 'mix') {
    sorted.sort((a, b) => {
      const aConn = students.filter(o => o.id !== a.id && hasChoice(matrix, a.id, o.id)).length
      const bConn = students.filter(o => o.id !== b.id && hasChoice(matrix, b.id, o.id)).length
      return aConn - bConn
    })
  } else if (strategy === 'separate-conflicts') {
    sorted.sort((a, b) => getRejectionsCount(matrix, b.id) - getRejectionsCount(matrix, a.id))
  }

  const shuffled = shuffle(sorted, rand)
  const result: Student[][][] = Array.from({ length: grid.rows }, () =>
    Array.from({ length: grid.cols }, () => [])
  )

  if (strategy === 'balanced' || strategy === 'separate-conflicts') {
    const fill = [...shuffled]
    for (const s of fill) {
      let bestR = -1, bestC = -1
      let bestScore = -Infinity
      for (const p of positions) {
        if (result[p.r][p.c].length > 0) continue
        const neighbors = getNeighbors(result, p.r, p.c, strategy === 'separate-conflicts')
        let score = 0
        for (const n of neighbors) {
          if (hasRejection(matrix, s.id, n.id) || hasRejection(matrix, n.id, s.id))
            score -= 10
          if (hasChoice(matrix, s.id, n.id) || hasChoice(matrix, n.id, s.id))
            score += 2
        }
        if (strategy === 'balanced' && getRejectionsCount(matrix, s.id) > 0) {
          const nearbyLeaders = neighbors.filter(n => (roleOrder[roles[n.id]] ?? 9) < 2).length
          score += nearbyLeaders * 5
        }
        if (score > bestScore) { bestScore = score; bestR = p.r; bestC = p.c }
      }
      if (bestR >= 0) {
        result[bestR][bestC].push(s)
      }
    }
  } else if (strategy === 'mix') {
    for (const s of shuffled) {
      let bestR = -1, bestC = -1
      let bestScore = Infinity
      for (const p of positions) {
        if (result[p.r][p.c].length > 0) continue
        const neighbors = getNeighbors(result, p.r, p.c, false)
        const overlap = neighbors.filter(n => hasChoice(matrix, s.id, n.id) || hasRejection(matrix, s.id, n.id)).length
        if (overlap < bestScore) { bestScore = overlap; bestR = p.r; bestC = p.c }
      }
      if (bestR >= 0) result[bestR][bestC].push(s)
    }
  } else {
    let idx = 0
    for (const p of positions) {
      if (idx < shuffled.length) result[p.r][p.c].push(shuffled[idx++])
    }
  }

  grid.tables = result
  return grid
}

function getNeighbors(grid: Student[][][], r: number, c: number, sameTableOnly: boolean): Student[] {
  const neighbors: Student[] = []
  const dirs = sameTableOnly
    ? [[0, 1], [1, 0]]
    : [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]]
  for (const [dr, dc] of dirs) {
    const nr = r + dr, nc = c + dc
    if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[0].length) {
      for (const s of grid[nr][nc]) {
        if (s) neighbors.push(s)
      }
    }
  }
  return neighbors
}

export function formDistribution(
  students: Student[],
  matrix: Matrix,
  roles: Record<string, string>,
  rows: number,
  cols: number,
  seed?: number,
  strategy: DistStrategy = 'balanced'
): DistGrid {
  const grid: DistGrid = { rows, cols, tables: [] }
  const totalSeats = rows * cols
  const available = totalSeats >= students.length ? students : students.slice(0, totalSeats)
  const rand = seed !== undefined ? seededRand(seed) : () => Math.random()
  return assignToTable(available, grid, matrix, roles, strategy, rand)
}
