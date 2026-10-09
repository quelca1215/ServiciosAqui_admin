<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Categorías y Subcategorías de Servicios</h2>
        <p class="text-slate-500 text-sm mt-0.5">
          Estructura de catálogos profesionales, comisiones y requerimientos mínimos de certificación.
        </p>
      </div>

      <button class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer">
        + Nueva Categoría
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="cat in categories" 
        :key="cat.name"
        class="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-emerald-300 transition"
      >
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
            Comisión: {{ cat.fee }}
          </span>
          <span class="text-xs text-slate-400 font-mono">{{ cat.providersCount }} proveedores</span>
        </div>

        <h3 class="text-base font-bold text-slate-900">{{ cat.name }}</h3>
        <p class="text-xs text-slate-500 mt-1 mb-4">{{ cat.description }}</p>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span class="font-medium text-slate-600">Certificación: <strong class="text-slate-900">{{ cat.certRequired ? 'Obligatoria' : 'Opcional' }}</strong></span>
          <button class="text-emerald-600 hover:text-emerald-800 font-bold cursor-pointer">Editar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const categories = [
  { name: 'Instalaciones Eléctricas', fee: '5.0%', providersCount: 142, description: 'Técnicos electricistas domiciliarios e industriales.', certRequired: true },
  { name: 'Plomería & Sanitarios', fee: '5.0%', providersCount: 98, description: 'Instalación de tuberías, bombas y desagües.', certRequired: false },
  { name: 'Climatización & HVAC', fee: '6.5%', providersCount: 54, description: 'Aire acondicionado comercial y cámaras de refrigeración.', certRequired: true },
  { name: 'Construcción & Albañilería', fee: '4.5%', providersCount: 210, description: 'Obra fina, muros, techos y refacciones estructurales.', certRequired: false },
  { name: 'Cerrajería de Alta Seguridad', fee: '5.0%', providersCount: 46, description: 'Cerraduras digitales, apertura de cajas y vehículos.', certRequired: true },
  { name: 'Limpieza & Desinfección', fee: '4.0%', providersCount: 180, description: 'Limpieza de fin de obra y oficinas corporativas.', certRequired: false }
]
</script>

