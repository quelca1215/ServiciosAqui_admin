<template>
  <div class="space-y-6">
    <div>
      <h2 class="text-2xl font-black text-slate-900 tracking-tight">Configuración del Sistema</h2>
      <p class="text-slate-500 text-sm mt-0.5">
        Parámetros globales de la plataforma, comisiones de pasarela bancaria y políticas de seguridad.
      </p>
    </div>

    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 max-w-3xl space-y-6">
      <!-- Sección Comisiones -->
      <div>
        <h3 class="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider mb-3">Políticas de Cobro Escrow</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Comisión Base de Plataforma (%)</label>
            <input type="number" value="5.0" step="0.1" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 font-mono" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-slate-600 mb-1">Días de Custodia tras Entrega</label>
            <input type="number" value="3" class="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm bg-slate-50 font-mono" />
          </div>
        </div>
      </div>

      <div class="h-px bg-slate-100"></div>

      <!-- Sección Seguridad -->
      <div>
        <h3 class="text-sm font-bold text-slate-900 uppercase font-mono tracking-wider mb-3">Seguridad y Acceso</h3>
        <div class="space-y-3">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked class="w-4 h-4 rounded text-emerald-600 accent-emerald-600" />
            <span class="text-xs text-slate-700 font-medium">Exigir Autenticación de Dos Factores (2FA) a todos los administradores</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked class="w-4 h-4 rounded text-emerald-600 accent-emerald-600" />
            <span class="text-xs text-slate-700 font-medium">Notificar inicios de sesión desde nuevas direcciones IP</span>
          </label>
        </div>
      </div>

      <div class="pt-4 flex justify-end">
        <button class="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer">
          Guardar Cambios
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

