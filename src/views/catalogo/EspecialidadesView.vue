<template>
  <div class="space-y-6">
    <PageHeader
      tag="Catálogo · Especialidades"
      title="Especialidades Técnicas"
      description="Administración de especialidades específicas vinculadas a cada categoría del catálogo."
    >
      <template #actions>
        <button
          type="button"
          :disabled="isLoading"
          @click="cargarDatos"
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
          <span>Nueva Especialidad</span>
        </button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatCard
        label="Total Especialidades"
        :value="displayMetric(especialidades.length)"
        subtext="Oficios específicos configurados"
        :icon="Wrench"
        variant="dark"
        :pulse-dot="true"
      />

      <StatCard
        label="Categorías Cubiertas"
        :value="displayMetric(categoriasRepresentadas)"
        :subtext="`De ${categorias.length} categorías disponibles`"
        :icon="FolderTree"
        variant="emerald"
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
        @click="cargarDatos"
        class="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs cursor-pointer"
      >
        Reintentar
      </button>
    </div>

    <div class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md p-5 grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
      <div class="sm:col-span-2 relative">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          v-model="filters.buscar"
          type="text"
          placeholder="Buscar especialidad por nombre o categoría..."
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

      <div>
        <label class="block text-[10px] font-bold uppercase tracking-wider text-slate-600 font-mono mb-1">
          Filtrar por Categoría
        </label>
        <select
          v-model="filters.idCategoria"
          @change="cargarDatos"
          class="w-full text-xs py-2 px-3 rounded-xl border border-slate-300 bg-slate-50 font-semibold text-slate-800"
        >
          <option value="todas">Todas las Categorías</option>
          <option v-for="c in categorias" :key="c.idCategoria" :value="c.idCategoria">
            {{ c.nombre }}
          </option>
        </select>
      </div>
    </div>

    <div class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <th class="py-3.5 px-4 font-bold">Especialidad</th>
              <th class="py-3.5 px-4 font-bold">Categoría Padre</th>
              <th v-if="puedeEditar || puedeEliminar" class="py-3.5 px-4 font-bold text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="esp in filteredEspecialidades" :key="esp.idEspecialidad" class="hover:bg-slate-50/80 transition">
              <td class="py-3.5 px-4 font-bold text-slate-900">{{ esp.nombre }}</td>
              <td class="py-3.5 px-4">
                <span class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-semibold text-[11px]">
                  {{ nombreCategoria(esp.idCategoria) }}
                </span>
              </td>
              <td v-if="puedeEditar || puedeEliminar" class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    v-if="puedeEditar"
                    type="button"
                    @click="abrirModalEditar(esp)"
                    class="p-1.5 rounded-xl border border-slate-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-800 cursor-pointer"
                    title="Editar"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                  </button>
                  <button
                    v-if="puedeEliminar"
                    type="button"
                    @click="solicitarEliminar(esp)"
                    class="p-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredEspecialidades.length === 0">
              <td :colspan="puedeEditar || puedeEliminar ? 3 : 2" class="py-12 text-center text-slate-500 text-xs">
                <Wrench class="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p class="font-bold text-slate-700">No se encontraron especialidades registradas</p>
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
            {{ formModal.editingId ? 'Editar Especialidad' : 'Nueva Especialidad' }}
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

        <form @submit.prevent="guardarEspecialidad" class="p-6 space-y-4">
          <div>
            <label class="block text-[10px] font-mono font-bold uppercase text-slate-600 mb-1">
              Categoría <span class="text-rose-500">*</span>
            </label>
            <select
              v-model="formModal.idCategoria"
              required
              :disabled="isSaving"
              class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs font-semibold text-slate-900"
            >
              <option value="" disabled>Selecciona una categoría...</option>
              <option v-for="c in categorias" :key="c.idCategoria" :value="c.idCategoria">
                {{ c.nombre }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-mono font-bold uppercase text-slate-600 mb-1">
              Nombre de la Especialidad <span class="text-rose-500">*</span>
            </label>
            <input
              v-model.trim="formModal.nombre"
              type="text"
              required
              :disabled="isSaving"
              placeholder="Ej. Instalación de duchas eléctricas"
              class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
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
              {{ isSaving ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <ConfirmModal
      :is-open="deleteModal.isOpen"
      :loading="isDeleting"
      title="Eliminar Especialidad"
      :message="`¿Confirmas eliminar la especialidad '${deleteModal.item?.nombre}'?`"
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
  Wrench,
  FolderTree,
  RefreshCw,
  Plus,
  AlertCircle,
  Search,
  X,
  Pencil,
  Trash2,
} from 'lucide-vue-next'
import { PageHeader, StatCard, ConfirmModal } from '@/components/common'
import {
  parametrosService,
  type CategoriaDto,
  type EspecialidadDto,
} from '@/api'
import { usePermissions } from '@/composables/usePermissions'
import { useToast } from '@/composables/useToast'

const { puedeCrear, puedeEditar, puedeEliminar } = usePermissions()
const toast = useToast()

const especialidades = ref<EspecialidadDto[]>([])
const categorias = ref<CategoriaDto[]>([])
const isLoading = ref(false)
const hasLoaded = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)
const errorMessage = ref<string | null>(null)

const filters = reactive({
  buscar: '',
  idCategoria: 'todas',
})

const formModal = reactive<{
  isOpen: boolean
  editingId: string | null
  idCategoria: string
  nombre: string
}>({
  isOpen: false,
  editingId: null,
  idCategoria: '',
  nombre: '',
})

const deleteModal = reactive<{
  isOpen: boolean
  item: EspecialidadDto | null
}>({
  isOpen: false,
  item: null,
})

const categoriasMap = computed(() => {
  const map = new Map<string, string>()
  for (const c of categorias.value) {
    map.set(c.idCategoria, c.nombre)
  }
  return map
})

const categoriasRepresentadas = computed(() => {
  const set = new Set<string>()
  for (const e of especialidades.value) {
    if (e.idCategoria) set.add(e.idCategoria)
  }
  return set.size
})

const filteredEspecialidades = computed(() => {
  const q = filters.buscar.trim().toLowerCase()
  return especialidades.value.filter((e) => {
    if (filters.idCategoria !== 'todas' && e.idCategoria !== filters.idCategoria) {
      return false
    }
    if (q) {
      const catName = nombreCategoria(e.idCategoria).toLowerCase()
      if (!e.nombre.toLowerCase().includes(q) && !catName.includes(q)) {
        return false
      }
    }
    return true
  })
})

function nombreCategoria(idCategoria: string): string {
  return categoriasMap.value.get(idCategoria) || idCategoria || 'Sin categoría'
}

function displayMetric(value: number): number | string {
  return isLoading.value && !hasLoaded.value ? '...' : value
}

async function cargarDatos() {
  if (isLoading.value) return
  isLoading.value = true
  errorMessage.value = null

  try {
    const [esps, cats] = await Promise.all([
      parametrosService.obtenerEspecialidades(
        filters.idCategoria !== 'todas'
          ? { idCategoria: filters.idCategoria }
          : undefined
      ),
      parametrosService.obtenerCategorias(),
    ])
    especialidades.value = esps
    categorias.value = cats
    hasLoaded.value = true
  } catch (err: any) {
    errorMessage.value =
      err?.message || 'No se pudieron obtener las especialidades.'
  } finally {
    isLoading.value = false
  }
}

function abrirModalCrear() {
  formModal.editingId = null
  formModal.idCategoria =
    filters.idCategoria !== 'todas'
      ? filters.idCategoria
      : categorias.value[0]?.idCategoria || ''
  formModal.nombre = ''
  formModal.isOpen = true
}

function abrirModalEditar(esp: EspecialidadDto) {
  formModal.editingId = esp.idEspecialidad
  formModal.idCategoria = esp.idCategoria
  formModal.nombre = esp.nombre
  formModal.isOpen = true
}

function cerrarModal() {
  if (isSaving.value) return
  formModal.isOpen = false
}

async function guardarEspecialidad() {
  if (isSaving.value) return
  isSaving.value = true

  const payload = {
    idCategoria: formModal.idCategoria,
    nombre: formModal.nombre,
  }

  try {
    if (formModal.editingId) {
      await parametrosService.editarEspecialidad(formModal.editingId, payload)
      toast.success('Especialidad actualizada.')
    } else {
      await parametrosService.crearEspecialidad(payload)
      toast.success('Nueva especialidad registrada.')
    }
    formModal.isOpen = false
    await cargarDatos()
  } catch (err: any) {
    toast.error(err?.message || 'No se pudo guardar la especialidad.')
  } finally {
    isSaving.value = false
  }
}

function solicitarEliminar(esp: EspecialidadDto) {
  deleteModal.item = esp
  deleteModal.isOpen = true
}

async function confirmarEliminar() {
  const esp = deleteModal.item
  if (!esp) return

  isDeleting.value = true
  try {
    await parametrosService.eliminarEspecialidad(esp.idEspecialidad)
    deleteModal.isOpen = false
    toast.success('Especialidad eliminada.')
    await cargarDatos()
  } catch (err: any) {
    toast.error(err?.message || 'No se pudo eliminar la especialidad.')
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  cargarDatos()
})
</script>
