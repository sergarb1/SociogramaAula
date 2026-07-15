(function() {
  if (!window.components) window.components = {};
  window.components['group-manager'] = {
    props: ['groups', 'selectedId', 'lang'],
    emits: ['select', 'refresh', 'start-survey', 'confirm', 'prompt'],
    template: `
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-1">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-5">
          <h2 class="text-lg font-semibold text-slate-700 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span class="w-6 h-6 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">1</span>
            {{ t('group.title') }}
          </h2>

          <div class="flex gap-2 mb-3">
            <input v-model="newGroupName" @keydown.enter="createGroup" :placeholder="t('group.placeholder')" class="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <button @click="createGroup" class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition shadow-md" :title="t('group.add')">+</button>
          </div>

          <button @click="showTemplateModal = true" class="w-full mb-4 py-2 px-3 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition flex items-center justify-center gap-1">
            {{ t('group.fromTemplate') }}
          </button>

          <div class="space-y-2 max-h-80 overflow-y-auto">
            <div v-for="g in groups" :key="g.id" @click="$emit('select', g.id)"
              class="group cursor-pointer p-3 rounded-xl border transition-all duration-200 flex items-center justify-between"
              :class="selectedId === g.id ? 'border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 shadow-md ring-1 ring-indigo-200 dark:ring-indigo-700' : 'border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0'">
              <div class="flex items-center gap-3 min-w-0">
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" :style="'background:'+stringToColor(g.name)">{{ g.name.charAt(0).toUpperCase() }}</div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{{ g.name }}</p>
                  <p class="text-xs text-slate-400 dark:text-slate-500">{{ g.students.length }} {{ t('group.students') }}</p>
                </div>
              </div>
              <div class="flex items-center gap-1">
                <button @click.stop="confirmDelete(g)" class="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition p-1 shrink-0" :aria-label="t('group.delete')">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
                <svg class="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </div>
            </div>
            <div v-if="!groups.length" class="text-center py-8 text-slate-400 dark:text-slate-500 text-sm">
              <p class="mb-1">{{ t('group.empty.title') }}</p>
              <p>{{ t('group.empty.desc') }}</p>
            </div>
          </div>

          <div v-if="group && group.students.length >= 2" class="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
            <button @click="$emit('start-survey')" class="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-sm font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-lg flex items-center justify-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
              {{ t('group.startSurvey') }}
            </button>
          </div>
        </div>
      </div>

      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-5">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-slate-700 dark:text-slate-100 flex items-center gap-2">
              <span class="w-6 h-6 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">2</span>
              {{ group ? group.name : t('group.select') }}
            </h2>
            <div class="flex gap-2" v-if="group">
              <button @click="bulkAdd" class="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition">{{ t('group.bulkAdd') }}</button>
              <button @click="addOne" class="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md">{{ t('group.addOne') }}</button>
              <label class="text-xs px-3 py-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/40 cursor-pointer transition">{{ t('group.importCSV') }}
                <input type="file" accept=".csv" @change="importCSV" class="hidden">
              </label>
            </div>
          </div>

          <div v-if="!group" class="text-center py-12 text-slate-400 dark:text-slate-500"><p class="text-4xl mb-3">👈</p><p class="text-sm">{{ t('group.selectHint') }}</p></div>

          <div v-if="group" key="student-list">
            <div class="space-y-2 max-h-96 overflow-y-auto pr-1">
              <div v-for="(s, idx) in group.students" :key="s.id" draggable="true"
                @dragstart="onDragStart($event, idx)" @dragover.prevent="onDragOver($event, idx)"
                @drop="onDrop($event, idx)" @dragend="onDragEnd"
                class="flex items-center gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 hover:border-indigo-200 dark:hover:border-indigo-600 hover:shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing"
                :class="{'opacity-50 border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20': dragIdx === idx}">
                <div class="text-slate-300 dark:text-slate-600 hover:text-slate-500"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"/></svg></div>
                <div class="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" :style="'background:'+stringToColor(s.name)">{{ s.name.charAt(0).toUpperCase() }}</div>
                <input :value="s.name" @change="rename(s.id, $event.target.value)" class="flex-1 text-sm font-medium text-slate-700 dark:text-slate-200 bg-transparent border-b border-transparent focus:border-indigo-300 focus:outline-none">
                <span class="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full shrink-0">#{{ idx+1 }}</span>
                <button @click="removeStudent(s.id)" class="text-red-300 hover:text-red-500 transition p-1" :aria-label="t('group.delete')"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>
              </div>
            </div>
            <div v-if="!group.students.length" class="text-center py-8 text-slate-400 dark:text-slate-500 text-sm"><p class="mb-1">{{ t('group.studentEmpty') }}</p><p>{{ t('group.reorder') }}</p></div>

            <div v-if="group.students.length >= 2" class="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
              <button @click="$emit('start-survey')" class="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition shadow-lg flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                {{ t('group.startSurvey') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showTemplateModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" @click.self="showTemplateModal = false">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col" @click.stop>
          <div class="p-5 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-100">{{ t('group.templateTitle') }}</h3>
            <button @click="showTemplateModal = false" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xl" aria-label="Close">&times;</button>
          </div>
          <div class="p-5 overflow-y-auto space-y-3">
            <div v-for="tmpl in templates" :key="tmpl.name" @click="createFromTemplate(tmpl)"
              class="p-4 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition flex items-center justify-between">
              <div>
                <p class="font-medium text-slate-700 dark:text-slate-200">{{ tmpl.name }}</p>
                <p class="text-xs text-slate-400 dark:text-slate-500">{{ tmpl.description || tmpl.students.length+' '+t('group.students') }}</p>
              </div>
              <span class="text-xs bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full text-slate-500 dark:text-slate-400">{{ tmpl.students.length }} {{ t('group.students') }}</span>
            </div>
          </div>
          <div class="p-4 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-400 dark:text-slate-500">{{ t('group.templateFooter') }} <code class="bg-slate-100 dark:bg-slate-700 px-1 rounded">js/templates.js</code></div>
        </div>
      </div>

      <div v-if="showBulk" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" @click.self="showBulk = false">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4" @click.stop>
          <h3 class="text-lg font-semibold text-slate-700 dark:text-slate-100 mb-1">{{ t('group.bulkTitle') }}</h3>
          <p class="text-xs text-slate-400 dark:text-slate-500 mb-3">{{ t('group.bulkHint') }}</p>
          <textarea v-model="bulkText" class="w-full h-32 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300"></textarea>
          <div class="flex justify-end gap-2 mt-3">
            <button @click="showBulk = false" class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition">{{ t('group.cancel') }}</button>
            <button @click="saveBulk" class="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md">{{ t('group.add') }}</button>
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
  };
})();
