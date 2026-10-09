<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Verificación de Identidad (e-KYC)</h2>
        <p class="text-slate-500 text-sm mt-0.5">
          Auditoría documental de cédulas de identidad, certificados y biometría para proveedores y clientes.
        </p>
      </div>

      <div class="flex items-center gap-2">
        <span class="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 text-xs font-mono font-bold">
          8 Solicitudes en Espera
        </span>
      </div>
    </div>

    <!-- Bandeja de solicitudes -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="item in kycRequests" 
        :key="item.id"
        class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between"
      >
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] font-mono text-slate-400">{{ item.id }}</span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-100 text-amber-800">
              Pendiente de Revisión
            </span>
          </div>

          <h3 class="text-base font-bold text-slate-900">{{ item.name }}</h3>
          <p class="text-xs text-slate-500 font-mono mb-3">{{ item.ci }} • {{ item.city }}</p>

          <div class="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Documento:</span>
              <span class="font-bold text-slate-800">CI Anverso y Reverso</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Foto Biometría:</span>
              <span class="font-bold text-emerald-600">Verificada por IA (98%)</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Categoría Solicitada:</span>
              <span class="font-bold text-slate-800">{{ item.category }}</span>
            </div>
          </div>
        </div>

        <div class="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
          <button class="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer">
            Aprobar
          </button>
          <button class="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs transition cursor-pointer">
            Observar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const kycRequests = [
  { id: '#KYC-1049', name: 'Carlos Mamani Choque', ci: 'CI: 6849201 LP', city: 'La Paz', category: 'Electricidad Industrial' },
  { id: '#KYC-1048', name: 'Lucía Rojas Guzmán', ci: 'CI: 5938102 SC', city: 'Santa Cruz', category: 'Diseño & Construcción' },
  { id: '#KYC-1047', name: 'Juan Manuel Torrico', ci: 'CI: 7492019 CB', city: 'Cochabamba', category: 'Plomería & Climatización' },
  { id: '#KYC-1046', name: 'Ana Patricia Velasco', ci: 'CI: 4920194 SC', city: 'Santa Cruz', category: 'Servicios Contables' },
  { id: '#KYC-1045', name: 'Esteban Quispe Ramos', ci: 'CI: 8192048 LP', city: 'El Alto', category: 'Cerrajería y Soldadura' },
  { id: '#KYC-1044', name: 'Silvia Morales Tapia', ci: 'CI: 3910294 OR', city: 'Oruro', category: 'Limpieza Corporativa' }
]
</script>

