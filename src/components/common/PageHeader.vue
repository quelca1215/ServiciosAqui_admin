<template>
  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
    <div>
      <div v-if="tag" class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200/80 mb-1.5">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        {{ tag }}
      </div>
      <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
        {{ title }}
      </h2>
      <p v-if="description" class="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
        {{ description }}
      </p>
    </div>

    <div v-if="$slots.actions" class="flex flex-wrap items-center gap-2.5 shrink-0">
      <slot name="actions" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  tag?: string
}>()
</script>

