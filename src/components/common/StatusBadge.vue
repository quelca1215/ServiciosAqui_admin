<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold tracking-tight select-none border',
      styleClasses
    ]"
  >
    <span v-if="dot" :class="['w-1.5 h-1.5 rounded-full', dotClass]"></span>
    <slot>{{ status }}</slot>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    status: string
    dot?: boolean
  }>(),
  {
    dot: true
  }
)

const styleClasses = computed(() => {
  const s = props.status?.toLowerCase() || ''

  // Inactivo (debe evaluarse antes que 'activo')
  if (s.includes('inactivo')) {
    return 'bg-slate-100 text-slate-700 border-slate-200 shadow-2xs'
  }

  if (
    s.includes('verificado') ||
    s.includes('liberado') ||
    s.includes('activo') ||
    s.includes('pagado') ||
    s.includes('resuelto') ||
    s.includes('aceptada') ||
    s.includes('finalizada') ||
    s.includes('finalizado') ||
    s.includes('completado') ||
    s.includes('procedente') ||
    s.includes('publicada')
  ) {
    return 'bg-emerald-50 text-emerald-800 border-emerald-200/80 shadow-2xs'
  }

  if (
    s.includes('custodia') ||
    s.includes('cotizada') ||
    s.includes('asignada') ||
    s.includes('ejecución') ||
    s.includes('ejecucion') ||
    s.includes('progreso') ||
    s.includes('análisis') ||
    s.includes('analisis') ||
    s.includes('esperando') ||
    s.includes('enviada') ||
    s.includes('solicitado')
  ) {
    return 'bg-blue-50 text-blue-800 border-blue-200/80 shadow-2xs'
  }

  if (s.includes('pendiente') || s.includes('revisión') || s.includes('revision') || s.includes('recibida') || s.includes('borrador')) {
    return 'bg-amber-50 text-amber-800 border-amber-200/80 shadow-2xs'
  }

  if (
    s.includes('disputa') ||
    s.includes('rechazado') ||
    s.includes('cancelada') ||
    s.includes('cancelado') ||
    s.includes('suspendido') ||
    s.includes('congelado') ||
    s.includes('expirado') ||
    s.includes('anulado') ||
    s.includes('anulada') ||
    s.includes('improcedente') ||
    s.includes('eliminada') ||
    s.includes('revocado') ||
    s.includes('crítica') ||
    s.includes('critica')
  ) {
    return 'bg-rose-50 text-rose-800 border-rose-200/80 shadow-2xs'
  }

  return 'bg-slate-100 text-slate-700 border-slate-200 shadow-2xs'
})

const dotClass = computed(() => {
  const s = props.status?.toLowerCase() || ''
  if (s.includes('inactivo')) {
    return 'bg-slate-400'
  }
  if (
    s.includes('verificado') ||
    s.includes('liberado') ||
    s.includes('activo') ||
    s.includes('pagado') ||
    s.includes('resuelto') ||
    s.includes('aceptada') ||
    s.includes('finalizada') ||
    s.includes('finalizado') ||
    s.includes('publicada')
  ) {
    return 'bg-emerald-500'
  }
  if (
    s.includes('custodia') ||
    s.includes('cotizada') ||
    s.includes('asignada') ||
    s.includes('ejecución') ||
    s.includes('progreso')
  ) {
    return 'bg-blue-500'
  }
  if (s.includes('pendiente') || s.includes('revisión') || s.includes('recibida')) {
    return 'bg-amber-500'
  }
  if (
    s.includes('disputa') ||
    s.includes('rechazado') ||
    s.includes('cancelada') ||
    s.includes('suspendido') ||
    s.includes('congelado') ||
    s.includes('expirado')
  ) {
    return 'bg-rose-500'
  }
  return 'bg-slate-400'
})
</script>

