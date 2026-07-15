import { ref, computed } from 'vue'
import { t as translate } from '@/utils/locales'

const currentLang = ref(localStorage.getItem('sociograma-lang') || 'es')

export function useI18n() {
  function setLang(lang: string) {
    currentLang.value = lang
    localStorage.setItem('sociograma-lang', lang)
  }

  function t(key: string): string {
    return translate(key, currentLang.value)
  }

  return { lang: currentLang, t, setLang }
}
