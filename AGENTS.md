# Sociograma Aula — AGENTS.md

## Project
Sociograma Aula: classroom social management tool for sociometry. Free, local-only, GDPR-compliant, open source (AGPL v3).

Helps teachers/counselors detect hidden group dynamics (leaders, isolated students, conflicts), form balanced teams, and arrange classroom seating.

## Stack
- **Vite 6** build tool + dev server with HMR
- **Vue 3** with `<script setup lang="ts">` Single File Components (`.vue`)
- **TypeScript** throughout (strict mode)
- **Tailwind CSS** via PostCSS plugin (`tailwindcss` + `autoprefixer`)
- **vis-network** (npm) for graph rendering
- **idb-keyval** (npm) for IndexedDB persistence
- **html2canvas** (npm) for PNG export
- **Chart.js** (npm) for optional charts
- **No CDN** — All dependencies managed via npm and bundled by Vite
- **Full offline** — Everything is bundled; no external requests at runtime

## Build commands
```bash
npm run dev        # Vite dev server with HMR on http://localhost:5173
npm run build      # vue-tsc --noEmit && vite build → dist/
npm run preview    # Preview production build locally
```

**css/tailwind.css** is no longer used — Tailwind is compiled by the PostCSS plugin during the Vite build.

**css/style.css** remains as a static asset for custom styles (linked in `index.html`).

## Dev Server
```bash
npm run dev
```
Opens at `http://localhost:5173` with hot module replacement.

## GitHub
- Repo: `github.com/sergarb1/SociogramaAula`
- Pages: `https://sergarb1.github.io/SociogramaAula/`

## File Structure
```
sociograma/
├── index.html           # Minimal Vite entry (<div id="app"> + <script src="/src/main.ts">)
├── ayuda.html           # Help page for teachers/counselors (static)
├── manual.html          # User manual (static)
├── manifest.json        # PWA manifest
├── css/style.css        # Custom styles (print, animations, custom scrollbar)
├── logo/
│   └── logo2.png        # App logo
├── public/              # Static assets served at root
├── src/
│   ├── main.ts          # App entry point (createApp + mount)
│   ├── App.vue          # Root component: steps, modals, header, layout
│   ├── style.css        # Tailwind directives (@tailwind base/components/utilities)
│   ├── constants.ts     # Shared types (Student, Group, Matrix, etc.) + constants
│   ├── components/
│   │   ├── ConfirmModal.vue
│   │   ├── PromptModal.vue
│   │   ├── ToastPopup.vue
│   │   ├── OnboardingOverlay.vue
│   │   ├── GroupManager.vue      # Student list, templates, bulk add
│   │   ├── Questionnaire.vue     # Survey with per-student answering
│   │   └── ResultsView.vue       # Graph, metrics, editor, matrix, export
│   ├── composables/
│   │   ├── useI18n.ts            # Reactive t() helper
│   │   ├── useDarkMode.ts        # Dark mode toggle + persistence
│   │   └── useStorage.ts         # Reactive storage wrappers
│   └── utils/
│       ├── locales.ts            # i18n: ES + EN translations, t(key, lang) helper
│       ├── storage.ts            # IndexedDB wrappers (groups, responses, distribution)
│       ├── sociogram.ts          # Core algorithm: matrix, metrics, roles, predictions
│       ├── graph.ts              # vis-network graph rendering + destroy
│       ├── reports.ts            # Export: JSON, HTML report, CSV, anonymized, graph PNG
│       ├── report-intelligence.ts # AI-like analysis text generation
│       ├── teams.ts              # Team formation algorithm with seeded shuffle
│       └── templates.ts          # Built-in class templates + test data generator
├── AGENTS.md
├── README.md
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Key Conventions
1. **i18n first** — All user-facing strings go through `src/utils/locales.ts` via the `t(key, lang)` function. Components use `t(key)` from `useI18n()` or direct import. Always check both ES + EN translations exist before adding new keys.
2. **Language persistence** — `localStorage` with key `sociograma-lang`.
3. **Matrix single source of truth** — All computations derive from the matrix. `computeSociogram()` processes questionnaire responses into the matrix. `computeFromMatrix()` handles manual edits. Both produce identical output shapes.
4. **Saves are async** — `saveGroups()`, `saveResponses()`, `saveDistribution()` all return Promises. Always `await` them.
5. **Distribution persistence** — `saveDistribution()` / `loadDistribution()` per group ID, stores seating layout.
6. **Seeded randomness** — `formTeams()` accepts optional `seed` parameter. Same seed + same inputs = same output.
7. **Auto-save in Questionnaire** — `toggle()` and `unchoose()` call `autoSave()` on every selection change. A `dirty` flag triggers `beforeunload` warning when navigating away with unsaved changes.
8. **Shared constants** — All types, `COLOR_PALETTE`, `ROLE_KEY_MAP`, `ROLE_CLASSES`, `ROLE_BG`, `ROLE_TEXT` and `stringToColor()` are defined once in `src/constants.ts`. Never duplicate these.
9. **TypeScript strict** — Always use proper types. Never use `any` unless forced by third-party library types (e.g., vis-network).
10. **Imports with `@/` alias** — All internal imports use the `@/` alias which resolves to `src/`.

## Key Functions

### Core algorithm (`src/utils/sociogram.ts`)
- `computeSociogram(students, responses, questions)` → `{ matrix, choicesCount, rejectionsCount, roles, metrics, predictions }`
- `computeFromMatrix(students, matrix)` → same output shape from manual edits
- `generatePredictions(students, choicesCount, rejectionsCount, roles, metrics)` → array of prediction objects

### Graph (`src/utils/graph.ts`)
- `renderGraph(containerId, students, matrix, roles, onClick)` → vis-network instance
- `destroyGraph()` → destroys the current network instance

### Reports (`src/utils/reports.ts`)
- `exportGraphPNG(containerId, lang)` → downloads PNG of the graph
- `exportReportHTML(group, metrics, roles, predictions, matrix, responses, lang)` → generates + downloads HTML report
- `downloadAnonymizedJSON(group, metrics, roles, predictions, matrix, responses, lang)` → anonymized JSON
- `downloadAnonymizedReportHTML(group, metrics, roles, predictions, matrix, responses, lang)` → anonymized HTML report
- `downloadStudentsCSV(group)` → CSV with student names
- `downloadMatrixCSV(group, matrix)` → CSV of sociometric matrix

### Teams (`src/utils/teams.ts`)
- `formTeams(students, matrix, roles, teamSize, seed)` → array of team arrays

### Storage (`src/utils/storage.ts`)
- `saveGroups(groups)`, `loadGroups()` → persist/load group list
- `saveResponses(groupId, responses)`, `loadResponses(groupId)` → persist/load questionnaire responses
- `saveDistribution(groupId, distGrid, distSize, distCols)`, `loadDistribution(groupId, students)` → persist/load seating layout
- `exportAllData()` → full JSON export of everything
- `importFromFile(file)` → full JSON import from a File object
- `downloadJSON(obj, filename)` → triggers JSON download

### Templates (`src/utils/templates.ts`)
- `loadTemplates()` → array of template objects
- `generateTestData()` → creates 3 simulated groups with realistic responses

## Component Architecture

### App.vue (root)
- Manages all app state: `groups`, `step`, `lang`, `responses`, modals
- Orchestrates navigation between steps 1–5
- Renders `GroupManager`, `Questionnaire`, `ResultsView` based on `step`
- Renders modal overlays (`ConfirmModal`, `PromptModal`, `ToastPopup`, `OnboardingOverlay`)

### GroupManager.vue
- Step 1: create/delete/select groups, manage students (add, bulk, CSV import, rename, reorder)
- Template modal for creating groups from presets
- Emits: `select`, `refresh`, `start-survey`, `confirm`, `prompt`

### Questionnaire.vue
- Step 2: per-student survey with configurable questions
- Preset selection, question toggling, choice count slider
- Auto-saves on every selection, `beforeunload` warning when dirty
- Emits: `done`, `toggle-question`, `apply-preset`, `update:maxChoices`

### ResultsView.vue
- Steps 3–5: sociogram graph, metrics, predictions, student list, editor, matrix display
- Manual editor with drag-drop and click-to-cycle cell editing
- Export: JSON, HTML, anonymized JSON/HTML, CSV, PNG
- Emits: `organize`, `back`

## Important Implementation Notes
- `vis-network` CSS is loaded via npm import in `graph.ts`
- Toast notifications auto-dismiss after 3.5 seconds
- Confirm/prompt dialogs use callback pattern
- All IDs generated with `Date.now().toString(36) + Math.random().toString(36).slice(2, 8)`
- The `writing-vertical` class in matrix/editor is for vertical text in table headers
- `stringToColor()` generates consistent colors from student names
- `ROLE_KEY_MAP` maps role strings to i18n keys; `ROLE_CLASSES` maps to Tailwind classes

## Testing
- Click `🧪 Datos prueba` button to load 3 simulated groups with realistic responses
- Test both ES and EN languages
- Test edge cases: empty group, single student, all responses identical
- Open browser console to check for JS errors
- Run `npm run build` to verify no TypeScript errors

## Deployment
- Push to `main` branch → auto-deploys to GitHub Pages
- **`npm run build` must be run before committing** (the built `dist/` should be committed or a CI action should build it)
- If using GitHub Actions, build step: `npm ci && npm run build`
- Update `manifest.json` if PWA-related changes

## Common Pitfalls
- Forgetting to add both ES + EN keys when adding new UI strings
- Not awaiting `saveGroups()` / `saveResponses()` before navigation
- `vis-network` destroy/recreate cycle: always call `destroyGraph()` before re-rendering
- Drag & drop in distribution: coordinates use `(rowIdx, tableIdx, studentId)` triple
- Matrix `cellClass()` uses tri-state: empty → choice → rejection → empty cycle
- Import paths: always use `@/` alias (e.g., `@/utils/locales`, `@/constants`)
- Adding new questions requires updating both `QUESTION_BANK` in `App.vue` and both locale files
