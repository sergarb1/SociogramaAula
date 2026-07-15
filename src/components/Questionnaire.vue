<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div class="lg:col-span-1">
      <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 p-5">
        <h2 class="text-lg font-semibold text-slate-700 dark:text-slate-100 mb-4">{{ t('survey.title') }}</h2>

        <div class="mb-4">
          <label class="block text-xs text-slate-500 dark:text-slate-400 mb-1">{{ t('preset.custom') }}</label>
          <select @change="$emit('apply-preset', ($event.target as HTMLSelectElement).value)" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300">
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
          <input type="range" :value="maxChoices" @input="$emit('update:maxChoices', +($event.target as HTMLInputElement).value)" min="1" max="5" class="w-full accent-indigo-600">
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

        <button @click="$emit('done')" class="btn-secondary w-full justify-center border-dashed border-indigo-300 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 mt-4">
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
            <p class="text-xs text-slate-400 dark:text-slate-500 mb-2">{{ t('survey.chooseUpTo').replace('{n}', String(q.maxChoices)) }}</p>
            <div class="flex flex-wrap gap-2 min-h-[44px] p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-dashed border-slate-300 dark:border-slate-600">
              <template v-for="s in group.students" :key="s.id"><div v-if="s.id !== current.id"
                @click="toggle(s.id, qi)" draggable="true"
                @dragstart="dragChoice($event, s.id, qi)"
                class="px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all select-none"
                :class="isChosen(s.id, qi) ? 'bg-indigo-600 text-white shadow-md' : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-indigo-200 dark:hover:border-indigo-600'">
                {{ s.name }}
                             </div></template>
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
              <button v-if="doneList.length > 0" @click="$emit('done')" class="btn-secondary">{{ t('survey.viewResults').replace('{n}', String(doneList.length)) }}</button>
              <button @click="saveAnswers" class="btn-primary px-6 py-2.5 shadow-md">{{ t('survey.save') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { t } from '@/utils/locales'
import { saveResponses } from '@/utils/storage'
import type { Group, Student } from '@/constants'

const props = defineProps<{
  group: Group
  questions: { text: string; type: string; active: boolean; maxChoices: number }[]
  maxChoices: number
  responses: Record<string, Record<string, string[]>>
  lang: string
  presetList: { id: string; name: string }[]
  currentPreset: string
}>()

const emit = defineEmits<{
  done: []
  'toggle-question': [qi: number]
  'apply-preset': [id: string]
  'update:maxChoices': [v: number]
}>()

const current = ref<Student | null>(null)
const answers = ref<Record<string, string[]>>({})
const doneList = ref<string[]>([])
const dirty = ref(false)

const answeredCount = computed(() => doneList.value.length)
const pct = computed(() => props.group?.students.length ? Math.round(doneList.value.length / props.group.students.length * 100) : 0)
const activeQs = computed(() => props.questions.filter(q => q.active).map(q => ({ ...q, maxChoices: props.maxChoices })))

function isDone(id: string) { return doneList.value.includes(id) }

function startStudent(s: Student) {
  current.value = s
  answers.value = JSON.parse(JSON.stringify(props.responses[s.id] || {}))
  for (let i = 0; i < activeQs.value.length; i++) {
    if (!answers.value[i]) answers.value[i] = []
  }
  dirty.value = false
}

function studentName(id: string) { return props.group?.students.find(s => s.id === id)?.name || '?' }
function getChosen(qi: number) { return answers.value[qi] || [] }
function isChosen(sid: string, qi: number) { return (answers.value[qi] || []).includes(sid) }

function toggle(sid: string, qi: number) {
  const arr = answers.value[qi] = answers.value[qi] || []
  const max = activeQs.value[qi]?.maxChoices || 3
  const i = arr.indexOf(sid)
  if (i >= 0) arr.splice(i, 1)
  else if (arr.length < max) arr.push(sid)
  dirty.value = true
  autoSave()
}

function unchoose(sid: string, qi: number) {
  const arr = answers.value[qi]
  if (arr) {
    const i = arr.indexOf(sid)
    if (i >= 0) arr.splice(i, 1)
    dirty.value = true
    autoSave()
  }
}

function dragChoice(e: DragEvent, sid: string, _qi: number) {
  if (e.dataTransfer) e.dataTransfer.setData('text', sid)
}

async function autoSave() {
  if (!current.value || !dirty.value) return
  props.responses[current.value.id] = JSON.parse(JSON.stringify(answers.value))
  await saveResponses(props.group.id, props.responses)
  if (!doneList.value.includes(current.value.id)) doneList.value.push(current.value.id)
  dirty.value = false
}

async function saveAnswers() {
  if (!current.value) return
  await autoSave()
  current.value = null
  answers.value = {}
  if (doneList.value.length === props.group.students.length) emit('done')
}

function onBeforeUnload(e: BeforeUnloadEvent) {
  if (dirty.value) { e.preventDefault(); e.returnValue = '' }
}

onMounted(() => {
  doneList.value = Object.keys(props.responses)
  window.addEventListener('beforeunload', onBeforeUnload)
})

onUnmounted(() => {
  window.removeEventListener('beforeunload', onBeforeUnload)
})
</script>
