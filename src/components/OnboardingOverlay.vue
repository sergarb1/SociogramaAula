<template>
  <div v-if="show" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm" data-overlay="onboarding">
    <div class="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 mx-4">
      <div class="flex gap-1 mb-6">
        <div v-for="s in steps.length" :key="s"
             class="h-1 flex-1 rounded-full transition"
             :class="s - 1 === step ? 'bg-indigo-600' : s - 1 < step ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'"></div>
      </div>

      <div v-if="step === 0" class="text-center space-y-3">
        <svg class="w-14 h-14 text-indigo-600 dark:text-indigo-400 mx-auto" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100">{{ t('onboard.welcome') }}</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ t('onboard.welcomeDesc') }}</p>
        <p class="text-xs text-slate-400 dark:text-slate-500">{{ t('onboard.local') }}</p>
      </div>

      <div v-if="step === 1" class="text-center space-y-3">
        <svg class="w-14 h-14 text-indigo-600 dark:text-indigo-400 mx-auto" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>
        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100">{{ t('onboard.step1Title') }}</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ t('onboard.step1Desc') }}</p>
      </div>

      <div v-if="step === 2" class="text-center space-y-3">
        <svg class="w-14 h-14 text-indigo-600 dark:text-indigo-400 mx-auto" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"/></svg>
        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100">{{ t('onboard.step2Title') }}</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ t('onboard.step2Desc') }}</p>
      </div>

      <div v-if="step === 3" class="text-center space-y-3">
        <svg class="w-14 h-14 text-indigo-600 dark:text-indigo-400 mx-auto" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>
        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100">{{ t('onboard.step3Title') }}</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ t('onboard.step3Desc') }}</p>
      </div>

      <div v-if="step === 4" class="text-center space-y-3">
        <svg class="w-14 h-14 text-indigo-600 dark:text-indigo-400 mx-auto" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/></svg>
        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100">{{ t('onboard.step4Title') }}</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ t('onboard.step4Desc') }}</p>
      </div>

      <div v-if="step === 5" class="text-center space-y-3">
        <svg class="w-14 h-14 text-indigo-600 dark:text-indigo-400 mx-auto" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"/></svg>
        <h3 class="text-xl font-bold text-slate-800 dark:text-slate-100">{{ t('onboard.step5Title') }}</h3>
        <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{{ t('onboard.step5Desc') }}</p>
      </div>

      <div class="flex items-center justify-between mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
        <button @click="step > 0 ? $emit('prev') : null"
                :class="step === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-100 dark:hover:bg-slate-700'"
                class="text-sm font-medium text-slate-500 dark:text-slate-400 px-4 py-2 min-h-[44px] sm:min-h-[36px] rounded-lg transition">&larr; {{ t('onboard.prev') }}</button>
        <div class="flex gap-1">
          <span v-for="s in steps.length" :key="s"
                class="w-2 h-2 rounded-full transition cursor-pointer"
                :class="s - 1 === step ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'"
                @click="$emit('go-to-step', s - 1)"></span>
        </div>
        <button v-if="step < steps.length - 1"
                 @click="$emit('next')"
                 class="bg-indigo-600 text-white text-sm font-bold px-5 py-2 min-h-[44px] rounded-xl hover:bg-indigo-700 transition">{{ t('onboard.next') }} &rarr;</button>
        <button v-if="step === steps.length - 1"
                 @click="$emit('close')"
                 class="flex items-center gap-1.5 bg-green-600 text-white text-sm font-bold px-5 py-2 min-h-[44px] rounded-xl hover:bg-green-700 transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/></svg> {{ t('onboard.start') }}
        </button>
      </div>
      <button @click="$emit('close')" class="text-xs text-slate-400 dark:text-slate-500 mt-3 w-full text-center hover:underline">{{ t('onboard.skip') }}</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from '@/composables/useI18n'

defineProps<{ show: boolean; step: number; steps: unknown[] }>()
defineEmits<{ close: []; next: []; prev: []; 'go-to-step': [step: number] }>()

const { t } = useI18n()
</script>
