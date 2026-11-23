<template>
  <div
    class="fixed top-4 right-4 z-[100] flex flex-col gap-2.5 w-full max-w-sm pointer-events-none px-4 sm:px-0"
    aria-live="polite"
  >
    <transition-group name="toast-slide">
      <div
        v-for="item in toasts"
        :key="item.id"
        :class="[
          'pointer-events-auto p-3.5 rounded-2xl border-2 shadow-xl flex items-start gap-3 text-xs backdrop-blur-md',
          TOAST_STYLES[item.type].container,
        ]"
        role="alert"
      >
        <component
          :is="TOAST_STYLES[item.type].icon"
          :class="['w-4 h-4 shrink-0 mt-0.5', TOAST_STYLES[item.type].iconColor]"
        />
        <p class="flex-1 font-semibold leading-snug">{{ item.message }}</p>
        <button
          type="button"
          @click="dismiss(item.id)"
          class="text-slate-400 hover:text-slate-700 cursor-pointer shrink-0"
          aria-label="Cerrar notificación"
        >
          <X class="w-3.5 h-3.5" />
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import type { Component } from 'vue'
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useToast, type ToastType } from '@/composables/useToast'

const { toasts, dismiss } = useToast()

const TOAST_STYLES: Record<
  ToastType,
  { container: string; icon: Component; iconColor: string }
> = {
  success: {
    container: 'bg-emerald-50/95 border-emerald-300 text-emerald-950 shadow-emerald-950/10',
    icon: CheckCircle2,
    iconColor: 'text-emerald-600',
  },
  error: {
    container: 'bg-rose-50/95 border-rose-300 text-rose-950 shadow-rose-950/10',
    icon: AlertCircle,
    iconColor: 'text-rose-600',
  },
  warning: {
    container: 'bg-amber-50/95 border-amber-300 text-amber-950 shadow-amber-950/10',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
  },
  info: {
    container: 'bg-slate-900/95 border-slate-700 text-white shadow-slate-950/20',
    icon: Info,
    iconColor: 'text-emerald-400',
  },
}
</script>

<style scoped>
.toast-slide-enter-active,
.toast-slide-leave-active {
  transition: all 0.22s ease;
}
.toast-slide-enter-from,
.toast-slide-leave-to {
  opacity: 0;
  transform: translateX(24px);
}
</style>
