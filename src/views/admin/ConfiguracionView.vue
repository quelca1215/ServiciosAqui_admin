<template>
  <div class="space-y-6">
    <PageHeader
      tag="Administración · Parámetros"
      title="Configuración del Sistema"
      description="Reglas operativas, comisiones y ajustes generales que controlan el funcionamiento de la plataforma."
    >
      <template #actions>
        <button
          type="button"
          :disabled="isLoading"
          @click="cargarConfiguraciones"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-500/40 hover:text-emerald-800 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs"
        >
          <RefreshCw :class="['w-3.5 h-3.5', { 'animate-spin': isLoading }]" />
          <span>{{ isLoading ? 'Actualizando...' : 'Actualizar' }}</span>
        </button>

        <button
          v-if="puedeCrear"
          type="button"
          @click="abrirModalNuevo"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold bg-slate-950 text-white hover:bg-slate-800 transition cursor-pointer shadow-xs"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>Nuevo Parámetro</span>
        </button>
      </template>
    </PageHeader>

    <div
      v-if="errorMessage"
      class="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs"
    >
      <AlertCircle class="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
      <div class="flex-1">
        <p class="font-bold">Error al consultar configuraciones</p>
        <p class="mt-0.5 text-rose-700">{{ errorMessage }}</p>
      </div>
    </div>

    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="relative w-full sm:max-w-sm">
          <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model.trim="searchQuery"
            type="text"
            placeholder="Buscar parámetro por nombre o descripción..."
            class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <p class="text-xs text-slate-500">
          Mostrando {{ configuracionesFiltradas.length }} de {{ configuraciones.length }} parámetros
        </p>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-slate-200/80">
        <table class="min-w-full divide-y divide-slate-200 text-left">
          <thead class="bg-slate-50/80">
            <tr>
              <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Parámetro
              </th>
              <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Valor
              </th>
              <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Actualización
              </th>
              <th
                v-if="puedeEditar"
                class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right"
              >
                Acciones
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100 bg-white">
            <tr v-if="isLoading && configuraciones.length === 0">
              <td :colspan="puedeEditar ? 4 : 3" class="px-4 py-10 text-center text-xs text-slate-500">
                Cargando parámetros del sistema...
              </td>
            </tr>

            <tr v-else-if="configuracionesFiltradas.length === 0">
              <td :colspan="puedeEditar ? 4 : 3" class="px-4 py-10 text-center text-xs text-slate-500">
                No se encontraron parámetros con el criterio de búsqueda.
              </td>
            </tr>

            <tr
              v-for="cfg in configuracionesFiltradas"
              :key="cfg.id || cfg.clave"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <td class="px-4 py-3.5 align-middle">
                <div class="max-w-lg" :title="cfg.clave">
                  <p class="text-xs sm:text-sm font-bold text-slate-900">
                    {{ cfg.descripcion?.trim() || formatConfigKey(cfg.clave) }}
                  </p>
                  <p v-if="cfg.descripcion?.trim()" class="text-[11px] text-slate-500 mt-0.5">
                    {{ formatConfigKey(cfg.clave) }}
                  </p>
                </div>
              </td>

              <td class="px-4 py-3.5 align-middle">
                <div v-if="isBooleanType(cfg.tipoDato)" class="inline-flex items-center gap-2.5">
                  <button
                    type="button"
                    role="switch"
                    :aria-checked="isTruthyValue(cfg.valor)"
                    :aria-label="cfg.descripcion || formatConfigKey(cfg.clave)"
                    :disabled="!puedeEditar || togglingKey === cfg.clave"
                    @click="toggleBooleanConfig(cfg)"
                    :class="[
                      'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/30',
                      isTruthyValue(cfg.valor) ? 'bg-emerald-600' : 'bg-slate-200',
                      !puedeEditar || togglingKey === cfg.clave
                        ? 'opacity-60 cursor-not-allowed'
                        : 'cursor-pointer',
                    ]"
                  >
                    <span
                      :class="[
                        'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out',
                        isTruthyValue(cfg.valor) ? 'translate-x-5' : 'translate-x-0',
                      ]"
                    />
                  </button>
                  <span
                    :class="[
                      'text-xs font-bold',
                      isTruthyValue(cfg.valor) ? 'text-emerald-700' : 'text-slate-500',
                    ]"
                  >
                    {{ togglingKey === cfg.clave ? 'Guardando...' : isTruthyValue(cfg.valor) ? 'Activado' : 'Desactivado' }}
                  </span>
                </div>

                <span
                  v-else-if="isJsonType(cfg.tipoDato)"
                  class="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-medium bg-indigo-50 text-indigo-800 border border-indigo-200/80 max-w-xs truncate"
                  :title="cfg.valor"
                >
                  Configuración estructurada
                </span>

                <span
                  v-else
                  class="inline-block text-xs font-bold text-slate-800 max-w-xs truncate"
                  :title="cfg.valor"
                >
                  {{ cfg.valor || 'Sin definir' }}
                </span>
              </td>

              <td class="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap align-middle">
                {{ formatFecha(cfg.fechaActualizacion) }}
              </td>

              <td v-if="puedeEditar" class="px-4 py-3.5 text-right whitespace-nowrap align-middle">
                <button
                  type="button"
                  :disabled="togglingKey === cfg.clave"
                  @click="abrirModalEditar(cfg)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-700 border border-slate-200 hover:border-emerald-500/40 hover:text-emerald-800 transition cursor-pointer disabled:opacity-50"
                >
                  <Pencil class="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="modal.isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4"
        @click.self="cerrarModal"
      >
        <div class="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div>
              <p class="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-700">
                {{ modal.isEditing ? 'Editar parámetro' : 'Nuevo parámetro' }}
              </p>
              <h3 class="text-base font-black text-slate-900 mt-0.5">
                {{
                  modal.isEditing
                    ? modal.form.descripcion || formatConfigKey(modal.form.clave)
                    : 'Registrar parámetro del sistema'
                }}
              </h3>
            </div>

            <button
              type="button"
              :disabled="isSaving"
              @click="cerrarModal"
              class="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center cursor-pointer disabled:opacity-50"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <form @submit.prevent="guardarParametroModal" class="p-6 space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">
                  Clave interna
                </label>
                <input
                  v-model.trim="modal.form.clave"
                  type="text"
                  required
                  :disabled="modal.isEditing || isSaving"
                  placeholder="Ej. COMISION_PLATAFORMA_PCT"
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-70"
                />
              </div>

              <div>
                <label class="block text-[11px] font-bold text-slate-600 mb-1">
                  Formato de valor
                </label>
                <select
                  v-model="modal.form.tipoDato"
                  :disabled="isSaving"
                  class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-70"
                >
                  <option value="String">Texto</option>
                  <option value="Integer">Número entero</option>
                  <option value="Decimal">Número decimal</option>
                  <option value="Boolean">Activado / Desactivado</option>
                  <option value="Json">Estructura JSON</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
                Nombre descriptivo para el equipo
              </label>
              <input
                v-model.trim="modal.form.descripcion"
                type="text"
                :disabled="isSaving"
                placeholder="Ej. Porcentaje de comisión por servicio finalizado"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 disabled:opacity-70"
              />
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-600 mb-1">
                Valor vigente
              </label>

              <select
                v-if="isBooleanType(modal.form.tipoDato)"
                v-model="modal.form.valor"
                :disabled="isSaving"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                <option value="true">Activado</option>
                <option value="false">Desactivado</option>
              </select>

              <textarea
                v-else-if="isJsonType(modal.form.tipoDato)"
                v-model="modal.form.valor"
                rows="5"
                required
                :disabled="isSaving"
                placeholder="{}"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              ></textarea>

              <input
                v-else
                v-model="modal.form.valor"
                :type="isNumericType(modal.form.tipoDato) ? 'number' : 'text'"
                :step="modal.form.tipoDato === 'Decimal' ? 'any' : modal.form.tipoDato === 'Integer' ? '1' : undefined"
                required
                :disabled="isSaving"
                placeholder="Ingresa el valor del parámetro"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>

            <div v-if="modalError" class="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {{ modalError }}
            </div>

            <div class="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                :disabled="isSaving"
                @click="cerrarModal"
                class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="isSaving"
                class="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer disabled:opacity-50"
              >
                {{ isSaving ? 'Guardando...' : 'Guardar parámetro' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { AlertCircle, Pencil, Plus, RefreshCw, Search, X } from 'lucide-vue-next'
import { PageHeader } from '@/components/common'
import {
  parametrosService,
  type ConfiguracionAdministrativaDto,
  type TipoDatoConfiguracion,
} from '@/api'
import { formatConfigKey, formatFecha } from '@/utils/format'
import { usePermissions } from '@/composables/usePermissions'
import { useToast } from '@/composables/useToast'

const { puedeCrear, puedeEditar } = usePermissions()
const toast = useToast()

const configuraciones = ref<ConfiguracionAdministrativaDto[]>([])
const isLoading = ref(false)
const isSaving = ref(false)
const togglingKey = ref<string | null>(null)
const errorMessage = ref<string | null>(null)
const modalError = ref<string | null>(null)
const searchQuery = ref('')

const modal = reactive<{
  isOpen: boolean
  isEditing: boolean
  form: {
    clave: string
    valor: string
    descripcion: string
    tipoDato: TipoDatoConfiguracion | string
  }
}>({
  isOpen: false,
  isEditing: false,
  form: {
    clave: '',
    valor: '',
    descripcion: '',
    tipoDato: 'String',
  },
})

const configuracionesFiltradas = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q) return configuraciones.value
  return configuraciones.value.filter(
    (cfg) =>
      cfg.descripcion?.toLowerCase().includes(q) ||
      cfg.clave?.toLowerCase().includes(q) ||
      formatConfigKey(cfg.clave).toLowerCase().includes(q),
  )
})

function isBooleanType(tipoDato: string): boolean {
  return String(tipoDato).toLowerCase() === 'boolean'
}

function isJsonType(tipoDato: string): boolean {
  return String(tipoDato).toLowerCase() === 'json'
}

function isNumericType(tipoDato: string): boolean {
  const t = String(tipoDato).toLowerCase()
  return t === 'integer' || t === 'decimal'
}

function isTruthyValue(valor: string): boolean {
  const normalized = String(valor).trim().toLowerCase()
  return normalized === 'true' || normalized === '1'
}

async function cargarConfiguraciones() {
  isLoading.value = true
  errorMessage.value = null
  try {
    configuraciones.value = await parametrosService.obtenerConfiguraciones()
  } catch (err: unknown) {
    errorMessage.value =
      err instanceof Error ? err.message : 'No se pudieron cargar los parámetros del sistema.'
  } finally {
    isLoading.value = false
  }
}

function upsertLocalConfig(saved: ConfiguracionAdministrativaDto) {
  const idx = configuraciones.value.findIndex((item) => item.clave === saved.clave)
  if (idx >= 0) {
    configuraciones.value[idx] = saved
  } else {
    configuraciones.value.unshift(saved)
  }
}

async function toggleBooleanConfig(cfg: ConfiguracionAdministrativaDto) {
  if (!puedeEditar.value || togglingKey.value) return
  togglingKey.value = cfg.clave
  const nextVal = isTruthyValue(cfg.valor) ? 'false' : 'true'
  try {
    const saved = await parametrosService.guardarConfiguracion({
      clave: cfg.clave,
      valor: nextVal,
      descripcion: cfg.descripcion ?? null,
      tipoDato: cfg.tipoDato,
    })
    upsertLocalConfig(saved)
    toast.success(
      `${cfg.descripcion?.trim() || formatConfigKey(cfg.clave)}: ${
        nextVal === 'true' ? 'Activado' : 'Desactivado'
      }`,
    )
  } catch (err: unknown) {
    toast.error(err instanceof Error ? err.message : 'No se pudo actualizar el parámetro.')
  } finally {
    togglingKey.value = null
  }
}

function abrirModalNuevo() {
  modalError.value = null
  modal.isEditing = false
  modal.form = {
    clave: '',
    valor: '',
    descripcion: '',
    tipoDato: 'String',
  }
  modal.isOpen = true
}

function abrirModalEditar(cfg: ConfiguracionAdministrativaDto) {
  modalError.value = null
  modal.isEditing = true
  modal.form = {
    clave: cfg.clave,
    valor: isBooleanType(cfg.tipoDato)
      ? isTruthyValue(cfg.valor)
        ? 'true'
        : 'false'
      : cfg.valor ?? '',
    descripcion: cfg.descripcion ?? '',
    tipoDato: cfg.tipoDato || 'String',
  }
  modal.isOpen = true
}

function cerrarModal() {
  if (isSaving.value) return
  modal.isOpen = false
  modalError.value = null
}

async function guardarParametroModal() {
  modalError.value = null
  const trimmedKey = modal.form.clave.trim()
  const rawVal = String(modal.form.valor ?? '').trim()

  if (!trimmedKey) {
    modalError.value = 'La clave interna es obligatoria.'
    return
  }

  if (isJsonType(modal.form.tipoDato)) {
    try {
      JSON.parse(rawVal || '{}')
    } catch {
      modalError.value = 'El formato JSON ingresado no es válido.'
      return
    }
  }

  isSaving.value = true
  try {
    const saved = await parametrosService.guardarConfiguracion({
      clave: trimmedKey,
      valor: rawVal,
      descripcion: modal.form.descripcion.trim() || null,
      tipoDato: modal.form.tipoDato,
    })
    upsertLocalConfig(saved)
    toast.success('Parámetro guardado correctamente')
    modal.isOpen = false
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'No se pudo guardar el parámetro.'
    modalError.value = msg
    toast.error(msg)
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  void cargarConfiguraciones()
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
