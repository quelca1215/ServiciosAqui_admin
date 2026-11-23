<template>
  <div class="space-y-6">
    <PageHeader
      tag="Finanzas · Pagos"
      title="Gestión de Pagos"
      description="Control de pagos de servicios, validación de comprobantes pendientes y comisiones de uso de aplicación."
    >
      <template #actions>
        <button
          type="button"
          :disabled="isLoading"
          @click="cargarPagos"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-500/40 hover:text-emerald-800 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs"
        >
          <RefreshCw :class="['w-3.5 h-3.5', { 'animate-spin': isLoading }]" />
          <span>{{ isLoading ? 'Actualizando...' : 'Actualizar' }}</span>
        </button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Pagos"
        :value="displayMetric(pagos.length)"
        :subtext="activeTab === 'pendientes' ? 'En cola de validación' : 'Registros en historial'"
        :icon="CreditCard"
        variant="dark"
        :pulse-dot="true"
      />

      <StatCard
        label="Monto Total (Bs.)"
        :value="isLoading && !hasLoaded ? '...' : formatBs(montoTotalSum)"
        subtext="Volumen transaccionado"
        :icon="Banknote"
        variant="emerald"
      />

      <StatCard
        label="Uso de App (Bs.)"
        :value="isLoading && !hasLoaded ? '...' : formatBs(montoUsoAppSum)"
        subtext="Ingresos por plataforma"
        :icon="Coins"
        variant="lime"
      />

      <StatCard
        label="Pendientes"
        :value="displayMetric(pendientesCount)"
        subtext="Por confirmar o rechazar"
        :icon="Clock"
        variant="amber"
        :pulse-dot="pendientesCount > 0"
      />
    </div>

    <div
      v-if="errorMessage"
      class="p-4 sm:p-5 rounded-3xl bg-rose-50 border-2 border-rose-200 text-rose-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div class="flex items-center gap-3">
        <AlertCircle class="w-5 h-5 text-rose-700 shrink-0" />
        <p class="text-sm font-medium">{{ errorMessage }}</p>
      </div>
      <button
        type="button"
        @click="cargarPagos"
        class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
      >
        Reintentar
      </button>
    </div>

    <div class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md shadow-slate-200/50 p-5 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="inline-flex items-center p-1 rounded-2xl bg-slate-100 border border-slate-200 self-start">
          <button
            type="button"
            @click="cambiarTab('pendientes')"
            :class="[
              'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer',
              activeTab === 'pendientes' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900',
            ]"
          >
            <span>Pendientes</span>
            <span
              v-if="pendientesCount > 0"
              :class="[
                'px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold',
                activeTab === 'pendientes' ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 text-amber-800',
              ]"
            >
              {{ pendientesCount }}
            </span>
          </button>
          <button
            type="button"
            @click="cambiarTab('todos')"
            :class="[
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer',
              activeTab === 'todos' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900',
            ]"
          >
            Historial completo
          </button>
        </div>

        <span class="text-[11px] font-mono text-slate-500">
          Mostrando <strong class="text-slate-900">{{ filteredPagos.length }}</strong> de {{ pagos.length }}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div :class="activeTab === 'todos' ? 'sm:col-span-2 relative' : 'sm:col-span-3 relative'">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            v-model="filters.buscar"
            type="text"
            placeholder="Buscar por solicitud, cliente, proveedor o método de pago..."
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

        <div v-if="activeTab === 'todos'">
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-1">
            Filtrar por Estado
          </label>
          <select
            v-model="filters.estado"
            @change="cargarPagos"
            class="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="todos">Todos los Estados</option>
            <option v-for="est in estadosDisponibles" :key="est" :value="est">{{ est }}</option>
          </select>
        </div>
      </div>
    </div>

    <div
      v-if="isLoading && !hasLoaded"
      class="bg-white rounded-3xl border-2 border-slate-200/90 p-12 text-center shadow-sm"
    >
      <RefreshCw class="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
      <p class="text-sm font-bold text-slate-800">Cargando pagos...</p>
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
              <th class="py-3.5 px-4 font-bold">Cliente / Proveedor</th>
              <th class="py-3.5 px-4 font-bold">Servicio</th>
              <th class="py-3.5 px-4 font-bold">Uso App</th>
              <th class="py-3.5 px-4 font-bold">Total</th>
              <th class="py-3.5 px-4 font-bold">Método</th>
              <th class="py-3.5 px-4 font-bold">Fecha</th>
              <th class="py-3.5 px-4 font-bold">Estado</th>
              <th class="py-3.5 px-4 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="pago in filteredPagos" :key="pago.idPago" class="hover:bg-slate-50/80 transition">
              <td class="py-3.5 px-4 max-w-[220px]">
                <p class="font-bold text-slate-900 truncate">{{ pago.tituloSolicitud || 'Servicio' }}</p>
              </td>
              <td class="py-3.5 px-4">
                <p class="font-semibold text-slate-900">{{ pago.nombreCliente || '—' }}</p>
                <p class="text-[11px] text-slate-500">Prov: {{ pago.nombreProveedor || '—' }}</p>
              </td>
              <td class="py-3.5 px-4 font-mono text-slate-700">{{ formatBs(pago.montoServicio) }}</td>
              <td class="py-3.5 px-4 font-mono text-emerald-700 font-bold">{{ formatBs(pago.montoUsoApp) }}</td>
              <td class="py-3.5 px-4 font-mono font-black text-slate-900">{{ formatBs(pago.montoTotal) }}</td>
              <td class="py-3.5 px-4 font-mono text-slate-600">{{ pago.metodoPago || '—' }}</td>
              <td class="py-3.5 px-4 font-mono text-slate-500">{{ formatFecha(pago.fechaCreacion) }}</td>
              <td class="py-3.5 px-4">
                <StatusBadge :status="pago.estado || 'Sin estado'" />
              </td>
              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    @click="selectedPago = pago"
                    class="p-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-emerald-400 hover:text-emerald-800 transition cursor-pointer"
                    title="Ver detalle"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>
                  <template v-if="puedeEditar && isPendiente(pago.estado)">
                    <button
                      type="button"
                      :disabled="processingPagoId === pago.idPago"
                      @click="solicitarAccionPago(pago, 'confirmar')"
                      class="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition cursor-pointer disabled:opacity-50"
                    >
                      Confirmar
                    </button>
                    <button
                      type="button"
                      :disabled="processingPagoId === pago.idPago"
                      @click="solicitarAccionPago(pago, 'rechazar')"
                      class="px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] transition cursor-pointer disabled:opacity-50"
                    >
                      Rechazar
                    </button>
                  </template>
                </div>
              </td>
            </tr>

            <tr v-if="filteredPagos.length === 0">
              <td colspan="9" class="py-12 text-center text-slate-500 text-xs">
                <CreditCard class="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p class="font-bold text-slate-700">
                  {{
                    activeTab === 'pendientes'
                      ? 'No hay pagos pendientes por validar'
                      : 'No hay pagos registrados para mostrar'
                  }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <DetailDrawer
      :is-open="Boolean(selectedPago)"
      :title="selectedPago?.tituloSolicitud || 'Detalle de Pago'"
      tag="Finanzas · Pago de Servicio"
      @close="selectedPago = null"
    >
      <template v-if="selectedPago">
        <div class="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0e1726] text-white space-y-3">
          <div class="flex items-center justify-between gap-3">
            <span class="text-xs font-semibold text-slate-300">Monto de la operación</span>
            <StatusBadge :status="selectedPago.estado || 'Sin estado'" />
          </div>
          <div class="text-3xl font-black font-mono text-emerald-400">
            {{ formatBs(selectedPago.montoTotal) }}
          </div>
          <div class="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
            <div>
              <span class="text-slate-400 block text-[10px]">Monto Servicio</span>
              <span class="text-white font-bold">{{ formatBs(selectedPago.montoServicio) }}</span>
            </div>
            <div>
              <span class="text-slate-400 block text-[10px]">Uso de App</span>
              <span class="text-lime-400 font-bold">{{ formatBs(selectedPago.montoUsoApp) }}</span>
            </div>
          </div>
        </div>

        <div class="p-4 rounded-2xl border-2 border-slate-200/80 bg-slate-50/50 space-y-2.5 text-xs">
          <div class="flex justify-between">
            <span class="text-slate-500">Cliente:</span>
            <span class="font-bold text-slate-900">{{ selectedPago.nombreCliente || '—' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Proveedor:</span>
            <span class="font-bold text-slate-900">{{ selectedPago.nombreProveedor || '—' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Método de Pago:</span>
            <span class="font-mono font-bold text-slate-800">{{ selectedPago.metodoPago || '—' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-500">Fecha de Creación:</span>
            <span class="font-mono text-slate-700">{{ formatFecha(selectedPago.fechaCreacion) }}</span>
          </div>
        </div>

        <details class="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs">
          <summary class="font-semibold text-slate-600 cursor-pointer select-none">
            Información técnica de soporte
          </summary>
          <div class="mt-3 space-y-2 text-[11px] font-mono text-slate-500">
            <div class="flex items-center justify-between gap-2">
              <span class="truncate">Pago: {{ selectedPago.idPago }}</span>
              <button
                type="button"
                @click="copiarId(selectedPago.idPago, 'Referencia de pago')"
                class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <Copy class="w-3 h-3" />
                <span>Copiar</span>
              </button>
            </div>
            <div class="flex items-center justify-between gap-2">
              <span class="truncate">Servicio: {{ selectedPago.idServicioAsignado }}</span>
              <button
                type="button"
                @click="copiarId(selectedPago.idServicioAsignado, 'Referencia de servicio')"
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
        <template v-if="selectedPago && puedeEditar && isPendiente(selectedPago.estado)">
          <button
            type="button"
            :disabled="processingPagoId === selectedPago.idPago"
            @click="solicitarAccionPago(selectedPago, 'rechazar')"
            class="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 transition cursor-pointer"
          >
            Rechazar Pago
          </button>
          <button
            type="button"
            :disabled="processingPagoId === selectedPago.idPago"
            @click="solicitarAccionPago(selectedPago, 'confirmar')"
            class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition cursor-pointer"
          >
            Confirmar Pago
          </button>
        </template>
        <button
          v-else
          type="button"
          @click="selectedPago = null"
          class="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
        >
          Cerrar
        </button>
      </template>
    </DetailDrawer>

    <ConfirmModal
      :is-open="confirmModal.isOpen"
      :loading="Boolean(processingPagoId)"
      :title="confirmModal.accion === 'confirmar' ? 'Confirmar Pago' : 'Rechazar Pago'"
      :subtitle="confirmModal.pago?.tituloSolicitud || ''"
      :message="
        confirmModal.accion === 'confirmar'
          ? `¿Confirmas validar el pago de ${formatBs(confirmModal.pago?.montoTotal || 0)} realizado por ${confirmModal.pago?.nombreCliente || 'el cliente'}?`
          : `¿Confirmas rechazar el pago de ${formatBs(confirmModal.pago?.montoTotal || 0)}?`
      "
      :danger="confirmModal.accion === 'rechazar'"
      :confirm-text="confirmModal.accion === 'confirmar' ? 'Confirmar Pago' : 'Rechazar Pago'"
      @confirm="confirmarAccionPago"
      @cancel="confirmModal.isOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  CreditCard,
  Banknote,
  Coins,
  Clock,
  RefreshCw,
  AlertCircle,
  Search,
  X,
  Eye,
  Copy,
} from 'lucide-vue-next'
import {
  PageHeader,
  StatCard,
  StatusBadge,
  DetailDrawer,
  ConfirmModal,
} from '@/components/common'
import { finanzasService, type PagoAdministracionDto } from '@/api'
import { copyToClipboard, formatBs, formatFecha } from '@/utils/format'
import { usePermissions } from '@/composables/usePermissions'
import { useToast } from '@/composables/useToast'

const { puedeEditar } = usePermissions()
const toast = useToast()

const pagos = ref<PagoAdministracionDto[]>([])
const isLoading = ref(false)
const hasLoaded = ref(false)
const errorMessage = ref<string | null>(null)
const processingPagoId = ref<string | null>(null)
const activeTab = ref<'pendientes' | 'todos'>('pendientes')
const selectedPago = ref<PagoAdministracionDto | null>(null)

const filters = reactive({
  buscar: '',
  estado: 'todos',
})

const confirmModal = reactive<{
  isOpen: boolean
  pago: PagoAdministracionDto | null
  accion: 'confirmar' | 'rechazar'
}>({
  isOpen: false,
  pago: null,
  accion: 'confirmar',
})

const montoTotalSum = computed(() =>
  pagos.value.reduce((acc, p) => acc + p.montoTotal, 0)
)
const montoUsoAppSum = computed(() =>
  pagos.value.reduce((acc, p) => acc + p.montoUsoApp, 0)
)
const pendientesCount = computed(
  () => pagos.value.filter((p) => isPendiente(p.estado)).length
)

const estadosDisponibles = computed(() => {
  const base = ['Pendiente', 'Confirmado', 'Rechazado', 'Pagado']
  const set = new Set<string>(base)
  for (const p of pagos.value) {
    if (p.estado?.trim()) set.add(p.estado.trim())
  }
  return Array.from(set)
})

const filteredPagos = computed(() => {
  const q = filters.buscar.trim().toLowerCase()
  return pagos.value.filter((p) => {
    if (
      activeTab.value === 'todos' &&
      filters.estado !== 'todos' &&
      p.estado.toLowerCase() !== filters.estado.toLowerCase()
    ) {
      return false
    }
    if (q) {
      const match =
        p.tituloSolicitud.toLowerCase().includes(q) ||
        p.nombreCliente.toLowerCase().includes(q) ||
        p.nombreProveedor.toLowerCase().includes(q) ||
        p.metodoPago.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

function isPendiente(estado?: string | null): boolean {
  return (estado || '').toLowerCase().includes('pend')
}

function displayMetric(value: number): number | string {
  return isLoading.value && !hasLoaded.value ? '...' : value
}

async function copiarId(val: string, label: string) {
  const ok = await copyToClipboard(val)
  if (ok) toast.success(`${label} copiada.`)
  else toast.error('No se pudo copiar.')
}

async function cargarPagos() {
  if (isLoading.value) return
  isLoading.value = true
  errorMessage.value = null

  try {
    pagos.value =
      activeTab.value === 'pendientes'
        ? await finanzasService.obtenerPagosPendientes()
        : await finanzasService.obtenerPagos(
            filters.estado !== 'todos' ? filters.estado : undefined
          )
    hasLoaded.value = true
  } catch (err: any) {
    errorMessage.value = err?.message || 'No se pudieron obtener los pagos.'
  } finally {
    isLoading.value = false
  }
}

function cambiarTab(tab: 'pendientes' | 'todos') {
  if (activeTab.value === tab) return
  activeTab.value = tab
  cargarPagos()
}

function solicitarAccionPago(
  pago: PagoAdministracionDto,
  accion: 'confirmar' | 'rechazar'
) {
  confirmModal.pago = pago
  confirmModal.accion = accion
  confirmModal.isOpen = true
}

async function confirmarAccionPago() {
  const pago = confirmModal.pago
  if (!pago) return

  processingPagoId.value = pago.idPago

  try {
    const actualizado =
      confirmModal.accion === 'confirmar'
        ? await finanzasService.confirmarPago(pago.idPago)
        : await finanzasService.rechazarPago(pago.idPago)

    if (activeTab.value === 'pendientes') {
      pagos.value = pagos.value.filter((p) => p.idPago !== pago.idPago)
      if (selectedPago.value?.idPago === pago.idPago) selectedPago.value = null
    } else {
      const idx = pagos.value.findIndex((p) => p.idPago === pago.idPago)
      if (idx !== -1 && actualizado.idPago) {
        pagos.value[idx] = actualizado
      }
      if (selectedPago.value?.idPago === pago.idPago && actualizado.idPago) {
        selectedPago.value = actualizado
      }
    }
    confirmModal.isOpen = false
    toast.success(
      confirmModal.accion === 'confirmar'
        ? 'Pago confirmado correctamente.'
        : 'Pago rechazado correctamente.'
    )
  } catch (err: any) {
    toast.error(err?.message || 'No se pudo procesar la acción sobre el pago.')
  } finally {
    processingPagoId.value = null
  }
}

onMounted(() => {
  cargarPagos()
})
</script>
