<template>
  <div class="space-y-6">
    <PageHeader
      tag="Finanzas · Parámetros de Comisiones"
      title="Comisiones de la Plataforma"
      description="Configuración de porcentajes de comisión aplicados por uso de la aplicación."
    >
      <template #actions>
        <button
          type="button"
          :disabled="isLoading"
          @click="cargarComisiones"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-500/40 hover:text-emerald-800 transition cursor-pointer disabled:opacity-60 shadow-2xs"
        >
          <RefreshCw :class="['w-3.5 h-3.5', { 'animate-spin': isLoading }]" />
          <span>Actualizar</span>
        </button>

        <button
          v-if="puedeCrear"
          type="button"
          @click="abrirModalCrear"
          class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-600 shadow-md shadow-emerald-600/25 transition cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span>Nueva Comisión</span>
        </button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Reglas"
        :value="displayMetric(comisiones.length)"
        subtext="Registros configurados"
        :icon="Percent"
        variant="dark"
        :pulse-dot="true"
      />

      <StatCard
        label="Comisión Activa (%)"
        :value="isLoading && !hasLoaded ? '...' : `${comisionActivaValor}%`"
        subtext="Tarifa vigente actual"
        :icon="CheckCircle2"
        variant="emerald"
      />

      <StatCard
        label="Reglas Activas"
        :value="displayMetric(activasCount)"
        subtext="Habilitadas en plataforma"
        :icon="BadgePercent"
        variant="lime"
      />

      <StatCard
        label="Inactivas"
        :value="displayMetric(inactivasCount)"
        subtext="Histórico o deshabilitadas"
        :icon="Archive"
        variant="slate"
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
        @click="cargarComisiones"
        class="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs cursor-pointer"
      >
        Reintentar
      </button>
    </div>

    <div class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="w-full sm:w-64">
        <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-1">
          Estado
        </label>
        <select
          v-model="filtroActivo"
          @change="cargarComisiones"
          class="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-slate-800"
        >
          <option value="todos">Todas las Reglas</option>
          <option value="activos">Solo Activas</option>
          <option value="inactivos">Solo Inactivas</option>
        </select>
      </div>

      <span class="text-[11px] font-mono text-slate-500">
        Total mostrado: <strong class="text-slate-900">{{ comisiones.length }}</strong>
      </span>
    </div>

    <div class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <th class="py-3.5 px-4 font-bold">Regla</th>
              <th class="py-3.5 px-4 font-bold">Porcentaje</th>
              <th class="py-3.5 px-4 font-bold">Estado</th>
              <th class="py-3.5 px-4 font-bold">Creación</th>
              <th class="py-3.5 px-4 font-bold">Última Actualización</th>
              <th v-if="puedeEditar || puedeEliminar" class="py-3.5 px-4 font-bold text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="(item, idx) in comisiones"
              :key="item.idConfiguracionComision"
              class="hover:bg-slate-50/80 transition"
            >
              <td class="py-3.5 px-4 font-mono font-bold text-slate-700">
                Regla #{{ idx + 1 }}
              </td>
              <td class="py-3.5 px-4 font-mono font-black text-base text-slate-900">
                {{ item.porsentajeComision }}%
              </td>
              <td class="py-3.5 px-4">
                <StatusBadge :status="item.activo ? 'Activo' : 'Inactivo'" />
              </td>
              <td class="py-3.5 px-4 font-mono text-slate-500">
                {{ formatFecha(item.fechaCreacion) }}
              </td>
              <td class="py-3.5 px-4 font-mono text-slate-500">
                {{ item.fechaActualizacion ? formatFecha(item.fechaActualizacion) : '—' }}
              </td>
              <td v-if="puedeEditar || puedeEliminar" class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    v-if="puedeEditar"
                    type="button"
                    @click="abrirModalEditar(item)"
                    class="p-1.5 rounded-xl border border-slate-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-800 cursor-pointer"
                    title="Editar"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                  </button>
                  <button
                    v-if="puedeEliminar"
                    type="button"
                    @click="solicitarEliminar(item)"
                    class="p-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="comisiones.length === 0">
              <td :colspan="puedeEditar || puedeEliminar ? 6 : 5" class="py-12 text-center text-slate-500 text-xs">
                <Percent class="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p class="font-bold text-slate-700">No hay reglas de comisión registradas</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="formModal.isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs"
      @click.self="cerrarModal"
    >
      <div class="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden text-slate-800">
        <div class="bg-gradient-to-br from-slate-950 via-slate-900 to-[#0e1726] text-white p-5 flex items-center justify-between">
          <h3 class="text-base font-black">
            {{ formModal.editingId ? 'Editar Comisión' : 'Nueva Comisión' }}
          </h3>
          <button
            type="button"
            :disabled="isSaving"
            @click="cerrarModal"
            class="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer disabled:opacity-40"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <form @submit.prevent="guardarComision" class="p-6 space-y-4">
          <div>
            <label class="block text-[10px] font-mono font-bold uppercase text-slate-600 mb-1">
              Porcentaje de Comisión (%) <span class="text-rose-500">*</span>
            </label>
            <input
              v-model.number="formModal.porsentajeComision"
              type="number"
              step="0.01"
              min="0"
              max="100"
              required
              :disabled="isSaving"
              class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <label class="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              v-model="formModal.activo"
              type="checkbox"
              :disabled="isSaving"
              class="w-4 h-4 rounded accent-emerald-600"
            />
            <span>Regla de comisión activa</span>
          </label>

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
              {{ isSaving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <ConfirmModal
      :is-open="deleteModal.isOpen"
      :loading="isDeleting"
      title="Eliminar Regla de Comisión"
      :message="`¿Confirmas eliminar la configuración de comisión de ${deleteModal.item?.porsentajeComision}%?`"
      :danger="true"
      confirm-text="Eliminar"
      @confirm="confirmarEliminar"
      @cancel="deleteModal.isOpen = false"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  Percent,
  CheckCircle2,
  BadgePercent,
  Archive,
  RefreshCw,
  Plus,
  AlertCircle,
  Pencil,
  Trash2,
  X,
} from 'lucide-vue-next'
import {
  PageHeader,
  StatCard,
  StatusBadge,
  ConfirmModal,
} from '@/components/common'
import { parametrosService, type ComisionDto } from '@/api'
import { formatFecha } from '@/utils/format'
import { usePermissions } from '@/composables/usePermissions'
import { useToast } from '@/composables/useToast'

const { puedeCrear, puedeEditar, puedeEliminar } = usePermissions()
const toast = useToast()

const comisiones = ref<ComisionDto[]>([])
const isLoading = ref(false)
const hasLoaded = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)
const errorMessage = ref<string | null>(null)
const filtroActivo = ref<'todos' | 'activos' | 'inactivos'>('todos')

const formModal = reactive<{
  isOpen: boolean
  editingId: string | null
  porsentajeComision: number
  activo: boolean
}>({
  isOpen: false,
  editingId: null,
  porsentajeComision: 10,
  activo: true,
})

const deleteModal = reactive<{
  isOpen: boolean
  item: ComisionDto | null
}>({
  isOpen: false,
  item: null,
})

const activasCount = computed(() => comisiones.value.filter((c) => c.activo).length)
const inactivasCount = computed(() => comisiones.value.filter((c) => !c.activo).length)
const comisionActivaValor = computed(() => {
  const active = comisiones.value.find((c) => c.activo)
  return active ? active.porsentajeComision : 0
})

function displayMetric(value: number): number | string {
  return isLoading.value && !hasLoaded.value ? '...' : value
}

async function cargarComisiones() {
  if (isLoading.value) return
  isLoading.value = true
  errorMessage.value = null

  try {
    const activoParam =
      filtroActivo.value === 'activos'
        ? true
        : filtroActivo.value === 'inactivos'
          ? false
          : undefined
    comisiones.value = await parametrosService.obtenerComisiones({
      activo: activoParam,
    })
    hasLoaded.value = true
  } catch (err: any) {
    errorMessage.value = err?.message || 'No se pudieron obtener las comisiones.'
  } finally {
    isLoading.value = false
  }
}

function abrirModalCrear() {
  formModal.editingId = null
  formModal.porsentajeComision = 10
  formModal.activo = true
  formModal.isOpen = true
}

function abrirModalEditar(item: ComisionDto) {
  formModal.editingId = item.idConfiguracionComision
  formModal.porsentajeComision = item.porsentajeComision
  formModal.activo = item.activo
  formModal.isOpen = true
}

function cerrarModal() {
  if (isSaving.value) return
  formModal.isOpen = false
}

async function guardarComision() {
  if (isSaving.value) return
  isSaving.value = true

  try {
    if (formModal.editingId) {
      await parametrosService.editarComision(formModal.editingId, {
        porsentajeComision: formModal.porsentajeComision,
        activo: formModal.activo,
      })
      toast.success('Regla de comisión actualizada.')
    } else {
      await parametrosService.crearComision({
        porsentajeComision: formModal.porsentajeComision,
        activo: formModal.activo,
      })
      toast.success('Nueva regla de comisión creada.')
    }
    formModal.isOpen = false
    await cargarComisiones()
  } catch (err: any) {
    toast.error(err?.message || 'No se pudo guardar la comisión.')
  } finally {
    isSaving.value = false
  }
}

function solicitarEliminar(item: ComisionDto) {
  deleteModal.item = item
  deleteModal.isOpen = true
}

async function confirmarEliminar() {
  const item = deleteModal.item
  if (!item) return

  isDeleting.value = true
  try {
    await parametrosService.eliminarComision(item.idConfiguracionComision)
    deleteModal.isOpen = false
    toast.success('Regla de comisión eliminada.')
    await cargarComisiones()
  } catch (err: any) {
    toast.error(err?.message || 'No se pudo eliminar la comisión.')
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  cargarComisiones()
})
</script>
