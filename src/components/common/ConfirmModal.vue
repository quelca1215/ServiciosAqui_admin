<template>
  <transition name="modal-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/70 backdrop-blur-xs"
      @click.self="handleCancel"
    >
      <div
        class="relative w-full max-w-md bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-7 overflow-hidden text-slate-800"
        role="dialog"
        aria-modal="true"
      >
        <div class="flex items-center gap-3.5 mb-4">
          <div
            :class="[
              'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0',
              danger ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
            ]"
          >
            <component :is="icon || (danger ? AlertTriangle : CheckCircle2)" class="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 class="text-lg font-black text-slate-900 leading-snug">
              {{ title }}
            </h3>
            <p v-if="subtitle" class="text-xs text-slate-500 mt-0.5">
              {{ subtitle }}
            </p>
          </div>
        </div>

        <div class="text-xs text-slate-600 leading-relaxed mb-4">
          <slot>
            {{ message }}
          </slot>
        </div>

        <div v-if="requireReason || showReason" class="mb-5">
          <label class="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            {{ reasonLabel || 'Motivo / Justificación' }}
            <span v-if="requireReason" class="text-rose-500">*</span>
          </label>
          <textarea
            v-model="reasonText"
            :disabled="loading"
            :placeholder="reasonPlaceholder || 'Escribe el motivo de esta acción para la bitácora...'"
            rows="3"
            class="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition resize-none disabled:opacity-60"
          ></textarea>
          <p v-if="reasonError" class="text-[11px] text-rose-600 font-medium mt-1">
            {{ reasonError }}
          </p>
        </div>

        <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            :disabled="loading"
            @click="handleCancel"
            class="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ cancelText || 'Cancelar' }}
          </button>
          <button
            type="button"
            :disabled="loading"
            @click="handleConfirm"
            :class="[
              'px-5 py-2.5 rounded-xl text-xs font-bold text-white transition shadow-sm cursor-pointer flex items-center gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed',
              danger ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
            ]"
          >
            {{ loading ? 'Procesando...' : (confirmText || 'Confirmar') }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, watch, type Component } from 'vue'
import { AlertTriangle, CheckCircle2 } from 'lucide-vue-next'

const props = defineProps<{
  isOpen: boolean
  title: string
  subtitle?: string
  message?: string
  danger?: boolean
  loading?: boolean
  icon?: Component
  confirmText?: string
  cancelText?: string
  showReason?: boolean
  requireReason?: boolean
  reasonLabel?: string
  reasonPlaceholder?: string
}>()

const emit = defineEmits<{
  (e: 'confirm', reason: string): void
  (e: 'cancel'): void
}>()

const reasonText = ref('')
const reasonError = ref('')

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      reasonText.value = ''
      reasonError.value = ''
    }
  }
)

function handleConfirm() {
  if (props.loading) return
  if (props.requireReason && !reasonText.value.trim()) {
    reasonError.value = 'El motivo es obligatorio para registrar en bitácora inmutable.'
    return
  }
  emit('confirm', reasonText.value.trim())
}

function handleCancel() {
  if (props.loading) return
  emit('cancel')
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
