# Sociograma Aula

**Sociometría gratuita para entender las relaciones de tu grupo, formar equipos y mejorar la convivencia.**

100% gratuita · Sin registro · Sin servidor · Datos locales · Cumple LOPDGDD/GDPR · Código abierto (AGPL v3)

---

## 🚀 Usar ahora

- **GitHub Pages:** https://sergarb1.github.io/SociogramaAula/
- **Local:** Abre `index.html` en cualquier navegador. No necesita instalación ni servidor.

---

## ✨ Funcionalidades

### 📊 Sociometría completa
- **Cuestionario sociométrico** — 15 preguntas configurables, 6 plantillas por nivel educativo (Primaria, ESO, Bachillerato, Convivencia, Inclusión, General)
- **Grafo interactivo** — Visualización de relaciones con vis-network: colores por rol, flechas de elección/rechazo, física suave, zoom y arrastre
- **Métricas automáticas** — Cohesión grupal, densidad de red, índice de aislamiento, reciprocidad
- **Predicciones inteligentes** — Detección de aislamiento, conflicto potencial, líderes positivos, baja cohesión. Incluye recomendaciones de intervención

### 👥 Gestión de grupos
- Creación y edición de grupos con arrastrar y soltar para reordenar alumnos
- Importación desde plantillas prediseñadas
- Importación CSV de listados de alumnos
- Añadido masivo (varios nombres de una vez)

### ✏️ Editor manual de relaciones
- Matriz sociométrica editable clic a clic
- Drag & drop entre alumnos para crear relaciones rápidamente
- Modo manual completo sin necesidad de pasar cuestionario

### 👥 Formación de equipos
- Algoritmo de formación equilibrada por roles, elecciones mutuas y rechazos
- Tamaño de equipo configurable
- Diferentes distribuciones con semilla aleatoria

### 🏫 Distribución de clase
- Plano visual interactivo con mesas
- 3 disposiciones: cuadrícula, filas, en U
- Arrastra alumnos entre mesas para reordenar
- Muestra rol de cada alumno y % de cohesión por mesa
- Exportable a imagen (PNG)

### 📤 Exportación
- **JSON** — Datos completos (importable/exportable)
- **HTML** — Informe profesional imprimible
- **PNG** — Grafo y distribución de clase como imagen
- **CSV** — Listado de alumnos y matriz sociométrica
- **Anonimizado** — Exporta datos con códigos (S_01, S_02…) para compartir con IA o análisis externo preservando el anonimato

### 🌐 Multi-idioma
- Español e Inglés completos
- Selección con persistencia en localStorage

### 🔒 Privacidad y cumplimiento legal
- **100% local** — Todos los datos se almacenan en IndexedDB en tu navegador
- **Sin servidor** — No se envía información a ningún servidor externo
- **Sin registro** — No necesita email, cuenta ni datos personales
- **Cumple LOPDGDD (España) y GDPR (Europa)** — Al no procesarse datos fuera de tu dispositivo, no hay tratamiento externo de datos personales
- **Exportación y borrado** — Puedes exportar tus datos y borrarlos en cualquier momento

---

## 🧑‍💻 Para desarrolladores

### Tecnologías

| Componente | Tecnología |
|---|---|
| Interfaz | Vue 3 (CDN) + Tailwind CSS (CDN) |
| Grafo | vis-network |
| Almacenamiento | idb-keyval (IndexedDB) |
| Exportación PNG | html2canvas |
| Gráficos | Chart.js |
| **Build** | **Ninguno** — Sin Node.js, sin bundler, sin servidor |

### Estructura del proyecto

```
sociograma/
├── index.html          # App principal (Vue + modales)
├── ayuda.html          # Página de ayuda para docentes
├── manifest.json       # PWA manifest
├── css/style.css       # Estilos adicionales
├── js/
│   ├── app.js          # Componentes Vue: GroupManager, Questionnaire, ResultsView
│   ├── sociogram.js    # Algoritmo principal: matriz, métricas, roles, predicciones
│   ├── graph.js        # Renderizado del grafo con vis-network
│   ├── reports.js      # Exportación: JSON, HTML, PNG, CSV, anonimizado
│   ├── locales.js      # Traducciones ES/EN + helper t()
│   ├── storage.js      # Wrapper IndexedDB (idb-keyval)
│   ├── teams.js        # Algoritmo de formación de equipos
│   └── templates.js    # Plantillas de clase + datos de prueba
├── AGENTS.md           # Guía para asistentes de IA
└── README.md
```

### Servidor local de desarrollo

```bash
npx live-server sociograma/ --port=5500 --no-browser
```

Abrir en `http://127.0.0.1:5500`

### Convenios clave

- Todos los textos visibles pasan por `locales.js` usando `t(key, lang)`
- Los componentes Vue tienen un método `t(key)` que delega según `this.lang`
- El idioma se persiste en `localStorage` con clave `sociograma-lang`
- La matriz sociométrica es la fuente de verdad única para todos los cálculos
- `computeSociogram()` y `computeFromMatrix()` comparten el mismo pipeline de resultados

---

## 📄 Licencia

**GNU AGPL v3** — Usa, modifica y comparte, pero cualquier mejora o derivado debe mantenerse libre.

Esta licencia garantiza que:
- ✅ Cualquier persona puede usar la herramienta gratis, modificarla y compartirla
- ✅ Si alguien la mejora y la pone a disposición (incluso por web), debe liberar sus cambios bajo la misma licencia
- ❌ Nadie puede apropiarse del código, cerrarlo y venderlo sin publicar sus modificaciones

Lee el texto completo en [LICENSE](./LICENSE) o en [https://www.gnu.org/licenses/agpl-3.0.html](https://www.gnu.org/licenses/agpl-3.0.html)
