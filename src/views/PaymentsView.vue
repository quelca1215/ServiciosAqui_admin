<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Pagos y Fondos en Custodia (Escrow)</h2>
        <p class="text-slate-500 text-sm mt-0.5">
          Supervisión de depósitos retenidos, liberaciones autorizadas y resolución de mediación financiera.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <button class="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition cursor-pointer">
          Descargar Conciliación Bancaria (.CSV)
        </button>
      </div>
    </div>

    <!-- Tarjetas de resumen financiero -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <span class="text-xs font-bold text-slate-400 uppercase font-mono">Total en Custodia (Escrow)</span>
        <div class="text-2xl font-black text-slate-900 mt-1 font-mono">BOB 84,250.00</div>
        <p class="text-xs text-emerald-600 mt-1 font-semibold">Garantizado en cuenta fiduciaria</p>
      </div>
      <div class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <span class="text-xs font-bold text-slate-400 uppercase font-mono">Liberaciones del Mes</span>
        <div class="text-2xl font-black text-emerald-600 mt-1 font-mono">BOB 312,890.00</div>
        <p class="text-xs text-slate-400 mt-1">428 contratos completados</p>
      </div>
      <div class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <span class="text-xs font-bold text-slate-400 uppercase font-mono">Fondos en Disputa</span>
        <div class="text-2xl font-black text-rose-600 mt-1 font-mono">BOB 5,120.00</div>
        <p class="text-xs text-rose-500 mt-1 font-medium">3 contratos bajo arbitraje</p>
      </div>
    </div>

    <!-- Lista de Contratos y Fondos -->
    <div class="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6">
      <h3 class="text-base font-bold text-slate-900 mb-4">Registro Transaccional de Garantías</h3>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="text-slate-400 uppercase font-mono border-b border-slate-100">
              <th class="pb-3 font-semibold">ID Transacción</th>
              <th class="pb-3 font-semibold">Cliente</th>
              <th class="pb-3 font-semibold">Proveedor</th>
              <th class="pb-3 font-semibold">Monto Escrow</th>
              <th class="pb-3 font-semibold">Estado</th>
              <th class="pb-3 font-semibold text-right">Acción</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 font-medium">
            <tr v-for="t in escrowList" :key="t.id" class="hover:bg-slate-50/60 transition">
              <td class="py-3 font-mono font-bold text-slate-700">{{ t.id }}</td>
              <td class="py-3 text-slate-900">{{ t.client }}</td>
              <td class="py-3 text-slate-700">{{ t.provider }}</td>
              <td class="py-3 font-mono font-bold text-slate-900">{{ t.amount }}</td>
              <td class="py-3">
                <span :class="['px-2 py-0.5 rounded font-mono text-[10px] font-bold', t.statusClass]">
                  {{ t.status }}
                </span>
              </td>
              <td class="py-3 text-right">
                <button class="text-emerald-600 hover:text-emerald-800 font-bold cursor-pointer">
                  Auditar Custodia
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const escrowList = [
  { id: '#TX-88219', client: 'Constructora del Sur SRL', provider: 'Ing. Carlos Mamani', amount: 'BOB 12,500.00', status: 'Custodia Activa', statusClass: 'bg-blue-100 text-blue-800' },
  { id: '#TX-88218', client: 'Hospital Los Pinos', provider: 'ClimaTech Bolivia', amount: 'BOB 4,200.00', status: 'Custodia Activa', statusClass: 'bg-blue-100 text-blue-800' },
  { id: '#TX-88217', client: 'Roberto Arnez', provider: 'Pinturas Pro CBBA', amount: 'BOB 1,800.00', status: 'Liberado a Proveedor', statusClass: 'bg-emerald-100 text-emerald-800' },
  { id: '#TX-88216', client: 'Restaurante El Fuego', provider: 'Gas & Tuberías La Paz', amount: 'BOB 3,400.00', status: 'En Arbitraje', statusClass: 'bg-rose-100 text-rose-800' }
]
</script>

