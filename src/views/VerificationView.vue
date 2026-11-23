<template>
  <div class="space-y-6">
    <PageHeader
      tag="Usuarios · Auditoría e-KYC"
      title="Verificación de Identidad (e-KYC)"
      description="Auditoría de documentos de identidad y selfies para aprobar o rechazar verificaciones."
    >
      <template #actions>
        <button
          type="button"
          :disabled="isLoading"
          @click="cargarVerificaciones"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-500/40 hover:text-emerald-800 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs"
        >
          <RefreshCw :class="['w-3.5 h-3.5', { 'animate-spin': isLoading }]" />
          <span>{{ isLoading ? 'Actualizando...' : 'Actualizar' }}</span>
        </button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Solicitudes e-KYC"
        :value="displayMetric(verificaciones.length)"
        subtext="Registros en consulta actual"
        :icon="ShieldCheck"
        variant="dark"
        :pulse-dot="true"
      />

      <StatCard
        label="Pendientes"
        :value="displayMetric(pendientesCount)"
        subtext="En espera de revisión"
        :icon="Clock"
        variant="amber"
        :pulse-dot="pendientesCount > 0"
      />

      <StatCard
        label="Aprobadas"
        :value="displayMetric(aprobadasCount)"
        subtext="Documentos validados"
        :icon="BadgeCheck"
        variant="emerald"
      />

      <StatCard
        label="Rechazadas"
        :value="displayMetric(rechazadasCount)"
        subtext="Observadas por auditoría"
        :icon="XCircle"
        variant="rose"
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
            Error al consultar verificaciones
          </p>
          <p class="text-sm font-medium text-rose-900">{{ errorMessage }}</p>
        </div>
      </div>

      <button
        type="button"
        :disabled="isLoading"
        @click="cargarVerificaciones"
        class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer shrink-0 self-start sm:self-auto disabled:opacity-60"
      >
        Reintentar
      </button>
    </div>

    <div class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md shadow-slate-200/50 p-5">
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div class="sm:col-span-1">
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-1">
            Estado de Verificación
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

        <div class="sm:col-span-1">
          <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-1">
            Buscar en lista
          </label>
          <div class="relative">
            <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              v-model="filters.buscarLocal"
              type="text"
              placeholder="Nombre, correo o nro. documento..."
              class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-2">
          <span class="text-[11px] font-mono text-slate-500">
            Mostrando <strong class="text-slate-900">{{ filteredVerificaciones.length }}</strong> de {{ verificaciones.length }}
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
      <p class="text-sm font-bold text-slate-800">Cargando verificaciones e-KYC...</p>
      <p class="text-xs text-slate-500 mt-1">Consultando documentos enviados por los usuarios.</p>
    </div>

    <div
      v-else
      class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md shadow-slate-200/40 overflow-hidden"
    >
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <th class="py-3.5 px-4 font-bold">Usuario</th>
              <th class="py-3.5 px-4 font-bold">Documento</th>
              <th class="py-3.5 px-4 font-bold">Observación</th>
              <th class="py-3.5 px-4 font-bold">Fecha Registro</th>
              <th class="py-3.5 px-4 font-bold">Estado</th>
              <th class="py-3.5 px-4 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="item in filteredVerificaciones"
              :key="item.idDocumentoDeIdentidad"
              class="hover:bg-slate-50/80 transition"
            >
              <td class="py-3.5 px-4">
                <p class="font-bold text-slate-900">{{ item.nombreCompleto || 'Sin nombre' }}</p>
                <p class="text-[11px] font-mono text-slate-500">{{ item.correo || 'Sin correo' }}</p>
              </td>
              <td class="py-3.5 px-4 font-mono">
                <span class="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px] mr-1.5">
                  {{ item.tipoDocumento || 'DOC' }}
                </span>
                <span class="font-bold text-slate-900">{{ item.numeroDocumento || '—' }}</span>
              </td>
              <td class="py-3.5 px-4 text-slate-600 max-w-[240px] truncate">
                {{ item.observacion || 'Sin observaciones' }}
              </td>
              <td class="py-3.5 px-4 font-mono text-slate-500">
                {{ formatFecha(item.fechaRegistro) }}
              </td>
              <td class="py-3.5 px-4">
                <StatusBadge :status="item.estado || 'Pendiente'" />
              </td>
              <td class="py-3.5 px-4 text-right">
                <button
                  type="button"
                  @click="abrirAuditoria(item)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition cursor-pointer"
                >
                  <FileCheck2 class="w-3.5 h-3.5 text-emerald-400" />
                  <span>Auditar</span>
                </button>
              </td>
            </tr>

            <tr v-if="filteredVerificaciones.length === 0">
              <td colspan="6" class="py-12 text-center text-slate-500 text-xs">
                <ShieldCheck class="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p class="font-bold text-slate-700">No hay verificaciones registradas con este filtro</p>
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
          Mostrando <strong class="text-slate-800">{{ verificaciones.length }}</strong> registros
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
            :disabled="isLoading || verificaciones.length < pagination.limite"
            @click="paginaSiguiente"
            class="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Siguiente →
          </button>
        </div>
      </div>
    </div>

    <DetailDrawer
      :is-open="Boolean(selectedVerificacion)"
      :title="selectedVerificacion?.nombreCompleto || 'Auditoría e-KYC'"
      tag="Verificación Documental"
      @close="cerrarAuditoria"
    >
      <template v-if="selectedVerificacion">
        <div class="p-4 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-[#0e1726] text-white space-y-3">
          <div class="flex items-center justify-between gap-3">
            <div>
              <h4 class="text-base font-black">{{ selectedVerificacion.nombreCompleto }}</h4>
              <p class="text-xs font-mono text-slate-400">{{ selectedVerificacion.correo }}</p>
            </div>
            <StatusBadge :status="selectedVerificacion.estado || 'Pendiente'" />
          </div>

          <div class="pt-3 border-t border-slate-800 grid grid-cols-3 gap-3 text-[11px] font-mono">
            <div>
              <span class="text-slate-400 block">Tipo Doc.</span>
              <span class="text-white font-bold">{{ selectedVerificacion.tipoDocumento || '—' }}</span>
            </div>
            <div>
              <span class="text-slate-400 block">Número Doc.</span>
              <span class="text-emerald-400 font-bold">{{ selectedVerificacion.numeroDocumento || '—' }}</span>
            </div>
            <div>
              <span class="text-slate-400 block">Registro</span>
              <span class="text-white font-bold">{{ formatFecha(selectedVerificacion.fechaRegistro) }}</span>
            </div>
          </div>
        </div>

        <div class="space-y-3">
          <h5 class="text-xs font-mono font-bold uppercase text-slate-800">
            Capturas Documentales y Biometría
          </h5>

          <div class="grid grid-cols-1 gap-3">
            <div
              v-for="foto in fotosAuditoria"
              :key="foto.key"
              class="p-3 rounded-2xl border-2 border-slate-200/80 bg-slate-50/50 space-y-2"
            >
              <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-slate-800">{{ foto.label }}</span>
                <a
                  v-if="blobUrls[foto.key]"
                  :href="blobUrls[foto.key]"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-[11px] font-bold text-emerald-700 hover:underline inline-flex items-center gap-1"
                >
                  <span>Ampliar imagen</span>
                  <ExternalLink class="w-3 h-3" />
                </a>
              </div>

              <div
                v-if="loadingImages[foto.key]"
                class="py-8 rounded-xl border border-slate-200 bg-white text-center text-xs text-slate-500 flex items-center justify-center gap-2"
              >
                <RefreshCw class="w-4 h-4 animate-spin text-emerald-600" />
                <span>Descargando captura protegida...</span>
              </div>

              <div
                v-else-if="blobUrls[foto.key] && !failedImages[foto.key]"
                class="rounded-xl overflow-hidden border border-slate-200 bg-white max-h-56 flex items-center justify-center"
              >
                <img
                  :src="blobUrls[foto.key]"
                  :alt="foto.label"
                  class="w-full max-h-56 object-contain"
                  @error="failedImages[foto.key] = true"
                />
              </div>

              <div
                v-else
                class="py-6 rounded-xl border border-dashed border-slate-300 bg-white text-center text-xs text-slate-400"
              >
                {{ foto.raw ? 'No se pudo cargar la captura protegida.' : 'Archivo no adjuntado.' }}
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="selectedVerificacion.observacion"
          class="p-4 rounded-2xl border border-amber-200 bg-amber-50/70 text-xs text-amber-900 space-y-1"
        >
          <p class="font-mono font-bold uppercase text-[10px] text-amber-700">Observación registrada</p>
          <p>{{ selectedVerificacion.observacion }}</p>
        </div>

        <details class="rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs">
          <summary class="font-semibold text-slate-600 cursor-pointer select-none">
            Información técnica de soporte
          </summary>
          <div class="mt-3 flex items-center justify-between gap-2 text-[11px] font-mono text-slate-500">
            <span class="truncate">Documento: {{ selectedVerificacion.idDocumentoDeIdentidad }}</span>
            <button
              type="button"
              @click="copiarIdDocumento(selectedVerificacion.idDocumentoDeIdentidad)"
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
            >
              <Copy class="w-3 h-3" />
              <span>Copiar</span>
            </button>
          </div>
        </details>
      </template>

      <template #footer>
        <template v-if="selectedVerificacion && puedeEditar">
          <button
            type="button"
            :disabled="resolvingId === selectedVerificacion.idDocumentoDeIdentidad"
            @click="solicitarResolucion(false)"
            class="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-700 transition cursor-pointer disabled:opacity-50"
          >
            Rechazar
          </button>
          <button
            type="button"
            :disabled="resolvingId === selectedVerificacion.idDocumentoDeIdentidad"
            @click="solicitarResolucion(true)"
            class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white transition cursor-pointer disabled:opacity-50"
          >
            Aprobar Verificación
          </button>
        </template>
        <button
          v-else
          type="button"
          @click="cerrarAuditoria"
          class="px-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          Cerrar
        </button>
      </template>
    </DetailDrawer>

    <ConfirmModal
      :is-open="confirmModal.isOpen"
      :loading="Boolean(resolvingId)"
      :title="confirmModal.aprobar ? 'Aprobar Verificación e-KYC' : 'Rechazar Verificación e-KYC'"
      :subtitle="confirmModal.item?.nombreCompleto || ''"
      :message="
        confirmModal.aprobar
          ? `¿Confirmas aprobar el documento ${confirmModal.item?.tipoDocumento} ${confirmModal.item?.numeroDocumento}?`
          : `Indica el motivo del rechazo para ${confirmModal.item?.nombreCompleto || 'este usuario'}.`
      "
      :danger="!confirmModal.aprobar"
      :show-reason="confirmModal.aprobar"
      :require-reason="!confirmModal.aprobar"
      reason-label="Observación / Motivo"
      :confirm-text="confirmModal.aprobar ? 'Aprobar' : 'Rechazar'"
      @confirm="confirmarResolucion"
      @cancel="confirmModal.isOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import {
  ShieldCheck,
  Clock,
  BadgeCheck,
  XCircle,
  RefreshCw,
  AlertCircle,
  Search,
  X,
  FileCheck2,
  ExternalLink,
  Copy,
} from 'lucide-vue-next'
import {
  PageHeader,
  StatCard,
  StatusBadge,
  DetailDrawer,
  ConfirmModal,
} from '@/components/common'
import {
  adminService,
  apiClient,
  type VerificacionIdentidadDto,
} from '@/api'
import { copyToClipboard, formatFecha } from '@/utils/format'
import { usePermissions } from '@/composables/usePermissions'
import { useToast } from '@/composables/useToast'

const { puedeEditar } = usePermissions()
const toast = useToast()

const verificaciones = ref<VerificacionIdentidadDto[]>([])
const isLoading = ref(false)
const hasLoaded = ref(false)
const errorMessage = ref<string | null>(null)
const resolvingId = ref<string | null>(null)

const selectedVerificacion = ref<VerificacionIdentidadDto | null>(null)
const blobUrls = reactive<Record<string, string>>({})
const loadingImages = reactive<Record<string, boolean>>({})
const failedImages = reactive<Record<string, boolean>>({})

const pagination = reactive({
  omitir: 0,
  limite: 50,
})

const filters = reactive({
  estado: 'todos',
  buscarLocal: '',
})

const confirmModal = reactive<{
  isOpen: boolean
  item: VerificacionIdentidadDto | null
  aprobar: boolean
}>({
  isOpen: false,
  item: null,
  aprobar: true,
})

const paginaActual = computed(() => Math.floor(pagination.omitir / pagination.limite) + 1)

const pendientesCount = computed(
  () => verificaciones.value.filter((v) => v.estado.toLowerCase().includes('pend')).length
)

const aprobadasCount = computed(
  () =>
    verificaciones.value.filter(
      (v) =>
        v.estado.toLowerCase().includes('aprob') ||
        v.estado.toLowerCase().includes('verif')
    ).length
)

const rechazadasCount = computed(
  () => verificaciones.value.filter((v) => v.estado.toLowerCase().includes('rech')).length
)

const estadosDisponibles = computed(() => {
  const base = ['Pendiente', 'Aprobado', 'Rechazado']
  const set = new Set<string>(base)
  for (const v of verificaciones.value) {
    if (v.estado?.trim()) set.add(v.estado.trim())
  }
  return Array.from(set)
})

const hasActiveFilters = computed(
  () => filters.estado !== 'todos' || filters.buscarLocal.trim() !== ''
)

const filteredVerificaciones = computed(() => {
  const q = filters.buscarLocal.trim().toLowerCase()
  return verificaciones.value.filter((v) => {
    if (
      filters.estado !== 'todos' &&
      v.estado.toLowerCase() !== filters.estado.toLowerCase()
    ) {
      return false
    }
    if (q) {
      const match =
        v.nombreCompleto.toLowerCase().includes(q) ||
        v.correo.toLowerCase().includes(q) ||
        v.numeroDocumento.toLowerCase().includes(q)
      if (!match) return false
    }
    return true
  })
})

const fotosAuditoria = computed(() => {
  const v = selectedVerificacion.value
  if (!v) return []
  return [
    { key: 'frontal', label: 'Foto Frontal del Documento', raw: (v.fotoFrontal || '').trim() },
    { key: 'posterior', label: 'Foto Posterior del Documento', raw: (v.fotoPosterior || '').trim() },
    { key: 'selfie', label: 'Selfie Biométrica', raw: (v.fotoSelfie || '').trim() },
  ]
})

function revocarBlobUrls() {
  for (const key of Object.keys(blobUrls)) {
    const url = blobUrls[key]
    if (url && url.startsWith('blob:')) {
      URL.revokeObjectURL(url)
    }
    delete blobUrls[key]
  }
}

async function cargarImagenAutenticada(key: string, raw: string) {
  if (!raw) return
  if (raw.startsWith('data:')) {
    blobUrls[key] = raw
    return
  }

  loadingImages[key] = true
  failedImages[key] = false
  const endpoint = /^https?:\/\//i.test(raw)
    ? raw
    : `/Auth/Archivos/${encodeURIComponent(raw)}`

  try {
    const response = await apiClient.get<Blob>(endpoint, {
      responseType: 'blob',
    })
    blobUrls[key] = URL.createObjectURL(response.data)
  } catch {
    failedImages[key] = true
  } finally {
    loadingImages[key] = false
  }
}

function displayMetric(value: number): number | string {
  return isLoading.value && !hasLoaded.value ? '...' : value
}

async function copiarIdDocumento(id: string) {
  const ok = await copyToClipboard(id)
  if (ok) toast.success('Referencia copiada.')
  else toast.error('No se pudo copiar.')
}

async function cargarVerificaciones() {
  if (isLoading.value) return
  isLoading.value = true
  errorMessage.value = null

  try {
    verificaciones.value = await adminService.obtenerVerificaciones({
      omitir: pagination.omitir,
      limite: pagination.limite,
      estado: filters.estado !== 'todos' ? filters.estado : undefined,
    })
    hasLoaded.value = true
  } catch (err: any) {
    errorMessage.value =
      err?.message || 'No se pudieron obtener las verificaciones de identidad.'
  } finally {
    isLoading.value = false
  }
}

function onEstadoFilterChange() {
  pagination.omitir = 0
  cargarVerificaciones()
}

function resetFilters() {
  filters.estado = 'todos'
  filters.buscarLocal = ''
  pagination.omitir = 0
  cargarVerificaciones()
}

function paginaAnterior() {
  if (pagination.omitir === 0) return
  pagination.omitir = Math.max(0, pagination.omitir - pagination.limite)
  cargarVerificaciones()
}

function paginaSiguiente() {
  if (verificaciones.value.length < pagination.limite) return
  pagination.omitir += pagination.limite
  cargarVerificaciones()
}

async function abrirAuditoria(item: VerificacionIdentidadDto) {
  revocarBlobUrls()
  failedImages.frontal = false
  failedImages.posterior = false
  failedImages.selfie = false
  loadingImages.frontal = false
  loadingImages.posterior = false
  loadingImages.selfie = false
  selectedVerificacion.value = item

  await Promise.all([
    cargarImagenAutenticada('frontal', (item.fotoFrontal || '').trim()),
    cargarImagenAutenticada('posterior', (item.fotoPosterior || '').trim()),
    cargarImagenAutenticada('selfie', (item.fotoSelfie || '').trim()),
  ])
}

function cerrarAuditoria() {
  revocarBlobUrls()
  selectedVerificacion.value = null
}

function solicitarResolucion(aprobar: boolean) {
  if (!selectedVerificacion.value) return
  confirmModal.item = selectedVerificacion.value
  confirmModal.aprobar = aprobar
  confirmModal.isOpen = true
}

async function confirmarResolucion(observacion: string) {
  const item = confirmModal.item
  if (!item) return

  resolvingId.value = item.idDocumentoDeIdentidad

  try {
    const actualizado = await adminService.resolverVerificacion(
      item.idDocumentoDeIdentidad,
      {
        aprobar: confirmModal.aprobar,
        observacion: observacion || null,
      }
    )
    const idx = verificaciones.value.findIndex(
      (v) => v.idDocumentoDeIdentidad === item.idDocumentoDeIdentidad
    )
    if (idx !== -1 && actualizado.idDocumentoDeIdentidad) {
      verificaciones.value[idx] = actualizado
    }
    if (
      selectedVerificacion.value?.idDocumentoDeIdentidad ===
      item.idDocumentoDeIdentidad
    ) {
      selectedVerificacion.value = actualizado.idDocumentoDeIdentidad
        ? actualizado
        : selectedVerificacion.value
    }
    confirmModal.isOpen = false
    toast.success(
      confirmModal.aprobar
        ? 'Verificación de identidad aprobada.'
        : 'Verificación de identidad rechazada.'
    )
  } catch (err: any) {
    toast.error(err?.message || 'No se pudo resolver la verificación de identidad.')
  } finally {
    resolvingId.value = null
  }
}

onBeforeUnmount(() => {
  revocarBlobUrls()
})

onMounted(() => {
  cargarVerificaciones()
})
</script>
