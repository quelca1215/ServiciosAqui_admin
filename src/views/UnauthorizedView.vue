<template>
  <div class="py-10 sm:py-16">
    <div
      class="max-w-lg mx-auto bg-white rounded-3xl border-2 border-rose-200/80 shadow-xl shadow-slate-200/50 p-8 sm:p-10 text-center space-y-5"
    >
      <div
        class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-rose-50 text-rose-700 border border-rose-200"
      >
        <ShieldAlert class="w-3.5 h-3.5" />
        <span>Acceso Restringido</span>
      </div>

      <div
        class="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0b1322] text-rose-400 border border-slate-800 shadow-lg mx-auto flex items-center justify-center"
      >
        <Lock class="w-8 h-8 stroke-[2.1]" />
      </div>

      <div class="space-y-2">
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">
          No tienes permiso para acceder a esta sección
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Tu rol actual no cuenta con acceso autorizado para consultar este módulo.
          Si necesitas permisos adicionales, solicítalo al administrador principal.
        </p>
      </div>

      <div class="pt-2">
        <router-link
          to="/dashboard"
          class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Volver a la Consola Principal</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShieldAlert, Lock, ArrowLeft } from 'lucide-vue-next'
</script>
