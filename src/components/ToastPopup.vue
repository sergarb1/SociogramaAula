<template>
  <div v-if="show" @click="$emit('dismiss')"
    class="px-5 py-3 rounded-xl shadow-2xl text-sm font-medium flex items-center gap-3 mx-3 sm:mx-0 transition-all duration-300 cursor-pointer animate-slideUp"
    :class="type === 'success' ? 'bg-green-600 text-white' : type === 'error' ? 'bg-red-600 text-white' : 'bg-slate-800 dark:bg-slate-700 text-white'">
    <span>{{ message }}</span>
    <svg class="w-4 h-4 shrink-0 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
  </div>
</template>

<script setup lang="ts">
defineProps<{ show: boolean; message: string; type?: string }>()
defineEmits<{ dismiss: [] }>()
</script>
