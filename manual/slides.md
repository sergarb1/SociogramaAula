---
theme: default
title: Sociograma Aula — Manual
info: |
  Manual en transparencias de Sociograma Aula.
  Herramienta gratuita de sociometría para docentes.
class: text-center
drawings:
  persist: false
transition: slide-left
mdc: true
colorSchema: light
favicon: /logo.png
fonts:
  provider: none
  sans: 'Inter, system-ui, sans-serif'
  local: 'Inter'
highlighter: shiki
---

<img src="/logo.png" alt="Sociograma Aula" class="logo" />

# Sociograma Aula

## Manual en transparencias

Herramienta gratuita de sociometría para entender las relaciones de tu grupo

<div class="badge-row">
  <span class="badge green">100% Gratuito</span>
  <span class="badge indigo">Sin registro</span>
  <span class="badge purple">Código abierto</span>
  <span class="badge teal">Datos locales</span>
</div>

<div class="pt-8">
  <a href="../" class="app-link">Ir a la app</a>
</div>

<style>
.logo { height: 88px; margin-bottom: .5rem; }
.badge-row { display:flex; flex-wrap:wrap; justify-content:center; gap:.5rem; margin-top:1.5rem; }
.badge { font-size:.75rem; font-weight:600; padding:.25rem .75rem; border-radius:999px; }
.badge.green { background:#dcfce7; color:#16a34a; }
.badge.indigo { background:#eef2ff; color:#4f46e5; }
.badge.purple { background:#f3e8ff; color:#9333ea; }
.badge.teal { background:#ccfbf1; color:#0d9488; }
.app-link { display:inline-block; padding:.6rem 1.5rem; border-radius:.75rem; background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; text-decoration:none; font-weight:600; box-shadow:0 4px 14px rgba(99,102,241,.35); }
.app-link:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(99,102,241,.45); }
</style>

---
layout: two-cols
---

# ¿Qué es un sociograma?

Un **sociograma** es un mapa visual de las relaciones sociales dentro de un grupo. Creado por **Jacob L. Moreno** en los años 30.

Muestra quién elige a quién, quién queda aislado, quién conecta subgrupos… cosas que el ojo humano no siempre detecta.

::right::

## ¿Para qué sirve?

- 🔍 Detectar **líderes positivos**
- 🆘 Identificar alumnos **aislados**
- ⚡ Localizar **conflictos latentes**
- 👥 Formar **equipos equilibrados**
- 🏫 **Distribuir** el aula
- 📈 Hacer **seguimiento** temporal

::footer::

No es un test de inteligencia ni un juicio de valor: es una **foto del momento**.

---

# La app en 5 pasos

<div class="grid grid-cols-3 gap-4 text-left">
  <div class="card"><span class="n n1">1</span><strong>Grupos</strong><p>Crea tu clase, añade alumnos, usa plantillas o importa CSV</p></div>
  <div class="card"><span class="n n2">2</span><strong>Cuestionario</strong><p>Cada alumno responde en tu dispositivo. Guardado automático</p></div>
  <div class="card"><span class="n n3">3</span><strong>Resultados</strong><p>Grafo, métricas, predicciones, editor y matriz</p></div>
  <div class="card"><span class="n n4">4</span><strong>Equipos</strong><p>Formación de equipos según 5 criterios (desde Resultados)</p></div>
  <div class="card"><span class="n n5">5</span><strong>Distribución</strong><p>Plano de clase con 4 criterios (desde Resultados)</p></div>
  <div class="card muted"><strong>Navegación</strong><p>Pulsa el número en la barra superior para cambiar de paso en cualquier momento</p></div>
</div>

<style>
.card { background:#fff; border:1px solid #e2e8f0; border-radius:.75rem; padding:.9rem 1rem; box-shadow:0 2px 8px rgba(0,0,0,.05); }
.card p { margin:.35rem 0 0; color:#64748b; font-size:.85rem; line-height:1.45; }
.card.muted { background:#f8fafc; }
.n { display:inline-flex; align-items:center; justify-content:center; width:1.6rem; height:1.6rem; border-radius:50%; font-weight:700; font-size:.8rem; margin-right:.45rem; color:#fff; }
.n1 { background:#6366f1; } .n2 { background:#22c55e; } .n3 { background:#f59e0b; }
.n4 { background:#22c55e; } .n5 { background:#a855f7; }
.dark .card { background:#1e293b; border-color:#334155; }
.dark .card p { color:#94a3b8; }
.dark .card.muted { background:#0f172a; }
</style>

---
layout: two-cols
---

# 1 · Grupos

### ➕ Crear grupo
Escribe el nombre y pulsa **Crear**. También puedes usar **Desde plantilla** con clases predefinidas.

### 👤 Añadir alumnos
- **+ Alumno** — uno a uno
- **+ Varios** — un nombre por línea
- **Importar CSV** — listado completo

### 🧪 Datos de prueba
Botón **Datos prueba** en la cabecera: carga 3 grupos simulados para explorar sin datos reales.

::right::

### 🔄 Reordenar
Arrastra los nombres para cambiar el orden.

### 📋 Plantillas
14 plantillas por nivel: Primaria, ESO, Bachillerato, FP…

### 🗑️ Gestionar
- Renombrar grupos
- Eliminar con confirmación
- Seleccionar grupo activo

::footer::

Los grupos se guardan solos en tu navegador (IndexedDB).

---

# 2 · Cuestionario

<div class="grid grid-cols-2 gap-4 text-left">
  <div class="card">
    <strong>📝 ¿Cómo funciona?</strong>
    <p>Cada alumno responde en tu dispositivo, uno por uno. Selecciona quién responde y elige compañeros según las preguntas activas.</p>
  </div>
  <div class="card">
    <strong>🎛️ Personaliza</strong>
    <p>6 plantillas (General, Primaria, ESO, Bachillerato, Convivencia, Inclusión) o activa/desactiva las 15 preguntas. Ajusta el máximo de elecciones.</p>
  </div>
  <div class="card">
    <strong>💾 Guardado automático</strong>
    <p>Cada elección se guarda al instante. Si cambias de alumno, las respuestas anteriores se conservan. Aviso si sales con cambios sin guardar.</p>
  </div>
  <div class="card warn">
    <strong>⏭️ ¿Demasiado largo?</strong>
    <p>Si ya conoces las relaciones, salta al paso 3 y edítalas a mano con el editor de relaciones.</p>
  </div>
</div>

<style>
.card { background:#fff; border:1px solid #e2e8f0; border-radius:.75rem; padding:.9rem 1rem; box-shadow:0 2px 8px rgba(0,0,0,.05); }
.card p { margin:.4rem 0 0; color:#64748b; font-size:.85rem; line-height:1.5; }
.card.warn { background:#fef2f2; border-color:#fecaca; }
.card.warn strong { color:#dc2626; }
.dark .card { background:#1e293b; border-color:#334155; }
.dark .card p { color:#94a3b8; }
.dark .card.warn { background:#450a0a; border-color:#7f1d1d; }
</style>

---
layout: two-cols
---

# 3 · Resultados — Grafo

### 🕸️ Grafo interactivo
Cada alumno es un nodo. **Flechas verdes** = elecciones, **rojas discontinuas** = rechazos. El color indica el **rol sociométrico**.

### 👆 Interacción
- **Clic** en un alumno → sus relaciones en el panel
- **Arrastrar** nodos para reordenar
- **Rueda** del ratón para zoom
- Botón **⟳** para re-centrar
- Botón **🖼️** para exportar PNG

::right::

### 🎨 Leyenda de roles

| Color | Rol |
|---|---|
| 🟢 | Líder |
| 🔵 | Popular |
| 🟡 | Puente |
| 🔴 | Rechazado |
| ⚪ | Aislado |
| 🟣 | Neutro |

<style>
table { font-size:.9rem; margin-top:.5rem; }
td, th { padding:.2rem .5rem; }
</style>

---

# 3 · Resultados — Métricas

<div class="grid grid-cols-3 gap-4 text-left">
  <div class="card"><strong>📈 Cohesión</strong><p>% de relaciones recíprocas sobre el total posible. Confianza mutua.</p></div>
  <div class="card"><strong>📊 Densidad</strong><p>% de conexiones existentes. Cuán conectado está el grupo.</p></div>
  <div class="card"><strong>🔍 Aislamiento</strong><p>% de alumnos sin ninguna elección. Riesgo de exclusión.</p></div>
  <div class="card"><strong>🔄 Reciprocidad</strong><p>% de elecciones correspondidas. Relaciones sólidas.</p></div>
  <div class="card"><strong>⭐ Más popular</strong><p>Quien recibe más elecciones positivas.</p></div>
  <div class="card"><strong>⚠️ Más rechazado</strong><p>Quien recibe más rechazos. Atención prioritaria.</p></div>
</div>

<div class="card accent mt-4 text-left">
  <p>También se generan <strong>predicciones automáticas</strong>: <em>riesgos</em> (aislamiento, conflicto, baja cohesión, subgrupos excluidos) y <em>oportunidades</em> (líderes, alta cohesión, distribución de líderes), con recomendaciones personalizadas.</p>
</div>

<style>
.card { background:#fff; border:1px solid #e2e8f0; border-radius:.75rem; padding:.85rem 1rem; box-shadow:0 2px 8px rgba(0,0,0,.05); }
.card p { margin:.35rem 0 0; color:#64748b; font-size:.82rem; line-height:1.45; }
.card.accent { background:linear-gradient(135deg,#eef2ff,#f3e8ff); border-color:#c7d2fe; border-left:3px solid #6366f1; }
.card.accent p { color:#334155; font-size:.85rem; }
.dark .card { background:#1e293b; border-color:#334155; }
.dark .card p { color:#94a3b8; }
.dark .card.accent { background:#1e1b4b; border-color:#3730a3; }
.dark .card.accent p { color:#cbd5e1; }
</style>

---
layout: two-cols
---

# 3 · Editor + Matriz

### ✏️ Editor de relaciones
Selecciona un alumno **de** y otro **hacia**, y elige elección o rechazo. También puedes **arrastrar** un alumno sobre otro para crear una relación rápida.

### 📊 Matriz sociométrica
Visión tabular. Clic en cualquier celda para alternar:

**vacío → elección (↑) → rechazo (↓) → vacío**

Ideal para edición masiva.

::right::

### 💡 Modo manual
Si no pasaste el cuestionario, define **todas** las relaciones desde cero. Grafo, métricas y predicciones se actualizan al instante.

### Botones clave (panel derecho)
- **Abrir editor** / **Ver matriz**
- **Formar equipos** → paso 4
- **Distribuir clase** → paso 5

---

# 4 · Equipos

<div class="grid grid-cols-2 gap-4 text-left">
  <div class="card">
    <strong>👥 Formar equipos</strong>
    <p>Elige tamaño (2–6) y un criterio. El algoritmo crea grupos equilibrados: separa rechazos, junta elecciones y reparte roles.</p>
  </div>
  <div class="card">
    <strong>🏷️ 5 criterios</strong>
    <ul>
      <li><b>Anti-bullying</b> (por defecto)</li>
      <li><b>Aleatorio</b> con semilla</li>
      <li><b>Mezclar no relacionados</b></li>
      <li><b>Agrupar por afinidad</b></li>
      <li><b>Separar conflictos</b></li>
    </ul>
  </div>
  <div class="card">
    <strong>🎲 Reproducible</strong>
    <p>Semilla aleatoria: misma semilla + mismos datos = mismo resultado.</p>
  </div>
  <div class="card">
    <strong>🖼️ Exportar PNG</strong>
    <p>Guarda la composición de equipos como imagen para imprimirla o compartirla.</p>
  </div>
</div>

<style>
.card { background:#fff; border:1px solid #e2e8f0; border-radius:.75rem; padding:.9rem 1rem; box-shadow:0 2px 8px rgba(0,0,0,.05); }
.card p, .card ul { margin:.4rem 0 0; color:#64748b; font-size:.85rem; line-height:1.5; }
.card ul { padding-left:1.1rem; }
.card li { margin:.15rem 0; }
.dark .card { background:#1e293b; border-color:#334155; }
.dark .card p, .dark .card ul { color:#94a3b8; }
</style>

---
layout: two-cols
---

# 5 · Distribución del aula

### 🏫 Plano de clase
Coloca a los alumnos en mesas con **3 diseños**:
- **Cuadrícula**
- **Filas**
- **En U**

Tamaño de mesa configurable.

### 🔄 Arrastrar y soltar
Reordena alumnos entre mesas. Se guarda **automáticamente** por grupo.

::right::

### 4 criterios de reparto
- **Equilibrado** (por defecto) — alumnos rechazados cerca de líderes
- **Aleatorio**
- **Mezclar no relacionados** — minimiza ya-conocidos juntos
- **Separar conflictos** — maximiza distancia entre rechazos

### 🖼️ Exportar PNG
Imagen de la distribución para imprimir o compartir.

---

# Roles sociométricos

<div class="grid grid-cols-3 gap-4 text-left">
  <div class="card g"><span class="dot" style="background:#22c55e"></span><strong>Líder</strong><p>Muchas elecciones, pocos rechazos. Referente positivo; buen mediador.</p></div>
  <div class="card i"><span class="dot" style="background:#6366f1"></span><strong>Popular</strong><p>Bien valorado. Varias elecciones sin llegar a líder.</p></div>
  <div class="card a"><span class="dot" style="background:#f59e0b"></span><strong>Puente</strong><p>Conecta subgrupos. Clave para la cohesión.</p></div>
  <div class="card r"><span class="dot" style="background:#ef4444"></span><strong>Rechazado</strong><p>Más rechazos que elecciones. Señal de alerta.</p></div>
  <div class="card s"><span class="dot" style="background:#94a3b8"></span><strong>Aislado</strong><p>Cero elecciones recibidas. Prioridad de intervención.</p></div>
  <div class="card p"><span class="dot" style="background:#a855f7"></span><strong>Neutro</strong><p>Sin relaciones significativas. Perfil medio evolutivo.</p></div>
</div>

<p class="note">Los roles no son etiquetas fijas. Cambian con el tiempo y las intervenciones.</p>

<style>
.card { border-radius:.75rem; padding:.85rem 1rem; border:1px solid #e2e8f0; background:#fff; }
.card p { margin:.35rem 0 0; color:#64748b; font-size:.8rem; line-height:1.45; }
.card strong { display:block; margin-top:.15rem; }
.dot { display:inline-block; width:.7rem; height:.7rem; border-radius:50%; margin-right:.4rem; }
.card.g { background:#f0fdf4; border-color:#bbf7d0; }
.card.i { background:#eef2ff; border-color:#c7d2fe; }
.card.a { background:#fffbeb; border-color:#fde68a; }
.card.r { background:#fef2f2; border-color:#fecaca; }
.card.s { background:#f8fafc; border-color:#cbd5e1; }
.card.p { background:#faf5ff; border-color:#e9d5ff; }
.note { margin-top:1rem; font-size:.8rem; color:#94a3b8; text-align:center; }
.dark .card { filter:brightness(.9); }
.dark .note { color:#64748b; }
</style>

---
layout: two-cols
---

# Exportación e informes

### 📄 Informe HTML
Completo e imprimible: métricas, roles, predicciones, matriz y recomendaciones.

### 🤖 Informe anonimizado
Nombres → códigos (**S_01, S_02…**). Ideal para IA u orientación sin revelar identidades.

::right::

### 📥 JSON completo
Todos los datos (grupos, respuestas, matriz, distribución) para copia de seguridad.

### 📋 CSV
Lista de alumnos o matriz sociométrica para hojas de cálculo.

### 🖼️ PNG
Grafo, equipos y distribución como imagen.

::footer::

🔒 **Todos los datos se quedan en tu dispositivo.** Las exportaciones solo ocurren cuando tú las pides.

---

# Privacidad y datos

<div class="grid grid-cols-3 gap-4 text-left">
  <div class="card g">
    <strong>💻 100% local</strong>
    <p>Datos en tu navegador (IndexedDB). Sin servidor, sin registro, sin cookies de terceros.</p>
  </div>
  <div class="card i">
    <strong>✅ Cumplimiento legal</strong>
    <p>Sin tratamiento externo: uso directamente conforme a <b>LOPDGDD</b> (España) y <b>GDPR</b> (Europa).</p>
  </div>
  <div class="card p">
    <strong>📤 Tú controlas tus datos</strong>
    <p>Exporta, borra, comparte o importa cuando quieras. Nada sale sin tu permiso.</p>
  </div>
</div>

<style>
.card { border-radius:.75rem; padding:1rem; border:1px solid #e2e8f0; background:#fff; }
.card p { margin:.5rem 0 0; color:#64748b; font-size:.88rem; line-height:1.5; }
.card.g { background:#f0fdf4; border-color:#bbf7d0; }
.card.g strong { color:#16a34a; }
.card.i { background:#eef2ff; border-color:#c7d2fe; }
.card.i strong { color:#4f46e5; }
.card.p { background:#f8fafc; border-color:#cbd5e1; }
.dark .card { filter:brightness(.9); }
</style>

---
layout: two-cols
---

# Cómo interpretar

### 📈 Cohesión > 50%
El grupo funciona bien. Aprovecha para proyectos colaborativos complejos.

### 📉 Cohesión < 25%
Grupo fragmentado. Prioriza dinámicas de cohesión antes de trabajos en equipo.

### 🚨 Aislamiento > 30%
Muchos alumnos sin elecciones. Intervención temprana recomendada.

::right::

### 🔄 Reciprocidad alta
Elecciones correspondidas. Relaciones sólidas y estables.

### ⭐ Un alumno concentra elecciones
El grupo depende de figuras centrales. Si faltan, la red se debilita.

### ⚠️ Rechazos cruzados
Dos o más se rechazan mutuamente. Conviene separarlos en actividades y equipos.

---

# Consejos prácticos

<div class="grid grid-cols-3 gap-4 text-left">
  <div class="card"><strong>🎯 Principio y mitad de curso</strong><p>Un sociograma al inicio y otro a mitad. Compara la evolución.</p></div>
  <div class="card"><strong>🤫 Garantiza el anonimato</strong><p>Explica que nadie verá respuestas individuales: solo el mapa grupal.</p></div>
  <div class="card"><strong>👀 No te fíes solo de la intuición</strong><p>Los aislados pasan desapercibidos; el sociograma los saca a la luz.</p></div>
  <div class="card"><strong>🔄 Actúa y vuelve a medir</strong><p>Diseña una intervención y repite el sociograma para evaluarla.</p></div>
  <div class="card"><strong>📋 Comparte con el departamento</strong><p>Usa informes anonimizados con orientación o equipo docente.</p></div>
  <div class="card"><strong>🤖 Apoya tu análisis con IA</strong><p>Exporta lo anonimizado y pide a una IA que lo analice.</p></div>
</div>

<style>
.card { background:#fff; border:1px solid #e2e8f0; border-radius:.75rem; padding:.9rem 1rem; box-shadow:0 2px 8px rgba(0,0,0,.05); }
.card p { margin:.4rem 0 0; color:#64748b; font-size:.83rem; line-height:1.45; }
.dark .card { background:#1e293b; border-color:#334155; }
.dark .card p { color:#94a3b8; }
</style>

---
layout: two-cols
---

# Usa la IA con tus datos

Exporta un **informe anonimizado** (S_01, S_02…) y pídele a un asistente de IA que lo analice.

### Ejemplos de prompts

- → *"Analiza este sociograma y dime qué dinámicas de grupo observas"*
- → *"¿Qué alumnos necesitan más atención según estos datos?"*
- → *"Propón una intervención para mejorar la cohesión del grupo"*
- → *"¿Cómo distribuirías los equipos de trabajo basándote en estas relaciones?"*

::right::

::tip::
Los códigos **S_01, S_02…** sustituyen a los nombres reales, preservando el anonimato incluso si compartes el archivo.

En la app encontrarás estos prompts listos en el panel de resultados.

---

# ¡Empieza ahora!

<div class="steps text-left">
  <div class="step"><b>1️⃣</b> Abre la app → <a href="../">Sociograma Aula</a> y crea tu primer grupo</div>
  <div class="step"><b>2️⃣</b> Añade alumnos: + Alumno, + Varios o importa CSV</div>
  <div class="step"><b>3️⃣</b> Pasa el cuestionario <em>o</em> edita relaciones a mano</div>
  <div class="step"><b>4️⃣</b> Explora grafo, métricas, equipos y distribución</div>
</div>

<div class="pt-6">
  <a href="../" class="app-link">Ir a Sociograma Aula</a>
  <a href="../ayuda.html" class="help-link">Guía detallada</a>
</div>

<style>
.steps { display:flex; flex-direction:column; gap:.65rem; max-width:36rem; margin:1.5rem auto 0; }
.step { background:#fff; border:1px solid #e2e8f0; border-radius:.75rem; padding:.75rem 1rem; font-size:.95rem; box-shadow:0 2px 8px rgba(0,0,0,.05); }
.step a { color:#4f46e5; font-weight:600; }
.dark .step { background:#1e293b; border-color:#334155; color:#e2e8f0; }
.app-link, .help-link { display:inline-block; padding:.6rem 1.4rem; border-radius:.75rem; font-weight:600; text-decoration:none; margin:0 .4rem; }
.app-link { background:linear-gradient(135deg,#6366f1,#8b5cf6); color:#fff; box-shadow:0 4px 14px rgba(99,102,241,.35); }
.help-link { background:#fff; color:#4f46e5; border:1px solid #c7d2fe; }
</style>
