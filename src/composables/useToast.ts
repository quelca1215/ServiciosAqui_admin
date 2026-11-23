import { readonly, ref } from 'vue'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: number
  type: ToastType
  message: string
}

const toasts = ref<ToastItem[]>([])
let nextToastId = 1

function dismiss(id: number) {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

function show(type: ToastType, message: string, duration = 4000) {
  const id = nextToastId++
  toasts.value = [...toasts.value, { id, type, message }]

  if (duration > 0) {
    setTimeout(() => {
      dismiss(id)
    }, duration)
  }
  return id
}

export const toast = {
  success: (message: string, duration = 4000) => show('success', message, duration),
  error: (message: string, duration = 5000) => show('error', message, duration),
  warning: (message: string, duration = 4500) => show('warning', message, duration),
  info: (message: string, duration = 4000) => show('info', message, duration),
  dismiss,
}

export function useToast() {
  return {
    toasts: readonly(toasts),
    dismiss,
    success: toast.success,
    error: toast.error,
    warning: toast.warning,
    info: toast.info,
  }
}

export default useToast
