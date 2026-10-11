<template>
  <div class="space-y-6">
    <!-- Encabezado del Módulo -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div class="flex items-center gap-2 mb-1.5">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#84cc16]/15 text-[#15803d] border border-[#84cc16]/30">
            <span class="w-1.5 h-1.5 rounded-full bg-[#16a34a] animate-pulse"></span>
            {{ moduleSection }}
          </span>
          <span class="text-xs text-slate-400 font-mono">• Módulo Autorizado</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <span>{{ moduleTitle }}</span>
        </h2>
        <p class="text-slate-500 text-xs sm:text-sm mt-0.5">
          Gestión integral de {{ moduleTitle.toLowerCase() }} para la consola administrativa de ServiciosAquí.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <router-link
          to="/dashboard"
          class="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition flex items-center gap-1.5"
        >
          <ArrowLeft class="w-3.5 h-3.5 text-slate-500" />
          <span>Volver al Dashboard</span>
        </router-link>
      </div>
    </div>

    <!-- Tarjeta Hero del Módulo -->
    <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#031d10] via-[#052e16] to-[#0b381d] text-white p-7 sm:p-9 border border-emerald-500/20 shadow-xl shadow-emerald-950/20">
      <div class="pointer-events-none absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-emerald-500/15 blur-3xl"></div>
      <div class="pointer-events-none absolute top-0 right-20 w-44 h-44 rounded-full bg-lime-400/10 blur-2xl"></div>

      <div class="relative z-10 max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-white/10 text-lime-300 border border-white/15 mb-4">
          <Sparkles class="w-3.5 h-3.5 text-lime-400" />
          <span>Módulo Conectado con la API</span>
        </div>
        <h3 class="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
          Consola Operativa: {{ moduleTitle }}
        </h3>
        <p class="text-xs sm:text-sm text-emerald-100/80 leading-relaxed mb-6">
          Este módulo está habilitado en tu perfil de operador con permisos de lectura y control administrativo según la respuesta de <code class="bg-black/30 px-1.5 py-0.5 rounded text-lime-300 font-mono text-[11px]">/api/AdminAuth/MostrarModulosPermitidos</code>.
        </p>

        <div class="flex flex-wrap items-center gap-3">
          <div class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-mono text-emerald-200">
            <ShieldCheck class="w-4 h-4 text-lime-400" />
            <span>Permiso: PuedeVer (Activo)</span>
          </div>
          <div class="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-xs font-mono text-lime-300">
            <CheckCircle2 class="w-4 h-4" />
            <span>Sincronizado con Sesión</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Indicador de Próxima Integración de Tabla -->
    <div class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md shadow-slate-200/40 p-8 text-center space-y-3">
      <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-lime-500 p-[2px] mx-auto shadow-md shadow-emerald-500/20">
        <div class="w-full h-full bg-[#052e16] rounded-[14px] flex items-center justify-center text-lime-400">
          <Layers class="w-6 h-6 stroke-[2.2]" />
        </div>
      </div>
      <h4 class="text-base font-black text-slate-800">
        Vista del Módulo {{ moduleTitle }} Lista para Integración
      </h4>
      <p class="text-xs text-slate-500 max-w-md mx-auto">
        La ruta <code class="font-mono text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-bold">{{ currentPath }}</code> ha sido vinculada correctamente en el router de navegación y en la barra lateral.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Layers 
} from 'lucide-vue-next'

const route = useRoute()

const currentPath = computed(() => route.path)

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

