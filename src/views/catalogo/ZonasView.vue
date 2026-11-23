<template>
  <div class="space-y-6">
    <PageHeader
      tag="Catálogo · Ubicaciones GPS"
      title="Zonas y Ubicaciones GPS"
      description="Consulta de ubicaciones georreferenciadas de clientes y proveedores registradas en plataforma."
    >
      <template #actions>
        <button
          type="button"
          :disabled="isLoading"
          @click="cargarUbicaciones"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-500/40 hover:text-emerald-800 transition cursor-pointer disabled:opacity-60 shadow-2xs"
        >
          <RefreshCw :class="['w-3.5 h-3.5', { 'animate-spin': isLoading }]" />
          <span>Actualizar</span>
        </button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Ubicaciones"
        :value="displayMetric(ubicaciones.length)"
        subtext="Puntos GPS registrados"
        :icon="MapPin"
        variant="dark"
        :pulse-dot="true"
      />

      <StatCard
        label="Activas"
        :value="displayMetric(activasCount)"
        :icon="CheckCircle2"
        variant="emerald"
        :progress="porcentajeActivas"
        progress-label="Activas:"
      />

      <StatCard
        label="Inactivas"
        :value="displayMetric(inactivasCount)"
        subtext="Puntos deshabilitados"
        :icon="MapPinOff"
        variant="amber"
        :pulse-dot="inactivasCount > 0"
      />

      <StatCard
        label="Perfiles con GPS"
        :value="displayMetric(perfilesUnicosCount)"
        subtext="Usuarios georreferenciados"
        :icon="Users"
        variant="blue"
      />
    </div>

    <div
      v-if="errorMessage"
      class="p-4 rounded-3xl bg-rose-50 border-2 border-rose-200 text-rose-900 flex items-center justify-between gap-4"
    >
      <div class="flex items-center gap-3">
        <AlertCircle class="w-5 h-5 text-rose-700 shrink-0" />
        <p class="text-sm font-medium">{{ errorMessage }}</p>
      </div>
      <button
        type="button"
        @click="cargarUbicaciones"
        class="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs cursor-pointer"
      >
        Reintentar
      </button>
    </div>

    <div class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
      <div class="sm:col-span-2 relative">
        <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-1">
          Buscar ubicación
        </label>
        <div class="relative">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            v-model="filters.buscar"
            type="text"
            placeholder="Buscar por nombre de zona o referencia..."
            class="w-full pl-10 pr-8 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
          <button
            v-if="filters.buscar"
            type="button"
            @click="filters.buscar = ''"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-1">
          Estado
        </label>
        <select
          v-model="filters.activo"
          @change="cargarUbicaciones"
          class="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-slate-800"
        >
          <option value="todos">Todas</option>
          <option value="activas">Solo Activas</option>
          <option value="inactivas">Solo Inactivas</option>
        </select>
      </div>
    </div>

    <div class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <th class="py-3.5 px-4 font-bold">Ubicación / Referencia</th>
              <th class="py-3.5 px-4 font-bold">Estado</th>
              <th class="py-3.5 px-4 font-bold text-right">Mapa</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="(ub, i) in filteredUbicaciones"
              :key="`${ub.idPerfil}-${i}`"
              class="hover:bg-slate-50/80 transition"
            >
              <td class="py-3.5 px-4">
                <p class="font-bold text-slate-900">
                  {{ ub.nombreUbicacion || 'Ubicación registrada' }}
                </p>
                <p class="text-[11px] font-mono text-slate-400 mt-0.5">
                  {{ ub.latitud.toFixed(5) }}, {{ ub.longitud.toFixed(5) }}
                </p>
              </td>
              <td class="py-3.5 px-4">
                <StatusBadge :status="ub.activo ? 'Activo' : 'Inactivo'" />
              </td>
              <td class="py-3.5 px-4 text-right">
                <a
                  :href="`https://www.google.com/maps?q=${ub.latitud},${ub.longitud}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold text-[11px] transition"
                >
                  <span>Ver en mapa</span>
                  <ExternalLink class="w-3 h-3" />
                </a>
              </td>
            </tr>

            <tr v-if="filteredUbicaciones.length === 0">
              <td colspan="3" class="py-12 text-center text-slate-500 text-xs">
                <MapPin class="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p class="font-bold text-slate-700">No se encontraron ubicaciones GPS</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  MapPin,
  CheckCircle2,
  MapPinOff,
  Users,
  RefreshCw,
  AlertCircle,
  Search,
  ExternalLink,
  X,
} from 'lucide-vue-next'
import { PageHeader, StatCard, StatusBadge } from '@/components/common'
import { parametrosService, type UbicacionPerfilDto } from '@/api'

const ubicaciones = ref<UbicacionPerfilDto[]>([])
const isLoading = ref(false)
const hasLoaded = ref(false)
const errorMessage = ref<string | null>(null)

const filters = reactive({
  buscar: '',
  activo: 'todos' as 'todos' | 'activas' | 'inactivas',
})

const activasCount = computed(() => ubicaciones.value.filter((u) => u.activo).length)
const inactivasCount = computed(() => ubicaciones.value.filter((u) => !u.activo).length)
const porcentajeActivas = computed(() => {
  if (ubicaciones.value.length === 0) return 0
  return Math.round((activasCount.value / ubicaciones.value.length) * 100)
})
const perfilesUnicosCount = computed(() => {
  const set = new Set<string>()
  for (const u of ubicaciones.value) {
    if (u.idPerfil) set.add(u.idPerfil)
  }
  return set.size
})

const filteredUbicaciones = computed(() => {
  const q = filters.buscar.trim().toLowerCase()
  if (!q) return ubicaciones.value
  return ubicaciones.value.filter((u) =>
    u.nombreUbicacion.toLowerCase().includes(q)
  )
})

function displayMetric(value: number): number | string {
  return isLoading.value && !hasLoaded.value ? '...' : value
}

async function cargarUbicaciones() {
  if (isLoading.value) return
  isLoading.value = true
  errorMessage.value = null

  try {
    const activo =
      filters.activo === 'activas'
        ? true
        : filters.activo === 'inactivas'
          ? false
          : undefined
    ubicaciones.value = await parametrosService.obtenerUbicaciones({
      activo,
    })
    hasLoaded.value = true
  } catch (err: any) {
    errorMessage.value =
      err?.message || 'No se pudieron obtener las ubicaciones GPS.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  cargarUbicaciones()
})
</script>
