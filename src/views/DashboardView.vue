<template>
  <div class="space-y-6">
    <!-- Header de bienvenida -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-black text-slate-900 tracking-tight">Panel de Control General</h2>
        <p class="text-slate-500 text-sm mt-0.5">
          Resumen operativo en tiempo real de transacciones, custodia y operadores.
        </p>
      </div>

      <div class="flex items-center gap-2.5">
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Escrow Activo: BOB 84,250.00
        </span>
      </div>
    </div>

    <!-- Métricas principales -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div 
        v-for="stat in stats" 
        :key="stat.title"
        class="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition duration-200"
      >
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500">{{ stat.title }}</span>
          <div :class="['w-9 h-9 rounded-xl flex items-center justify-center text-sm', stat.iconBg]">
            <component :is="stat.icon" class="w-4 h-4" />
          </div>
        </div>
        <div class="text-2xl font-black text-slate-900 tracking-tight">{{ stat.value }}</div>
        <div class="flex items-center gap-1.5 text-xs mt-2" :class="stat.trendColor">
          <span>{{ stat.trend }}</span>
          <span class="text-slate-400 font-normal">vs. mes anterior</span>
        </div>
      </div>
    </div>

    <!-- Sección de Acciones Rápidas & Estado de la Plataforma -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Columna 1 y 2: Actividad reciente -->
      <div class="lg:col-span-2 p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-base font-bold text-slate-900">Operaciones en Custodia (Escrow) Recientes</h3>
          <router-link to="/pagos" class="text-xs font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
            Ver todas →
          </router-link>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="text-slate-400 uppercase font-mono border-b border-slate-100">
                <th class="pb-3 font-semibold">ID Contrato</th>
                <th class="pb-3 font-semibold">Servicio</th>
                <th class="pb-3 font-semibold">Monto</th>
                <th class="pb-3 font-semibold">Estado</th>
                <th class="pb-3 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 font-medium">
              <tr v-for="tx in recentTransactions" :key="tx.id" class="hover:bg-slate-50/60 transition">
                <td class="py-3 font-mono text-slate-600">{{ tx.id }}</td>
                <td class="py-3 text-slate-900">{{ tx.service }}</td>
                <td class="py-3 font-mono font-bold text-slate-900">{{ tx.amount }}</td>
                <td class="py-3">
                  <span :class="['px-2 py-0.5 rounded-md font-mono text-[10px] font-bold', tx.badgeClass]">
                    {{ tx.status }}
                  </span>
                </td>
                <td class="py-3 text-right">
                  <button class="text-emerald-600 hover:text-emerald-800 font-bold cursor-pointer">
                    Revisar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Columna 3: Verificaciones pendientes de atención -->
      <div class="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-slate-900">Validaciones KYC</h3>
            <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 font-mono">
              8 por auditar
            </span>
          </div>
          <p class="text-xs text-slate-500 mb-4">
            Operadores que han enviado documento de identidad y fotografía para aprobación manual.
          </p>

          <ul class="space-y-3">
            <li v-for="user in pendingUsers" :key="user.name" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center justify-center">
                  {{ user.name.charAt(0) }}
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-800 leading-tight">{{ user.name }}</p>
                  <p class="text-[10px] text-slate-400 font-mono">{{ user.role }}</p>
                </div>
              </div>
              <router-link to="/verificacion" class="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
                Auditar
              </router-link>
            </li>
          </ul>
        </div>

        <router-link
          to="/verificacion"
          class="mt-6 w-full py-2.5 text-center text-xs font-bold rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100/70 transition"
        >
          Ir a Bandeja de Verificación →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Users, BadgeCheck, CreditCard, ShieldCheck } from 'lucide-vue-next'

const stats = [
  {
    title: 'Total Usuarios',
    value: '1,248',
    trend: '+12.5%',
    trendColor: 'text-emerald-600 font-bold',
    icon: Users,
    iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100'
  },
  {
    title: 'KYC Aprobados',
    value: '894',
    trend: '+8.1%',
    trendColor: 'text-emerald-600 font-bold',
    icon: BadgeCheck,
    iconBg: 'bg-lime-50 text-lime-600 border border-lime-100'
  },
  {
    title: 'Fondos en Custodia',
    value: 'BOB 84.2k',
    trend: '+24.0%',
    trendColor: 'text-emerald-600 font-bold',
    icon: CreditCard,
    iconBg: 'bg-blue-50 text-blue-600 border border-blue-100'
  },
  {
    title: 'Tasa de Resolución',
    value: '99.4%',
    trend: '+0.2%',
    trendColor: 'text-emerald-600 font-bold',
    icon: ShieldCheck,
    iconBg: 'bg-purple-50 text-purple-600 border border-purple-100'
  }
]

const recentTransactions = [
  { id: '#CTR-9021', service: 'Instalación Eléctrica Trifásica', amount: 'BOB 1,200', status: 'En Custodia', badgeClass: 'bg-amber-100 text-amber-800' },
  { id: '#CTR-9020', service: 'Mantenimiento Preventivo HVAC', amount: 'BOB 850', status: 'Liberado', badgeClass: 'bg-emerald-100 text-emerald-800' },
  { id: '#CTR-9019', service: 'Pintura y Acabados Interiores', amount: 'BOB 3,400', status: 'En Disputa', badgeClass: 'bg-rose-100 text-rose-800' },
  { id: '#CTR-9018', service: 'Plomería de Emergencia', amount: 'BOB 350', status: 'Liberado', badgeClass: 'bg-emerald-100 text-emerald-800' }
]

const pendingUsers = [
  { name: 'Carlos Mamani', role: 'Proveedor • Electricista' },
  { name: 'Lucía Rojas', role: 'Proveedor • Diseñadora' },
  { name: 'Mario Vargas', role: 'Cliente Corporativo' }
]
</script>

