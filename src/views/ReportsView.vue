<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Reportes y Analíticas de Negocio</h2>
        <p class="text-slate-500 text-sm mt-0.5">
          Métricas de volumen transaccional, rendimiento de contratos y comisiones generadas.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <select class="text-xs px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold shadow-2xs">
          <option>Últimos 30 días</option>
          <option>Este Trimestre</option>
          <option>Año 2026</option>
        </select>
        <button class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer">
          Exportar PDF
        </button>
      </div>
    </div>

    <!-- Bloques de resumen -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <span class="text-xs font-mono font-bold text-slate-400 uppercase">Volumen Bruto Gestionado</span>
        <div class="text-3xl font-black text-slate-900 mt-2 font-mono">BOB 1,489,200</div>
        <span class="text-xs text-emerald-600 font-bold mt-1 inline-block">↑ +18.4% de crecimiento</span>
      </div>
      <div class="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <span class="text-xs font-mono font-bold text-slate-400 uppercase">Comisiones Percibidas (Revenue)</span>
        <div class="text-3xl font-black text-emerald-600 mt-2 font-mono">BOB 74,460</div>
        <span class="text-xs text-slate-500 mt-1 inline-block">Tasa efectiva: 5.0%</span>
      </div>
      <div class="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <span class="text-xs font-mono font-bold text-slate-400 uppercase">Contratos Concluidos Exitosos</span>
        <div class="text-3xl font-black text-slate-900 mt-2 font-mono">1,120</div>
        <span class="text-xs text-emerald-600 font-bold mt-1 inline-block">Calificación promedio: 4.8★</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

