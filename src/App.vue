<template>
  <div v-if="loading" class="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-indigo-950">
    <div class="w-14 h-14 relative mb-5">
      <div class="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-800 rounded-full"></div>
      <div class="absolute inset-0 border-4 border-t-indigo-600 dark:border-t-indigo-400 rounded-full animate-spin"></div>
      <div class="absolute inset-2 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900 dark:to-purple-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg">S</div>
    </div>
    <p class="text-sm font-medium text-indigo-600 dark:text-indigo-400 animate-pulse">{{ t('app.loading') }}</p>
  </div>

  <div v-show="!loading" class="max-w-7xl mx-auto px-3 py-4">
    <header class="flex items-center justify-between gap-2 flex-wrap mb-8">
      <div>
        <a href="/SociogramaAula/" class="flex items-center gap-3">
          <img src="/logo/logo2.png" alt="Sociograma Aula" class="h-12 md:h-16 w-auto" />
          <span class="text-[11px] md:text-xs text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap hidden sm:block">{{ t('badge.free') }} · {{ t('badge.lopdgdd') }}</span>
        </a>
      </div>
      <div class="flex items-center gap-1.5 flex-wrap justify-end">
        <button @click="toggleDark"
          class="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          :title="t('app.darkMode')">
          <svg v-if="isDark" class="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          <svg v-else class="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
        </button>
        <select @change="setLang(($event.target as HTMLSelectElement).value)" :value="lang"
          class="min-h-[44px] sm:min-h-[36px] text-xs bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-lg px-2 font-medium transition cursor-pointer focus:outline-none">
          <option value="es">ES</option>
          <option value="en">EN</option>
        </select>
        <button v-if="step > 1" @click="step--"
          class="min-w-[44px] min-h-[44px] sm:min-w-[36px] sm:min-h-[36px] flex items-center justify-center bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          :title="t('app.back')">
          <svg class="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"/></svg>
        </button>

        <div class="hidden md:flex items-center gap-1.5">
          <button @click="loadTestData"
            class="flex items-center gap-1.5 text-xs font-medium bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-xl px-3 py-2.5 sm:py-2 min-h-[44px] hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            <svg class="w-4 h-4 sm:w-3.5 sm:h-3.5 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
            {{ t('app.testData') }}
          </button>
          <label class="flex items-center gap-1.5 text-xs font-medium bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-xl px-3 py-2.5 sm:py-2 min-h-[44px] hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer">
            <svg class="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"/></svg>
            {{ t('app.import') }}
            <input type="file" accept=".json" @change="importJSON" class="hidden">
          </label>
          <button @click="exportAll"
            class="flex items-center gap-1.5 text-xs font-medium bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-xl px-3 py-2.5 sm:py-2 min-h-[44px] hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            <svg class="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
            {{ t('app.exportAll') }}
          </button>
          <a href="manual.html" target="_blank"
            class="flex items-center gap-1.5 text-xs font-medium bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-xl px-3 py-2.5 sm:py-2 min-h-[44px] hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            <svg class="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>
            {{ t('app.manual') }}
          </a>
          <a href="ayuda.html" target="_blank"
            class="flex items-center gap-1.5 text-xs font-medium bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-xl px-3 py-2.5 sm:py-2 min-h-[44px] hover:bg-slate-50 dark:hover:bg-slate-700 transition">
            <svg class="w-4 h-4 sm:w-3.5 sm:h-3.5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/></svg>
            {{ t('app.help') }}
          </a>
        </div>

        <button @click="showMobileMenu = !showMobileMenu"
          class="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition">
          <svg class="w-5 h-5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>
    </header>

    <div v-if="showMobileMenu" class="md:hidden absolute top-full right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border dark:border-slate-600 p-2 z-50 animate-slideUp origin-top-right">
      <button @click="loadTestData; showMobileMenu = false" class="w-full flex items-center gap-2 text-xs px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition min-h-[44px] font-medium">
        <svg class="w-4 h-4 text-amber-500 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
        {{ t('app.testData') }}
      </button>
      <label class="w-full flex items-center gap-2 text-xs px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer min-h-[44px] font-medium">
        <svg class="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"/></svg>
        {{ t('app.import') }}
        <input type="file" accept=".json" @change="importJSON; showMobileMenu = false" class="hidden">
      </label>
      <button @click="exportAll; showMobileMenu = false" class="w-full flex items-center gap-2 text-xs px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition min-h-[44px] font-medium">
        <svg class="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"/></svg>
        {{ t('app.exportAll') }}
      </button>
      <a href="manual.html" target="_blank" @click="showMobileMenu = false" class="w-full flex items-center gap-2 text-xs px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition min-h-[44px] font-medium">
        <svg class="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>
        {{ t('app.manual') }}
      </a>
      <a href="ayuda.html" target="_blank" @click="showMobileMenu = false" class="w-full flex items-center gap-2 text-xs px-3 py-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition min-h-[44px] font-medium">
        <svg class="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/></svg>
        {{ t('app.help') }}
      </a>
    </div>

    <div class="mb-4 px-5 py-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-950/30 dark:to-slate-900 border-l-4 border-indigo-400 dark:border-indigo-500 shadow-sm">
      <div class="flex flex-wrap items-center gap-1.5 mb-3">
        <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-100/80 dark:bg-indigo-900/40 dark:text-indigo-300 px-2 py-0.5 rounded-full">{{ t('badge.free') }}</span>
        <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-100/80 dark:bg-green-900/40 dark:text-green-300 px-2 py-0.5 rounded-full">{{ t('badge.noregister') }}</span>
        <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-700 bg-purple-100/80 dark:bg-purple-900/40 dark:text-purple-300 px-2 py-0.5 rounded-full">{{ t('badge.lopdgdd') }}</span>
        <span class="inline-flex items-center gap-1 text-[10px] font-semibold text-teal-700 bg-teal-100/80 dark:bg-teal-900/40 dark:text-teal-300 px-2 py-0.5 rounded-full">{{ t('badge.local') }}</span>
      </div>
      <div class="text-sm text-indigo-800 dark:text-indigo-200 font-medium leading-relaxed">{{ t('app.tagline') }}</div>
      <div class="mt-1 text-[11px] text-indigo-400 dark:text-indigo-400/70">{{ t('app.taglineTest') }}</div>
    </div>

    <div class="flex items-center justify-center mb-5 overflow-x-auto px-1 py-1">
      <template v-for="(s, i) in steps" :key="i">
        <div @click="goStep(i+1)"
          class="flex flex-col items-center cursor-pointer group shrink-0 transition-all duration-300 px-1.5 py-1 rounded-xl"
          :class="step === i+1 ? 'bg-indigo-100 dark:bg-indigo-900/30 shadow-sm' : (step > i+1 ? 'bg-green-50 dark:bg-green-900/20' : 'opacity-60 hover:opacity-100')">
          <div class="flex items-center gap-1.5"
            :class="step === i+1 ? 'text-indigo-700 dark:text-indigo-300' : step > i+1 ? 'text-green-600 dark:text-green-400' : 'text-slate-400 dark:text-slate-500'">
            <div class="w-8 h-8 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 shadow-sm"
              :class="step >= i+1 ? 'bg-indigo-600 text-white shadow-indigo-200 dark:shadow-indigo-900' : 'bg-white/60 dark:bg-slate-700 text-slate-400 dark:text-slate-500 border border-slate-300 dark:border-slate-600'">
              <span v-if="step > i+1" class="text-sm">✓</span>
              <span v-else>{{ i+1 }}</span>
            </div>
            <span class="text-xs font-semibold hidden sm:inline whitespace-nowrap">{{ s }}</span>
          </div>
          <span v-if="stepDesc[i]" class="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block mt-0.5 whitespace-nowrap">{{ stepDesc[i] }}</span>
        </div>
        <div v-if="i < steps.length-1" class="flex items-center mx-0.5 sm:mx-1 mt-[-2px] sm:mt-[-8px]">
          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-300 dark:text-slate-600" :class="{'text-indigo-400 dark:text-indigo-500': step > i+1}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
        </div>
      </template>
    </div>

    <div v-if="step === 1 && groups.length === 0" class="mb-4 p-5 rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-pink-950/30 border border-indigo-200 dark:border-indigo-800/50 shadow-sm">
      <div class="flex items-start gap-4">
        <span class="text-3xl shrink-0">👋</span>
        <div class="text-sm text-indigo-800 dark:text-indigo-200 space-y-2">
          <p class="font-semibold text-base">{{ t('welcome.title') }}</p>
          <p>{{ t('welcome.desc') }}</p>
          <div class="mt-3 space-y-1.5">
            <p class="flex items-center gap-2 text-indigo-700 font-medium">{{ t('welcome.step1') }}</p>
            <p class="flex items-center gap-2 text-indigo-700 font-medium">{{ t('welcome.step2') }}</p>
            <p class="flex items-center gap-2 text-indigo-700 font-medium">{{ t('welcome.step3') }}</p>
            <p class="flex items-center gap-2 text-indigo-700 font-medium">{{ t('welcome.step4') }}</p>
            <p class="flex items-center gap-2 text-indigo-700 font-medium">{{ t('welcome.step5') }}</p>
          </div>
          <p class="mt-3 text-indigo-600 font-semibold">{{ t('welcome.cta') }}</p>
          <div class="flex flex-wrap gap-2 mt-3">
            <a href="manual.html" target="_blank" class="flex items-center gap-1.5 text-xs font-medium bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-xl px-3 py-2.5 min-h-[44px] hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              <svg class="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"/></svg>
              {{ t('app.manual') }}
            </a>
            <a href="ayuda.html" target="_blank" class="flex items-center gap-1.5 text-xs font-medium bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-xl px-3 py-2.5 min-h-[44px] hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              <svg class="w-4 h-4 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"/></svg>
              {{ t('app.help') }}
            </a>
            <button @click="loadTestData" class="flex items-center gap-1.5 text-xs font-medium bg-white dark:bg-slate-800 border dark:border-slate-600 rounded-xl px-3 py-2.5 min-h-[44px] hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              <svg class="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
              {{ t('app.testData') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade" mode="out-in">
      <GroupManager v-if="step === 1"
        :groups="groups" :selected-id="selectedGroupId" :lang="lang"
        @select="selectedGroupId = $event"
        @refresh="loadGroupsData"
        @start-survey="startSurvey"
        @confirm="handleGroupDelete"
        @prompt="showPrompt" />
    </Transition>

    <Transition name="fade" mode="out-in">
      <Questionnaire v-if="step === 2 && selectedGroup"
        :group="selectedGroup" :questions="questions" :max-choices="maxChoices"
        :responses="responses" :lang="lang"
        :preset-list="presetList" :current-preset="currentPreset"
        @done="step = 3"
        @toggle-question="toggleQuestion"
        @apply-preset="applyPreset"
        @update:max-choices="maxChoices = $event" />
    </Transition>

    <Transition name="fade" mode="out-in">
      <ResultsView v-if="step === 3 && selectedGroup"
        :group="selectedGroup" :questions="questions" :lang="lang"
        :responses="responses"
        :trigger-teams="triggerTeamsModal"
        :trigger-dist="triggerDistModal"
        @back="step = 2" />
    </Transition>

    <div class="mt-8 space-y-4">
      <div class="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm border-l-4 border-l-indigo-400 dark:border-l-indigo-500 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        <p class="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 mb-1">💡 <span>{{ t('info.sociogram') }}</span></p>
        <p class="pl-7">{{ t('info.metrics') }}</p>
      </div>

      <div class="p-4 rounded-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-sm border-l-4 border-l-amber-400 dark:border-l-amber-500 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
        <p class="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 mb-1">🐛 <span>{{ t('feedback.title') }}</span></p>
        <p class="pl-7">{{ t('feedback.desc') }} <a href="https://mejoratudocencia.es" target="_blank" class="underline font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700">mejoratudocencia.es</a> {{ t('feedback.or') }} <a href="https://t.me/mejoratudocencia" target="_blank" class="underline font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700">t.me/mejoratudocencia</a>.</p>
      </div>

      <button @click="showPrivacy = !showPrivacy" class="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 text-xs font-medium text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-slate-200 transition shadow-sm">
        <span>🔒</span> {{ t('privacy.law') }}
        <span class="text-slate-300 dark:text-slate-600 text-[10px] transition-transform duration-200" :class="showPrivacy ? 'rotate-180' : ''">▼</span>
      </button>
      <div v-if="showPrivacy" class="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-xs text-slate-600 dark:text-slate-400 space-y-3 leading-relaxed animate-slideUp">
        <p class="font-semibold text-slate-700 dark:text-slate-200 text-sm">{{ t('privacy.title') }}</p>
        <p>{{ t('privacy.desc') }}</p>
        <p class="text-slate-500 dark:text-slate-500">{{ t('privacy.lopdgdd') }}</p>
        <div class="flex flex-wrap gap-3 pt-1">
          <span class="inline-flex items-center gap-1 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/30 px-2.5 py-1 rounded-full text-[10px] font-semibold">{{ t('privacy.local') }}</span>
          <span class="inline-flex items-center gap-1 text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-full text-[10px] font-semibold">{{ t('privacy.anonymous') }}</span>
          <span class="inline-flex items-center gap-1 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full text-[10px] font-semibold">{{ t('privacy.export') }}</span>
        </div>
      </div>
    </div>
  </div>

  <OnboardingOverlay :show="showOnboarding" :step="onboardingStep" :steps="onboardingSteps"
    @close="onboardClose" @next="onboardNext" @prev="onboardPrev" @go-to-step="onboardGoTo" />

  <ConfirmModal :show="confirmDialog.show" :message="confirmDialog.message"
    @confirm="okConfirm" @cancel="cancelConfirm" />

  <PromptModal :show="promptDialog.show" :message="promptDialog.message"
    @ok="okPrompt" @cancel="cancelPrompt" />

  <div class="fixed bottom-0 left-0 right-0 sm:bottom-5 sm:left-auto sm:right-5 z-50 flex justify-center sm:block pointer-events-none">
    <div class="pointer-events-auto">
      <ToastPopup :show="toast.show" :message="toast.message" :type="toast.type"
        @dismiss="toast.show = false" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { t } from '@/utils/locales'
import { loadGroups, saveGroups, loadResponses, exportAllData, importFromFile } from '@/utils/storage'
import { generateTestData } from '@/utils/templates'
import GroupManager from '@/components/GroupManager.vue'
import Questionnaire from '@/components/Questionnaire.vue'
import ResultsView from '@/components/ResultsView.vue'
import ConfirmModal from '@/components/ConfirmModal.vue'
import PromptModal from '@/components/PromptModal.vue'
import ToastPopup from '@/components/ToastPopup.vue'
import OnboardingOverlay from '@/components/OnboardingOverlay.vue'
import type { Group } from '@/constants'

const QUESTION_BANK = [
  { key: 'q.0', typeKey: 'qt.choice', maxChoices: 3 },
  { key: 'q.1', typeKey: 'qt.rejection', maxChoices: 3 },
  { key: 'q.2', typeKey: 'qt.perception', maxChoices: 1 },
  { key: 'q.3', typeKey: 'qt.affinity', maxChoices: 3 },
  { key: 'q.4', typeKey: 'qt.trust', maxChoices: 2 },
  { key: 'q.5', typeKey: 'qt.affinity', maxChoices: 3 },
  { key: 'q.6', typeKey: 'qt.affinity', maxChoices: 3 },
  { key: 'q.7', typeKey: 'qt.perception', maxChoices: 2 },
  { key: 'q.8', typeKey: 'qt.trust', maxChoices: 2 },
  { key: 'q.9', typeKey: 'qt.perception', maxChoices: 2 },
  { key: 'q.10', typeKey: 'qt.trust', maxChoices: 2 },
  { key: 'q.11', typeKey: 'qt.affinity', maxChoices: 3 },
  { key: 'q.12', typeKey: 'qt.academic', maxChoices: 1 },
  { key: 'q.13', typeKey: 'qt.representation', maxChoices: 1 },
  { key: 'q.14', typeKey: 'qt.rejection', maxChoices: 3 },
]

const QUESTION_PRESETS: Record<string, { nameKey: string; active: number[] }> = {
  general:     { nameKey: 'preset.general', active: [0, 1, 2] },
  primary:     { nameKey: 'preset.primary', active: [0, 1, 3, 6, 8, 11] },
  secondary:   { nameKey: 'preset.secondary', active: [0, 1, 2, 4, 7, 12] },
  highschool:  { nameKey: 'preset.highschool', active: [0, 1, 4, 7, 10, 13] },
  coexistence: { nameKey: 'preset.coexistence', active: [1, 3, 5, 9, 11, 14] },
  inclusion:   { nameKey: 'preset.inclusion', active: [0, 3, 4, 6, 8, 11] },
}

const step = ref(1)
const groups = ref<Group[]>([])
const selectedGroupId = ref<string | null>(null)
const lang = ref(localStorage.getItem('sociograma-lang') || 'es')
const showOnboarding = ref(false)
const onboardingStep = ref(0)
const showMobileMenu = ref(false)
const triggerTeamsModal = ref(0)
const triggerDistModal = ref(0)
const loading = ref(true)
const maxChoices = ref(3)
const responses = ref<Record<string, Record<string, string[]>>>({})
const isDark = ref(document.documentElement.classList.contains('dark'))
const showPrivacy = ref(false)
const toast = ref({ show: false, message: '', type: 'success' })
const confirmDialog = ref<{ show: boolean; message: string; onOk: (() => void | Promise<void>) | null }>({ show: false, message: '', onOk: null })
const promptDialog = ref<{ show: boolean; message: string; onOk: ((val: string) => void) | null }>({ show: false, message: '', onOk: null })
const questionActive = ref<number[]>([])
const currentPreset = ref('general')
const questions = ref<{ text: string; type: string; maxChoices: number; active: boolean }[]>([])

const selectedGroup = computed(() => groups.value.find(g => g.id === selectedGroupId.value) || null)

const presetList = computed(() => {
  return Object.keys(QUESTION_PRESETS).map(n => ({ id: n, name: t(QUESTION_PRESETS[n].nameKey, lang.value) }))
})

const onboardingSteps = computed(() => Array(6))

const steps = computed(() => [
  t('step.groups', lang.value),
  t('step.questionnaire', lang.value),
  t('step.results', lang.value),
  t('step.teams', lang.value),
  t('step.dist', lang.value),
])

const stepDesc = computed(() => [
  t('step.groupsDesc', lang.value),
  t('step.questionnaireDesc', lang.value),
  t('step.resultsDesc', lang.value),
  t('step.teamsDesc', lang.value),
  t('step.distDesc', lang.value),
])

function setLang(l: string) {
  lang.value = l
  localStorage.setItem('sociograma-lang', l)
  buildQuestions()
  document.title = t('app.title', lang.value)
}

function onboardNext() { if (onboardingStep.value < 5) onboardingStep.value++ }
function onboardPrev() { if (onboardingStep.value > 0) onboardingStep.value-- }
function onboardGoTo(s: number) { onboardingStep.value = s }
function onboardClose() {
  showOnboarding.value = false
  localStorage.setItem('sociograma-onboarding', '1')
}

function toggleDark() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('sociograma-dark', String(isDark.value))
}

function buildQuestions() {
  questions.value = QUESTION_BANK.map((qb, i) => ({
    text: t(qb.key, lang.value),
    type: t(qb.typeKey, lang.value),
    maxChoices: qb.maxChoices,
    active: questionActive.value.includes(i),
  }))
}

watch(questionActive, () => buildQuestions(), { deep: true })

function handleGroupDelete(groupId: string) {
  const g = groups.value.find(g => g.id === groupId)
  if (!g) return
  const msg = t('group.confirmDelete', lang.value).replace('{name}', g.name)
  showConfirm(msg, () => deleteGroup(groupId))
}

async function deleteGroup(id: string) {
  groups.value = groups.value.filter(g => g.id !== id)
  if (selectedGroupId.value === id) selectedGroupId.value = null
  await saveGroups(groups.value)
}

function showConfirm(msg: string, onOk: () => void) {
  confirmDialog.value = { show: true, message: msg, onOk }
}

function showPrompt(msg: string, onOk: (val: string) => void) {
  promptDialog.value = { show: true, message: msg, onOk }
}

function cancelConfirm() { confirmDialog.value.show = false; confirmDialog.value.onOk = null }
function cancelPrompt() { promptDialog.value.show = false; promptDialog.value.onOk = null }
function okConfirm() {
  const cb = confirmDialog.value.onOk
  confirmDialog.value.show = false
  confirmDialog.value.onOk = null
  if (cb) cb()
}
function okPrompt(val: string) {
  const cb = promptDialog.value.onOk
  promptDialog.value.show = false
  promptDialog.value.onOk = null
  if (cb) cb(val)
}

function toggleQuestion(qi: number) {
  const idx = questionActive.value.indexOf(qi)
  if (idx >= 0) questionActive.value.splice(idx, 1)
  else questionActive.value.push(qi)
}

function applyPreset(name: string) {
  const preset = QUESTION_PRESETS[name]
  if (!preset) return
  currentPreset.value = name
  questionActive.value = [...preset.active]
}

async function initApp() {
  lang.value = localStorage.getItem('sociograma-lang') || 'es'
  ;(window as unknown as Record<string, unknown>).__lang = lang.value
  groups.value = await loadGroups()
  if (!localStorage.getItem('sociograma-onboarding')) {
    showOnboarding.value = true
    onboardingStep.value = 0
  }
  applyPreset('general')
  buildQuestions()
  document.title = t('app.title', lang.value)
  loading.value = false
}

async function goStep(s: number) {
  if (s === 3 && selectedGroup.value) {
    const loaded = await loadResponses(selectedGroupId.value!)
    if (loaded && Object.keys(loaded).length) responses.value = loaded
  }
  showMobileMenu.value = false
  if (s === 4) {
    step.value = 3
    triggerTeamsModal.value = Date.now()
  } else if (s === 5) {
    step.value = 3
    triggerDistModal.value = Date.now()
  } else {
    step.value = s
  }
}

async function startSurvey() {
  showMobileMenu.value = false
  responses.value = await loadResponses(selectedGroupId.value!)
  step.value = 2
}

async function loadGroupsData() {
  groups.value = await loadGroups()
}

async function loadTestData() {
  showConfirm(t('confirm.testData', lang.value), async () => {
    await generateTestData()
    await loadGroupsData()
    showToast('toast.testData', 'success')
  })
}

async function exportAll() {
  await exportAllData()
  showToast('toast.exported', 'success')
}

async function importJSON(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  try {
    await importFromFile(file)
    await loadGroupsData()
    showToast('toast.imported', 'success')
  } catch { showToast('toast.error', 'error') }
  input.value = ''
}

function showToast(key: string, type = 'success') {
  toast.value = { show: true, message: t(key, lang.value), type }
  setTimeout(() => { toast.value.show = false }, 3500)
}

onMounted(() => { initApp() })
</script>
