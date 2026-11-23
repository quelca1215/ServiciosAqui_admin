<template>
  <div class="space-y-7">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Consola de Control General
        </h2>
        <p class="text-slate-500 text-xs sm:text-sm mt-0.5">
          Centro de Administración de Información (CAI) · Resumen operativo en tiempo real.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2.5">
        <span
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-2xs"
        >
          <span
            :class="[
              'w-2 h-2 rounded-full',
              totalPendientes > 0 ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500',
            ]"
          ></span>
          Pendientes por atender: {{ isLoading && !hasLoaded ? '...' : totalPendientes }}
        </span>

        <button
          type="button"
          :disabled="isLoading"
          @click="cargarResumen"
          class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl text-xs font-bold bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-500/40 hover:text-emerald-800 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs"
        >
          <RefreshCw :class="['w-3.5 h-3.5', { 'animate-spin': isLoading }]" />
          <span>{{ isLoading ? 'Actualizando...' : 'Actualizar' }}</span>
        </button>
      </div>
    </div>

    <div
      v-if="errorMessage"
      class="p-4 sm:p-5 rounded-3xl bg-rose-50 border-2 border-rose-200 text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 rounded-2xl bg-rose-100 text-rose-700 border border-rose-200 flex items-center justify-center shrink-0"
        >
          <AlertCircle class="w-5 h-5" />
        </div>
        <div>
          <p class="text-xs font-mono font-bold uppercase text-rose-700">
            Error al cargar resumen administrativo
          </p>
          <p class="text-sm font-medium text-rose-900">{{ errorMessage }}</p>
        </div>
      </div>

      <button
        type="button"
        :disabled="isLoading"
        @click="cargarResumen"
        class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer shrink-0 self-start sm:self-auto disabled:opacity-60"
      >
        Reintentar
      </button>
    </div>

    <section class="space-y-3">
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm sm:text-base font-black text-slate-900 tracking-tight">
            Requiere tu atención hoy
          </h3>
          <p class="text-xs text-slate-500">
            Colas operativas y financieras en espera de revisión o aprobación.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link to="/finanzas/pagos" class="block">
          <StatCard
            label="Pagos Pendientes"
            :value="displayValue(resumen.pagosPendientes)"
            subtext="Por confirmar o rechazar →"
            :icon="CreditCard"
            variant="indigo"
            :pulse-dot="resumen.pagosPendientes > 0"
          />
        </router-link>

        <router-link to="/finanzas/retiros" class="block">
          <StatCard
            label="Retiros Pendientes"
            :value="displayValue(resumen.retirosPendientes)"
            subtext="Por completar o rechazar →"
            :icon="Wallet"
            variant="purple"
            :pulse-dot="resumen.retirosPendientes > 0"
          />
        </router-link>

        <router-link to="/verificacion" class="block">
          <StatCard
            label="Verificaciones Pendientes"
            :value="displayValue(resumen.verificacionesPendientes)"
            subtext="Identidad e-KYC por auditar →"
            :icon="BadgeCheck"
            variant="lime"
            :pulse-dot="resumen.verificacionesPendientes > 0"
          />
        </router-link>

        <router-link to="/operaciones/solicitudes" class="block">
          <StatCard
            label="Solicitudes Pendientes"
            :value="displayValue(resumen.solicitudesPendientes)"
            subtext="En espera de atención →"
            :icon="ClipboardList"
            variant="amber"
            :pulse-dot="resumen.solicitudesPendientes > 0"
          />
        </router-link>
      </div>
    </section>

    <section class="space-y-3">
      <div>
        <h3 class="text-sm sm:text-base font-black text-slate-900 tracking-tight">
          Estado general de la plataforma
        </h3>
        <p class="text-xs text-slate-500">
          Comunidad registrada y servicios activos en ejecución.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <router-link to="/usuarios/clientes" class="block">
          <StatCard
            label="Clientes"
            :value="displayValue(resumen.clientes)"
            subtext="Clientes registrados →"
            :icon="Users"
            variant="dark"
            :pulse-dot="true"
          />
        </router-link>

        <router-link to="/usuarios/prestadores" class="block">
          <StatCard
            label="Proveedores"
            :value="displayValue(resumen.proveedores)"
            subtext="Prestadores registrados →"
            :icon="Briefcase"
            variant="emerald"
          />
        </router-link>

        <router-link to="/operaciones/servicios" class="block">
          <StatCard
            label="Servicios en Proceso"
            :value="displayValue(resumen.serviciosEnProceso)"
            subtext="Ejecuciones activas →"
            :icon="Wrench"
            variant="blue"
            :pulse-dot="resumen.serviciosEnProceso > 0"
          />
        </router-link>
      </div>
    </section>

    <div
      class="px-5 py-4 rounded-2xl bg-white border-2 border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
    >
      <div class="flex-1 max-w-xl space-y-1.5">
        <div class="flex items-center justify-between text-[11px] font-mono text-slate-600">
          <span>
            Distribución de comunidad:
            <strong class="text-emerald-700">{{ porcentajeClientes }}% Clientes</strong> ·
            <strong class="text-lime-700">{{ porcentajeProveedores }}% Proveedores</strong>
          </span>
        </div>
        <div class="w-full h-2 rounded-full bg-slate-100 overflow-hidden flex">
          <div
            class="h-full bg-emerald-600 transition-all duration-300"
            :style="{ width: `${porcentajeClientes}%` }"
          ></div>
          <div
            class="h-full bg-lime-500 transition-all duration-300"
            :style="{ width: `${porcentajeProveedores}%` }"
          ></div>
        </div>
      </div>

      <div class="flex items-center gap-2 text-slate-500 shrink-0">
        <span>Última actualización:</span>
        <span class="font-mono font-bold text-slate-800">
          {{ lastUpdated || 'Sin sincronizar' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  Users,
  Briefcase,
  ClipboardList,
  Wrench,
  CreditCard,
  Wallet,
  BadgeCheck,
  RefreshCw,
  AlertCircle,
} from 'lucide-vue-next'
import { StatCard } from '@/components/common'
import { adminService, type ResumenAdministrativoDto } from '@/api'

const resumen = ref<ResumenAdministrativoDto>({
  clientes: 0,
  proveedores: 0,
  solicitudesPendientes: 0,
  serviciosEnProceso: 0,
  pagosPendientes: 0,
  retirosPendientes: 0,
  verificacionesPendientes: 0,
})

const isLoading = ref(false)
const hasLoaded = ref(false)
const errorMessage = ref<string | null>(null)
const lastUpdated = ref<string | null>(null)

const totalUsuarios = computed(() => resumen.value.clientes + resumen.value.proveedores)

const totalPendientes = computed(
  () =>
    resumen.value.solicitudesPendientes +
    resumen.value.pagosPendientes +
    resumen.value.retirosPendientes +
    resumen.value.verificacionesPendientes
)

const porcentajeClientes = computed(() => {
  if (totalUsuarios.value === 0) return 0
  return Math.round((resumen.value.clientes / totalUsuarios.value) * 100)
})

const porcentajeProveedores = computed(() => {
  if (totalUsuarios.value === 0) return 0
  return Math.round((resumen.value.proveedores / totalUsuarios.value) * 100)
})

function displayValue(value: number): number | string {
  return isLoading.value && !hasLoaded.value ? '...' : value
}

async function cargarResumen() {
  if (isLoading.value) return
  isLoading.value = true
  errorMessage.value = null

  try {
    resumen.value = await adminService.obtenerResumen()
    hasLoaded.value = true
    lastUpdated.value = new Date().toLocaleTimeString('es-BO')
  } catch (err: any) {
    errorMessage.value =
      err?.message || 'No se pudo obtener el resumen administrativo.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  cargarResumen()
})
</script>
