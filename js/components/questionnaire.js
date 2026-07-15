(function() {
  if (!window.components) window.components = {};
  window.components['questionnaire'] = {
    props: ['group', 'questions', 'maxChoices', 'responses', 'lang', 'presetList', 'currentPreset'],
    emits: ['done', 'toggle-question', 'apply-preset', 'update:maxChoices'],
    template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-5">
          <h2 class="text-lg font-semibold text-slate-700 dark:text-slate-100 mb-4">{{ t('survey.title') }}</h2>

          <div class="mb-4">
            <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">{{ t('preset.custom') }}</label>
            <select @change="$emit('apply-preset', $event.target.value)" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300">
              <option v-for="p in presetList" :key="p.id" :value="p.id" :selected="p.id===currentPreset">{{ p.name }}</option>
            </select>
          </div>

          <div class="space-y-2">
            <label v-for="(q, qi) in questions" :key="qi" class="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition"
              :class="q.active ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50'">
              <input type="checkbox" :checked="q.active" @change="$emit('toggle-question', qi)" class="mt-0.5 rounded text-indigo-600 focus:ring-indigo-400">
              <div><p class="text-sm font-medium text-slate-700 dark:text-slate-200">{{ q.text }}</p><p class="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{{ q.type }} &middot; {{ t('survey.chooseLabel') }} {{ q.maxChoices }}</p></div>
            </label>
          </div>
          <div class="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600">
            <label class="text-xs text-slate-500 dark:text-slate-400 block mb-1">{{ t('survey.choicesPerQ') }}</label>
            <input type="range" :value="maxChoices" @input="$emit('update:maxChoices', +$event.target.value)" min="1" max="5" class="w-full accent-indigo-600">
            <div class="flex justify-between text-xs text-slate-400 dark:text-slate-500"><span>1</span><span>{{ maxChoices }}</span><span>5</span></div>
          </div>
          <div class="mt-4 text-sm"><span class="text-slate-500 dark:text-slate-400">{{ t('survey.progress') }}</span> <span class="font-medium text-indigo-600 dark:text-indigo-400">{{ answeredCount }}/{{ group.students.length }}</span></div>

          <div class="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/40 text-xs text-amber-700 dark:text-amber-300 space-y-1">
            <p><strong>{{ t('info.survey') }}</strong></p>
            <p>{{ t('info.surveyTip') }}</p>
          </div>

          <div class="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 text-xs text-slate-600 dark:text-slate-400">
            <p class="font-medium text-slate-700 dark:text-slate-300 mb-1">{{ t('info.surveyPrep') }}</p>
            <ul class="space-y-0.5 list-disc list-inside">
              <li>{{ t('info.surveyPrep1') }}</li>
              <li>{{ t('info.surveyPrep2') }}</li>
              <li>{{ t('info.surveyPrep3') }}</li>
            </ul>
          </div>

          <button @click="$emit('done')" class="mt-4 w-full py-2.5 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 text-sm font-medium hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition">
            {{ t('info.skipSurvey') }}
          </button>
        </div>
      </div>

      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-slate-700 dark:text-slate-100">{{ t('survey.section') }}</h2>
            <div class="w-32 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" :style="'width:'+pct+'%'"></div>
            </div>
          </div>

          <div v-if="!current" class="text-center py-8">
            <p class="text-4xl mb-3">📋</p>
            <p class="text-slate-500 dark:text-slate-400 mb-4 text-sm">{{ t('survey.pickStudent') }}</p>
            <div class="flex flex-wrap justify-center gap-2">
              <button v-for="s in group.students" :key="s.id" @click="startStudent(s)"
                class="px-4 py-2 rounded-xl border text-sm font-medium transition-all"
                :class="isDone(s.id) ? 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 line-through' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'">
                {{ s.name }} <span v-if="isDone(s.id)">&#10003;</span>
              </button>
            </div>
          </div>

          <div v-if="current" key="answering">
            <div class="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-50 dark:from-indigo-900/30 to-purple-50 dark:to-purple-900/30 border border-indigo-100 dark:border-indigo-800/40">
              <p class="text-sm text-slate-500 dark:text-slate-400">{{ t('survey.responding') }}</p>
              <p class="text-lg font-semibold text-slate-800 dark:text-slate-100">{{ current.name }}</p>
            </div>

            <div v-for="(q, qi) in activeQs" :key="qi" class="mb-6 p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70">
              <p class="text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">{{ q.text }}</p>
              <p class="text-xs text-slate-400 dark:text-slate-500 mb-2">{{ t('survey.chooseUpTo').replace('{n}', q.maxChoices) }}</p>
              <div class="flex flex-wrap gap-2 min-h-[44px] p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-dashed border-slate-300 dark:border-slate-600">
                <div v-for="s in group.students" :key="s.id" v-if="s.id !== current.id"
                  @click="toggle(s.id, qi)" draggable="true"
                  @dragstart="dragChoice($event, s.id, qi)"
                  class="px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all select-none"
                  :class="isChosen(s.id, qi) ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-200 dark:hover:border-indigo-600'">
                  {{ s.name }}
                </div>
              </div>
              <div v-if="getChosen(qi).length" class="flex flex-wrap gap-1.5 mt-2">
                <span v-for="cid in getChosen(qi)" :key="cid" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                  {{ studentName(cid) }} <button @click="unchoose(cid, qi)" class="hover:text-red-500">&times;</button>
                </span>
              </div>
            </div>

            <div class="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-700">
              <button @click="current = null" class="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">{{ t('survey.changeStudent') }}</button>
              <div class="flex gap-2">
                <button v-if="doneList.length > 0" @click="$emit('done')" class="px-4 py-2 text-sm bg-white dark:bg-slate-700 border border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition">{{ t('survey.viewResults').replace('{n}', doneList.length) }}</button>
                <button @click="saveAnswers" class="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-lg">{{ t('survey.save') }}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`,
    data() {
      return { current: null, answers: {}, doneList: [], dirty: false }
    },
    computed: {
      answeredCount() { return this.doneList.length },
      pct() { return this.group?.students.length ? Math.round(this.doneList.length / this.group.students.length * 100) : 0 },
      activeQs() { return this.questions.filter(q => q.active).map(q => ({ ...q, maxChoices: this.maxChoices })) },
    },
    methods: {
      t(key) { return t(key, this.lang) },
      isDone(id) { return this.doneList.includes(id) },
      startStudent(s) { this.current = s; this.answers = JSON.parse(JSON.stringify(this.responses[s.id] || {})); for (let i = 0; i < this.activeQs.length; i++) if (!this.answers[i]) this.answers[i] = []; this.dirty = false },
      studentName(id) { return this.group?.students.find(s => s.id === id)?.name || '?' },
      getChosen(qi) { return this.answers[qi] || [] },
      isChosen(sid, qi) { return (this.answers[qi] || []).includes(sid) },
      toggle(sid, qi) { const arr = this.answers[qi] = this.answers[qi] || []; const max = this.activeQs[qi]?.maxChoices || 3; const i = arr.indexOf(sid); if (i >= 0) arr.splice(i, 1); else if (arr.length < max) arr.push(sid); this.dirty = true; this.autoSave() },
      unchoose(sid, qi) { const arr = this.answers[qi]; if (arr) { const i = arr.indexOf(sid); if (i >= 0) arr.splice(i, 1); this.dirty = true; this.autoSave() } },
      dragChoice(e, sid, qi) { e.dataTransfer.setData('text', sid) },
      async autoSave() {
        if (!this.current || !this.dirty) return
        this.responses[this.current.id] = JSON.parse(JSON.stringify(this.answers))
        await saveResponses(this.group.id, this.responses)
        if (!this.doneList.includes(this.current.id)) this.doneList.push(this.current.id)
        this.dirty = false
      },
      async saveAnswers() {
        if (!this.current) return
        await this.autoSave()
        this.current = null; this.answers = {}
        if (this.doneList.length === this.group.students.length) this.$emit('done')
      },
      onBeforeUnload(e) { if (this.dirty) { e.preventDefault(); e.returnValue = '' } },
    },
    mounted() { this.doneList = Object.keys(this.responses); window.addEventListener('beforeunload', this.onBeforeUnload) },
    unmounted() { window.removeEventListener('beforeunload', this.onBeforeUnload) },
  };
})();
