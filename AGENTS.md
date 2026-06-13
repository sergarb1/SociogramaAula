# Sociograma Aula — AGENTS.md

## Project
Sociograma Aula: classroom social management tool (sociometry). Free, local-only, GDPR-compliant.

## Stack
- Pure HTML + CDN Vue 3 (`vue.global.prod.js`)
- Tailwind CSS via CDN (`cdn.tailwindcss.com`)
- vis-network (`vis-network.min.js`) for graph rendering
- idb-keyval for IndexedDB
- html2canvas for PNG export
- Chart.js for charts
- **No build step, no Node.js, no server**

## Dev Server
```bash
npx live-server sociograma/ --port=5500 --no-browser
```
Server runs at `http://127.0.0.1:5500`

## GitHub
- Repo: `github.com/sergarb1/SociogramaAula`
- Pages: `https://sergarb1.github.io/SociogramaAula/`

## File Structure
```
sociograma/
├── index.html          # Root Vue app template + modals + modals
├── ayuda.html          # Help page for teachers/counselors
├── manifest.json       # PWA manifest
├── css/style.css       # Additional styles
├── js/
│   ├── app.js          # Vue components: GroupManager, Questionnaire, ResultsView
│   ├── sociogram.js    # Core algorithm: matrix, metrics, roles, predictions
│   ├── graph.js        # vis-network graph rendering
│   ├── reports.js      # Export: JSON, HTML, PNG, CSV, anonymized
│   ├── locales.js      # i18n: ES/EN translations, global t() helper
│   ├── storage.js      # IndexedDB wrappers (idb-keyval)
│   ├── teams.js        # Team formation algorithm with seeded shuffle
│   └── templates.js    # Built-in class templates + test data
└── AGENTS.md
```

## Key Conventions
- All user-facing strings go through `locales.js` (global `t(key, lang)`)
- Each Vue component has a `t(key)` method that delegates via `this.lang` prop
- `window.__lang` + `localStorage` persist language choice
- Matrix is the single source of truth for all computations
- `computeFromMatrix()` added so manual edits and questionnaire responses share same pipeline
- `saveDistribution()` / `loadDistribution()` persist seating layout per group
- `formTeams()` accepts optional `seed` parameter for different shuffles

## Key Functions
- `computeSociogram(students, responses, questions)` → matrix, roles, metrics, predictions
- `computeFromMatrix(students, matrix)` → same result from manual edits
- `formTeams(students, matrix, roles, teamSize, seed)` → array of teams
- `renderGraph(containerId, students, matrix, roles, onClick)` → vis-network
- `exportGraphPNG()`, `downloadJSON()`, `downloadReportHTML()`, etc.

## Distribution Feature
- Supports group sizes 1–8
- 3 layouts: grid, rows, u-shape
- Drag & drop students between tables
- Shows role badges + table cohesion %
- Export as image (html2canvas)
- Print-friendly via @media print CSS

## Tips
- Always check `locales.js` has matching ES + EN keys before adding new strings
- Test with `🧪 Datos prueba` button (loads 3 simulated groups)
- Open browser console to check for JS errors after changes
- Commit to both `sociograma/` (SociogramaAula repo) and `mejoratudocencia` if resources.js changes
