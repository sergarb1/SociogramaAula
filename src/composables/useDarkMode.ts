import { ref, watch } from 'vue'

const isDark = ref(
  localStorage.getItem('sociograma-dark') === 'true' ||
  (!localStorage.getItem('sociograma-dark') && window.matchMedia('(prefers-color-scheme: dark)').matches)
)

export function useDarkMode() {
  watch(isDark, (val) => {
    document.documentElement.classList.toggle('dark', val)
    localStorage.setItem('sociograma-dark', String(val))
  }, { immediate: true })

  function toggleDark() {
    isDark.value = !isDark.value
  }

  return { isDark, toggleDark }
}
