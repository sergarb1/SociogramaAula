function formTeams(students, matrix, roles, teamSize, seed) {
  const n = students.length
  if (n < 2) return []
  const numTeams = Math.max(1, Math.round(n / teamSize))

  const roleOrder = { Líder: 0, Popular: 1, Puente: 2, Neutro: 3, Aislado: 4, Rechazado: 5 }
  let sorted = [...students].sort((a, b) => (roleOrder[roles[a.id]] ?? 9) - (roleOrder[roles[b.id]] ?? 9))

  if (seed !== undefined) {
    let s = seed
    const rand = () => { s = (s * 1664525 + 1013904223) & 0xffffffff; return (s >>> 0) / 0xffffffff }
    for (let i = sorted.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [sorted[i], sorted[j]] = [sorted[j], sorted[i]]
    }
  }

  const teams = Array.from({ length: numTeams }, () => [])
  let ti = 0

  for (const s of sorted) {
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
