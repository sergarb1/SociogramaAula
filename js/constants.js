const COLOR_PALETTE = ['#6366f1','#8b5cf6','#ec4899','#f43f5e','#f97316','#eab308','#22c55e','#14b8a6','#06b6d4','#3b82f6']

function stringToColor(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = str.charCodeAt(i) + ((h << 5) - h)
  return COLOR_PALETTE[Math.abs(h) % COLOR_PALETTE.length]
}

const ROLE_KEY_MAP = { Líder:'leader', Popular:'popular', Puente:'bridge', Rechazado:'rejected', Aislado:'isolated', Neutro:'neutral' }

const ROLE_CLASSES = { Líder:'bg-green-100 text-green-700', Popular:'bg-indigo-100 text-indigo-700', Puente:'bg-amber-100 text-amber-700', Rechazado:'bg-red-100 text-red-700', Aislado:'bg-slate-100 text-slate-600' }

const ROLE_BG = { Líder: '#dcfce7', Popular: '#eef2ff', Puente: '#fef3c7', Rechazado: '#fef2f2', Aislado: '#f1f5f9' }
const ROLE_TEXT = { Líder: '#166534', Popular: '#4338ca', Puente: '#92400e', Rechazado: '#991b1b', Aislado: '#475569' }
