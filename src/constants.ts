export const COLOR_PALETTE = ['#6366f1','#8b5cf6','#ec4899','#f43f5e','#f97316','#eab308','#22c55e','#14b8a6','#06b6d4','#3b82f6']

export function stringToColor(str: string): string {
  let h = 0
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h)
  return COLOR_PALETTE[Math.abs(h) % COLOR_PALETTE.length]
}

export const ROLE_KEY_MAP: Record<string, string> = {
  Líder:'leader', Popular:'popular', Puente:'bridge',
  Rechazado:'rejected', Aislado:'isolated', Neutro:'neutral'
}

export const ROLE_CLASSES: Record<string, string> = {
  Líder:'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  Popular:'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  Puente:'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  Rechazado:'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  Aislado:'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
}

export const ROLE_BG: Record<string, string> = {
  Líder:'#dcfce7', Popular:'#eef2ff', Puente:'#fef3c7',
  Rechazado:'#fef2f2', Aislado:'#f1f5f9'
}

export const ROLE_TEXT: Record<string, string> = {
  Líder:'#166534', Popular:'#4338ca', Puente:'#92400e',
  Rechazado:'#991b1b', Aislado:'#475569'
}

export interface Student {
  id: string
  name: string
}

export interface Group {
  id: string
  name: string
  students: Student[]
  createdAt?: string
}

export interface Matrix {
  [from: string]: {
    [to: string]: { choice: number; rejection: number }
  }
}

export interface Metrics {
  cohesion: number
  density: number
  isolationIndex: number
  reciprocity: number
  mostPopular: string
  mostRejected: string
  isolatedCount: number
  totalStudents: number
  answeredCount: number
}

export interface Prediction {
  type: 'risk' | 'opportunity' | 'info'
  icon: string
  label: string
  desc: string
  action: string
}

export interface Question {
  text: string
  type: string
  maxChoices: number
  active: boolean
}
