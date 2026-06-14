# Sociograma Aula — AGENTS.md

## Project
Sociograma Aula: classroom social management tool for sociometry. Free, local-only, GDPR-compliant, open source (AGPL v3).

Helps teachers/counselors detect hidden group dynamics (leaders, isolated students, conflicts), form balanced teams, and arrange classroom seating.

## Stack
- Pure HTML + CDN Vue 3 (`vue.global.prod.js`) — SFC-less, all components in `app.js`
- Tailwind CSS via CDN (`cdn.tailwindcss.com`)
- vis-network (`vis-network.min.js`) for graph rendering
- idb-keyval for IndexedDB persistence
- html2canvas for PNG export
- Chart.js for optional charts
- **No build step, no Node.js, no server** — deploy by uploading to any static host
- **Offline fallback** — All CDN libraries are mirrored in `js/vendor/`. Scripts try CDN first, fall back to local copies automatically.

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
├── index.html          # Root Vue app: template, modals (confirm, prompt, toast)
├── ayuda.html          # Help page for teachers/counselors
├── manifest.json       # PWA manifest for installable app
├── css/style.css       # Additional styles (print, animations, custom scrollbar)
├── js/
│   ├── app.js          # Vue components: GroupManager, Questionnaire, ResultsView
│   ├── sociogram.js    # Core algorithm: matrix computation, metrics, roles, predictions
│   ├── graph.js        # vis-network graph rendering, legend, PNG export
│   ├── reports.js      # Exports: JSON, HTML report, CSV (students + matrix), anonymized
│   ├── locales.js      # i18n: ES + EN translations, global t(key, lang) helper
│   ├── storage.js      # IndexedDB wrappers via idb-keyval (groups, responses, distribution)
│   ├── teams.js        # Team formation algorithm with seeded shuffle
│   ├── templates.js    # Built-in class templates + test data generator
│   ├── constants.js    # Shared constants: COLOR_PALETTE, ROLE_KEY_MAP, ROLE_CLASSES, stringToColor()
│   └── vendor/         # Local CDN fallback files (loaded when CDN is unavailable)
├── logo/
│   └── logo2.png       # App logo (transparent background, preprocessed)
├── AGENTS.md           # This file — dev guide for AI assistants
└── README.md           # Public-facing documentation
```

## Key Conventions
1. **i18n first** — All user-facing strings go through `locales.js` via the global `t(key, lang)` function. Every Vue component has a `t(key)` method that delegates using `this.lang`. Always check both ES + EN translations exist before adding new keys.
2. **Language persistence** — `window.__lang` + `localStorage` with key `sociograma-lang`.
3. **Matrix single source of truth** — All computations derive from the matrix. `computeSociogram()` processes questionnaire responses into the matrix. `computeFromMatrix()` handles manual edits. Both produce identical output shapes.
4. **Saves are async** — `saveGroups()`, `saveResponses()`, `saveDistribution()` all return Promises. Always `await` them.
5. **Distribution persistence** — `saveDistribution()` / `loadDistribution()` per group ID, stores seating layout (positions, layout type, columns, sizes).
6. **Seeded randomness** — `formTeams()` and `generateDist()` accept optional `seed` parameter. Using the same seed + same inputs = same output (useful for reproducibility).
7. **Auto-save in Questionnaire** — `toggle()` and `unchoose()` call `autoSave()` on every selection change. A `dirty` flag triggers `beforeunload` warning when navigating away with unsaved changes.
8. **Shared constants** — `COLOR_PALETTE`, `ROLE_KEY_MAP`, `ROLE_CLASSES`, `ROLE_BG`, `ROLE_TEXT` and `stringToColor()` are defined once in `js/constants.js` and used across all files. Never duplicate these.

## Key Functions

### Core algorithm (`sociogram.js`)
- `computeSociogram(students, responses, questions)` → `{ matrix, choicesCount, rejectionsCount, roles, metrics, predictions }`
- `computeFromMatrix(students, matrix)` → same output shape from manual edits
- `generatePredictions(students, choicesCount, rejectionsCount, roles, metrics)` → array of prediction objects

### Graph (`graph.js`)
- `renderGraph(containerId, students, matrix, roles, onClick)` → vis-network instance
- `exportGraphPNG(containerId, filename)` → downloads PNG of the graph
- `renderLegend()` → adds color legend to the graph container

### Reports (`reports.js`)
- `downloadJSON(data, filename)` → triggers JSON download
- `downloadReportHTML(group, matrix, roles, metrics, predictions, lang)` → generates printable HTML report
- `downloadAnonJSON(matrix, studentIds)` → anonymized JSON (S_01 codes)
- `downloadAnonHTML(group, matrix, roles, metrics, predictions, lang)` → anonymized HTML report
- `downloadStudentsCSV(group)` → CSV with student names
- `downloadMatrixCSV(group, matrix)` → CSV of the sociometric matrix

### Teams (`teams.js`)
- `formTeams(students, matrix, roles, teamSize, seed)` → array of team arrays
- Uses greedy algorithm: picks team captains (leaders first), then assigns remaining students considering choices/rejections

### Storage (`storage.js`)
- `saveGroups(groups)`, `loadGroups()` → persist/load group list
- `saveResponses(groupId, responses)`, `loadResponses(groupId)` → persist/load questionnaire responses per group
- `saveDistribution(groupId, distData)`, `loadDistribution(groupId)` → persist/load seating layout per group
- `exportAll(groups, responsesMap)` → full JSON export of everything
- `importAll(jsonData)` → full JSON import

### Templates (`templates.js`)
- `loadTemplates()` → returns array of template objects with name, description, students[], defaultQuestions[]
- `loadTestData()` → generates 3 simulated groups with realistic sociometric data

## Distribution Feature
- Supports group sizes 1–8 students per table
- 3 layouts: grid, rows, u-shape
- Drag & drop between tables to rearrange
- Shows role badges (colored) + table cohesion %
- Export as PNG via html2canvas
- Print-friendly via @media print CSS in index.html
- Color palette: `['#6366f1','#8b5cf6','#ec4899','#f43f5e','#f97316','#eab308','#22c55e','#14b8a6']` (defined in `js/constants.js`)

## Questionnaire System
- 15 questions in QUESTION_BANK with keys: `q.0` through `q.14`
- Each question has: `key` (locale key), `typeKey` (locale key for type), `maxChoices`, `default` (active by default?)
- 6 presets (QUESTION_PRESETS): general, primary, secondary, highschool, coexistence, inclusion
- Presets define which questions are active + maxChoices

## Important Implementation Notes
- `vis-network` CSS must be loaded manually or via CDN
- Tailwind classes are used throughout; no custom CSS for layout, only overrides
- The `writing-vertical` class in matrix/editor is for vertical text in table headers
- Toast notifications auto-dismiss after 2.5 seconds
- Confirm dialog uses callback pattern (`showConfirm(msg, onOk)`)
- Prompt dialog uses callback pattern (`showPrompt(msg, callback)`)
- All group/student IDs are generated with `crypto.randomUUID()` or fallback `Date.now().toString(36)`
- CDN scripts have inline fallbacks: if the CDN fails, the local copy in `js/vendor/` is loaded automatically
- Confirm modal now has a full-screen overlay (`bg-black/60 backdrop-blur-md`) with translated buttons (`dialog.cancel` / `dialog.confirm`)

## Testing
- Click `🧪 Datos prueba` button to load 3 simulated groups (1º ESO A, 4º ESO B, 2º Bach C) with realistic responses
- Test both ES and EN languages
- Test edge cases: empty group, single student, all responses identical
- Open browser console to check for JS errors after changes
- Test distribution with all 3 layouts and various group sizes

## Deployment
- Push to `main` branch on GitHub → auto-deploys to GitHub Pages
- No build step needed — just commit and push
- If adding new features, update `manifest.json` if PWA-related
- Cache-busting: users may need Ctrl+F5 after significant updates

## Common Pitfalls
- Forgetting to add both ES + EN keys when adding new UI strings
- Not awaiting `saveGroups()` / `saveResponses()` before navigation
- `vis-network` destroy/recreate cycle: always call `network.destroy()` before re-rendering
- Drag & drop in distribution: coordinates use `(rowIdx, tableIdx, studentId)` triple
- Matrix `cellClass()` uses tri-state: empty → choice → rejection → empty cycle
