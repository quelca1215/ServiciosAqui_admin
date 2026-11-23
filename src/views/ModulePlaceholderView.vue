<template>
  <div class="space-y-6">
    <PageHeader
      :tag="moduleSection"
      :title="moduleTitle"
      :description="`Información general de la sección ${moduleTitle}.`"
    >
      <template #actions>
        <router-link
          to="/dashboard"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl border-2 border-slate-200 bg-white hover:border-emerald-500/40 hover:text-emerald-800 text-slate-700 font-bold text-xs shadow-2xs transition"
        >
          <ArrowLeft class="w-3.5 h-3.5" />
          <span>Volver a la Consola</span>
        </router-link>
      </template>
    </PageHeader>

    <div
      class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md shadow-slate-200/40 p-10 sm:p-14 text-center"
    >
      <div class="max-w-lg mx-auto space-y-4">
        <div
          class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200"
        >
          <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>Próximamente</span>
        </div>

        <div
          class="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0b1322] text-amber-400 border border-slate-800 shadow-lg mx-auto flex items-center justify-center"
        >
          <Clock class="w-7 h-7 stroke-[2.1]" />
        </div>

        <h3 class="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Aún no disponible
        </h3>

        <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">
          La sección <strong class="text-slate-700">{{ moduleTitle }}</strong> estará disponible
          próximamente en el panel de administración.
        </p>

        <div class="pt-2">
          <router-link
            to="/dashboard"
            class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
          >
            <ArrowLeft class="w-3.5 h-3.5" />
            <span>Ir a la Consola</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { ArrowLeft, Clock } from 'lucide-vue-next'
import { PageHeader } from '@/components/common'

const route = useRoute()

const moduleTitle = computed(() => {
  if (route.meta?.title) return route.meta.title as string
  const parts = route.path.split('/').filter(Boolean)
  if (parts.length > 0) {
    const last = parts[parts.length - 1] || ''
    return last.charAt(0).toUpperCase() + last.slice(1)
  }
  return 'Módulo'
})

const moduleSection = computed(() => {
  if (route.meta?.section) return route.meta.section as string
  const parts = route.path.split('/').filter(Boolean)
  if (parts.length > 0) {
    return (parts[0] || '').toUpperCase()
  }
  return 'GENERAL'
})
</script>
