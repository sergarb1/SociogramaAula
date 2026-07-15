(function() {
  if (!window.components) window.components = {};
  window.components['results-view'] = {
    props: ['group', 'responses', 'questions', 'lang'],
    emits: ['back', 'organize'],
    template: `
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <!-- Left sidebar: Metrics + Predictions -->
      <div class="lg:col-span-1 space-y-4">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-5">
          <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-100 mb-3 flex items-center gap-2"><span class="w-5 h-5 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">i</span>{{ t('results.metrics') }}</h3>
          <div class="space-y-2">
            <div v-for="m in metricList" :key="m.label" class="flex justify-between items-center p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
              <span class="text-xs text-slate-500 dark:text-slate-400">{{ m.label }}</span>
              <span class="text-sm font-bold" :class="m.color" v-html="m.value"></span>
            </div>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-5">
          <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-100 mb-3 flex items-center gap-2"><span class="w-5 h-5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center text-xs font-bold">!</span>{{ t('results.predictions') }}</h3>
          <div class="space-y-2">
            <div v-for="p in predictions" :key="p.label" class="p-2.5 rounded-xl"
              :class="p.type==='risk'?'bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/40':p.type==='opportunity'?'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/40':'bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40'">
              <div class="flex items-start gap-2">
                <span class="text-sm shrink-0">{{ p.icon }}</span>
                <div><p class="text-xs font-medium text-slate-700 dark:text-slate-200">{{ p.label }}</p><p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{ p.desc }}</p></div>
              </div>
            </div>
            <div v-if="!predictions.length" class="text-center py-4 text-slate-400 dark:text-slate-500 text-xs"><p>{{ t('results.noData') }}</p></div>
          </div>
        </div>
      </div>

      <!-- Center: Graph -->
      <div class="lg:col-span-2">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-100">{{ t('results.graph') }}</h3>
            <div class="flex gap-1.5">
              <button @click="refreshGraph" class="btn-icon bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-600" :title="t('results.refresh')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"/></svg>
              </button>
              <button @click="exportPNG" class="btn-icon bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-600" :title="t('results.exportImg')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>
              </button>
            </div>
          </div>
          <div id="resultsGraph" class="w-full h-[460px] rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 dark:from-slate-900 to-white dark:to-slate-800"></div>
          <div class="flex flex-wrap gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
            <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-green-500"></span> {{ t('role.leader') }}</span>
            <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-indigo-500"></span> {{ t('role.popular') }}</span>
            <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-amber-500"></span> {{ t('role.bridge') }}</span>
            <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-red-500"></span> {{ t('role.rejected') }}</span>
            <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-slate-400"></span> {{ t('role.isolated') }}</span>
            <span class="flex items-center gap-1"><span class="w-3 h-3 rounded-full bg-purple-400"></span> {{ t('role.neutral') }}</span>
            <span class="flex items-center gap-1 ml-2">&#x27F6; {{ t('graph.legend.choice') }}</span>
            <span class="flex items-center gap-1">- - - {{ t('graph.legend.rejection') }}</span>
          </div>
        </div>
      </div>

      <!-- Right sidebar: Students + Actions -->
      <div class="lg:col-span-1 space-y-4">
        <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-5">
          <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-100 mb-2">{{ t('results.students') }}</h3>
          <input v-model="studentFilter" :placeholder="t('results.search')" class="w-full mb-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300">
          <div class="space-y-1 max-h-52 overflow-y-auto">
            <div v-for="s in filteredStudents" :key="s.id" @click="selected = s.id"
              class="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition text-sm"
              :class="selected === s.id ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'">
              <div class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" :style="'background:'+s.color">{{ s.name.charAt(0) }}</div>
              <span class="flex-1 text-slate-700 dark:text-slate-200 truncate">{{ s.name }}</span>
              <span class="text-xs font-medium px-1.5 py-0.5 rounded-full shrink-0" :class="roleClass(s.role)">{{ t('role.'+roleKey(s.role)) }}</span>
            </div>
          </div>
        </div>

        <div v-if="selected" class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-5">
          <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-100 mb-2">{{ studentName(selected) }}</h3>
          <div class="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <p>{{ t('results.receivesChoices') }} <strong class="text-slate-800 dark:text-slate-100">{{ received(selected).length }}</strong></p>
            <p>{{ t('results.receivesRejections') }} <strong class="text-slate-800 dark:text-slate-100">{{ rejections(selected).length }}</strong></p>
            <p>{{ t('results.makesChoices') }} <strong class="text-slate-800 dark:text-slate-100">{{ made(selected).length }}</strong></p>
            <p>{{ t('results.role') }} <strong class="text-slate-800 dark:text-slate-100">{{ t('role.'+roleKey(roles[selected])) }}</strong></p>
            <div v-if="received(selected).length"><p class="text-slate-400 dark:text-slate-500 mt-2 mb-1">{{ t('results.chosenBy') }}</p><div class="flex flex-wrap gap-1"> <span v-for="cid in received(selected)" :key="cid" class="px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs">{{ studentName(cid) }}</span></div></div>
          </div>
        </div>

        <button @click="showEdit = !showEdit" class="w-full py-2.5 rounded-xl text-sm font-medium transition shadow-sm"
          :class="showEdit ? 'bg-indigo-600 text-white' : 'btn-secondary justify-center'">
          {{ showEdit ? t('results.closeEditor') : t('results.openEditor') }}
        </button>
        <button @click="showMatrix = !showMatrix" class="btn-secondary w-full justify-center shadow-sm">{{ showMatrix ? t('results.hideMatrix') : t('results.showMatrix') }}</button>
        <button @click="$emit('organize')" class="w-full py-2.5 rounded-xl text-sm font-bold transition shadow-sm bg-green-600 text-white hover:bg-green-700">
          &#x1F465; {{ t('teams.form') }}
        </button>
        <button @click="goDist" class="w-full py-2.5 rounded-xl text-sm font-bold transition shadow-sm bg-indigo-600 text-white hover:bg-indigo-700">
          &#x1F3EB; {{ t('dist.form') }}
        </button>
        <div class="flex gap-2">
          <button @click="exportJSON" class="btn-secondary flex-1 justify-center shadow-sm">{{ t('results.exportJSON') }}</button>
          <button @click="exportHTML" class="btn-primary flex-1 justify-center shadow-sm">{{ t('results.exportReport') }}</button>
        </div>
        <div class="flex gap-2">
          <button @click="exportAnonJSON" class="flex-1 py-2 rounded-xl border border-dashed border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 text-xs font-medium hover:bg-amber-50 dark:hover:bg-amber-900/20 transition">{{ t('results.anonJSON') }}</button>
          <button @click="exportAnonHTML" class="flex-1 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 text-xs font-medium hover:bg-amber-100 dark:hover:bg-amber-800/40 transition">{{ t('results.anonReport') }}</button>
        </div>
        <div class="mt-2 p-2 rounded-lg bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/40 text-[10px] text-amber-600 dark:text-amber-400 leading-relaxed">
          {{ t('results.anonPrompt') }}<br>
          <span class="italic">"{{ t('results.anonPrompt1') }}"</span><br>
          <span class="italic">"{{ t('results.anonPrompt2') }}"</span><br>
          <span class="italic">"{{ t('results.anonPrompt3') }}"</span>
        </div>
        <div class="flex gap-2">
          <button @click="downloadStudentsCSV(group)" class="flex-1 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">{{ t('results.csvStudents') }}</button>
          <button @click="downloadMatrixCSV(group, matrix)" class="flex-1 py-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">{{ t('results.csvMatrix') }}</button>
        </div>
      </div>
    </div>

    <!-- Editor -->
    <div v-if="showEdit" class="mt-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-5 no-print">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-100">{{ t('editor.title') }}</h3>
        <span class="text-xs text-slate-400 dark:text-slate-500">{{ t('editor.hint') }}</span>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <div>
          <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">{{ t('editor.from') }}</label>
          <select v-model="editFrom" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <option value="">{{ t('editor.select') }}</option>
            <option v-for="s in group.students" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">{{ t('editor.to') }}</label>
          <select v-model="editTo" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300">
            <option value="">{{ t('editor.select') }}</option>
            <option v-for="s in group.students" :key="s.id" :value="s.id">{{ s.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">{{ t('editor.type') }}</label>
          <div class="flex gap-2">
            <button @click="addChoice" :disabled="!editFrom || !editTo || editFrom===editTo"
              class="flex-1 py-2 rounded-xl text-sm font-medium transition shadow-sm"
              :class="editFrom && editTo && editFrom!==editTo ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed'">
              {{ t('editor.choice') }}
            </button>
            <button @click="addRejection" :disabled="!editFrom || !editTo || editFrom===editTo"
              class="flex-1 py-2 rounded-xl text-sm font-medium transition shadow-sm"
              :class="editFrom && editTo && editFrom!==editTo ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-600 cursor-not-allowed'">
              {{ t('editor.rejection') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Drag-drop between students -->
      <div class="mb-4">
        <label class="block text-xs text-slate-500 dark:text-slate-400 mb-2">&#x1F5B1; {{ t('editor.dragHint') }}</label>
        <div class="flex flex-wrap gap-2">
          <div v-for="s in group.students" :key="s.id"
            draggable="true"
            @dragstart="onDragStart(s.id)"
            @dragover.prevent="onDragOver(s.id)"
            @dragleave="onDragLeave"
            @drop.prevent="onDragDrop(s.id)"
            class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-grab active:cursor-grabbing transition-all select-none border"
            :class="dragFrom === s.id ? 'border-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 shadow-sm' : dragOver === s.id ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-2 ring-indigo-300 scale-105' : 'border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 hover:border-indigo-300 dark:hover:border-indigo-600'">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0" :style="'background:'+s.color">{{ s.name.charAt(0) }}</span>
            {{ s.name }}
          </div>
        </div>
      </div>

      <!-- Drag-drop popup -->
      <div v-if="showRelPopup" class="mb-4 p-3 rounded-xl bg-white dark:bg-slate-700 border-2 border-indigo-200 dark:border-indigo-700 shadow-lg flex items-center gap-3">
        <span class="text-xs text-slate-600 dark:text-slate-300">{{ t('editor.dragFrom') }} <strong>{{ studentName(dragFrom) }}</strong> &rarr; <strong>{{ studentName(dragTo) }}</strong></span>
        <button @click="dragAddChoice" class="px-3 py-1 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm">{{ t('editor.choice') }}</button>
        <button @click="dragAddRejection" class="px-3 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-sm">{{ t('editor.rejection') }}</button>
        <button @click="showRelPopup = false" class="px-2 py-1 text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition">&times;</button>
      </div>

      <!-- Matrix table -->
      <div class="overflow-x-auto">
        <table class="text-sm border-collapse mx-auto">
          <thead>
            <tr>
              <th class="p-1 text-left text-slate-400 dark:text-slate-500 text-xs font-medium w-20"></th>
              <th v-for="s in group.students" :key="s.id" class="p-1 text-center text-xs font-medium text-slate-500 dark:text-slate-400 align-bottom">
                <div class="writing-vertical" :title="s.name">{{ s.name.split(' ')[0] }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in group.students" :key="s.id">
              <td class="p-1 font-medium text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap">{{ s.name.split(' ')[0] }}</td>
              <td v-for="s2 in group.students" :key="s2.id" class="p-0.5 text-center">
                <span v-if="s.id!==s2.id"
                  @click="toggleCell(s.id, s2.id)"
                  class="inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs cursor-pointer transition-all hover:ring-2 hover:ring-indigo-400"
                  :class="cellClass(s.id, s2.id) + ' ' + (editHighlight(s.id, s2.id) ? 'ring-2 ring-indigo-500 scale-110' : '')">
                  {{ cellSym(s.id, s2.id) }}
                </span>
                <span v-else class="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-600 text-xs">&middot;</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="flex gap-4 mt-3 text-xs text-slate-400 dark:text-slate-500 justify-center flex-wrap no-print">
        <span>{{ t('editor.legend') }}</span>
        <span class="inline-flex items-center gap-1"><span class="w-4 h-4 rounded bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-xs">&uarr;</span> {{ t('editor.choiceLabel') }}</span>
        <span class="inline-flex items-center gap-1"><span class="w-4 h-4 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 flex items-center justify-center text-xs">&darr;</span> {{ t('editor.rejectionLabel') }}</span>
        <span>&rarr; <span class="text-slate-300 dark:text-slate-600">&middot;</span> {{ t('editor.noRelation') }}</span>
      </div>
      <div v-if="Object.keys(responses).length === 0" class="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-700 dark:text-amber-300">
        {{ t('editor.manualHint') }}
      </div>
    </div>

    <!-- Matrix display -->
    <div v-if="showMatrix && !showEdit" class="mt-6 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-5 overflow-x-auto no-print">
      <h3 class="text-sm font-semibold text-slate-700 dark:text-slate-100 mb-3">{{ t('matrix.title') }}</h3>
      <table class="text-sm border-collapse mx-auto">
        <thead><tr><th class="p-1.5 text-left text-slate-400 dark:text-slate-500 text-xs font-medium"></th><th v-for="s in group.students" :key="s.id" class="p-1.5 text-center text-xs font-medium text-slate-500 dark:text-slate-400 align-bottom"><div class="writing-vertical" :title="s.name">{{ s.name.split(' ')[0] }}</div></th></tr></thead>
        <tbody><tr v-for="s in group.students" :key="s.id"><td class="p-1.5 font-medium text-slate-600 dark:text-slate-400 text-xs whitespace-nowrap">{{ s.name.split(' ')[0] }}</td><td v-for="s2 in group.students" :key="s2.id" class="p-1 text-center"><span v-if="s.id!==s2.id" class="inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs" :class="cellClass(s.id,s2.id)">{{ cellSym(s.id,s2.id) }}</span><span v-else class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-300 dark:text-slate-600 text-xs">&middot;</span></td></tr></tbody>
      </table>
      <div class="flex gap-4 mt-3 text-xs text-slate-400 dark:text-slate-500 justify-center">{{ t('matrix.legend') }}</div>
    </div>`,
    data() {
      return {
        selected: null, showMatrix: false, showEdit: false,
        editFrom: '', editTo: '', dragFrom: null, dragTo: null, dragOver: null,
        showRelPopup: false, studentFilter: '',
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
          { label: t('metric.cohesion'), value: m.cohesion + '%', color: m.cohesion > 50 ? 'text-green-600 dark:text-green-400' : m.cohesion > 25 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400' },
          { label: t('metric.density'), value: m.density + '%', color: 'text-slate-700 dark:text-slate-300' },
          { label: t('metric.isolation'), value: m.isolationIndex + '%', color: m.isolationIndex > 30 ? 'text-red-600 dark:text-red-400' : m.isolationIndex > 10 ? 'text-amber-600 dark:text-amber-400' : 'text-green-600 dark:text-green-400' },
          { label: t('metric.reciprocity'), value: m.reciprocity + '%', color: 'text-slate-700 dark:text-slate-300' },
          { label: t('metric.popular'), value: m.mostPopular, color: 'text-indigo-600 dark:text-indigo-400' },
          { label: t('metric.rejected'), value: m.mostRejected, color: 'text-red-600 dark:text-red-400' },
          { label: t('metric.answered'), value: (m.answeredCount || 0) + '/' + (m.totalStudents || 0), color: 'text-slate-700 dark:text-slate-300' },
        ]
      },
    },
    methods: {
      t(key) { return t(key, this.lang) },
      roleKey(r) { return ROLE_KEY_MAP[r] || 'neutral' },
      studentName(id) { return this.group?.students.find(s => s.id === id)?.name || '?' },
      roleClass(r) { return ROLE_CLASSES[r] || 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' },
      received(id) { const r = []; for (const s of this.group.students) { if (s.id!==id && this.matrix[s.id]?.[id]?.choice>0) r.push(s.id) } return r },
      rejections(id) { const r = []; for (const s of this.group.students) { if (s.id!==id && this.matrix[s.id]?.[id]?.rejection>0) r.push(s.id) } return r },
      made(id) { const r = []; for (const s of this.group.students) { if (s.id!==id && this.matrix[id]?.[s.id]?.choice>0) r.push(s.id) } return r },
      cellClass(a,b) { const m = this.matrix[a]?.[b]; if (!m) return 'bg-slate-50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600'; if (m.choice && m.rejection) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'; if (m.choice) return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'; if (m.rejection) return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'; return 'bg-slate-50 dark:bg-slate-800/50 text-slate-300 dark:text-slate-600' },
      cellSym(a,b) { const m = this.matrix[a]?.[b]; if (!m) return '\u00B7'; if (m.choice && m.rejection) return '\u21D5'; if (m.choice) return '\u2191'; if (m.rejection) return '\u2193'; return '\u00B7' },
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
      goDist() { this.$emit('organize') },
      async exportPNG() { destroyGraph(); await nextTick(); await exportGraphPNG('resultsGraph', this.lang); this.renderIt() },
      exportJSON() { downloadJSON({ group:{name:this.group.name,students:this.group.students}, metrics:this.metrics, roles:this.roles, predictions:this.predictions, responses:this.responses }, `sociograma-${this.group.name}-${new Date().toISOString().slice(0,10)}.json`) },
      exportAnonJSON() { downloadAnonymizedJSON(this.group, this.metrics, this.roles, this.predictions, this.matrix, this.responses, this.lang) },
      exportHTML() { downloadReportHTML(this.group, this.metrics, this.roles, this.predictions, this.matrix, this.responses, this.lang) },
      exportAnonHTML() { downloadAnonymizedReportHTML(this.group, this.metrics, this.roles, this.predictions, this.matrix, this.responses, this.lang) },
      renderIt() { nextTick(() => { renderGraph('resultsGraph', this.group.students, this.matrix, this.roles, (id)=>{ this.selected = id }) }) },
      refreshGraph() { destroyGraph(); this.renderIt() },
    },
    mounted() {
      if (!this.group) return
      const r = computeSociogram(this.group.students, this.responses, this.activeQs)
      this.matrix = r.matrix; this.choicesCount = r.choicesCount; this.rejectionsCount = r.rejectionsCount
      this.roles = r.roles; this.metrics = r.metrics; this.predictions = r.predictions; this.result = r
      this.sortedStudents = [...this.group.students].sort((a,b) => (this.choicesCount[b.id]||0) - (this.choicesCount[a.id]||0))
      this.sortedStudents.forEach(s => { s.role = this.roles[s.id] || 'Neutro'; s.color = stringToColor(s.name) })
      this.renderIt()
    },
    beforeUnmount() { destroyGraph() },
  };
})();
