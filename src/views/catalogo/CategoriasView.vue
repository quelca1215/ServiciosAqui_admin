<template>
  <div class="space-y-6">
    <PageHeader
      tag="Catálogo · Categorías"
      title="Categorías de Servicios"
      description="Administración del catálogo principal de categorías de oficios y servicios."
    >
      <template #actions>
        <button
          type="button"
          :disabled="isLoading"
          @click="cargarCategorias"
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
          <span>Nueva Categoría</span>
        </button>
      </template>
    </PageHeader>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <StatCard
        label="Total Categorías"
        :value="displayMetric(categorias.length)"
        subtext="Categorías activas en catálogo"
        :icon="FolderTree"
        variant="dark"
        :pulse-dot="true"
      />

      <StatCard
        label="Clasificaciones"
        :value="displayMetric(tiposUnicosCount)"
        subtext="Tipos de categoría distintos"
        :icon="Layers"
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
        @click="cargarCategorias"
        class="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs cursor-pointer"
      >
        Reintentar
      </button>
    </div>

    <div class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div class="relative flex-1">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          v-model="buscar"
          type="text"
          placeholder="Buscar categoría por nombre, tipo o descripción..."
          class="w-full pl-10 pr-8 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
        />
        <button
          v-if="buscar"
          type="button"
          @click="buscar = ''"
          class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <span class="text-[11px] font-mono text-slate-500">
        Mostrando <strong class="text-slate-900">{{ filteredCategorias.length }}</strong> de {{ categorias.length }}
      </span>
    </div>

    <div class="bg-white rounded-3xl border-2 border-slate-200/90 shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-mono text-[10px]">
              <th class="py-3.5 px-4 font-bold">Nombre</th>
              <th class="py-3.5 px-4 font-bold">Tipo Categoría</th>
              <th class="py-3.5 px-4 font-bold">Descripción</th>
              <th v-if="puedeEditar || puedeEliminar" class="py-3.5 px-4 font-bold text-right">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="cat in filteredCategorias" :key="cat.idCategoria" class="hover:bg-slate-50/80 transition">
              <td class="py-3.5 px-4 font-bold text-slate-900">
                {{ cat.nombre }}
              </td>
              <td class="py-3.5 px-4">
                <span class="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 font-mono font-bold text-[11px]">
                  {{ cat.tipoCategoria || 'General' }}
                </span>
              </td>
              <td class="py-3.5 px-4 text-slate-600 max-w-md">
                {{ cat.descripcion || 'Sin descripción' }}
              </td>
              <td v-if="puedeEditar || puedeEliminar" class="py-3.5 px-4 text-right">
                <div class="flex items-center justify-end gap-1.5">
                  <button
                    v-if="puedeEditar"
                    type="button"
                    @click="abrirModalEditar(cat)"
                    class="p-1.5 rounded-xl border border-slate-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-800 cursor-pointer"
                    title="Editar"
                  >
                    <Pencil class="w-3.5 h-3.5" />
                  </button>
                  <button
                    v-if="puedeEliminar"
                    type="button"
                    @click="solicitarEliminar(cat)"
                    class="p-1.5 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer"
                    title="Eliminar"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredCategorias.length === 0">
              <td :colspan="puedeEditar || puedeEliminar ? 4 : 3" class="py-12 text-center text-slate-500 text-xs">
                <FolderTree class="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p class="font-bold text-slate-700">No se encontraron categorías registradas</p>
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
            {{ formModal.editingId ? 'Editar Categoría' : 'Nueva Categoría' }}
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

        <form @submit.prevent="guardarCategoria" class="p-6 space-y-4">
          <div>
            <label class="block text-[10px] font-mono font-bold uppercase text-slate-600 mb-1">
              Nombre <span class="text-rose-500">*</span>
            </label>
            <input
              v-model.trim="formModal.nombre"
              type="text"
              required
              :disabled="isSaving"
              placeholder="Ej. Electricidad Doméstica"
              class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label class="block text-[10px] font-mono font-bold uppercase text-slate-600 mb-1">
              Tipo de Categoría
            </label>
            <input
              v-model.trim="formModal.tipoCategoria"
              type="text"
              :disabled="isSaving"
              placeholder="Ej. Hogar, Técnico, Mantenimiento..."
              class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label class="block text-[10px] font-mono font-bold uppercase text-slate-600 mb-1">
              Ícono (opcional para app móvil)
            </label>
            <input
              v-model.trim="formModal.icono"
              type="text"
              :disabled="isSaving"
              placeholder="Ej. zap, wrench, home..."
              class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div>
            <label class="block text-[10px] font-mono font-bold uppercase text-slate-600 mb-1">
              Descripción
            </label>
            <textarea
              v-model.trim="formModal.descripcion"
              rows="3"
              :disabled="isSaving"
              placeholder="Descripción breve de los servicios incluidos..."
              class="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none"
            ></textarea>
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
      title="Eliminar Categoría"
      :message="`¿Confirmas eliminar la categoría '${deleteModal.item?.nombre}'?`"
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
  FolderTree,
  Layers,
  RefreshCw,
  Plus,
  AlertCircle,
  Search,
  X,
  Pencil,
  Trash2,
} from 'lucide-vue-next'
import { PageHeader, StatCard, ConfirmModal } from '@/components/common'
import { parametrosService, type CategoriaDto } from '@/api'
import { usePermissions } from '@/composables/usePermissions'
import { useToast } from '@/composables/useToast'

const { puedeCrear, puedeEditar, puedeEliminar } = usePermissions()
const toast = useToast()

const categorias = ref<CategoriaDto[]>([])
const isLoading = ref(false)
const hasLoaded = ref(false)
const isSaving = ref(false)
const isDeleting = ref(false)
const errorMessage = ref<string | null>(null)
const buscar = ref('')

const formModal = reactive<{
  isOpen: boolean
  editingId: string | null
  nombre: string
  tipoCategoria: string
  icono: string
  descripcion: string
}>({
  isOpen: false,
  editingId: null,
  nombre: '',
  tipoCategoria: '',
  icono: '',
  descripcion: '',
})

const deleteModal = reactive<{
  isOpen: boolean
  item: CategoriaDto | null
}>({
  isOpen: false,
  item: null,
})

const tiposUnicosCount = computed(() => {
  const set = new Set<string>()
  for (const c of categorias.value) {
    if (c.tipoCategoria?.trim()) set.add(c.tipoCategoria.trim())
  }
  return set.size
})

const filteredCategorias = computed(() => {
  const q = buscar.value.trim().toLowerCase()
  if (!q) return categorias.value
  return categorias.value.filter(
    (c) =>
      c.nombre.toLowerCase().includes(q) ||
      c.descripcion.toLowerCase().includes(q) ||
      c.tipoCategoria.toLowerCase().includes(q)
  )
})

function displayMetric(value: number): number | string {
  return isLoading.value && !hasLoaded.value ? '...' : value
}

async function cargarCategorias() {
  if (isLoading.value) return
  isLoading.value = true
  errorMessage.value = null

  try {
    categorias.value = await parametrosService.obtenerCategorias()
    hasLoaded.value = true
  } catch (err: any) {
    errorMessage.value = err?.message || 'No se pudieron obtener las categorías.'
  } finally {
    isLoading.value = false
  }
}

function abrirModalCrear() {
  formModal.editingId = null
  formModal.nombre = ''
  formModal.tipoCategoria = ''
  formModal.icono = ''
  formModal.descripcion = ''
  formModal.isOpen = true
}

function abrirModalEditar(cat: CategoriaDto) {
  formModal.editingId = cat.idCategoria
  formModal.nombre = cat.nombre
  formModal.tipoCategoria = cat.tipoCategoria
  formModal.icono = cat.icono
  formModal.descripcion = cat.descripcion
  formModal.isOpen = true
}

function cerrarModal() {
  if (isSaving.value) return
  formModal.isOpen = false
}

async function guardarCategoria() {
  if (isSaving.value) return
  isSaving.value = true

  const payload = {
    nombre: formModal.nombre,
    tipoCategoria: formModal.tipoCategoria || null,
    icono: formModal.icono || null,
    descripcion: formModal.descripcion || null,
  }

  try {
    if (formModal.editingId) {
      await parametrosService.editarCategoria(formModal.editingId, payload)
      toast.success('Categoría actualizada.')
    } else {
      await parametrosService.crearCategoria(payload)
      toast.success('Nueva categoría registrada.')
    }
    formModal.isOpen = false
    await cargarCategorias()
  } catch (err: any) {
    toast.error(err?.message || 'No se pudo guardar la categoría.')
  } finally {
    isSaving.value = false
  }
}

function solicitarEliminar(cat: CategoriaDto) {
  deleteModal.item = cat
  deleteModal.isOpen = true
}

async function confirmarEliminar() {
  const cat = deleteModal.item
  if (!cat) return

  isDeleting.value = true
  try {
    await parametrosService.eliminarCategoria(cat.idCategoria)
    deleteModal.isOpen = false
    toast.success('Categoría eliminada.')
    await cargarCategorias()
  } catch (err: any) {
    toast.error(err?.message || 'No se pudo eliminar la categoría.')
  } finally {
    isDeleting.value = false
  }
}

onMounted(() => {
  cargarCategorias()
})
</script>
