<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm" @click.self="$emit('cancel')">
    <div class="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-5 w-full max-w-sm mx-3" @click.stop>
      <p class="text-sm text-slate-700 dark:text-slate-200 mb-3">{{ message }}</p>
      <input v-model="value" @keydown.enter="$emit('ok', value)" autofocus class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-300 mb-3">
      <div class="flex justify-end gap-2">
        <button @click="$emit('cancel')" class="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition">{{ t('group.cancel') }}</button>
        <button @click="$emit('ok', value)" class="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition shadow-md">{{ t('group.add') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { useI18n } from '@/composables/useI18n'

const props = defineProps<{ show: boolean; message: string }>()
defineEmits<{ ok: [value: string]; cancel: [] }>()

const { t } = useI18n()
const value = ref('')

watch(() => props.show, (v) => {
  if (v) nextTick(() => value.value = '')
})
</script>
