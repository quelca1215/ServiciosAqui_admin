<template>
  <div class="space-y-6">
    <PageHeader
      tag="Operaciones · Solicitudes"
      title="Solicitudes de Servicio"
      description="Supervisión en tiempo real de solicitudes emitidas por clientes, presupuestos y servicios asignados."
    >
      <template #actions>
        <button
          type="button"
          :disabled="isLoading"
          @click="cargarSolicitudes"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-500/40 hover:text-emerald-800 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs"
        >
          <RefreshCw :class="['w-3.5 h-3.5', { 'animate-spin': isLoading }]" />
          <span>{{ isLoading ? 'Actualizando...' : 'Actualizar' }}</span>
        </button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Solicitudes"
        :value="displayMetric(solicitudes.length)"
        subtext="Registros en consulta actual"
        :icon="ClipboardList"
        variant="dark"
        :pulse-dot="true"
      />

      <StatCard
        label="Con Servicio Asignado"
        :value="displayMetric(conServicioCount)"
        subtext="Proveedor asignado al trabajo"
        :icon="Briefcase"
        variant="blue"
      />

      <StatCard
        label="Presupuesto Total"
        :value="isLoading && !hasLoaded ? '...' : formatBs(presupuestoTotal)"
        subtext="Suma estimada en consulta"
        :icon="Coins"
        variant="emerald"
      />

      <StatCard
        label="Sin Asignar / Pendientes"
        :value="displayMetric(sinAsignarCount)"
        subtext="En espera de asignación"
        :icon="Clock"
        variant="amber"
        :pulse-dot="sinAsignarCount > 0"
      />
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
            Error al consultar solicitudes
          </p>
          <p class="text-sm font-medium text-rose-900">{{ errorMessage }}</p>
        </div>
      </div>

      <button
        type="button"
        :disabled="isLoading"
        @click="cargarSolicitudes"
        class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer shrink-0 self-start sm:self-auto disabled:opacity-60"
      >
        Reintentar
      </button>
    </div>

    <div class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md shadow-slate-200/50 p-5 space-y-4">
      <div class="relative group">
        <span
          class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors"
        >
          <Search class="w-4 h-4" />
        </span>
        <input
          v-model="filters.buscar"
          type="text"
          placeholder="Buscar por título, descripción, cliente, proveedor o dirección..."
          @keyup.enter="ejecutarBusquedaInmediata"
          class="w-full pl-11 pr-9 py-2.5 rounded-2xl border-2 border-slate-200 bg-slate-50/70 text-slate-900 text-xs sm:text-sm placeholder-slate-400 hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15 focus:border-emerald-500 transition duration-150"
        />
        <button
          v-if="filters.buscar"
          type="button"
          @click="limpiarBusqueda"
          class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
        <div>
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-1">
            Estado de la Solicitud
          </label>
          <select
            v-model="filters.estado"
            @change="onEstadoFilterChange"
            class="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition"
          >
            <option value="todos">Todos los Estados</option>
            <option v-for="est in estadosDisponibles" :key="est" :value="est">
              {{ est }}
            </option>
          </select>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-2">
          <span class="text-[11px] font-mono text-slate-500">
            Mostrando <strong class="text-slate-900">{{ filteredSolicitudes.length }}</strong> de {{ solicitudes.length }}
          </span>
          <button
            v-if="hasActiveFilters"
            type="button"
            @click="resetFilters"
            class="px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition cursor-pointer inline-flex items-center gap-1"
          >
            <X class="w-3.5 h-3.5" />
            <span>Limpiar</span>
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="isLoading && !hasLoaded"
      class="bg-white rounded-3xl border-2 border-slate-200/90 p-12 text-center shadow-sm"
    >
      <RefreshCw class="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
      <p class="text-sm font-bold text-slate-800">Cargando solicitudes...</p>
      <p class="text-xs text-slate-500 mt-1">Consultando registros de solicitudes en plataforma.</p>
    </div>

    <div
      v-else
      class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md shadow-slate-200/40 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <th class="py-3.5 px-4 font-bold">Solicitud</th>
              <th class="py-3.5 px-4 font-bold">Cliente</th>
              <th class="py-3.5 px-4 font-bold">Proveedor Asignado</th>
              <th class="py-3.5 px-4 font-bold">Presupuesto / Servicio</th>
              <th class="py-3.5 px-4 font-bold">Creación</th>
              <th class="py-3.5 px-4 font-bold">Estado</th>
              <th class="py-3.5 px-4 font-bold text-right">Detalle</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="item in filteredSolicitudes"
              :key="item.idSolicitudServicio"
              class="hover:bg-slate-50/80 transition"
            >
              <td class="py-3.5 px-4 max-w-[260px]">
                <p class="font-bold text-slate-900 truncate">{{ item.titulo || 'Sin título' }}</p>
                <p class="text-[11px] text-slate-500 truncate">
                  {{ item.direccion || 'Sin dirección especificada' }}
                </p>
              </td>
              <td class="py-3.5 px-4 font-semibold text-slate-800">
                {{ item.nombreCliente || 'Cliente' }}
              </td>
              <td class="py-3.5 px-4">
                <div v-if="item.nombreProveedor" class="space-y-0.5">
                  <p class="font-semibold text-slate-800">{{ item.nombreProveedor }}</p>
                  <p v-if="item.estadoServicio" class="text-[10px] font-mono text-blue-700">
                    Servicio: {{ item.estadoServicio }}
                  </p>
                </div>
                <span v-else class="text-[11px] font-mono text-slate-400">Sin asignar</span>
              </td>
              <td class="py-3.5 px-4 font-mono">
                <p class="font-bold text-slate-900">
                  {{ item.presupuesto !== null ? formatBs(item.presupuesto) : 'Por cotizar' }}
                </p>
                <p v-if="item.montoServicio !== null" class="text-[10px] text-emerald-700">
                  Acordado: {{ formatBs(item.montoServicio) }}
                </p>
              </td>
              <td class="py-3.5 px-4 font-mono text-slate-500">
                {{ formatFecha(item.fechaCreacion) }}
              </td>
              <td class="py-3.5 px-4">
                <StatusBadge :status="item.estado || 'Sin estado'" />
              </td>
              <td class="py-3.5 px-4 text-right">
                <button
                  type="button"
                  @click="selectedSolicitud = item"
                  class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:text-emerald-800 font-bold text-[11px] transition cursor-pointer"
                >
                  <Eye class="w-3.5 h-3.5" />
                  <span>Ver detalle</span>
                </button>
              </td>
            </tr>

            <tr v-if="filteredSolicitudes.length === 0">
              <td colspan="7" class="py-12 text-center text-slate-500 text-xs">
                <ClipboardList class="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p class="font-bold text-slate-700">No se encontraron solicitudes registradas</p>
                <button
                  v-if="hasActiveFilters"
                  type="button"
                  @click="resetFilters"
                  class="mt-2 font-bold text-emerald-700 hover:underline cursor-pointer"
                >
                  Limpiar filtros
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        class="px-5 py-3.5 bg-slate-50/80 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
      >
        <span class="font-mono text-slate-500">
          Página <strong class="text-slate-800">{{ paginaActual }}</strong> ·
          Mostrando <strong class="text-slate-800">{{ solicitudes.length }}</strong> registros
        </span>

        <div class="flex items-center gap-2">
          <button
            type="button"
            :disabled="isLoading || pagination.omitir === 0"
            @click="paginaAnterior"
            class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>
          <button
            type="button"
            :disabled="isLoading || solicitudes.length < pagination.limite"
            @click="paginaSiguiente"
            class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>

    <DetailDrawer
      :is-open="Boolean(selectedSolicitud)"
      :title="selectedSolicitud?.titulo || 'Detalle de Solicitud'"
      tag="Operaciones · Solicitud de Servicio"
      @close="selectedSolicitud = null"
    >
      <template v-if="selectedSolicitud">
        <div class="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0e1726] text-white space-y-3">
          <div class="flex items-center justify-between gap-3">
            <span class="text-xs font-semibold text-slate-300">Resumen del pedido</span>
            <StatusBadge :status="selectedSolicitud.estado || 'Sin estado'" />
          </div>
          <p class="text-sm leading-relaxed text-slate-200">
            {{ selectedSolicitud.descripcion || 'Sin descripción registrada.' }}
          </p>
          <div class="pt-3 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <span class="text-slate-400 block text-[10px]">Presupuesto Estimado</span>
              <span class="text-emerald-400 font-black">
                {{ selectedSolicitud.presupuesto !== null ? formatBs(selectedSolicitud.presupuesto) : 'Por definir' }}
              </span>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">Fecha de Creación</span>
              <span class="text-white font-bold">{{ formatFecha(selectedSolicitud.fechaCreacion) }}</span>
            </div>
          </div>
        </div>

        <div class="p-4 rounded-2xl border-2 border-slate-200/80 bg-slate-50/50 space-y-2.5 text-xs">
          <h5 class="font-mono font-bold uppercase text-[11px] text-slate-700">Ubicación y Cliente</h5>
          <p class="text-slate-700 flex items-start gap-2">
            <MapPin class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{{ selectedSolicitud.direccion || 'Sin dirección especificada' }}</span>
          </p>
          <div class="pt-2 border-t border-slate-200/70 text-xs">
            <span class="text-slate-500">Solicitado por: </span>
            <strong class="text-slate-900">{{ selectedSolicitud.nombreCliente || '—' }}</strong>
          </div>
        </div>

        <div class="p-4 rounded-2xl border-2 border-slate-200/80 bg-white space-y-2.5 text-xs">
          <h5 class="font-mono font-bold uppercase text-[11px] text-slate-700">Servicio Asignado</h5>
          <div v-if="selectedSolicitud.idServicioAsignado" class="space-y-2 text-xs">
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Estado Servicio:</span>
              <StatusBadge :status="selectedSolicitud.estadoServicio || 'Asignado'" />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Proveedor:</span>
              <span class="font-bold text-slate-900">{{ selectedSolicitud.nombreProveedor || '—' }}</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-slate-500">Monto Servicio:</span>
              <span class="font-mono font-bold text-emerald-700">
                {{ selectedSolicitud.montoServicio !== null ? formatBs(selectedSolicitud.montoServicio) : '—' }}
              </span>
            </div>
          </div>
          <p v-else class="text-xs text-slate-500 italic">
            Esta solicitud aún no cuenta con un servicio asignado.
          </p>
        </div>

        <details class="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs">
          <summary class="font-semibold text-slate-600 cursor-pointer select-none">
            Información técnica de soporte
          </summary>
          <div class="mt-3 space-y-2 text-[11px] font-mono text-slate-500">
            <div class="flex items-center justify-between gap-2">
              <span class="truncate">Solicitud: {{ selectedSolicitud.idSolicitudServicio }}</span>
              <button
                type="button"
                @click="copiarId(selectedSolicitud.idSolicitudServicio, 'Referencia de solicitud')"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <Copy class="w-3 h-3" />
                <span>Copiar</span>
              </button>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="truncate">Cliente: {{ selectedSolicitud.idPerfilCliente }}</span>
              <button
                type="button"
                @click="copiarId(selectedSolicitud.idPerfilCliente, 'Referencia de cliente')"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <Copy class="w-3 h-3" />
                <span>Copiar</span>
              </button>
            </div>
            <div v-if="selectedSolicitud.idServicioAsignado" class="flex items-center justify-between gap-2">
              <span class="truncate">Servicio: {{ selectedSolicitud.idServicioAsignado }}</span>
              <button
                type="button"
                @click="copiarId(selectedSolicitud.idServicioAsignado, 'Referencia de servicio')"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <Copy class="w-3 h-3" />
                <span>Copiar</span>
              </button>
            </div>
          </div>
        </details>
      </template>

      <template #footer>
        <button
          type="button"
          @click="selectedSolicitud = null"
          class="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          Cerrar
        </button>
      </template>
    </DetailDrawer>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import {
  ClipboardList,
  Briefcase,
  Coins,
  Clock,
  RefreshCw,
  AlertCircle,
  Search,
  X,
  Eye,
  MapPin,
  Copy,
} from 'lucide-vue-next'
import {
  PageHeader,
  StatCard,
  StatusBadge,
  DetailDrawer,
} from '@/components/common'
import { adminService, type SolicitudAdministracionDto } from '@/api'
import { copyToClipboard, formatBs, formatFecha } from '@/utils/format'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const solicitudes = ref<SolicitudAdministracionDto[]>([])
const isLoading = ref(false)
const hasLoaded = ref(false)
const errorMessage = ref<string | null>(null)
const selectedSolicitud = ref<SolicitudAdministracionDto | null>(null)
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null

const pagination = reactive({
  omitir: 0,
  limite: 50,
})

const filters = reactive({
  buscar: '',
  estado: 'todos',
})

const paginaActual = computed(() => Math.floor(pagination.omitir / pagination.limite) + 1)

const conServicioCount = computed(
  () => solicitudes.value.filter((s) => Boolean(s.idServicioAsignado)).length
)

const sinAsignarCount = computed(
  () => solicitudes.value.filter((s) => !s.idServicioAsignado).length
)

const presupuestoTotal = computed(() =>
  solicitudes.value.reduce((acc, s) => acc + Number(s.presupuesto ?? s.montoServicio ?? 0), 0)
)

const estadosDisponibles = computed(() => {
  const base = ['Pendiente', 'Publicada', 'Asignada', 'EnProceso', 'Finalizada', 'Cancelada']
  const set = new Set<string>(base)
  for (const s of solicitudes.value) {
    if (s.estado?.trim()) set.add(s.estado.trim())
  }
  return Array.from(set)
})

const hasActiveFilters = computed(
  () => filters.buscar.trim() !== '' || filters.estado !== 'todos'
)

const filteredSolicitudes = computed(() => {
  const q = filters.buscar.trim().toLowerCase()
  return solicitudes.value.filter((s) => {
    if (filters.estado !== 'todos' && s.estado.toLowerCase() !== filters.estado.toLowerCase()) {
      return false
    }
    if (q) {
      const match =
        s.titulo.toLowerCase().includes(q) ||
        s.descripcion.toLowerCase().includes(q) ||
        s.nombreCliente.toLowerCase().includes(q) ||
        (s.nombreProveedor || '').toLowerCase().includes(q) ||
        s.direccion.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

function displayMetric(value: number): number | string {
  return isLoading.value && !hasLoaded.value ? '...' : value
}

async function copiarId(val: string, label: string) {
  const ok = await copyToClipboard(val)
  if (ok) toast.success(`${label} copiada.`)
  else toast.error('No se pudo copiar al portapapeles.')
}

async function cargarSolicitudes() {
  if (isLoading.value) return
  isLoading.value = true
  errorMessage.value = null

  try {
    solicitudes.value = await adminService.obtenerSolicitudes({
      omitir: pagination.omitir,
      limite: pagination.limite,
      estado: filters.estado !== 'todos' ? filters.estado : undefined,
      buscar: filters.buscar.trim() || undefined,
    })
    hasLoaded.value = true
  } catch (err: any) {
    errorMessage.value =
      err?.message || 'No se pudieron obtener las solicitudes administrativas.'
  } finally {
    isLoading.value = false
  }
}

watch(
  () => filters.buscar,
  () => {
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
    searchDebounceTimer = setTimeout(() => {
      pagination.omitir = 0
      cargarSolicitudes()
    }, 350)
  }
)

function ejecutarBusquedaInmediata() {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  pagination.omitir = 0
  cargarSolicitudes()
}

function onEstadoFilterChange() {
  pagination.omitir = 0
  cargarSolicitudes()
}

function limpiarBusqueda() {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  filters.buscar = ''
  pagination.omitir = 0
  cargarSolicitudes()
}

function resetFilters() {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  filters.buscar = ''
  filters.estado = 'todos'
  pagination.omitir = 0
  cargarSolicitudes()
}

function paginaAnterior() {
  if (pagination.omitir === 0) return
  pagination.omitir = Math.max(0, pagination.omitir - pagination.limite)
  cargarSolicitudes()
}

function paginaSiguiente() {
  if (solicitudes.value.length < pagination.limite) return
  pagination.omitir += pagination.limite
  cargarSolicitudes()
}

onBeforeUnmount(() => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
})

onMounted(() => {
  cargarSolicitudes()
})
</script>
