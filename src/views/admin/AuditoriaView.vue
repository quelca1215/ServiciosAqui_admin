<template>
  <div class="space-y-6">
    <PageHeader
      tag="Administración · Trazabilidad"
      title="Auditoría y Accesos"
      description="Seguimiento de cambios realizados en el panel administrativo y registro de inicios de sesión del equipo."
    >
      <template #actions>
        <button
          type="button"
          :disabled="isLoading"
          @click="recargarTabActual"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-500/40 hover:text-emerald-800 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs"
        >
          <RefreshCw :class="['w-3.5 h-3.5', { 'animate-spin': isLoading }]" />
          <span>{{ isLoading ? 'Actualizando...' : 'Actualizar' }}</span>
        </button>
      </template>
    </PageHeader>

    <div class="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
      <button
        type="button"
        @click="cambiarTab('auditoria')"
        :class="[
          'inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer',
          activeTab === 'auditoria'
            ? 'bg-slate-950 text-white shadow-sm'
            : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900',
        ]"
      >
        <History class="w-3.5 h-3.5" />
        <span>Auditoría de Acciones</span>
      </button>

      <button
        type="button"
        @click="cambiarTab('accesos')"
        :class="[
          'inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer',
          activeTab === 'accesos'
            ? 'bg-slate-950 text-white shadow-sm'
            : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:text-slate-900',
        ]"
      >
        <ShieldCheck class="w-3.5 h-3.5" />
        <span>Historial de Accesos</span>
      </button>
    </div>

    <div
      v-if="errorMessage"
      class="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs"
    >
      <AlertCircle class="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
      <div class="flex-1">
        <p class="font-bold">No se pudo cargar la información solicitada</p>
        <p class="mt-0.5 text-rose-700">{{ errorMessage }}</p>
      </div>
    </div>

    <template v-if="activeTab === 'auditoria'">
      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">Módulo</label>
            <div class="relative">
              <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                v-model.trim="auditFilters.modulo"
                type="text"
                placeholder="Ej. Retiros, Pagos, Usuarios..."
                class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">Desde</label>
            <input
              v-model="auditFilters.desde"
              type="date"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">Hasta</label>
            <input
              v-model="auditFilters.hasta"
              type="date"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div class="flex items-end">
            <button
              type="button"
              :disabled="!hasAuditFilters || isLoading"
              @click="limpiarFiltrosAuditoria"
              class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-slate-200/80">
          <table class="min-w-full divide-y divide-slate-200 text-left">
            <thead class="bg-slate-50/80">
              <tr>
                <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Fecha y Hora
                </th>
                <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Administrador
                </th>
                <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Módulo
                </th>
                <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Acción realizada
                </th>
                <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  IP Origen
                </th>
                <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">
                  Cambios
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-if="isLoading && auditorias.length === 0">
                <td colspan="6" class="px-4 py-10 text-center text-xs text-slate-500">
                  Cargando registros de auditoría...
                </td>
              </tr>

              <tr v-else-if="auditorias.length === 0">
                <td colspan="6" class="px-4 py-10 text-center text-xs text-slate-500">
                  No se encontraron eventos de auditoría con los filtros seleccionados.
                </td>
              </tr>

              <tr
                v-for="item in auditorias"
                :key="item.id"
                class="hover:bg-slate-50/70 transition-colors"
              >
                <td class="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                  {{ formatFechaHora(item.fechaRegistro) }}
                </td>
                <td class="px-4 py-3 text-xs font-bold text-slate-900">
                  {{ item.administrador || 'Sistema' }}
                </td>
                <td class="px-4 py-3 text-xs">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80">
                    {{ item.moduloAfectado || 'General' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-xs font-medium text-slate-800">
                  {{ item.accion || 'Operación registrada' }}
                </td>
                <td class="px-4 py-3 text-xs font-mono text-slate-500 whitespace-nowrap">
                  {{ item.direccionIp || '—' }}
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <button
                    type="button"
                    @click="abrirDetalleAuditoria(item)"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100 transition cursor-pointer"
                  >
                    <Eye class="w-3.5 h-3.5" />
                    <span>Ver cambios</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <p class="text-xs text-slate-500">
            Página {{ paginaAuditActual }} · Mostrando {{ auditorias.length }} registros
          </p>
          <div class="flex items-center gap-2">
            <button
              type="button"
              :disabled="auditFilters.omitir === 0 || isLoading"
              @click="cambiarPaginaAuditoria(-1)"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft class="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
            <button
              type="button"
              :disabled="auditorias.length < auditFilters.limite || isLoading"
              @click="cambiarPaginaAuditoria(1)"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Siguiente</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">Buscar en página</label>
            <div class="relative">
              <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                v-model.trim="accesoSearchLocal"
                type="text"
                placeholder="Administrador o IP..."
                class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">Resultado</label>
            <select
              v-model="accessFilters.resultado"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="todos">Todos los intentos</option>
              <option value="exitoso">Solo exitosos</option>
              <option value="fallido">Solo fallidos</option>
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">Desde</label>
            <input
              v-model="accessFilters.desde"
              type="date"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-600 mb-1">Hasta</label>
            <input
              v-model="accessFilters.hasta"
              type="date"
              class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div class="flex items-end">
            <button
              type="button"
              :disabled="!hasAccessFilters || isLoading"
              @click="limpiarFiltrosAccesos"
              class="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        <div class="overflow-x-auto rounded-2xl border border-slate-200/80">
          <table class="min-w-full divide-y divide-slate-200 text-left">
            <thead class="bg-slate-50/80">
              <tr>
                <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Fecha y Hora
                </th>
                <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Administrador
                </th>
                <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Resultado
                </th>
                <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  IP Origen
                </th>
                <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Dispositivo / Navegador
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 bg-white">
              <tr v-if="isLoading && accesos.length === 0">
                <td colspan="5" class="px-4 py-10 text-center text-xs text-slate-500">
                  Cargando historial de accesos...
                </td>
              </tr>

              <tr v-else-if="accesosFiltrados.length === 0">
                <td colspan="5" class="px-4 py-10 text-center text-xs text-slate-500">
                  No se encontraron intentos de acceso para mostrar.
                </td>
              </tr>

              <tr
                v-for="acc in accesosFiltrados"
                :key="acc.id"
                class="hover:bg-slate-50/70 transition-colors"
              >
                <td class="px-4 py-3 text-xs text-slate-600 whitespace-nowrap">
                  {{ formatFechaHora(acc.fechaIntento) }}
                </td>
                <td class="px-4 py-3 text-xs font-bold text-slate-900">
                  {{ acc.administrador || 'Usuario no identificado' }}
                </td>
                <td class="px-4 py-3 text-xs">
                  <div class="space-y-1">
                    <span
                      :class="[
                        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-bold border',
                        acc.exitoso
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200/80'
                          : 'bg-rose-50 text-rose-800 border-rose-200/80',
                      ]"
                    >
                      <span
                        :class="[
                          'w-1.5 h-1.5 rounded-full',
                          acc.exitoso ? 'bg-emerald-500' : 'bg-rose-500',
                        ]"
                      ></span>
                      {{ acc.exitoso ? 'Acceso exitoso' : 'Intento fallido' }}
                    </span>
                    <p v-if="!acc.exitoso && acc.motivoFallo" class="text-[11px] text-rose-700">
                      {{ acc.motivoFallo }}
                    </p>
                  </div>
                </td>
                <td class="px-4 py-3 text-xs font-mono text-slate-500 whitespace-nowrap">
                  {{ acc.direccionIp || '—' }}
                </td>
                <td
                  class="px-4 py-3 text-xs text-slate-700"
                  :title="acc.userAgent || 'Sin información del navegador'"
                >
                  {{ parseUserAgent(acc.userAgent) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <p class="text-xs text-slate-500">
            Página {{ paginaAccesosActual }} · Mostrando {{ accesosFiltrados.length }} registros
          </p>
          <div class="flex items-center gap-2">
            <button
              type="button"
              :disabled="accessFilters.omitir === 0 || isLoading"
              @click="cambiarPaginaAccesos(-1)"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft class="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
            <button
              type="button"
              :disabled="accesos.length < accessFilters.limite || isLoading"
              @click="cambiarPaginaAccesos(1)"
              class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span>Siguiente</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </template>

    <DetailDrawer
      :is-open="Boolean(selectedAudit)"
      :tag="selectedAudit?.moduloAfectado || 'Auditoría'"
      :title="selectedAudit?.accion || 'Detalle de cambios'"
      @close="selectedAudit = null"
    >
      <template v-if="selectedAudit">
        <div class="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
          <div>
            <p class="text-[11px] font-bold text-slate-500">Administrador</p>
            <p class="font-bold text-slate-900 mt-0.5">
              {{ selectedAudit.administrador || 'Sistema' }}
            </p>
          </div>
          <div>
            <p class="text-[11px] font-bold text-slate-500">Fecha y hora</p>
            <p class="font-semibold text-slate-800 mt-0.5">
              {{ formatFechaHora(selectedAudit.fechaRegistro) }}
            </p>
          </div>
          <div>
            <p class="text-[11px] font-bold text-slate-500">Módulo</p>
            <p class="font-semibold text-slate-800 mt-0.5">
              {{ selectedAudit.moduloAfectado || 'General' }}
            </p>
          </div>
          <div>
            <p class="text-[11px] font-bold text-slate-500">Dirección IP</p>
            <p class="font-mono text-slate-700 mt-0.5">
              {{ selectedAudit.direccionIp || '—' }}
            </p>
          </div>
        </div>

        <div class="space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-700">
              Comparativa de cambios
            </h4>
            <span
              v-if="changedFieldsCount > 0"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200"
            >
              {{ changedFieldsCount }} {{ changedFieldsCount === 1 ? 'campo modificado' : 'campos modificados' }}
            </span>
          </div>

          <div
            v-if="diffRows.length === 0"
            class="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 text-center"
          >
            Este evento no contiene campos detallados antes o después de la operación.
          </div>

          <div v-else class="overflow-x-auto rounded-2xl border border-slate-200">
            <table class="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead class="bg-slate-50">
                <tr>
                  <th class="px-3 py-2.5 font-bold text-slate-600">Campo</th>
                  <th class="px-3 py-2.5 font-bold text-slate-600">Antes</th>
                  <th class="px-3 py-2.5 font-bold text-slate-600">Después</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 bg-white">
                <tr
                  v-for="row in diffRows"
                  :key="row.campo"
                  :class="row.cambio ? 'bg-amber-50/70' : ''"
                >
                  <td class="px-3 py-2.5 font-semibold text-slate-800 align-top">
                    <div class="flex items-center gap-1.5">
                      <span
                        v-if="row.cambio"
                        class="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"
                        title="Campo modificado"
                      ></span>
                      <span>{{ row.campo }}</span>
                    </div>
                  </td>
                  <td
                    :class="[
                      'px-3 py-2.5 align-top break-words max-w-[160px]',
                      row.cambio ? 'text-rose-700 line-through decoration-rose-400/70' : 'text-slate-500',
                    ]"
                  >
                    {{ row.antes }}
                  </td>
                  <td
                    :class="[
                      'px-3 py-2.5 align-top break-words max-w-[160px]',
                      row.cambio ? 'font-bold text-emerald-800' : 'text-slate-700',
                    ]"
                  >
                    {{ row.despues }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <details class="rounded-2xl border border-slate-200 bg-slate-50/60 p-3.5 text-xs">
          <summary class="cursor-pointer font-bold text-slate-600 hover:text-slate-900 select-none">
            Información técnica sin formato
          </summary>

          <div class="mt-3 space-y-3 pt-3 border-t border-slate-200/80">
            <div class="flex items-center justify-between gap-2 bg-white p-2.5 rounded-xl border border-slate-200">
              <div class="min-w-0">
                <p class="text-[10px] font-bold uppercase text-slate-500">ID Registro Afectado</p>
                <p class="font-mono text-[11px] text-slate-800 truncate">
                  {{ selectedAudit.idRegistroAfectado || 'Sin referencia' }}
                </p>
              </div>
              <button
                v-if="selectedAudit.idRegistroAfectado"
                type="button"
                @click="copiarReferencia(selectedAudit.idRegistroAfectado)"
                class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer shrink-0"
              >
                <Copy class="w-3 h-3" />
                <span>Copiar</span>
              </button>
            </div>

            <div class="space-y-1.5">
              <p class="text-[10px] font-bold uppercase text-slate-500">Datos anteriores (JSON)</p>
              <pre class="p-3 rounded-xl bg-slate-950 text-slate-200 text-[11px] font-mono overflow-x-auto max-h-48">{{
                formatearJsonCrudo(selectedAudit.datosAnterioresJson)
              }}</pre>
            </div>

            <div class="space-y-1.5">
              <p class="text-[10px] font-bold uppercase text-slate-500">Datos nuevos (JSON)</p>
              <pre class="p-3 rounded-xl bg-slate-950 text-emerald-300 text-[11px] font-mono overflow-x-auto max-h-48">{{
                formatearJsonCrudo(selectedAudit.datosNuevosJson)
              }}</pre>
            </div>
          </div>
        </details>
      </template>
    </DetailDrawer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  History,
  RefreshCw,
  Search,
  ShieldCheck,
} from 'lucide-vue-next'
import { DetailDrawer, PageHeader } from '@/components/common'
import {
  adminService,
  type AccesoAdministrativoDto,
  type RegistroAuditoriaAdministrativaDto,
} from '@/api'
import {
  buildJsonDiffRows,
  copyToClipboard,
  formatFechaHora,
  parseUserAgent,
} from '@/utils/format'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const activeTab = ref<'auditoria' | 'accesos'>('auditoria')
const isLoading = ref(false)
const errorMessage = ref<string | null>(null)

const auditorias = ref<RegistroAuditoriaAdministrativaDto[]>([])
const accesos = ref<AccesoAdministrativoDto[]>([])
const selectedAudit = ref<RegistroAuditoriaAdministrativaDto | null>(null)
const accesoSearchLocal = ref('')

const auditFilters = reactive({
  modulo: '',
  desde: '',
  hasta: '',
  omitir: 0,
  limite: 25,
})

const accessFilters = reactive({
  resultado: 'todos' as 'todos' | 'exitoso' | 'fallido',
  desde: '',
  hasta: '',
  omitir: 0,
  limite: 25,
})

let moduloDebounceTimer: ReturnType<typeof setTimeout> | null = null

const hasAuditFilters = computed(
  () => Boolean(auditFilters.modulo || auditFilters.desde || auditFilters.hasta),
)

const hasAccessFilters = computed(
  () =>
    accessFilters.resultado !== 'todos' ||
    Boolean(accessFilters.desde || accessFilters.hasta || accesoSearchLocal.value),
)

const paginaAuditActual = computed(() => Math.floor(auditFilters.omitir / auditFilters.limite) + 1)
const paginaAccesosActual = computed(() => Math.floor(accessFilters.omitir / accessFilters.limite) + 1)

const accesosFiltrados = computed(() => {
  const q = accesoSearchLocal.value.toLowerCase()
  if (!q) return accesos.value
  return accesos.value.filter(
    (acc) =>
      acc.administrador?.toLowerCase().includes(q) ||
      acc.direccionIp?.toLowerCase().includes(q) ||
      acc.motivoFallo?.toLowerCase().includes(q),
  )
})

const diffRows = computed(() => {
  if (!selectedAudit.value) return []
  return buildJsonDiffRows(
    selectedAudit.value.datosAnterioresJson,
    selectedAudit.value.datosNuevosJson,
  )
})

const changedFieldsCount = computed(() => diffRows.value.filter((row) => row.cambio).length)

function buildDateParam(dateStr: string, endOfDay: boolean): string | undefined {
  if (!dateStr) return undefined
  return endOfDay ? `${dateStr}T23:59:59` : `${dateStr}T00:00:00`
}

async function cargarAuditoria() {
  isLoading.value = true
  errorMessage.value = null
  try {
    auditorias.value = await adminService.obtenerAuditoria({
      modulo: auditFilters.modulo || undefined,
      desde: buildDateParam(auditFilters.desde, false),
      hasta: buildDateParam(auditFilters.hasta, true),
      omitir: auditFilters.omitir,
      limite: auditFilters.limite,
    })
  } catch (err: unknown) {
    errorMessage.value =
      err instanceof Error ? err.message : 'No se pudo consultar el historial de auditoría.'
  } finally {
    isLoading.value = false
  }
}

async function cargarAccesos() {
  isLoading.value = true
  errorMessage.value = null
  try {
    const exitosoParam =
      accessFilters.resultado === 'todos'
        ? undefined
        : accessFilters.resultado === 'exitoso'
    accesos.value = await adminService.obtenerAccesos({
      exitoso: exitosoParam,
      desde: buildDateParam(accessFilters.desde, false),
      hasta: buildDateParam(accessFilters.hasta, true),
      omitir: accessFilters.omitir,
      limite: accessFilters.limite,
    })
  } catch (err: unknown) {
    errorMessage.value =
      err instanceof Error ? err.message : 'No se pudo consultar el historial de accesos.'
  } finally {
    isLoading.value = false
  }
}

function recargarTabActual() {
  if (activeTab.value === 'auditoria') {
    void cargarAuditoria()
  } else {
    void cargarAccesos()
  }
}

function cambiarTab(tab: 'auditoria' | 'accesos') {
  if (activeTab.value === tab) return
  activeTab.value = tab
  errorMessage.value = null
  if (tab === 'auditoria' && auditorias.value.length === 0) {
    void cargarAuditoria()
  } else if (tab === 'accesos' && accesos.value.length === 0) {
    void cargarAccesos()
  }
}

function cambiarPaginaAuditoria(direction: -1 | 1) {
  const next = Math.max(0, auditFilters.omitir + direction * auditFilters.limite)
  if (next === auditFilters.omitir) return
  auditFilters.omitir = next
  void cargarAuditoria()
}

function cambiarPaginaAccesos(direction: -1 | 1) {
  const next = Math.max(0, accessFilters.omitir + direction * accessFilters.limite)
  if (next === accessFilters.omitir) return
  accessFilters.omitir = next
  void cargarAccesos()
}

function limpiarFiltrosAuditoria() {
  auditFilters.modulo = ''
  auditFilters.desde = ''
  auditFilters.hasta = ''
  auditFilters.omitir = 0
  void cargarAuditoria()
}

function limpiarFiltrosAccesos() {
  accesoSearchLocal.value = ''
  accessFilters.resultado = 'todos'
  accessFilters.desde = ''
  accessFilters.hasta = ''
  accessFilters.omitir = 0
  void cargarAccesos()
}

function abrirDetalleAuditoria(item: RegistroAuditoriaAdministrativaDto) {
  selectedAudit.value = item
}

async function copiarReferencia(valor: string) {
  const ok = await copyToClipboard(valor)
  if (ok) {
    toast.success('Referencia copiada al portapapeles')
  } else {
    toast.error('No se pudo copiar la referencia')
  }
}

function formatearJsonCrudo(raw?: string): string {
  if (!raw || !raw.trim()) return 'Sin información registrada'
  try {
    return JSON.stringify(JSON.parse(raw), null, 2)
  } catch {
    return raw
  }
}

watch(
  () => auditFilters.modulo,
  () => {
    if (moduloDebounceTimer) clearTimeout(moduloDebounceTimer)
    moduloDebounceTimer = setTimeout(() => {
      auditFilters.omitir = 0
      if (activeTab.value === 'auditoria') {
        void cargarAuditoria()
      }
    }, 350)
  },
)

watch([() => auditFilters.desde, () => auditFilters.hasta], () => {
  auditFilters.omitir = 0
  if (activeTab.value === 'auditoria') {
    void cargarAuditoria()
  }
})

watch(
  [() => accessFilters.resultado, () => accessFilters.desde, () => accessFilters.hasta],
  () => {
    accessFilters.omitir = 0
    if (activeTab.value === 'accesos') {
      void cargarAccesos()
    }
  },
)

onMounted(() => {
  void cargarAuditoria()
})

onUnmounted(() => {
  if (moduloDebounceTimer) clearTimeout(moduloDebounceTimer)
})
</script>
