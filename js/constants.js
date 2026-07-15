const COLOR_PALETTE = ['#6366f1','#8b5cf6','#ec4899','#f43f5e','#f97316','#eab308','#22c55e','#14b8a6','#06b6d4','#3b82f6']

function stringToColor(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h)
  return COLOR_PALETTE[Math.abs(h) % COLOR_PALETTE.length]
}

const ROLE_KEY_MAP = { Líder:'leader', Popular:'popular', Puente:'bridge', Rechazado:'rejected', Aislado:'isolated', Neutro:'neutral' }

const ROLE_CLASSES = { Líder:'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300', Popular:'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300', Puente:'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300', Rechazado:'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300', Aislado:'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' }

const ROLE_BG = { Líder: '#dcfce7', Popular: '#eef2ff', Puente: '#fef3c7', Rechazado: '#fef2f2', Aislado: '#f1f5f9' }
const ROLE_TEXT = { Líder: '#166534', Popular: '#4338ca', Puente: '#92400e', Rechazado: '#991b1b', Aislado: '#475569' }
