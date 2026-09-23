<script setup lang="ts">
import { computed } from 'vue'
import { useNav } from '@slidev/client'

const { currentSlideNo, total, next, prev, hasNext, hasPrev, isPrintMode } = useNav()

const progressPct = computed(() => {
  if (total.value <= 0) return 0
  return (currentSlideNo.value / total.value) * 100
})

const showHint = computed(() => currentSlideNo.value === 1 && !isPrintMode.value)
</script>

<template>
  <div v-if="!isPrintMode" class="slide-nav" aria-label="Navegación de diapositivas">
    <div class="slide-nav-progress" :style="{ width: `${progressPct}%` }" />

    <div class="slide-nav-bar">
      <button
        type="button"
        class="slide-nav-btn"
        :disabled="!hasPrev"
        title="Diapositiva anterior (←)"
        aria-label="Diapositiva anterior"
        @click.stop.prevent="prev()"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <span class="slide-nav-counter" title="Nº de diapositiva">
        <strong>{{ currentSlideNo }}</strong>
        <span class="opacity-60"> / {{ total }}</span>
      </span>

      <button
        type="button"
        class="slide-nav-btn slide-nav-btn-next"
        :disabled="!hasNext"
        title="Siguiente diapositiva (→)"
        aria-label="Siguiente diapositiva"
        @click.stop.prevent="next()"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <p v-if="showHint" class="slide-nav-hint">
      Son transparencias: usa <kbd>←</kbd> <kbd>→</kbd>, la barra espaciadora o las flechas de abajo
    </p>
  </div>
</template>

<style>
.slide-nav {
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  font-family: Inter, system-ui, sans-serif;
}

.slide-nav-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 4px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  box-shadow: 0 0 8px rgba(99, 102, 241, 0.45);
  transition: width 0.25s ease;
}

.slide-nav-bar {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.88);
  color: #f8fafc;
  border: 1px solid rgba(148, 163, 184, 0.35);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(8px);
  pointer-events: auto;
}

.slide-nav-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: inherit;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease, opacity 0.15s ease;
}

.slide-nav-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.18);
  transform: translateY(-1px);
}

.slide-nav-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.slide-nav-btn-next {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
}

.slide-nav-btn-next:hover:not(:disabled) {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
}

.slide-nav-counter {
  min-width: 3.5rem;
  text-align: center;
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
  user-select: none;
}

.slide-nav-hint {
  position: absolute;
  left: 50%;
  bottom: 1.1rem;
  transform: translateX(-50%);
  margin: 0;
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.78);
  color: #e2e8f0;
  font-size: 0.78rem;
  letter-spacing: 0.01em;
  white-space: nowrap;
  max-width: calc(100vw - 10rem);
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
}

.slide-nav-hint kbd {
  display: inline-block;
  min-width: 1.1rem;
  padding: 0.05rem 0.3rem;
  margin: 0 0.1rem;
  border-radius: 0.3rem;
  border: 1px solid rgba(148, 163, 184, 0.55);
  background: rgba(255, 255, 255, 0.1);
  font-family: inherit;
  font-size: 0.72rem;
  text-align: center;
}

@media (max-width: 720px) {
  .slide-nav-bar {
    right: 0.5rem;
    bottom: 0.5rem;
    left: 0.5rem;
    justify-content: center;
  }

  .slide-nav-hint {
    bottom: 4.25rem;
    white-space: normal;
    text-align: center;
    line-height: 1.35;
  }
}

@media print {
  .slide-nav {
    display: none !important;
  }
}
</style>
