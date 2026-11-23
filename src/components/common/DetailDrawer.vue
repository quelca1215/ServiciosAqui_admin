<template>
  <transition name="drawer-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 overflow-hidden bg-slate-950/50 backdrop-blur-xs flex justify-end"
      @click.self="emit('close')"
    >
      <transition name="drawer-slide">
        <div
          v-if="isOpen"
          class="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200"
          role="dialog"
          aria-modal="true"
        >
          <div class="p-5 sm:p-6 border-b border-slate-200/80 flex items-center justify-between gap-4 bg-slate-50/70 shrink-0">
            <div>
              <div v-if="tag" class="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700 mb-1">
                {{ tag }}
              </div>
              <h3 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight leading-snug">
                {{ title }}
              </h3>
            </div>

            <button
              type="button"
              @click="emit('close')"
              class="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition cursor-pointer shrink-0"
              aria-label="Cerrar panel"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            <slot />
          </div>

          <div v-if="$slots.footer" class="p-4 sm:p-5 border-t border-slate-200/80 bg-slate-50/70 shrink-0 flex items-center justify-end gap-2.5">
            <slot name="footer" />
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
  title: string
  tag?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.25s ease;
}
.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-slide-enter-active,
.drawer-slide-leave-active {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-slide-enter-from,
.drawer-slide-leave-to {
  transform: translateX(100%);
}
</style>

