const { createApp, ref, reactive, computed, watch, nextTick, onMounted, onUnmounted, toRaw } = Vue

const GroupManager = {
  props: ['groups', 'selectedId', 'lang'],
  emits: ['select', 'refresh', 'start-survey', 'confirm', 'prompt'],
  template: `
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-1">
      <div class="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white/50 p-5">
        <h2 class="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span class="w-6 h-6 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">1</span>
          {{ t('group.title') }}
        </h2>

        <div class="flex gap-2 mb-3">
          <input v-model="newGroupName" @keydown.enter="createGroup" :placeholder="t('group.placeholder')" class="flex-1 px-3 py-2 rounded-xl border border-slate-200 bg-white/70 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <button @click="createGroup" class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-md">+</button>
        </div>

        <div class="mb-4">
          <button @click="showTemplateModal = true" class="w-full py-2 px-3 rounded-xl border border-dashed border-indigo-300 text-indigo-600 text-sm hover:bg-indigo-50 transition flex items-center justify-center gap-1">
            {{ t('group.fromTemplate') }}
          </button>
        </div>

        <div class="space-y-2 max-h-80 overflow-y-auto">
          <div v-for="g in groups" :key="g.id" @click="$emit('select', g.id)"
            class="group cursor-pointer p-3 rounded-xl border transition-all duration-200 flex items-center justify-between"
            :class="selectedId === g.id ? 'border-indigo-300 bg-indigo-50 shadow-md ring-1 ring-indigo-200' : 'border-slate-200 bg-white/50 hover:border-indigo-300 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" :style="'background:'+stringToColor(g.name)">{{ g.name.charAt(0).toUpperCase() }}</div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-slate-700 truncate">{{ g.name }}</p>
                <p class="text-xs text-slate-400">{{ g.students.length }} {{ t('group.students') }}</p>
              </div>
            </div>
            <div class="flex items-center gap-1">
              <button @click.stop="confirmDelete(g)" class="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition p-1 shrink-0">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
              <svg class="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </div>
          </div>
          <div v-if="!groups.length" class="text-center py-8 text-slate-400 text-sm">
            <p class="mb-1">{{ t('group.empty.title') }}</p>
            <p>{{ t('group.empty.desc') }}</p>
          </div>
        </div>

        <div v-if="group && group.students.length >= 2" class="mt-4 pt-3 border-t border-slate-200">
          <button @click="$emit('start-survey')" class="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-lg flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
            {{ t('group.startSurvey') }}
          </button>
        </div>
      </div>
    </div>

    <div class="lg:col-span-2">
      <div class="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white/50 p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-700 flex items-center gap-2">
            <span class="w-6 h-6 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">2</span>
            {{ group ? group.name : t('group.select') }}
          </h2>
          <div class="flex gap-2" v-if="group">
            <button @click="bulkAdd" class="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition">{{ t('group.bulkAdd') }}</button>
            <button @click="addOne" class="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md">{{ t('group.addOne') }}</button>
            <label class="text-xs px-3 py-1.5 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 cursor-pointer transition">{{ t('group.importCSV') }}
              <input type="file" accept=".csv" @change="importCSV" class="hidden">
            </label>
          </div>
        </div>

        <div v-if="!group" class="text-center py-12 text-slate-400"><p class="text-4xl mb-3">👈</p><p class="text-sm">{{ t('group.selectHint') }}</p></div>

        <div v-if="group" key="student-list">
          <div class="space-y-2 max-h-96 overflow-y-auto pr-1">
            <div v-for="(s, idx) in group.students" :key="s.id" draggable="true"
              @dragstart="onDragStart($event, idx)" @dragover.prevent="onDragOver($event, idx)"
              @drop="onDrop($event, idx)" @dragend="onDragEnd"
              class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white/70 hover:border-indigo-200 hover:shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing"
              :class="{'opacity-50 border-indigo-300 bg-indigo-50': dragIdx === idx}">
              <div class="text-slate-300 hover:text-slate-500"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/></svg></div>
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" :style="'background:'+stringToColor(s.name)">{{ s.name.charAt(0).toUpperCase() }}</div>
              <input :value="s.name" @change="rename(s.id, $event.target.value)" class="flex-1 text-sm font-medium text-slate-700 bg-transparent border-b border-transparent focus:border-indigo-300 focus:outline-none">
              <span class="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">#{{ idx+1 }}</span>
              <button @click="removeStudent(s.id)" class="text-red-300 hover:text-red-500 transition p-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
          </div>
          <div v-if="!group.students.length" class="text-center py-8 text-slate-400 text-sm"><p class="mb-1">{{ t('group.studentEmpty') }}</p><p>{{ t('group.reorder') }}</p></div>

          <div v-if="group.students.length >= 2" class="mt-6 pt-4 border-t border-slate-200">
            <button @click="$emit('start-survey')" class="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-lg flex items-center justify-center gap-2">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
              {{ t('group.startSurvey') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showTemplateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" @click.self="showTemplateModal = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col" @click.stop>
        <div class="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-slate-700">{{ t('group.templateTitle') }}</h3>
          <button @click="showTemplateModal = false" class="text-slate-400 hover:text-slate-600 text-xl">✕</button>
        </div>
        <div class="p-5 overflow-y-auto space-y-3">
          <div v-for="t in templates" :key="t.name" @click="createFromTemplate(t)"
            class="p-4 rounded-xl border border-slate-200 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition flex items-center justify-between">
            <div>
              <p class="font-medium text-slate-700">{{ t.name }}</p>
              <p class="text-xs text-slate-400">{{ t.description || t.students.length+' '+t('group.students') }}</p>
            </div>
            <span class="text-xs bg-slate-100 px-2 py-1 rounded-full text-slate-500">{{ t.students.length }} {{ t('group.students') }}</span>
          </div>
        </div>
        <div class="p-4 border-t border-slate-200 text-xs text-slate-400">
          {{ t('group.templateFooter') }} <code class="bg-slate-100 px-1 rounded">js/templates.js</code>
        </div>
      </div>
    </div>

    <div v-if="showBulk" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" @click.self="showBulk = false">
      <div class="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4" @click.stop>
        <h3 class="text-lg font-semibold text-slate-700 mb-1">{{ t('group.bulkTitle') }}</h3>
        <p class="text-xs text-slate-400 mb-3">{{ t('group.bulkHint') }}</p>
        <textarea v-model="bulkText" class="w-full h-32 px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"></textarea>
        <div class="flex justify-end gap-2 mt-3">
          <button @click="showBulk = false" class="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition">{{ t('group.cancel') }}</button>
          <button @click="saveBulk" class="px-4 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md">{{ t('group.add') }}</button>
        </div>
      </div>
    </div>
  </div>`,

  data() {
    return {
      newGroupName: '',
      showTemplateModal: false,
      templates: [],
      showBulk: false,
      bulkText: '',
      dragIdx: null,
    }
  },
  computed: {
    group() { return this.groups.find(g => g.id === this.selectedId) || null },
  },
  async mounted() { this.templates = await loadTemplates() },
  methods: {
    t(key) { return t(key, this.lang) },
    async createGroup() {
      const name = this.newGroupName.trim()
      if (!name) return
      const g = { id: generateId(), name, students: [], createdAt: new Date().toISOString() }
      this.groups.push(g)
      this.newGroupName = ''
      await saveGroups(this.groups)
      this.$emit('select', g.id)
    },
    async createFromTemplate(tmpl) {
      const g = {
        id: generateId(),
        name: tmpl.name.replace(/^[^\s]+\s/, ''),
        students: tmpl.students.map(s => ({ id: generateId(), name: s })),
        createdAt: new Date().toISOString(),
      }
      this.groups.push(g)
      this.showTemplateModal = false
      await saveGroups(this.groups)
      this.$emit('select', g.id)
      this.$emit('refresh')
    },
    confirmDelete(g) { this.$emit('confirm', g.id) },
    async importCSV(e) {
      const file = e.target.files[0]; if (!file || !this.group) return
      const text = await file.text()
      const lines = text.split('\n').filter(l => l.trim() && !l.startsWith('Nombre') && !l.startsWith('Name'))
      const names = lines.map(l => l.split(',')[0].trim()).filter(Boolean)
      for (const name of names) this.group.students.push({ id: generateId(), name })
      await saveGroups(this.groups)
      e.target.value = ''
    },
    async addOne() {
      this.$emit('prompt', t('group.promptName', this.lang), (name) => {
        if (name && this.group) {
          this.group.students.push({ id: generateId(), name: name.trim() })
          saveGroups(this.groups)
        }
      })
    },
    bulkAdd() { this.bulkText = ''; this.showBulk = true },
    async saveBulk() {
      const names = this.bulkText.split('\n').map(s => s.trim()).filter(Boolean)
      for (const name of names) this.group.students.push({ id: generateId(), name })
      this.showBulk = false
      await saveGroups(this.groups)
    },
    async removeStudent(id) { if (!this.group) return; this.group.students.splice(this.group.students.findIndex(s => s.id === id), 1); await saveGroups(this.groups) },
    async rename(id, name) { const s = this.group?.students.find(st => st.id === id); if (s) { s.name = name; await saveGroups(this.groups) } },
    onDragStart(e, idx) { this.dragIdx = idx; e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text', idx) },
    onDragOver(e, idx) { if (this.dragIdx !== null && this.dragIdx !== idx) e.target.closest('[draggable]')?.classList.add('border-indigo-400') },
    async onDrop(e, idx) {
      document.querySelectorAll('[draggable]').forEach(el => el.classList.remove('border-indigo-400'))
      if (this.dragIdx === null || this.dragIdx === idx) return
      const arr = this.group.students
      const [m] = arr.splice(this.dragIdx, 1); arr.splice(idx, 0, m)
      this.dragIdx = null; await saveGroups(this.groups)
    },
    onDragEnd() { this.dragIdx = null; document.querySelectorAll('[draggable]').forEach(el => el.classList.remove('border-indigo-400')) },
    stringToColor,
  }
}

const Questionnaire = {
  props: ['group', 'questions', 'maxChoices', 'responses', 'lang', 'presetList', 'currentPreset'],
  emits: ['done', 'toggle-question', 'apply-preset'],
  template: `
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-1">
      <div class="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white/50 p-5">
        <h2 class="text-lg font-semibold text-slate-700 mb-4">{{ t('survey.title') }}</h2>

        <div class="mb-4">
          <label class="block text-xs text-slate-500 mb-1">{{ t('preset.custom') }}</label>
          <select @change="$emit('apply-preset', $event.target.value)" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
            <option v-for="p in presetList" :key="p.id" :value="p.id" :selected="p.id===currentPreset">{{ p.name }}</option>
          </select>
        </div>

        <div class="space-y-2">
          <label v-for="(q, qi) in questions" :key="qi" class="flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition"
            :class="q.active ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-white/50'">
            <input type="checkbox" :checked="q.active" @change="$emit('toggle-question', qi)" class="mt-0.5 rounded text-indigo-600 focus:ring-indigo-400">
            <div><p class="text-sm font-medium text-slate-700">{{ q.text }}</p><p class="text-xs text-slate-400 mt-0.5">{{ q.type }} · {{ t('survey.chooseLabel') }} {{ q.maxChoices }}</p></div>
          </label>
        </div>
        <div class="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
          <label class="text-xs text-slate-500 block mb-1">{{ t('survey.choicesPerQ') }}</label>
          <input type="range" :value="maxChoices" @input="$emit('update:maxChoices', +$event.target.value)" min="1" max="5" class="w-full accent-indigo-600">
          <div class="flex justify-between text-xs text-slate-400"><span>1</span><span>{{ maxChoices }}</span><span>5</span></div>
        </div>
        <div class="mt-4 text-sm"><span class="text-slate-500">{{ t('survey.progress') }}</span> <span class="font-medium text-indigo-600">{{ answeredCount }}/{{ group.students.length }}</span></div>

        <div class="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-700 space-y-1">
          <p>💡 <strong>{{ t('info.survey') }}</strong></p>
          <p>{{ t('info.surveyTip') }}</p>
        </div>

        <div class="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
          <p class="font-medium text-slate-700 mb-1">{{ t('info.surveyPrep') }}</p>
          <ul class="space-y-0.5 list-disc list-inside">
            <li>{{ t('info.surveyPrep1') }}</li>
            <li>{{ t('info.surveyPrep2') }}</li>
            <li>{{ t('info.surveyPrep3') }}</li>
          </ul>
        </div>

        <button @click="$emit('done')" class="mt-4 w-full py-2.5 rounded-xl border border-dashed border-indigo-300 text-indigo-600 text-sm font-medium hover:bg-indigo-50 transition">
          {{ t('info.skipSurvey') }}
        </button>
      </div>
    </div>

    <div class="lg:col-span-2">
      <div class="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white/50 p-5">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-slate-700">{{ t('survey.section') }}</h2>
          <div class="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" :style="'width:'+pct+'%'"></div>
          </div>
        </div>

        <div v-if="!current" class="text-center py-8">
          <p class="text-4xl mb-3">📋</p>
          <p class="text-slate-500 mb-4 text-sm">{{ t('survey.pickStudent') }}</p>
          <div class="flex flex-wrap justify-center gap-2">
            <button v-for="s in group.students" :key="s.id" @click="startStudent(s)"
              class="px-4 py-2 rounded-xl border text-sm font-medium transition-all"
              :class="isDone(s.id) ? 'bg-green-100 border-green-300 text-green-700 line-through' : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-indigo-50'">
              {{ s.name }} <span v-if="isDone(s.id)">✓</span>
            </button>
          </div>
        </div>

        <div v-if="current" key="answering">
          <div class="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
            <p class="text-sm text-slate-500">{{ t('survey.responding') }}</p>
            <p class="text-lg font-semibold text-slate-800">{{ current.name }}</p>
          </div>

          <div v-for="(q, qi) in activeQs" :key="qi" class="mb-6 p-4 rounded-xl border border-slate-200 bg-white/70">
            <p class="text-sm font-medium text-slate-700 mb-3">{{ q.text }}</p>
            <p class="text-xs text-slate-400 mb-2">{{ t('survey.chooseUpTo').replace('{n}', q.maxChoices) }}</p>
            <div class="flex flex-wrap gap-2 min-h-[44px] p-3 rounded-lg bg-slate-50 border border-dashed border-slate-300">
              <div v-for="s in group.students" :key="s.id" v-if="s.id !== current.id"
                @click="toggle(s.id, qi)" draggable="true"
                @dragstart="dragChoice($event, s.id, qi)"
                class="px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all select-none"
                :class="isChosen(s.id, qi) ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-200'">
                {{ s.name }}
              </div>
            </div>
            <div v-if="getChosen(qi).length" class="flex flex-wrap gap-1.5 mt-2">
              <span v-for="cid in getChosen(qi)" :key="cid" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700">
                {{ studentName(cid) }} <button @click="unchoose(cid, qi)" class="hover:text-red-500">✕</button>
              </span>
            </div>
          </div>

          <div class="flex justify-between items-center pt-4 border-t border-slate-200">
            <button @click="current = null" class="text-sm text-slate-500 hover:text-slate-700">{{ t('survey.changeStudent') }}</button>
            <div class="flex gap-2">
              <button v-if="doneList.length > 0" @click="$emit('done')" class="px-4 py-2 text-sm bg-white border border-indigo-300 text-indigo-600 rounded-xl hover:bg-indigo-50 transition">{{ t('survey.viewResults').replace('{n}', doneList.length) }}</button>
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
}

const ResultsView = {
  props: ['group', 'responses', 'questions', 'lang'],
  emits: ['back'],
  template: `
  <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
    <div class="lg:col-span-1 space-y-4">
      <div class="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white/50 p-5">
        <h3 class="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><span class="w-5 h-5 rounded bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">i</span>{{ t('results.metrics') }}</h3>
        <div class="space-y-2">
          <div v-for="m in metricList" :key="m.label" class="flex justify-between items-center p-2 rounded-lg bg-slate-50">
            <span class="text-xs text-slate-500">{{ m.label }}</span>
            <span class="text-sm font-bold" :class="m.color" v-html="m.value"></span>
          </div>
        </div>
      </div>

      <div class="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white/50 p-5">
        <h3 class="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2"><span class="w-5 h-5 rounded bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold">!</span>{{ t('results.predictions') }}</h3>
        <div class="space-y-2">
          <div v-for="p in predictions" :key="p.label" class="p-2.5 rounded-xl"
            :class="p.type==='risk'?'bg-red-50 border border-red-100':p.type==='opportunity'?'bg-green-50 border border-green-100':'bg-blue-50 border border-blue-100'">
            <div class="flex items-start gap-2">
              <span class="text-sm shrink-0">{{ p.icon }}</span>
              <div><p class="text-xs font-medium text-slate-700">{{ p.label }}</p><p class="text-xs text-slate-500 mt-0.5">{{ p.desc }}</p></div>
            </div>
          </div>
          <div v-if="!predictions.length" class="text-center py-4 text-slate-400 text-xs"><p>{{ t('results.noData') }}</p></div>
        </div>
      </div>
    </div>

    <div class="lg:col-span-2">
      <div class="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white/50 p-5">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-semibold text-slate-700">{{ t('results.graph') }}</h3>
          <div class="flex gap-1.5">
            <button @click="refreshGraph" class="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition text-slate-600" :title="t('results.refresh')">⟳</button>
            <button @click="exportPNG" class="text-xs px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 transition text-slate-600" :title="t('results.exportImg')">🖼</button>
          </div>
        </div>
        <div id="resultsGraph" class="w-full h-[460px] rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white"></div>
        <div class="flex flex-wrap gap-3 mt-3 text-xs text-slate-500">
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-green-500"></span> {{ t('role.leader') }}</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-indigo-500"></span> {{ t('role.popular') }}</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-amber-500"></span> {{ t('role.bridge') }}</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-red-500"></span> {{ t('role.rejected') }}</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-slate-400"></span> {{ t('role.isolated') }}</span>
          <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-purple-400"></span> {{ t('role.neutral') }}</span>
          <span class="flex items-center gap-1 ml-2">⟶ {{ t('graph.legend.choice') }}</span>
          <span class="flex items-center gap-1">- - - {{ t('graph.legend.rejection') }}</span>
        </div>
      </div>
    </div>

    <div class="lg:col-span-1 space-y-4">
      <div class="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white/50 p-5">
        <h3 class="text-sm font-semibold text-slate-700 mb-2">{{ t('results.students') }}</h3>
        <input v-model="studentFilter" placeholder="🔍 Buscar..." class="w-full mb-2 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white/70">
        <div class="space-y-1 max-h-52 overflow-y-auto">
          <div v-for="s in filteredStudents" :key="s.id" @click="selected = s.id"
            class="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition text-sm"
            :class="selected === s.id ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-slate-50'">
            <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" :style="'background:'+s.color">{{ s.name.charAt(0) }}</div>
            <span class="flex-1 text-slate-700 truncate">{{ s.name }}</span>
            <span class="text-xs font-medium px-1.5 py-0.5 rounded-full shrink-0" :class="roleClass(s.role)">{{ t('role.'+roleKey(s.role)) }}</span>
          </div>
        </div>
      </div>

      <div v-if="selected" class="bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white/50 p-5">
        <h3 class="text-sm font-semibold text-slate-700 mb-2">{{ studentName(selected) }}</h3>
        <div class="text-xs text-slate-600 space-y-1">
          <p>{{ t('results.receivesChoices') }} <strong>{{ received(selected).length }}</strong></p>
          <p>{{ t('results.receivesRejections') }} <strong>{{ rejections(selected).length }}</strong></p>
          <p>{{ t('results.makesChoices') }} <strong>{{ made(selected).length }}</strong></p>
          <p>{{ t('results.role') }} <strong>{{ t('role.'+roleKey(roles[selected])) }}</strong></p>
          <div v-if="received(selected).length"><p class="text-slate-400 mt-2 mb-1">{{ t('results.chosenBy') }}</p><div class="flex flex-wrap gap-1"> <span v-for="cid in received(selected)" :key="cid" class="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs">{{ studentName(cid) }}</span></div></div>
        </div>
      </div>

      <button @click="showEdit = !showEdit" class="w-full py-2.5 rounded-2xl text-sm font-medium transition shadow-lg"
        :class="showEdit ? 'bg-indigo-600 text-white' : 'bg-white/80 backdrop-blur border border-white/50 text-slate-700 hover:bg-white'">
        {{ showEdit ? t('results.closeEditor') : t('results.openEditor') }}
      </button>
      <button @click="showTeams = !showTeams; if(showTeams && !teams.length) generateTeams()" class="w-full py-2.5 rounded-2xl text-sm font-medium transition shadow-lg"
        :class="showTeams ? 'bg-green-600 text-white' : 'bg-white/80 backdrop-blur border border-white/50 text-slate-700 hover:bg-white'">
        {{ showTeams ? t('teams.close') : t('teams.form') }}
      </button>
      <button @click="showDist = !showDist; if(showDist && !distGrid.length) generateDist()" class="w-full py-2.5 rounded-2xl text-sm font-medium transition shadow-lg"
        :class="showDist ? 'bg-indigo-600 text-white' : 'bg-white/80 backdrop-blur border border-white/50 text-slate-700 hover:bg-white'">
        {{ showDist ? t('dist.close') : t('dist.form') }}
      </button>
      <button @click="showMatrix = !showMatrix" class="w-full py-2.5 bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white/50 text-sm font-medium text-slate-700 hover:bg-white transition">{{ showMatrix ? t('results.hideMatrix') : t('results.showMatrix') }}</button>
      <div class="flex gap-2">
        <button @click="exportJSON" class="flex-1 py-2.5 bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white/50 text-sm font-medium text-slate-600 hover:bg-white transition">{{ t('results.exportJSON') }}</button>
        <button @click="exportHTML" class="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl shadow-lg text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition">{{ t('results.exportReport') }}</button>
      </div>
      <div class="flex gap-2">
        <button @click="exportAnonJSON" class="flex-1 py-2 rounded-xl border border-dashed border-amber-300 text-amber-700 text-xs font-medium hover:bg-amber-50 transition">{{ t('results.anonJSON') }}</button>
        <button @click="exportAnonHTML" class="flex-1 py-2 rounded-xl bg-amber-50 border border-amber-300 text-amber-700 text-xs font-medium hover:bg-amber-100 transition">{{ t('results.anonReport') }}</button>
      </div>
      <div class="flex gap-2">
        <button @click="downloadStudentsCSV(group)" class="flex-1 py-2 rounded-xl border border-dashed border-slate-300 text-slate-600 text-xs font-medium hover:bg-slate-50 transition">{{ t('results.csvStudents') }}</button>
        <button @click="downloadMatrixCSV(group, matrix)" class="flex-1 py-2 rounded-xl border border-dashed border-slate-300 text-slate-600 text-xs font-medium hover:bg-slate-50 transition">{{ t('results.csvMatrix') }}</button>
      </div>
    </div>
  </div>

  <div v-if="showEdit" class="mt-6 bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white/50 p-5">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold text-slate-700">{{ t('editor.title') }}</h3>
      <span class="text-xs text-slate-400">{{ t('editor.hint') }}</span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
      <div>
        <label class="block text-xs text-slate-500 mb-1">{{ t('editor.from') }}</label>
        <select v-model="editFrom" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
          <option value="">{{ t('editor.select') }}</option>
          <option v-for="s in group.students" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
      <div>
        <label class="block text-xs text-slate-500 mb-1">{{ t('editor.to') }}</label>
        <select v-model="editTo" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
          <option value="">{{ t('editor.select') }}</option>
          <option v-for="s in group.students" :key="s.id" :value="s.id">{{ s.name }}</option>
        </select>
      </div>
      <div>
        <label class="block text-xs text-slate-500 mb-1">{{ t('editor.type') }}</label>
        <div class="flex gap-2">
          <button @click="addChoice" :disabled="!editFrom || !editTo || editFrom===editTo"
            class="flex-1 py-2 rounded-xl text-sm font-medium transition shadow-sm"
            :class="editFrom && editTo && editFrom!==editTo ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 text-slate-300 cursor-not-allowed'">
            {{ t('editor.choice') }}
          </button>
          <button @click="addRejection" :disabled="!editFrom || !editTo || editFrom===editTo"
            class="flex-1 py-2 rounded-xl text-sm font-medium transition shadow-sm"
            :class="editFrom && editTo && editFrom!==editTo ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-slate-100 text-slate-300 cursor-not-allowed'">
            {{ t('editor.rejection') }}
          </button>
        </div>
      </div>
    </div>

    <div class="mb-4">
      <label class="block text-xs text-slate-500 mb-2">🖱️ {{ t('editor.dragHint') }}</label>
      <div class="flex flex-wrap gap-2">
        <div v-for="s in group.students" :key="s.id"
          draggable="true"
          @dragstart="onDragStart(s.id)"
          @dragover.prevent="onDragOver(s.id)"
          @dragleave="onDragLeave"
          @drop.prevent="onDragDrop(s.id)"
          class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-grab active:cursor-grabbing transition-all select-none border"
          :class="dragFrom === s.id ? 'border-indigo-400 bg-indigo-100 shadow-sm' : dragOver === s.id ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-300 scale-105' : 'border-slate-200 bg-white hover:border-indigo-300'">
          <span class="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" :style="'background:'+s.color">{{ s.name.charAt(0) }}</span>
          {{ s.name }}
        </div>
      </div>
    </div>

    <!-- Drag-drop popup -->
    <div v-if="showRelPopup" class="mb-4 p-3 rounded-xl bg-white border-2 border-indigo-200 shadow-lg flex items-center gap-3">
      <span class="text-xs text-slate-600">{{ t('editor.dragFrom') }} <strong>{{ studentName(dragFrom) }}</strong> → <strong>{{ studentName(dragTo) }}</strong></span>
      <button @click="dragAddChoice" class="px-3 py-1 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm">{{ t('editor.choice') }}</button>
      <button @click="dragAddRejection" class="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-sm">{{ t('editor.rejection') }}</button>
      <button @click="showRelPopup = false" class="px-2 py-1 text-xs text-slate-400 hover:text-slate-600 transition">✕</button>
    </div>

    <div class="overflow-x-auto">
      <table class="text-sm border-collapse mx-auto">
        <thead>
          <tr>
            <th class="p-1 text-left text-slate-400 text-xs font-medium w-20"></th>
            <th v-for="s in group.students" :key="s.id" class="p-1 text-center text-xs font-medium text-slate-500 align-bottom">
              <div class="writing-vertical" :title="s.name">{{ s.name.split(' ')[0] }}</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="s in group.students" :key="s.id">
            <td class="p-1 font-medium text-slate-600 text-xs whitespace-nowrap">{{ s.name.split(' ')[0] }}</td>
            <td v-for="s2 in group.students" :key="s2.id" class="p-0.5 text-center">
              <span v-if="s.id!==s2.id"
                @click="toggleCell(s.id, s2.id)"
                class="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs cursor-pointer transition-all hover:ring-2 hover:ring-indigo-400"
                :class="cellClass(s.id, s2.id) + ' ' + (editHighlight(s.id, s2.id) ? 'ring-2 ring-indigo-500 scale-110' : '')">
                {{ cellSym(s.id, s2.id) }}
              </span>
              <span v-else class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-300 text-xs">·</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="flex gap-4 mt-3 text-xs text-slate-400 justify-center flex-wrap">
      <span>{{ t('editor.legend') }}</span>
      <span class="inline-flex items-center gap-1"><span class="w-4 h-4 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs">↑</span> {{ t('editor.choiceLabel') }}</span>
      <span class="inline-flex items-center gap-1"><span class="w-4 h-4 rounded bg-red-100 text-red-700 flex items-center justify-center text-xs">↓</span> {{ t('editor.rejectionLabel') }}</span>
      <span>→ <span class="text-slate-300">·</span> {{ t('editor.noRelation') }}</span>
    </div>
    <div v-if="Object.keys(responses).length === 0" class="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-700">
      {{ t('editor.manualHint') }}
    </div>
  </div>

  <div v-if="showMatrix && !showEdit" class="mt-6 bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white/50 p-5 overflow-x-auto">
    <h3 class="text-sm font-semibold text-slate-700 mb-3">{{ t('matrix.title') }}</h3>
    <table class="text-sm border-collapse mx-auto">
      <thead><tr><th class="p-1.5 text-left text-slate-400 text-xs font-medium"></th><th v-for="s in group.students" :key="s.id" class="p-1.5 text-center text-xs font-medium text-slate-500 align-bottom"><div class="writing-vertical" :title="s.name">{{ s.name.split(' ')[0] }}</div></th></tr></thead>
      <tbody><tr v-for="s in group.students" :key="s.id"><td class="p-1.5 font-medium text-slate-600 text-xs whitespace-nowrap">{{ s.name.split(' ')[0] }}</td><td v-for="s2 in group.students" :key="s2.id" class="p-1 text-center"><span v-if="s.id!==s2.id" class="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs" :class="cellClass(s.id,s2.id)">{{ cellSym(s.id,s2.id) }}</span><span v-else class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 text-slate-300 text-xs">·</span></td></tr></tbody>
    </table>
    <div class="flex gap-4 mt-3 text-xs text-slate-400 justify-center">{{ t('matrix.legend') }}</div>
  </div>

  <!-- Classroom Distribution -->
  <div v-if="showDist" class="mt-6 bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white/50 p-5" ref="distContainer">
    <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
      <h3 class="text-sm font-semibold text-slate-700">{{ t('dist.title') }}</h3>
      <div class="flex items-center gap-2 flex-wrap">
        <label class="text-xs text-slate-400">{{ t('dist.layout') }}
          <select v-model="distLayout" @change="generateDist" class="ml-1 px-2 py-1 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <option value="grid">{{ t('dist.layoutGrid') }}</option>
            <option value="rows">{{ t('dist.layoutRows') }}</option>
            <option value="ushape">{{ t('dist.layoutU') }}</option>
          </select>
        </label>
        <label class="text-xs text-slate-400">{{ t('dist.groupSize') }}
          <select v-model.number="distSize" @change="generateDist" class="ml-1 px-2 py-1 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <option v-for="n in [1,2,3,4,5,6,7,8]" :key="n" :value="n">{{ n }}</option>
          </select>
        </label>
        <label class="text-xs text-slate-400">{{ t('dist.columns') }}
          <input type="number" v-model.number="distCols" min="2" max="8" @change="generateDist" class="ml-1 w-12 px-2 py-1 rounded-lg border border-slate-200 text-xs text-center focus:outline-none focus:ring-2 focus:ring-indigo-300">
        </label>
        <button @click="generateDist" class="text-xs px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm" :title="t('dist.generate')">⟳</button>
        <button @click="exportDistPNG" class="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition shadow-sm" :title="t('results.exportImg')">🖼</button>
      </div>
    </div>
    <div class="bg-slate-50 rounded-xl border-2 border-slate-200 p-4 overflow-x-auto">
      <!-- Teacher desk (only for grid/rows layouts) -->
      <div v-if="distLayout !== 'ushape'" class="flex justify-center mb-4">
        <div class="px-6 py-2 rounded-lg bg-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider shadow-inner">👩‍🏫 {{ t('dist.teacher') }}</div>
      </div>
      <!-- Student tables grid -->
      <div class="space-y-3 max-w-4xl mx-auto" :class="distLayout === 'ushape' ? 'flex flex-col items-center' : ''">
        <!-- U-shape: top row (back wall) -->
        <div v-if="distLayout === 'ushape' && distGrid.length > 0" class="flex gap-3 justify-center w-full">
          <div v-for="(table, ti) in distGrid[0]" :key="'ut-' + ti"
            class="flex-1 min-w-0 p-3 rounded-xl border-2 text-center"
            :style="'border-color:' + tableColor(0, ti) + ';background:' + tableColor(0, ti, 0.08)">
            <p class="text-[10px] font-semibold mb-1.5 uppercase tracking-wider"
              :style="'color:' + tableColor(0, ti)">M{{ ti + 1 }}</p>
            <div class="space-y-1">
              <div v-for="s in table" :key="s.id" draggable="true"
                @dragstart="distDragStart($event, 0, ti, s.id)"
                @dragover.prevent="distDragOver($event, 0, ti, s.id)"
                @drop.prevent="distDrop(0, ti, s.id)"
                class="px-2 py-1 rounded-lg text-xs font-medium shadow-sm flex items-center gap-1 cursor-grab active:cursor-grabbing"
                :style="'background:' + tableColor(0, ti, 0.15) + ';color:' + tableColor(0, ti, 1)">
                <span>{{ s.name }}</span>
                <span class="ml-auto text-[9px] opacity-60">{{ t('role.'+roleKey(roles[s.id])) }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- U-shape: sides + middle rows -->
        <div v-if="distLayout === 'ushape'" class="flex gap-3 justify-center w-full">
          <div class="flex flex-col gap-3">
            <div v-for="(table, ti) in distGrid[1] || []" :key="'ul-' + ti"
              class="p-3 rounded-xl border-2 text-center"
              :style="'border-color:' + tableColor(1, ti) + ';background:' + tableColor(1, ti, 0.08)">
              <p class="text-[10px] font-semibold mb-1.5 uppercase tracking-wider"
                :style="'color:' + tableColor(1, ti)">M{{ distGrid[0].length + ti + 1 }}</p>
              <div class="space-y-1">
                <div v-for="s in table" :key="s.id" draggable="true"
                  @dragstart="distDragStart($event, 1, ti, s.id)"
                  @dragover.prevent="distDragOver($event, 1, ti, s.id)"
                  @drop.prevent="distDrop(1, ti, s.id)"
                  class="px-2 py-1 rounded-lg text-xs font-medium shadow-sm flex items-center gap-1 cursor-grab active:cursor-grabbing"
                  :style="'background:' + tableColor(1, ti, 0.15) + ';color:' + tableColor(1, ti, 1)">
                  <span>{{ s.name }}</span>
                  <span class="ml-auto text-[9px] opacity-60">{{ t('role.'+roleKey(roles[s.id])) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="flex-1"></div>
          <div class="flex flex-col gap-3">
            <div v-for="(table, ti) in distGrid[2] || []" :key="'ur-' + ti"
              class="p-3 rounded-xl border-2 text-center"
              :style="'border-color:' + tableColor(2, ti) + ';background:' + tableColor(2, ti, 0.08)">
              <p class="text-[10px] font-semibold mb-1.5 uppercase tracking-wider"
                :style="'color:' + tableColor(2, ti)">M{{ distGrid[0].length + (distGrid[1]||[]).length + ti + 1 }}</p>
              <div class="space-y-1">
                <div v-for="s in table" :key="s.id" draggable="true"
                  @dragstart="distDragStart($event, 2, ti, s.id)"
                  @dragover.prevent="distDragOver($event, 2, ti, s.id)"
                  @drop.prevent="distDrop(2, ti, s.id)"
                  class="px-2 py-1 rounded-lg text-xs font-medium shadow-sm flex items-center gap-1 cursor-grab active:cursor-grabbing"
                  :style="'background:' + tableColor(2, ti, 0.15) + ';color:' + tableColor(2, ti, 1)">
                  <span>{{ s.name }}</span>
                  <span class="ml-auto text-[9px] opacity-60">{{ t('role.'+roleKey(roles[s.id])) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Grid / Rows layout -->
        <div v-if="distLayout !== 'ushape'" v-for="(row, ri) in distGrid" :key="ri" class="flex gap-3 justify-center" :class="distLayout === 'rows' ? 'flex-col items-center' : ''">
          <div v-for="(table, ti) in row" :key="ti"
            class="flex-1 min-w-0 p-3 rounded-xl border-2 text-center transition hover:shadow-md"
            :style="'border-color:' + tableColor(ri, ti) + ';background:' + tableColor(ri, ti, 0.08)"
            @dragover.prevent @drop.prevent="distDrop(ri, ti, null)">
            <div class="flex items-center justify-between mb-1.5">
              <p class="text-[10px] font-semibold uppercase tracking-wider"
                :style="'color:' + tableColor(ri, ti)">
                {{ t('dist.table') }} {{ ri * distGrid[0].length + ti + 1 }}
              </p>
              <span class="text-[9px] text-slate-400" v-if="tableCohesion(table) > 0">{{ tableCohesion(table) }}%</span>
            </div>
            <div class="space-y-1">
              <div v-for="s in table" :key="s.id" draggable="true"
                @dragstart="distDragStart($event, ri, ti, s.id)"
                @dragover.prevent="distDragOver($event, ri, ti, s.id)"
                @drop.prevent="distDrop(ri, ti, s.id)"
                class="px-2 py-1 rounded-lg text-xs font-medium shadow-sm flex items-center gap-1 cursor-grab active:cursor-grabbing"
                :class="distDragId === s.id ? 'opacity-50 ring-2 ring-indigo-400' : ''"
                :style="'background:' + tableColor(ri, ti, 0.15) + ';color:' + tableColor(ri, ti, 1)">
                <span>{{ s.name }}</span>
                <span class="ml-auto text-[9px] opacity-60" :class="roleClass(roles[s.id])">{{ t('role.'+roleKey(roles[s.id])) }}</span>
              </div>
            </div>
            <div v-if="table.length < distSize" class="mt-1.5 text-[10px] text-slate-300 italic">
              {{ distSize - table.length }} {{ t('dist.empty') }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3 flex justify-center gap-4 text-[10px] text-slate-400">
      <span>💡 {{ t('dist.dragHint') }}</span>
    </div>
  </div>

  <!-- Teams -->
  <div v-if="showTeams" class="mt-6 bg-white/80 backdrop-blur rounded-2xl shadow-lg border border-white/50 p-5">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold text-slate-700">{{ t('teams.title') }}</h3>
      <div class="flex items-center gap-2">
        <label class="text-xs text-slate-400">{{ t('teams.size') }}</label>
        <input type="number" v-model.number="teamSize" min="1" max="8" class="w-14 px-2 py-1 rounded-lg border border-slate-200 text-xs text-center focus:outline-none focus:ring-2 focus:ring-indigo-300">
        <button @click="generateTeams" class="text-xs px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm">{{ t('teams.generate') }}</button>
      </div>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div v-for="(team, ti) in teams" :key="ti" class="p-3 rounded-xl border border-slate-200 bg-slate-50">
        <p class="text-xs font-semibold text-slate-600 mb-2">{{ t('teams.team') }} {{ ti + 1 }} <span class="text-slate-400 font-normal">({{ team.length }})</span></p>
        <div class="space-y-1">
          <div v-for="s in team" :key="s.id" class="flex items-center gap-2 px-2 py-1 rounded-lg bg-white text-xs"
            :class="'border-l-2 ' + (roles[s.id]==='Líder'?'border-green-400':roles[s.id]==='Popular'?'border-indigo-400':roles[s.id]==='Puente'?'border-amber-400':roles[s.id]==='Rechazado'?'border-red-400':roles[s.id]==='Aislado'?'border-slate-400':'border-purple-400')">
            <span class="shrink-0">{{ s.name }}</span>
            <span class="ml-auto text-[10px] text-slate-400">{{ t('role.'+roleKey(roles[s.id])) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>`,

  data() {
    return {
      selected: null, showMatrix: false, showEdit: false, showTeams: false, showDist: false,
      editFrom: '', editTo: '', dragFrom: null, dragTo: null, dragOver: null,
      showRelPopup: false,
      teamSize: 4, teams: [], teamSeed: 0, distSize: 2, distCols: 4, distGrid: [], distSeed: 0,
      studentFilter: '',
      distLayout: 'grid', distDragId: null, distDragFrom: null,
      result: null, matrix: {}, choicesCount: {}, rejectionsCount: {},
      roles: {}, metrics: {}, predictions: [], sortedStudents: [],
    }
  },
  computed: {
    activeQs() { return this.questions.filter(q => q.active) },
    filteredStudents() {
      if (!this.studentFilter) return this.sortedStudents
      const f = this.studentFilter.toLowerCase()
      return this.sortedStudents.filter(s => s.name.toLowerCase().includes(f))
    },
    metricList() {
      const m = this.metrics
      const t = (key) => this.t(key)
      return [
        { label: t('metric.cohesion'), value: m.cohesion + '%', color: m.cohesion > 50 ? 'text-green-600' : m.cohesion > 25 ? 'text-amber-600' : 'text-red-600' },
        { label: t('metric.density'), value: m.density + '%', color: 'text-slate-700' },
        { label: t('metric.isolation'), value: m.isolationIndex + '%', color: m.isolationIndex > 30 ? 'text-red-600' : m.isolationIndex > 10 ? 'text-amber-600' : 'text-green-600' },
        { label: t('metric.reciprocity'), value: m.reciprocity + '%', color: 'text-slate-700' },
        { label: t('metric.popular'), value: m.mostPopular, color: 'text-indigo-600' },
        { label: t('metric.rejected'), value: m.mostRejected, color: 'text-red-600' },
        { label: t('metric.answered'), value: (m.answeredCount || 0) + '/' + (m.totalStudents || 0), color: 'text-slate-700' },
      ]
    },
  },
  methods: {
    t(key) { return t(key, this.lang) },
    roleKey(r) { return ROLE_KEY_MAP[r] || 'neutral' },
    studentName(id) { return this.group?.students.find(s => s.id === id)?.name || '?' },
    roleClass(r) { return ROLE_CLASSES[r] || 'bg-purple-100 text-purple-700' },
    received(id) { const r = []; for (const s of this.group.students) { if (s.id!==id && this.matrix[s.id]?.[id]?.choice>0) r.push(s.id) } return r },
    rejections(id) { const r = []; for (const s of this.group.students) { if (s.id!==id && this.matrix[s.id]?.[id]?.rejection>0) r.push(s.id) } return r },
    made(id) { const r = []; for (const s of this.group.students) { if (s.id!==id && this.matrix[id]?.[s.id]?.choice>0) r.push(s.id) } return r },
    cellClass(a,b) { const m = this.matrix[a]?.[b]; if (!m) return 'bg-slate-50 text-slate-300'; if (m.choice && m.rejection) return 'bg-amber-100 text-amber-700'; if (m.choice) return 'bg-indigo-100 text-indigo-700'; if (m.rejection) return 'bg-red-100 text-red-700'; return 'bg-slate-50 text-slate-300' },
    cellSym(a,b) { const m = this.matrix[a]?.[b]; if (!m) return '·'; if (m.choice && m.rejection) return '↕'; if (m.choice) return '↑'; if (m.rejection) return '↓'; return '·' },
    editHighlight(a,b) { return this.editFrom === a && this.editTo === b },
    toggleCell(a,b) {
      const m = this.matrix[a][b]
      if (!m.choice && !m.rejection) { m.choice = 1 }
      else if (m.choice && !m.rejection) { m.choice = 0; m.rejection = 1 }
      else if (!m.choice && m.rejection) { m.rejection = 0 }
      else { m.choice = 0; m.rejection = 0 }
      this.recompute()
    },
    addChoice() { if (this.editFrom && this.editTo && this.editFrom!==this.editTo) { this.matrix[this.editFrom][this.editTo] = { choice: 1, rejection: 0 }; this.recompute() } },
    addRejection() { if (this.editFrom && this.editTo && this.editFrom!==this.editTo) { this.matrix[this.editFrom][this.editTo] = { choice: 0, rejection: 1 }; this.recompute() } },
    onDragStart(id) { this.dragFrom = id; this.showRelPopup = false },
    onDragOver(id) { if (this.dragFrom && this.dragFrom !== id) this.dragOver = id },
    onDragLeave() { this.dragOver = null },
    onDragDrop(id) { this.dragOver = null; if (this.dragFrom && this.dragFrom !== id) { this.dragTo = id; this.showRelPopup = true } },
    dragAddChoice() { if (this.dragFrom && this.dragTo) { this.matrix[this.dragFrom][this.dragTo] = { choice: 1, rejection: 0 }; this.showRelPopup = false; this.dragFrom = null; this.recompute() } },
    dragAddRejection() { if (this.dragFrom && this.dragTo) { this.matrix[this.dragFrom][this.dragTo] = { choice: 0, rejection: 1 }; this.showRelPopup = false; this.dragFrom = null; this.recompute() } },
    recompute() {
      const r = computeFromMatrix(this.group.students, this.matrix)
      this.choicesCount = r.choicesCount; this.rejectionsCount = r.rejectionsCount
      this.roles = r.roles; this.metrics = r.metrics; this.predictions = r.predictions
      this.sortedStudents = [...this.group.students].sort((a,b) => (this.choicesCount[b.id]||0) - (this.choicesCount[a.id]||0))
      this.sortedStudents.forEach(s => { s.role = this.roles[s.id] || 'Neutro'; s.color = stringToColor(s.name) })
      this.renderIt()
    },
    refreshGraph() { this.renderIt() },
    async exportPNG() { destroyGraph(); await nextTick(); await exportGraphPNG('resultsGraph', this.lang); this.renderIt() },
    exportJSON() { downloadJSON({ group:{name:this.group.name,students:this.group.students}, metrics:this.metrics, roles:this.roles, predictions:this.predictions, responses:this.responses }, `sociograma-${this.group.name}-${new Date().toISOString().slice(0,10)}.json`) },
    exportAnonJSON() { downloadAnonymizedJSON(this.group, this.metrics, this.roles, this.predictions, this.matrix, this.responses, this.lang) },
    exportHTML() { downloadReportHTML(this.group, this.metrics, this.roles, this.predictions, this.matrix, this.responses, this.lang) },
    exportAnonHTML() { downloadAnonymizedReportHTML(this.group, this.metrics, this.roles, this.predictions, this.matrix, this.responses, this.lang) },
    generateTeams() {
      this.teamSeed = (this.teamSeed || 0) + 1
      this.teams = formTeams(this.group.students, this.matrix, this.roles, this.teamSize, this.teamSeed)
      this.showTeams = true
    },
    tableColor(ri, ti, alpha) {
      const c = COLOR_PALETTE[(ri * 3 + ti) % COLOR_PALETTE.length]
      if (alpha === undefined) return c
      const r = parseInt(c.slice(1,3), 16), g = parseInt(c.slice(3,5), 16), b = parseInt(c.slice(5,7), 16)
      return `rgba(${r},${g},${b},${alpha})`
    },
    generateDist() {
      this.distSeed = (this.distSeed || 0) + 1
      const groups = formTeams(this.group.students, this.matrix, this.roles, this.distSize, this.distSeed)
      const cols = Math.min(this.distCols, Math.max(2, Math.ceil(Math.sqrt(groups.length * 2))))
      const grid = []
      let row = []
      for (const g of groups) {
        row.push(g)
        if (row.length >= cols) { grid.push(row); row = [] }
      }
      if (row.length) grid.push(row)
      this.distGrid = grid
      this.showDist = true
      saveDistribution(this.group.id, grid, this.distSize, this.distCols)
    },
    async exportDistPNG() {
      const el = this.$refs.distContainer
      if (!el || !window.html2canvas) return
      const canvas = await html2canvas(el, { backgroundColor: '#ffffff', scale: 2 })
      const link = document.createElement('a')
      link.download = `distribucion-${this.group.name}-${new Date().toISOString().slice(0,10)}.png`
      link.href = canvas.toDataURL()
      link.click()
    },
    distDragStart(e, ri, ti, sid) {
      this.distDragId = sid; this.distDragFrom = { ri, ti }
      e.dataTransfer.effectAllowed = 'move'
    },
    distDragOver(e, ri, ti, sid) {
      e.dataTransfer.dropEffect = 'move'
      e.target.closest('[draggable]')?.classList.add('ring-2', 'ring-indigo-400')
    },
    distDrop(toRi, toTi, toSid) {
      document.querySelectorAll('[draggable]').forEach(el => el.classList.remove('ring-2', 'ring-indigo-400'))
      if (!this.distDragId || !this.distDragFrom) return
      const from = this.distDragFrom
      let srcStudent = null, srcTable = null
      for (let ri = 0; ri < this.distGrid.length; ri++) {
        for (let ti = 0; ti < this.distGrid[ri].length; ti++) {
          const idx = this.distGrid[ri][ti].findIndex(s => s.id === this.distDragId)
          if (idx !== -1) { srcStudent = this.distGrid[ri][ti].splice(idx, 1)[0]; srcTable = { ri, ti }; break }
        }
        if (srcStudent) break
      }
      if (!srcStudent) { this.distDragId = null; this.distDragFrom = null; return }
      if (toSid && toSid !== this.distDragId) {
        const dstTable = this.distGrid[toRi][toTi]
        const dstIdx = dstTable.findIndex(s => s.id === toSid)
        if (dstIdx !== -1) { dstTable.splice(dstIdx, 0, srcStudent); this.distGrid[toRi][toTi] = dstTable }
        else { this.distGrid[toRi][toTi].push(srcStudent) }
      } else {
        this.distGrid[toRi][toTi].push(srcStudent)
      }
      this.distDragId = null; this.distDragFrom = null
      saveDistribution(this.group.id, this.distGrid, this.distSize, this.distCols)
    },
    tableCohesion(table) {
      if (table.length < 2) return 0
      let choices = 0, pairs = 0
      for (let i = 0; i < table.length; i++) {
        for (let j = i + 1; j < table.length; j++) {
          pairs++
          const a = table[i].id, b = table[j].id
          if (this.matrix[a]?.[b]?.choice > 0 || this.matrix[b]?.[a]?.choice > 0) choices++
        }
      }
      return pairs ? Math.round(choices / pairs * 100) : 0
    },
    renderIt() { nextTick(() => { renderGraph('resultsGraph', this.group.students, this.matrix, this.roles, (id)=>{ this.selected = id }) }) },
  },
  mounted() {
    const r = computeSociogram(this.group.students, this.responses, this.activeQs)
    this.matrix = r.matrix; this.choicesCount = r.choicesCount; this.rejectionsCount = r.rejectionsCount
    this.roles = r.roles; this.metrics = r.metrics; this.predictions = r.predictions; this.result = r
    this.sortedStudents = [...this.group.students].sort((a,b) => (this.choicesCount[b.id]||0) - (this.choicesCount[a.id]||0))
    this.sortedStudents.forEach(s => { s.role = this.roles[s.id] || 'Neutro'; let h=0; for (let i=0; i<s.name.length; i++) h=s.name.charCodeAt(i)+((h<<5)-h); s.color = ['#6366f1','#8b5cf6','#ec4899','#f43f5e','#f97316','#eab308','#22c55e','#14b8a6','#06b6d4','#3b82f6'][Math.abs(h)%10] })
    this.renderIt()
    loadDistribution(this.group.id, this.group.students).then(data => {
      if (data) { this.distGrid = data.grid; this.distSize = data.size; this.distCols = data.cols }
    })
  },
  beforeUnmount() { destroyGraph() },
}

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

const QUESTION_PRESETS = {
  general:     { nameKey: 'preset.general', active: [0, 1, 2] },
  primary:     { nameKey: 'preset.primary', active: [0, 1, 3, 6, 8, 11] },
  secondary:   { nameKey: 'preset.secondary', active: [0, 1, 2, 4, 7, 12] },
  highschool:  { nameKey: 'preset.highschool', active: [0, 1, 4, 7, 10, 13] },
  coexistence: { nameKey: 'preset.coexistence', active: [1, 3, 5, 9, 11, 14] },
  inclusion:   { nameKey: 'preset.inclusion', active: [0, 3, 4, 6, 8, 11] },
}

const app = createApp({
  data() {
    return {
      step: 1,
      groups: [],
      selectedGroupId: null,
      lang: localStorage.getItem('sociograma-lang') || 'es',
      maxChoices: 3,
      responses: {},
      showImportInput: false,
      showPrivacy: false,
      toast: { show: false, message: '', type: 'success' },
      confirmDialog: { show: false, message: '', onOk: null },
      promptDialog: { show: false, message: '', onOk: null, value: '' },
      questionActive: [],
      currentPreset: 'general',
      questions: [],
    }
  },
  computed: {
    selectedGroup() { return this.groups.find(g => g.id === this.selectedGroupId) || null },
    presetList() {
      const names = Object.keys(QUESTION_PRESETS)
      return names.map(n => ({ id: n, name: this.t(QUESTION_PRESETS[n].nameKey) }))
    },
    steps() {
      return [this.t('step.groups'), this.t('step.questionnaire'), this.t('step.results'), this.t('step.organize')]
    },
    stepDesc() {
      return [this.t('step.groupsDesc'), this.t('step.questionnaireDesc'), this.t('step.resultsDesc'), this.t('step.organizeDesc')]
    },
  },
  watch: {
    lang(l) {
      localStorage.setItem('sociograma-lang', l)
      this.buildQuestions()
    },
    questionActive: { deep: true, handler() { this.buildQuestions() } },
  },
  methods: {
    t(key) { return t(key, this.lang) },
    setLang(l) { this.lang = l },
    buildQuestions() {
      this.questions = QUESTION_BANK.map((qb, i) => ({
        text: this.t(qb.key),
        type: this.t(qb.typeKey),
        maxChoices: qb.maxChoices,
        active: this.questionActive.includes(i),
      }))
    },
    handleGroupDelete(groupId) {
      const g = this.groups.find(g => g.id === groupId)
      if (!g) return
      const msg = this.t('group.confirmDelete').replace('{name}', g.name)
      this.showConfirm(msg, () => this.deleteGroup(groupId))
    },
    async deleteGroup(id) {
      this.groups.splice(this.groups.findIndex(g => g.id === id), 1)
      if (this.selectedGroupId === id) this.selectedGroupId = null
      await saveGroups(this.groups)
    },
    showConfirm(msg, onOk) { this.confirmDialog = { show: true, message: msg, onOk } },
    showPrompt(msg, onOk) { this.promptDialog = { show: true, message: msg, onOk, value: '' } },
    cancelConfirm() { this.confirmDialog.show = false; this.confirmDialog.onOk = null },
    cancelPrompt() { this.promptDialog.show = false; this.promptDialog.onOk = null },
    okConfirm() { const cb = this.confirmDialog.onOk; this.confirmDialog.show = false; this.confirmDialog.onOk = null; if (cb) { const r = cb(); if (r && r.catch) r.catch(()=>{}) } },
    okPrompt() { const cb = this.promptDialog.onOk; const val = this.promptDialog.value; this.promptDialog.show = false; this.promptDialog.onOk = null; if (cb) cb(val) },
    toggleQuestion(qi) {
      const idx = this.questionActive.indexOf(qi)
      if (idx >= 0) this.questionActive.splice(idx, 1)
      else this.questionActive.push(qi)
    },
    applyPreset(name) {
      const preset = QUESTION_PRESETS[name]
      if (!preset) return
      this.currentPreset = name
      this.questionActive = [...preset.active]
    },
    async initApp() {
      this.lang = localStorage.getItem('sociograma-lang') || 'es'
      window.__lang = this.lang
      this.groups = await loadGroups()
      this.applyPreset('general')
    },
    async goStep(s) {
      if (s >= 3 && s <= 4 && this.selectedGroup) {
        const loaded = await loadResponses(this.selectedGroupId)
        if (loaded && Object.keys(loaded).length) this.responses = loaded
      }
      this.step = s
    },
    async startSurvey() { this.responses = await loadResponses(this.selectedGroupId); this.step = 2 },
    async loadGroupsData() { this.groups = await loadGroups() },
    async loadTestData() {
      this.showConfirm(this.t('confirm.testData'), async () => {
        await generateTestData()
        await this.loadGroupsData()
        this.showToast('toast.testData', 'success')
      })
    },
    async exportAll() { await exportAllData(); this.showToast('toast.exported', 'success') },
    async importJSON(e) {
      const file = e.target.files[0]
      if (!file) return
      try {
        await importFromFile(file)
        await this.loadGroupsData()
        this.showToast('toast.imported', 'success')
      } catch (err) { this.showToast('toast.error', 'error') }
      e.target.value = ''
    },
    showToast(key, type = 'success') {
      this.toast = { show: true, message: this.t(key), type }
      setTimeout(() => { this.toast.show = false }, 3500)
    },
  },
  mounted() { this.initApp() },
})

app.component('group-manager', GroupManager)
app.component('questionnaire', Questionnaire)
app.component('results-view', ResultsView)
app.mount('#app')
