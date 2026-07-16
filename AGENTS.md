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

## Dev Server
```bash
npm run dev
```
Opens at `http://localhost:5173` with hot module replacement.

## GitHub
- Repo: `github.com/sergarb1/SociogramaAula`
- Pages: `https://sergarb1.github.io/SociogramaAula/`
- Auto-deploy: push to `main` → GitHub Actions build → gh-pages

## File Structure
```
sociograma/
├── index.html           # Minimal Vite entry (<div id="app"> + <script src="/src/main.ts">)
├── ayuda.html           # Help page for teachers/counselors (static)
├── manual.html          # User manual (static)
├── AGENTS.md
├── README.md
├── src/
│   ├── main.ts          # App entry point (createApp + mount)
│   ├── App.vue          # Root component: steps, modals, header (RutaEstudio-style), layout
│   ├── style.css        # Tailwind directives (@tailwind base/components/utilities)
│   ├── constants.ts     # Shared types (Student, Group, Matrix, Metrics, Prediction, Question) + constants
│   ├── components/
│   │   ├── GroupManager.vue      # Student list, templates, bulk add, CSV import
│   │   ├── Questionnaire.vue     # Survey with per-student answering, auto-save
│   │   ├── ResultsView.vue       # Graph, metrics, editor, matrix, export
│   │   ├── ConfirmModal.vue      # Confirm dialog (callback pattern)
│   │   ├── PromptModal.vue       # Prompt dialog (callback pattern)
│   │   ├── ToastPopup.vue        # Toast notifications (3.5s auto-dismiss)
│   │   └── OnboardingOverlay.vue # Step-by-step tutorial overlay
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
├── public/
│   ├── css/style.css             # Custom styles (print, animations, custom scrollbar)
│   ├── logo/logo2.png            # App logo
│   ├── manifest.json             # PWA manifest
│   ├── icon-192.png              # PWA icon
│   └── icon-512.png              # PWA icon
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## Key Conventions
1. **i18n first** — All user-facing strings go through `src/utils/locales.ts` via the `t(key, lang)` function. Components use `t(key)` from `useI18n()` or direct import. Always check both ES + EN translations exist before adding new keys.
2. **Language persistence** — `localStorage` with key `sociograma-lang`. Language selector is in the header bar.
3. **Matrix single source of truth** — All computations derive from the matrix. `computeSociogram()` processes questionnaire responses into the matrix. `computeFromMatrix()` handles manual edits. Both produce identical output shapes.
4. **Saves are async** — `saveGroups()`, `saveResponses()`, `saveDistribution()` all return Promises. Always `await` them.
5. **Distribution persistence** — `saveDistribution()` / `loadDistribution()` per group ID, stores seating layout.
6. **Seeded randomness** — `formTeams()` accepts optional `seed` parameter. Same seed + same inputs = same output.
7. **Auto-save in Questionnaire** — `toggle()` and `unchoose()` call `autoSave()` on every selection change. A `dirty` flag triggers `beforeunload` warning when navigating away with unsaved changes.
8. **Shared constants** — All types, `COLOR_PALETTE`, `ROLE_KEY_MAP`, `ROLE_CLASSES`, `ROLE_BG`, `ROLE_TEXT` and `stringToColor()` are defined once in `src/constants.ts`. Never duplicate these.
9. **TypeScript strict** — Always use proper types. Never use `any` unless forced by third-party library types (e.g., vis-network).
10. **Imports with `@/` alias** — All internal imports use the `@/` alias which resolves to `src/`.
11. **`buildQuestions()` must be called after `applyPreset()`** — `questions` ref is built from `QUESTION_BANK` + `questionActive`. A `watch(questionActive, ..., { deep: true })` rebuilds them automatically.
12. **Header uses RutaEstudio-style buttons** — All header buttons have consistent styling: `bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-xl px-3 py-2.5 min-h-[44px] hover:bg-slate-50 dark:hover:bg-slate-700 transition text-xs font-medium` with SVG icons. No emoji icons in button text.
13. **Manifest in `public/`** — `manifest.json` and PWA icons are in `public/`, not at project root. Vite copies them as-is to `dist/`.

## Key Functions

### Core algorithm (`src/utils/sociogram.ts`)
- `computeSociogram(students, responses, questions)` → `{ matrix, choicesCount, rejectionsCount, roles, metrics, predictions }`
- `computeFromMatrix(students, matrix)` → same output shape from manual edits
- `generatePredictions(students, choicesCount, rejectionsCount, roles, metrics)` → array of prediction objects

### Graph (`src/utils/graph.ts`)
- `renderGraph(containerId, students, matrix, roles, onClick)` → vis-network instance (forceAtlas2Based physics, role-colored nodes, curved edges with arrows)
- `destroyGraph()` → destroys the current network instance

### Reports (`src/utils/reports.ts`)
- `exportGraphPNG(containerId, lang)` → downloads PNG of the graph via html2canvas
- `exportElementPNG(containerId, filename, lang)` → generic PNG export of any element by ID
- `exportReportHTML(group, metrics, roles, predictions, matrix, responses, lang)` → generates + downloads HTML report
- `downloadAnonymizedJSON(group, metrics, roles, predictions, matrix, responses, lang)` → anonymized JSON (S_01, S_02…)
- `downloadAnonymizedReportHTML(group, metrics, roles, predictions, matrix, responses, lang)` → anonymized HTML report
- `downloadStudentsCSV(group)` → CSV with student names
- `downloadMatrixCSV(group, matrix)` → CSV of sociometric matrix

### Teams & Distribution (`src/utils/teams.ts`)
- `formTeams(students, matrix, roles, teamSize, seed, strategy)` → array of teams. Strategies:
  - `'balanced'` (default, anti-bullying) — penalizes rejection pairs, rewards choices, spreads leaders
  - `'random'` — seeded shuffle + round-robin
  - `'mix'` — puts students with NO existing edges together (maximize new connections)
  - `'cluster'` — keeps reciprocal-choosing pairs together (collaborative projects)
  - `'scatter'` — separates rejection pairs, pairs rejected with popular/leaders
- `formDistribution(students, matrix, roles, rows, cols, seed, strategy)` → `DistGrid`. Strategies:
  - `'balanced'` (default) — places rejected students near leaders/popular
  - `'random'` — random placement
  - `'mix'` — minimizes adjacency of students who already interact
  - `'separate-conflicts'` — maximizes distance between rejection pairs
- `getTeamStrategies()` → array of `{ id, labelKey }` for dropdown
- `getDistStrategies()` → array of `{ id, labelKey }` for dropdown

### Storage (`src/utils/storage.ts`)
- `saveGroups(groups)`, `loadGroups()` → persist/load group list via IndexedDB (idb-keyval)
- `saveResponses(groupId, responses)`, `loadResponses(groupId)` → persist/load questionnaire responses
- `saveDistribution(groupId, distGrid, distSize, distCols)`, `loadDistribution(groupId, students)` → persist/load seating layout
- `exportAllData()` → full JSON export of everything
- `importFromFile(file)` → full JSON import from a File object
- `downloadJSON(obj, filename)` → triggers JSON download

### Templates (`src/utils/templates.ts`)
- `loadTemplates()` → array of 14 built-in template objects
- `generateTestData()` → creates 3 simulated groups with realistic responses (choices + rejections)

## Component Architecture

### App.vue (root)
- Manages all app state: `groups`, `step`, `lang`, `responses`, modals
- Orchestrates navigation between steps 1–5
- Header bar with RutaEstudio-style buttons (SVG icons, consistent styling)
- Tagline/badges banner with 4 badges + tagline text
- Step progress indicator (numbered circles with descriptions)
- Renders `GroupManager`, `Questionnaire`, `ResultsView` based on `step`
- Renders modal overlays (`ConfirmModal`, `PromptModal`, `ToastPopup`, `OnboardingOverlay`)
- Footer: sociogram info, feedback links, privacy panel (collapsible)

### GroupManager.vue
- Step 1: create/delete/select groups, manage students (add, bulk, CSV import, rename, reorder via drag)
- Template modal for creating groups from 14 presets
- Group cards show student count and delete button
- Emits: `select`, `refresh`, `start-survey`, `confirm`, `prompt`

### Questionnaire.vue
- Step 2: per-student survey with configurable questions
- Preset selection (6 presets), question toggling (15 questions), choice count slider
- Student selector with completion checkmarks
- Per-question choice UI with drag support
- Auto-saves on every selection, `beforeunload` warning when dirty
- Emits: `done`, `toggle-question`, `apply-preset`, `update:maxChoices`

### ResultsView.vue
- Steps 3–5: sociogram graph, metrics, predictions, student list, editor, matrix display
- Mode-based rendering via `mode` prop: `'results'` (step 3), `'teams'` (step 4), `'dist'` (step 5)
- Computes sociogram via `computeSociogram()` on mount, or `computeFromMatrix()` after manual edits
- Manual editor with click-to-cycle cell editing (empty → choice → rejection → empty)
- Drag & drop matrix editor: drag student name onto another to create choice
- Graph with physics simulation, role-colored nodes, edge arrows, interactive legend
- Student list sorted by choices received, with search filter
- Export actions: JSON, HTML report, PNG graph image, anonymized JSON/HTML, CSV
- Teams mode: strategy dropdown (5 criteria), team size input, generate, PNG export
- Dist mode: strategy dropdown, rows/cols config, generate, visual drag-and-drop grid, PNG export
- Emits: `back`, `organize`, `dist`

## Important Implementation Notes
- `vis-network` CSS is loaded via npm import in `graph.ts`
- Toast notifications auto-dismiss after 3.5 seconds
- Confirm/prompt dialogs use callback pattern (not promises)
- All IDs generated with `Date.now().toString(36) + Math.random().toString(36).slice(2, 8)`
- The `writing-vertical` class in matrix/editor is for vertical text in table headers
- `stringToColor()` generates consistent colors from student names
- `ROLE_KEY_MAP` maps role strings to i18n keys; `ROLE_CLASSES` maps to Tailwind classes
- Graph physics: `forceAtlas2Based`, stabilized then disabled
- Matrix cells are typed as `{ choice: number; rejection: number }` — a cell can have both
- Test data responses use indices 0,1,2 matching the 'general' preset active questions
- `buildQuestions()` depends on `questionActive` — watched via `watch(questionActive, ..., { deep: true })`
- Privacy panel is toggled open/closed via `showPrivacy` ref

## Testing
- Click `🧪 Datos prueba` button (header or welcome section) to load 3 simulated groups with realistic responses
- Test both ES and EN languages via the header language selector
- Test edge cases: empty group, single student, all responses identical
- Test manual editor: click cells to cycle, drag students to create relations
- Verify the graph shows edges (nodes connected by arrows) after loading test data and navigating to step 3
- Open browser console to check for JS errors
- Run `npm run build` to verify no TypeScript errors

## Deployment
- Push to `main` branch → GitHub Actions workflow builds and deploys to Pages
- GitHub Pages source must be set to "GitHub Actions" (workflow build type)
- The workflow in `.github/workflows/deploy.yml` runs `npm ci && npm run build` then `actions/deploy-pages`
- `vite.config.ts` has `base: '/SociogramaAula/'` for GH Pages project-site deployment
- `manifest.json` and icons are in `public/` — update `public/manifest.json` for PWA changes

## Common Pitfalls
- Forgetting to add both ES + EN keys when adding new UI strings (`src/utils/locales.ts`)
- Not awaiting `saveGroups()` / `saveResponses()` before navigation
- `vis-network` destroy/recreate cycle: always call `destroyGraph()` before re-rendering
- Drag & drop in distribution: coordinates use `(rowIdx, tableIdx, studentId)` triple
- Matrix `cellClass()` uses tri-state: empty → choice → rejection → empty cycle
- Import paths: always use `@/` alias (e.g., `@/utils/locales`, `@/constants`)
- Adding new questions requires updating both `QUESTION_BANK` in `App.vue` and both locale files
- `buildQuestions()` must be called after `applyPreset()` — the watcher handles this, but direct calls to `questionActive.value.push/splice` won't trigger deep watch unless using reactive array methods
- Header button text comes from locale values — if you add SVG icons to buttons, remove any emoji from the corresponding locale key to avoid double icons
