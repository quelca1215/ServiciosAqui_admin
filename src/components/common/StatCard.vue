<template>
  <div
    :class="[
      'p-5 rounded-3xl relative overflow-hidden group transition-all duration-300',
      styles.card,
    ]"
  >
    <template v-if="resolvedVariant === 'dark'">
      <div
        class="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500"
      ></div>
      <div
        class="absolute top-0 right-0 w-24 h-24 bg-lime-400/10 rounded-full blur-xl pointer-events-none"
      ></div>
    </template>

    <div class="relative z-10 flex items-center justify-between gap-2 mb-3">
      <span :class="['text-xs font-mono font-bold uppercase tracking-wider', styles.label]">
        {{ label }}
      </span>

      <div
        v-if="icon"
        :class="[
          'w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 shrink-0',
          styles.iconBox,
        ]"
      >
        <div
          v-if="resolvedVariant === 'dark'"
          class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center"
        >
          <component :is="icon" class="w-5 h-5 text-emerald-400 stroke-[2.2]" />
        </div>
        <component v-else :is="icon" class="w-5 h-5 stroke-[2.2]" />
      </div>
    </div>

    <div
      :class="[
        'relative z-10 text-3xl sm:text-4xl font-black font-mono tracking-tight',
        valueClass || styles.value,
      ]"
    >
      {{ value }}
    </div>

    <div v-if="progress !== undefined" class="relative z-10 mt-2.5">
      <div :class="['flex items-center justify-between text-[11px] font-mono mb-1', styles.progressText]">
        <span>{{ progressLabel || 'Proporción:' }}</span>
        <span :class="['font-bold', styles.progressPercent]">{{ progress }}%</span>
      </div>
      <div :class="['h-1.5 w-full rounded-full overflow-hidden', styles.progressTrack]">
        <div
          class="h-full bg-gradient-to-r from-emerald-500 to-lime-500 rounded-full transition-all duration-500"
          :style="{ width: `${Math.min(100, Math.max(0, progress))}%` }"
        ></div>
      </div>
    </div>

    <div
      v-else-if="subtext || $slots.subtext"
      :class="['relative z-10 text-xs font-semibold mt-2 flex items-center gap-1.5', styles.subtext]"
    >
      <span v-if="pulseDot" :class="['w-2 h-2 rounded-full shrink-0', styles.dot]"></span>
      <slot name="subtext">
        <span>{{ subtext }}</span>
      </slot>
    </div>
  </div>
</template>

<script lang="ts">
export type StatCardVariant =
  | 'dark'
  | 'emerald'
  | 'lime'
  | 'amber'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'teal'
  | 'rose'
  | 'slate'
</script>

<script setup lang="ts">
import { computed, type Component } from 'vue'

interface VariantStyleConfig {
  card: string
  label: string
  iconBox: string
  value: string
  subtext: string
  dot: string
  progressText: string
  progressPercent: string
  progressTrack: string
}

const VARIANT_STYLES: Record<StatCardVariant, VariantStyleConfig> = {
  dark: {
    card: 'bg-gradient-to-br from-slate-950 via-slate-900 to-[#0b1322] text-white border border-slate-800 shadow-xl shadow-slate-950/20 hover:shadow-2xl',
    label: 'text-slate-400',
    iconBox: 'bg-gradient-to-tr from-emerald-500 to-lime-400 p-[1.5px] shadow-lg shadow-emerald-500/25',
    value: 'text-white',
    subtext: 'text-emerald-400',
    dot: 'bg-emerald-400 animate-pulse',
    progressText: 'text-slate-400',
    progressPercent: 'text-emerald-400',
    progressTrack: 'bg-slate-800',
  },
  emerald: {
    card: 'bg-gradient-to-br from-emerald-50/70 via-white to-white border-2 border-emerald-500/30 shadow-lg shadow-emerald-500/10 hover:border-emerald-500/50 hover:shadow-xl',
    label: 'text-emerald-900',
    iconBox: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30',
    value: 'text-slate-900',
    subtext: 'text-emerald-700',
    dot: 'bg-emerald-500 animate-pulse',
    progressText: 'text-slate-500',
    progressPercent: 'text-emerald-700',
    progressTrack: 'bg-emerald-100',
  },
  lime: {
    card: 'bg-gradient-to-br from-lime-50/70 via-white to-white border-2 border-lime-500/30 shadow-lg shadow-lime-500/10 hover:border-lime-500/50 hover:shadow-xl',
    label: 'text-lime-950',
    iconBox: 'bg-gradient-to-tr from-lime-500 to-emerald-500 text-slate-950 shadow-md shadow-lime-500/30 font-bold',
    value: 'text-emerald-800',
    subtext: 'text-emerald-700',
    dot: 'bg-lime-500 animate-pulse',
    progressText: 'text-slate-500',
    progressPercent: 'text-lime-800',
    progressTrack: 'bg-lime-100',
  },
  amber: {
    card: 'bg-gradient-to-br from-amber-50/80 via-white to-white border-2 border-amber-500/30 shadow-lg shadow-amber-500/10 hover:border-amber-500/50 hover:shadow-xl',
    label: 'text-amber-950',
    iconBox: 'bg-amber-500 text-white shadow-md shadow-amber-500/30',
    value: 'text-amber-700',
    subtext: 'text-amber-800',
    dot: 'bg-amber-500 animate-ping',
    progressText: 'text-slate-500',
    progressPercent: 'text-amber-700',
    progressTrack: 'bg-amber-100',
  },
  blue: {
    card: 'bg-gradient-to-br from-blue-50/80 via-white to-white border-2 border-blue-500/30 shadow-lg shadow-blue-500/10 hover:border-blue-500/50 hover:shadow-xl',
    label: 'text-blue-950',
    iconBox: 'bg-blue-600 text-white shadow-md shadow-blue-600/30',
    value: 'text-blue-900',
    subtext: 'text-blue-700',
    dot: 'bg-blue-500 animate-pulse',
    progressText: 'text-slate-500',
    progressPercent: 'text-blue-700',
    progressTrack: 'bg-blue-100',
  },
  indigo: {
    card: 'bg-gradient-to-br from-indigo-50/80 via-white to-white border-2 border-indigo-500/30 shadow-lg shadow-indigo-500/10 hover:border-indigo-500/50 hover:shadow-xl',
    label: 'text-indigo-950',
    iconBox: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30',
    value: 'text-indigo-900',
    subtext: 'text-indigo-700',
    dot: 'bg-indigo-500 animate-pulse',
    progressText: 'text-slate-500',
    progressPercent: 'text-indigo-700',
    progressTrack: 'bg-indigo-100',
  },
  purple: {
    card: 'bg-gradient-to-br from-purple-50/80 via-white to-white border-2 border-purple-500/30 shadow-lg shadow-purple-500/10 hover:border-purple-500/50 hover:shadow-xl',
    label: 'text-purple-950',
    iconBox: 'bg-purple-600 text-white shadow-md shadow-purple-600/30',
    value: 'text-purple-900',
    subtext: 'text-purple-700',
    dot: 'bg-purple-500 animate-pulse',
    progressText: 'text-slate-500',
    progressPercent: 'text-purple-700',
    progressTrack: 'bg-purple-100',
  },
  teal: {
    card: 'bg-gradient-to-br from-teal-50/80 via-white to-white border-2 border-teal-500/30 shadow-lg shadow-teal-500/10 hover:border-teal-500/50 hover:shadow-xl',
    label: 'text-teal-950',
    iconBox: 'bg-teal-600 text-white shadow-md shadow-teal-600/30',
    value: 'text-teal-900',
    subtext: 'text-teal-700',
    dot: 'bg-teal-500 animate-pulse',
    progressText: 'text-slate-500',
    progressPercent: 'text-teal-700',
    progressTrack: 'bg-teal-100',
  },
  rose: {
    card: 'bg-gradient-to-br from-rose-50/80 via-white to-white border-2 border-rose-500/30 shadow-lg shadow-rose-500/10 hover:border-rose-500/50 hover:shadow-xl',
    label: 'text-rose-950',
    iconBox: 'bg-rose-600 text-white shadow-md shadow-rose-600/30',
    value: 'text-rose-700',
    subtext: 'text-rose-700',
    dot: 'bg-rose-500 animate-ping',
    progressText: 'text-slate-500',
    progressPercent: 'text-rose-700',
    progressTrack: 'bg-rose-100',
  },
  slate: {
    card: 'bg-gradient-to-br from-slate-100/80 via-white to-white border-2 border-slate-300/70 shadow-lg shadow-slate-300/20 hover:border-slate-400/70 hover:shadow-xl',
    label: 'text-slate-700',
    iconBox: 'bg-slate-800 text-white shadow-md shadow-slate-800/25',
    value: 'text-slate-900',
    subtext: 'text-slate-600',
    dot: 'bg-slate-500 animate-pulse',
    progressText: 'text-slate-500',
    progressPercent: 'text-slate-700',
    progressTrack: 'bg-slate-200',
  },
}

const props = defineProps<{
  label: string
  value: string | number
  subtext?: string
  icon?: Component
  variant?: StatCardVariant
  pulseDot?: boolean
  progress?: number
  progressLabel?: string
  iconBgClass?: string
  valueClass?: string
}>()

const resolvedVariant = computed<StatCardVariant>(() => {
  if (props.variant) return props.variant
  const cls = (props.iconBgClass || '').toLowerCase()
  if (cls.includes('rose') || cls.includes('red')) return 'rose'
  if (cls.includes('amber') || cls.includes('yellow') || cls.includes('orange')) return 'amber'
  if (cls.includes('lime')) return 'lime'
  if (cls.includes('emerald') || cls.includes('green')) return 'emerald'
  if (cls.includes('blue') || cls.includes('sky')) return 'blue'
  if (cls.includes('indigo')) return 'indigo'
  if (cls.includes('purple') || cls.includes('violet')) return 'purple'
  if (cls.includes('teal') || cls.includes('cyan')) return 'teal'
  if (cls.includes('slate') || cls.includes('gray')) return 'slate'
  return 'emerald'
})

const styles = computed(() => VARIANT_STYLES[resolvedVariant.value])
</script>
