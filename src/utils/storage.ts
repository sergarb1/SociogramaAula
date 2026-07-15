import { get, set } from 'idb-keyval'
import type { Group, Student } from '@/constants'

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export async function loadGroups(): Promise<Group[]> {
  return (await get<Group[]>('sociogram-groups')) || []
}

export async function saveGroups(groups: Group[]): Promise<void> {
  await set('sociogram-groups', JSON.parse(JSON.stringify(groups)))
}

export interface Responses {
  [respondentId: string]: {
    [questionIndex: string]: string[]
  }
}

export async function loadResponses(groupId: string): Promise<Responses> {
  return (await get<Responses>(`sociogram-responses-${groupId}`)) || {}
}

export async function saveResponses(groupId: string, responses: Responses): Promise<void> {
  await set(`sociogram-responses-${groupId}`, JSON.parse(JSON.stringify(responses)))
}

export interface DistData {
  grid: Student[][][]
  size: number
  cols: number
}

export async function saveDistribution(groupId: string, distGrid: Student[][][], distSize: number, distCols: number): Promise<void> {
  const gridIds = distGrid.map(row => row.map(table => table.map(s => s.id)))
  await set(`sociogram-dist-${groupId}`, { grid: gridIds, size: distSize, cols: distCols })
}

export async function loadDistribution(groupId: string, students: Student[]): Promise<DistData | null> {
  const data = await get<{ grid: string[][][]; size: number; cols: number } | undefined>(`sociogram-dist-${groupId}`)
  if (!data) return null
  const map = Object.fromEntries(students.map(s => [s.id, s]))
  const grid = data.grid.map(row => row.map(ids => ids.map(id => map[id]).filter(Boolean)))
  return { grid: grid.filter(row => row.some(t => t.length)), size: data.size, cols: data.cols }
}

export async function exportAllData(): Promise<void> {
  const groups = await loadGroups()
  const allResponses: Record<string, Responses> = {}
  for (const g of groups) allResponses[g.id] = await loadResponses(g.id)
  const data = { version: 1, exportDate: new Date().toISOString(), groups, responses: allResponses }
  downloadJSON(data, `sociograma-${new Date().toISOString().slice(0, 10)}.json`)
}

export async function importFromFile(file: File): Promise<Group[]> {
  const text = await file.text()
  const data = JSON.parse(text)
  if (!data.groups) throw new Error('Invalid format')
  await saveGroups(data.groups)
  if (data.responses) {
    for (const [gid, responses] of Object.entries(data.responses as Record<string, Responses>))
      await saveResponses(gid, responses)
  }
  return data.groups
}

export function downloadJSON(obj: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
