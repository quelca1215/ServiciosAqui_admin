<template>
  <div class="space-y-6">
    <PageHeader
      tag="Finanzas · Retiros"
      title="Retiros y Desembolsos"
      description="Administración de solicitudes de retiro de proveedores, procesamiento de transferencias y rechazos."
    >
      <template #actions>
        <button
          type="button"
          :disabled="isLoading"
          @click="cargarRetiros"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-500/40 hover:text-emerald-800 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs"
        >
          <RefreshCw :class="['w-3.5 h-3.5', { 'animate-spin': isLoading }]" />
          <span>{{ isLoading ? 'Actualizando...' : 'Actualizar' }}</span>
        </button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Retiros"
        :value="displayMetric(retiros.length)"
        :subtext="activeTab === 'pendientes' ? 'Por desembolsar' : 'Registros en historial'"
        :icon="Wallet"
        variant="dark"
        :pulse-dot="true"
      />

      <StatCard
        label="Monto Total (Bs.)"
        :value="isLoading && !hasLoaded ? '...' : formatBs(montoTotal)"
        subtext="Volumen de retiros"
        :icon="Banknote"
        variant="emerald"
      />

      <StatCard
        label="Pendientes"
        :value="displayMetric(pendientesCount)"
        subtext="Desembolsos por procesar"
        :icon="Clock"
        variant="amber"
        :pulse-dot="pendientesCount > 0"
      />

      <StatCard
        label="Completados"
        :value="displayMetric(completadosCount)"
        subtext="Transferencias ejecutadas"
        :icon="CheckCircle2"
        variant="blue"
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
        @click="cargarRetiros"
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
          Mostrando <strong class="text-slate-900">{{ filteredRetiros.length }}</strong> de {{ retiros.length }}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div :class="activeTab === 'todos' ? 'sm:col-span-2 relative' : 'sm:col-span-3 relative'">
          <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            v-model="filters.buscar"
            type="text"
            placeholder="Buscar por proveedor, banco destino o número de transacción..."
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
            Estado
          </label>
          <select
            v-model="filters.estado"
            @change="cargarRetiros"
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
      <p class="text-sm font-bold text-slate-800">Cargando retiros...</p>
    </div>

    <div
      v-else
      class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md shadow-slate-200/40 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <th class="py-3.5 px-4 font-bold">Proveedor</th>
              <th class="py-3.5 px-4 font-bold">Banco / Cuenta Destino</th>
              <th class="py-3.5 px-4 font-bold">Nro. Transacción</th>
              <th class="py-3.5 px-4 font-bold">Monto</th>
              <th class="py-3.5 px-4 font-bold">Solicitud / Proceso</th>
              <th class="py-3.5 px-4 font-bold">Estado</th>
              <th class="py-3.5 px-4 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="retiro in filteredRetiros" :key="retiro.idRetiro" class="hover:bg-slate-50/80 transition">
              <td class="py-3.5 px-4 font-bold text-slate-900">
                {{ retiro.nombreProveedor || 'Proveedor' }}
              </td>
              <td class="py-3.5 px-4">
                <p class="font-semibold text-slate-900">{{ retiro.bancoDestino || '—' }}</p>
                <p class="text-[11px] font-mono text-slate-500" title="Cuenta enmascarada por seguridad">
                  {{ maskAccountNumber(retiro.nroCuentaDestino) }}
                </p>
              </td>
              <td class="py-3.5 px-4 font-mono text-slate-700">
                {{ retiro.nroTransaccion || '—' }}
              </td>
              <td class="py-3.5 px-4 font-mono font-black text-slate-900">
                {{ formatBs(retiro.monto) }}
              </td>
              <td class="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                <p>Sol: {{ formatFecha(retiro.fechaCreacion) }}</p>
                <p v-if="retiro.fechaRetiro" class="text-emerald-700">
                  Proc: {{ formatFecha(retiro.fechaRetiro) }}
                </p>
              </td>
              <td class="py-3.5 px-4">
                <StatusBadge :status="retiro.estado || 'Sin estado'" />
              </td>
              <td class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <template v-if="puedeEditar && isPendiente(retiro.estado)">
                    <button
                      type="button"
                      :disabled="processingRetiroId === retiro.idRetiro"
                      @click="abrirModalCompletar(retiro)"
                      class="px-2.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] transition cursor-pointer disabled:opacity-50"
                    >
                      Completar
                    </button>
                    <button
                      type="button"
                      :disabled="processingRetiroId === retiro.idRetiro"
                      @click="solicitarRechazo(retiro)"
                      class="px-2.5 py-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] transition cursor-pointer disabled:opacity-50"
                    >
                      Rechazar
                    </button>
                  </template>
                  <span v-else class="text-[11px] font-mono text-slate-400">
                    {{ isPendiente(retiro.estado) ? 'Solo lectura' : 'Procesado' }}
                  </span>
                </div>
              </td>
            </tr>

            <tr v-if="filteredRetiros.length === 0">
              <td colspan="7" class="py-12 text-center text-slate-500 text-xs">
                <Wallet class="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p class="font-bold text-slate-700">
                  {{
                    activeTab === 'pendientes'
                      ? 'No hay retiros pendientes por desembolsar'
                      : 'No hay retiros registrados para mostrar'
                  }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <transition name="modal-fade">
      <div
        v-if="completarModal.isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
        @click.self="cerrarModalCompletar"
      >
        <div class="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden text-slate-800">
          <div class="bg-gradient-to-br from-slate-950 via-slate-900 to-[#0e1726] text-white p-5 flex items-center justify-between">
            <div>
              <h3 class="text-base font-black">Completar Retiro</h3>
              <p class="text-xs text-slate-300">
                {{ completarModal.retiro?.nombreProveedor }} · {{ formatBs(completarModal.retiro?.monto || 0) }}
              </p>
            </div>
            <button
              type="button"
              :disabled="Boolean(processingRetiroId)"
              @click="cerrarModalCompletar"
              class="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer disabled:opacity-40"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <form @submit.prevent="confirmarCompletarRetiro" class="p-6 space-y-4">
            <div class="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p class="text-slate-500 font-semibold">Cuenta Destino Completa (para transferencia):</p>
              <p class="font-bold text-slate-900">
                {{ completarModal.retiro?.bancoDestino || '—' }}
              </p>
              <p class="font-mono font-bold text-emerald-800 select-all">
                {{ completarModal.retiro?.nroCuentaDestino || '—' }}
              </p>
            </div>

            <div>
              <label class="block text-[10px] font-mono font-bold uppercase text-slate-600 mb-1">
                Banco Origen
              </label>
              <input
                v-model.trim="completarForm.bancoOrigen"
                type="text"
                required
                :disabled="Boolean(processingRetiroId)"
                placeholder="Ej. Banco Unión"
                class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label class="block text-[10px] font-mono font-bold uppercase text-slate-600 mb-1">
                Número de Cuenta Origen
              </label>
              <input
                v-model.trim="completarForm.nroCuentaOrigen"
                type="text"
                required
                :disabled="Boolean(processingRetiroId)"
                placeholder="Ej. 10000012345678"
                class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div>
              <label class="block text-[10px] font-mono font-bold uppercase text-slate-600 mb-1">
                Número de Transacción / Comprobante
              </label>
              <input
                v-model.trim="completarForm.nroTransaccion"
                type="text"
                required
                :disabled="Boolean(processingRetiroId)"
                placeholder="Ej. TRX-987654"
                class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                :disabled="Boolean(processingRetiroId)"
                @click="cerrarModalCompletar"
                class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="Boolean(processingRetiroId)"
                class="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer disabled:opacity-50"
              >
                {{ processingRetiroId ? 'Procesando...' : 'Registrar Transferencia' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <ConfirmModal
      :is-open="rechazoModal.isOpen"
      :loading="Boolean(processingRetiroId)"
      title="Rechazar Solicitud de Retiro"
      :subtitle="rechazoModal.retiro?.nombreProveedor || ''"
      :message="`¿Confirmas rechazar el retiro por ${formatBs(rechazoModal.retiro?.monto || 0)} para ${rechazoModal.retiro?.nombreProveedor || 'este proveedor'}?`"
      :danger="true"
      confirm-text="Rechazar Retiro"
      @confirm="confirmarRechazoRetiro"
      @cancel="rechazoModal.isOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  Wallet,
  Banknote,
  Clock,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Search,
  X,
} from 'lucide-vue-next'
import {
  PageHeader,
  StatCard,
  StatusBadge,
  ConfirmModal,
} from '@/components/common'
import { finanzasService, type RetiroAdministracionDto } from '@/api'
import { formatBs, formatFecha, maskAccountNumber } from '@/utils/format'
import { usePermissions } from '@/composables/usePermissions'
import { useToast } from '@/composables/useToast'

const { puedeEditar } = usePermissions()
const toast = useToast()

const retiros = ref<RetiroAdministracionDto[]>([])
const isLoading = ref(false)
const hasLoaded = ref(false)
const errorMessage = ref<string | null>(null)
const processingRetiroId = ref<string | null>(null)
const activeTab = ref<'pendientes' | 'todos'>('pendientes')

const filters = reactive({
  buscar: '',
  estado: 'todos',
})

const completarModal = reactive<{
  isOpen: boolean
  retiro: RetiroAdministracionDto | null
}>({
  isOpen: false,
  retiro: null,
})

const completarForm = reactive({
  bancoOrigen: '',
  nroCuentaOrigen: '',
  nroTransaccion: '',
})

const rechazoModal = reactive<{
  isOpen: boolean
  retiro: RetiroAdministracionDto | null
}>({
  isOpen: false,
  retiro: null,
})

const montoTotal = computed(() =>
  retiros.value.reduce((acc, r) => acc + r.monto, 0)
)
const pendientesCount = computed(
  () => retiros.value.filter((r) => isPendiente(r.estado)).length
)
const completadosCount = computed(
  () => retiros.value.filter((r) => r.estado.toLowerCase().includes('complet')).length
)

const estadosDisponibles = computed(() => {
  const base = ['Pendiente', 'Completado', 'Rechazado']
  const set = new Set<string>(base)
  for (const r of retiros.value) {
    if (r.estado?.trim()) set.add(r.estado.trim())
  }
  return Array.from(set)
})

const filteredRetiros = computed(() => {
  const q = filters.buscar.trim().toLowerCase()
  return retiros.value.filter((r) => {
    if (
      activeTab.value === 'todos' &&
      filters.estado !== 'todos' &&
      r.estado.toLowerCase() !== filters.estado.toLowerCase()
    ) {
      return false
    }
    if (q) {
      const match =
        r.nombreProveedor.toLowerCase().includes(q) ||
        r.bancoDestino.toLowerCase().includes(q) ||
        r.nroCuentaDestino.toLowerCase().includes(q) ||
        r.nroTransaccion.toLowerCase().includes(q)
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

async function cargarRetiros() {
  if (isLoading.value) return
  isLoading.value = true
  errorMessage.value = null

  try {
    retiros.value =
      activeTab.value === 'pendientes'
        ? await finanzasService.obtenerRetirosPendientes()
        : await finanzasService.obtenerRetiros(
            filters.estado !== 'todos' ? filters.estado : undefined
          )
    hasLoaded.value = true
  } catch (err: any) {
    errorMessage.value = err?.message || 'No se pudieron obtener los retiros.'
  } finally {
    isLoading.value = false
  }
}

function cambiarTab(tab: 'pendientes' | 'todos') {
  if (activeTab.value === tab) return
  activeTab.value = tab
  cargarRetiros()
}

function abrirModalCompletar(retiro: RetiroAdministracionDto) {
  completarModal.retiro = retiro
  completarForm.bancoOrigen = ''
  completarForm.nroCuentaOrigen = ''
  completarForm.nroTransaccion = ''
  completarModal.isOpen = true
}

function cerrarModalCompletar() {
  if (processingRetiroId.value) return
  completarModal.isOpen = false
}

async function confirmarCompletarRetiro() {
  const retiro = completarModal.retiro
  if (!retiro || processingRetiroId.value) return

  processingRetiroId.value = retiro.idRetiro

  try {
    const actualizado = await finanzasService.completarRetiro(retiro.idRetiro, {
      bancoOrigen: completarForm.bancoOrigen || null,
      nroCuentaOrigen: completarForm.nroCuentaOrigen || null,
      nroTransaccion: completarForm.nroTransaccion || null,
    })
    completarModal.isOpen = false

    if (activeTab.value === 'pendientes') {
      retiros.value = retiros.value.filter((r) => r.idRetiro !== retiro.idRetiro)
    } else {
      const idx = retiros.value.findIndex((r) => r.idRetiro === retiro.idRetiro)
      if (idx !== -1 && actualizado.idRetiro) retiros.value[idx] = actualizado
    }
    toast.success('Retiro marcado como completado.')
  } catch (err: any) {
    toast.error(err?.message || 'No se pudo completar el retiro.')
  } finally {
    processingRetiroId.value = null
  }
}

function solicitarRechazo(retiro: RetiroAdministracionDto) {
  rechazoModal.retiro = retiro
  rechazoModal.isOpen = true
}

async function confirmarRechazoRetiro() {
  const retiro = rechazoModal.retiro
  if (!retiro) return

  processingRetiroId.value = retiro.idRetiro

  try {
    const actualizado = await finanzasService.rechazarRetiro(retiro.idRetiro)
    if (activeTab.value === 'pendientes') {
      retiros.value = retiros.value.filter((r) => r.idRetiro !== retiro.idRetiro)
    } else {
      const idx = retiros.value.findIndex((r) => r.idRetiro === retiro.idRetiro)
      if (idx !== -1 && actualizado.idRetiro) retiros.value[idx] = actualizado
    }
    rechazoModal.isOpen = false
    toast.success('Solicitud de retiro rechazada.')
  } catch (err: any) {
    toast.error(err?.message || 'No se pudo rechazar el retiro.')
  } finally {
    processingRetiroId.value = null
  }
}

onMounted(() => {
  cargarRetiros()
})
</script>
