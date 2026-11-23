<template>
  <div class="space-y-6">
    <PageHeader
      tag="Administración · Seguridad"
      title="Roles y Permisos"
      description="Configura qué módulos puede consultar, crear, editar o eliminar cada rol dentro del panel administrativo."
    >
      <template #actions>
        <button
          type="button"
          :disabled="isLoading || isSaving"
          @click="recargarDatos"
          class="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-white text-slate-700 border-2 border-slate-200 hover:border-emerald-500/40 hover:text-emerald-800 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs"
        >
          <RefreshCw :class="['w-3.5 h-3.5', { 'animate-spin': isLoading }]" />
          <span>{{ isLoading ? 'Actualizando...' : 'Actualizar' }}</span>
        </button>

        <button
          v-if="puedeEditar"
          type="button"
          :disabled="dirtyKeys.size === 0 || isSaving || isLoading"
          @click="guardarCambiosPendientes"
          :class="[
            'inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer disabled:cursor-not-allowed shadow-xs',
            dirtyKeys.size > 0
              ? 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60'
              : 'bg-slate-100 text-slate-400 border border-slate-200',
          ]"
        >
          <Save class="w-3.5 h-3.5" />
          <span>
            {{ isSaving ? 'Guardando...' : `Guardar cambios (${dirtyKeys.size})` }}
          </span>
        </button>
      </template>
    </PageHeader>

    <div
      v-if="errorMessage"
      class="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs"
    >
      <AlertCircle class="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
      <div class="flex-1">
        <p class="font-bold">No se pudieron cargar los roles o permisos</p>
        <p class="mt-0.5 text-rose-700">{{ errorMessage }}</p>
      </div>
    </div>

    <div
      v-if="!puedeEditar"
      class="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-800 text-xs"
    >
      <ShieldAlert class="w-4 h-4 shrink-0 text-amber-600" />
      <span>Modo de solo lectura: no tienes permisos para modificar la matriz de acceso.</span>
    </div>

    <div class="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-5 space-y-4">
      <div class="space-y-2">
        <p class="text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Selecciona un rol para administrar sus accesos
        </p>

        <div v-if="roles.length === 0 && !isLoading" class="text-xs text-slate-500 py-2">
          No hay roles registrados en el sistema.
        </div>

        <div v-else class="flex flex-wrap items-center gap-2">
          <button
            v-for="rol in roles"
            :key="rol.id"
            type="button"
            :disabled="isLoading || isSaving"
            @click="intentarCambiarRol(rol.id)"
            :class="[
              'inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition cursor-pointer disabled:opacity-60',
              selectedRolId === rol.id
                ? 'bg-slate-950 text-white shadow-sm'
                : 'bg-slate-50 text-slate-700 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/40',
            ]"
          >
            <Shield class="w-3.5 h-3.5" />
            <span>{{ rol.nombre }}</span>
          </button>
        </div>
      </div>

      <div
        v-if="selectedRol"
        class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100"
      >
        <div class="flex flex-wrap items-center gap-2 text-xs">
          <span class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-bold">
            Acceso a {{ modulosConAccesoCount }} de {{ permisos.length }} módulos
          </span>
          <span
            v-if="dirtyKeys.size > 0"
            class="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 font-bold"
          >
            {{ dirtyKeys.size }} {{ dirtyKeys.size === 1 ? 'cambio pendiente' : 'cambios pendientes' }}
          </span>
        </div>

        <div class="relative w-full sm:w-64">
          <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model.trim="searchQuery"
            type="text"
            placeholder="Filtrar módulo..."
            class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>
      </div>

      <div class="overflow-x-auto rounded-2xl border border-slate-200/80">
        <table class="min-w-full divide-y divide-slate-200 text-left">
          <thead class="bg-slate-50/80">
            <tr>
              <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Módulo del sistema
              </th>
              <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">
                Ver
              </th>
              <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">
                Crear
              </th>
              <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">
                Editar
              </th>
              <th class="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-center">
                Eliminar
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100 bg-white">
            <tr v-if="isLoading && permisos.length === 0">
              <td colspan="5" class="px-4 py-10 text-center text-xs text-slate-500">
                Cargando permisos del rol seleccionado...
              </td>
            </tr>

            <tr v-else-if="permisosFiltrados.length === 0">
              <td colspan="5" class="px-4 py-10 text-center text-xs text-slate-500">
                No se encontraron módulos para mostrar.
              </td>
            </tr>

            <tr
              v-for="row in permisosFiltrados"
              :key="getRowKey(row)"
              :class="[
                'transition-colors',
                isRowDirty(row) ? 'bg-amber-50/50' : 'hover:bg-slate-50/70',
              ]"
            >
              <td class="px-4 py-3.5 text-xs">
                <div class="flex items-center gap-2">
                  <span class="font-bold text-slate-900">{{ row.modulo }}</span>
                  <span
                    v-if="isRowDirty(row)"
                    class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200"
                  >
                    Sin guardar
                  </span>
                </div>
              </td>

              <td
                v-for="field in permissionColumns"
                :key="field.key"
                class="px-4 py-3.5 text-center"
              >
                <button
                  type="button"
                  role="switch"
                  :aria-checked="Boolean(row[field.key])"
                  :aria-label="`${field.label} en ${row.modulo}`"
                  :disabled="!puedeEditar || isSaving"
                  @click="togglePermiso(row, field.key)"
                  :class="[
                    'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500/30',
                    Boolean(row[field.key]) ? 'bg-emerald-600' : 'bg-slate-200',
                    !puedeEditar || isSaving
                      ? 'opacity-60 cursor-not-allowed'
                      : 'cursor-pointer',
                  ]"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out',
                      Boolean(row[field.key]) ? 'translate-x-5' : 'translate-x-0',
                    ]"
                  />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ConfirmModal
      :is-open="Boolean(pendingRoleSwitchId)"
      title="Cambios sin guardar"
      :subtitle="selectedRol?.nombre || ''"
      :message="`Tienes ${dirtyKeys.size} ${dirtyKeys.size === 1 ? 'módulo modificado' : 'módulos modificados'} sin guardar. ¿Deseas descartar los cambios y cambiar de rol?`"
      :danger="true"
      confirm-text="Descartar y cambiar"
      @confirm="confirmarCambioDeRol"
      @cancel="pendingRoleSwitchId = null"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  AlertCircle,
  RefreshCw,
  Save,
  Search,
  Shield,
  ShieldAlert,
} from 'lucide-vue-next'
import { ConfirmModal, PageHeader } from '@/components/common'
import {
  parametrosService,
  type PermisoModuloDto,
  type RolDto,
} from '@/api'
import { usePermissions } from '@/composables/usePermissions'
import { useToast } from '@/composables/useToast'

type PermissionFieldKey = 'puedeVer' | 'puedeCrear' | 'puedeEditar' | 'puedeEliminar'

interface PermissionSnapshot {
  puedeVer: boolean
  puedeCrear: boolean
  puedeEditar: boolean
  puedeEliminar: boolean
}

const permissionColumns: Array<{ key: PermissionFieldKey; label: string }> = [
  { key: 'puedeVer', label: 'Ver' },
  { key: 'puedeCrear', label: 'Crear' },
  { key: 'puedeEditar', label: 'Editar' },
  { key: 'puedeEliminar', label: 'Eliminar' },
]

const { puedeEditar } = usePermissions()
const toast = useToast()

const roles = ref<RolDto[]>([])
const selectedRolId = ref<string>('')
const pendingRoleSwitchId = ref<string | null>(null)
const permisos = ref<PermisoModuloDto[]>([])
const initialSnapshot = ref<Record<string, PermissionSnapshot>>({})

const isLoading = ref(false)
const isSaving = ref(false)
const errorMessage = ref<string | null>(null)
const searchQuery = ref('')

const selectedRol = computed(() =>
  roles.value.find((rol) => rol.id === selectedRolId.value) ?? null,
)

function getRowKey(row: PermisoModuloDto): string {
  return `${row.rolId}::${row.moduloId}`
}

function toSnapshot(row: PermisoModuloDto): PermissionSnapshot {
  return {
    puedeVer: Boolean(row.puedeVer),
    puedeCrear: Boolean(row.puedeCrear),
    puedeEditar: Boolean(row.puedeEditar),
    puedeEliminar: Boolean(row.puedeEliminar),
  }
}

const dirtyKeys = computed(() => {
  const dirty = new Set<string>()
  for (const row of permisos.value) {
    const key = getRowKey(row)
    const base = initialSnapshot.value[key]
    if (!base) continue
    if (
      Boolean(row.puedeVer) !== base.puedeVer ||
      Boolean(row.puedeCrear) !== base.puedeCrear ||
      Boolean(row.puedeEditar) !== base.puedeEditar ||
      Boolean(row.puedeEliminar) !== base.puedeEliminar
    ) {
      dirty.add(key)
    }
  }
  return dirty
})

const permisosFiltrados = computed(() => {
  const q = searchQuery.value.toLowerCase()
  if (!q) return permisos.value
  return permisos.value.filter((row) => row.modulo?.toLowerCase().includes(q))
})

const modulosConAccesoCount = computed(
  () => permisos.value.filter((row) => Boolean(row.puedeVer)).length,
)

function isRowDirty(row: PermisoModuloDto): boolean {
  return dirtyKeys.value.has(getRowKey(row))
}

function normalizeAndSnapshot(rows: PermisoModuloDto[]) {
  const snapshot: Record<string, PermissionSnapshot> = {}
  const normalized = rows.map((row) => {
    const item: PermisoModuloDto = {
      ...row,
      puedeVer: Boolean(row.puedeVer),
      puedeCrear: Boolean(row.puedeCrear),
      puedeEditar: Boolean(row.puedeEditar),
      puedeEliminar: Boolean(row.puedeEliminar),
    }
    snapshot[getRowKey(item)] = toSnapshot(item)
    return item
  })
  permisos.value = normalized
  initialSnapshot.value = snapshot
}

async function cargarPermisosDeRol(rolId: string) {
  if (!rolId) {
    permisos.value = []
    initialSnapshot.value = {}
    return
  }
  isLoading.value = true
  errorMessage.value = null
  try {
    const data = await parametrosService.obtenerPermisosModulos(rolId)
    normalizeAndSnapshot(data)
  } catch (err: unknown) {
    errorMessage.value =
      err instanceof Error ? err.message : 'No se pudieron obtener los permisos del rol.'
  } finally {
    isLoading.value = false
  }
}

async function cargarRolesYPermisos() {
  isLoading.value = true
  errorMessage.value = null
  try {
    const rolesList = await parametrosService.obtenerRoles()
    roles.value = rolesList
    const primerRol = rolesList[0]
    if (primerRol) {
      const stillExists = rolesList.some((r) => r.id === selectedRolId.value)
      const targetRolId = stillExists ? selectedRolId.value : primerRol.id
      selectedRolId.value = targetRolId
      const data = await parametrosService.obtenerPermisosModulos(targetRolId)
      normalizeAndSnapshot(data)
    } else {
      selectedRolId.value = ''
      permisos.value = []
      initialSnapshot.value = {}
    }
  } catch (err: unknown) {
    errorMessage.value =
      err instanceof Error ? err.message : 'No se pudieron obtener los roles del sistema.'
  } finally {
    isLoading.value = false
  }
}

function intentarCambiarRol(rolId: string) {
  if (rolId === selectedRolId.value || isLoading.value || isSaving.value) return
  if (dirtyKeys.value.size > 0) {
    pendingRoleSwitchId.value = rolId
    return
  }
  selectedRolId.value = rolId
  void cargarPermisosDeRol(rolId)
}

function confirmarCambioDeRol() {
  const targetId = pendingRoleSwitchId.value
  pendingRoleSwitchId.value = null
  if (!targetId) return
  selectedRolId.value = targetId
  void cargarPermisosDeRol(targetId)
}

function togglePermiso(row: PermisoModuloDto, field: PermissionFieldKey) {
  if (!puedeEditar.value || isSaving.value) return
  row[field] = !Boolean(row[field])
}

async function guardarCambiosPendientes() {
  if (!puedeEditar.value || dirtyKeys.value.size === 0 || isSaving.value) return
  isSaving.value = true
  errorMessage.value = null

  const rowsToSave = permisos.value.filter((row) => isRowDirty(row))

  try {
    const savedRows = await Promise.all(
      rowsToSave.map((row) =>
        parametrosService.actualizarPermisoModulo({
          rolId: row.rolId,
          moduloId: row.moduloId,
          puedeVer: Boolean(row.puedeVer),
          puedeCrear: Boolean(row.puedeCrear),
          puedeEditar: Boolean(row.puedeEditar),
          puedeEliminar: Boolean(row.puedeEliminar),
        }),
      ),
    )

    const savedMap = new Map<string, PermisoModuloDto>()
    for (const saved of savedRows) {
      savedMap.set(getRowKey(saved), saved)
    }

    const updated = permisos.value.map((row) => {
      const key = getRowKey(row)
      const match = savedMap.get(key)
      if (!match) return row
      return {
        ...match,
        puedeVer: Boolean(match.puedeVer),
        puedeCrear: Boolean(match.puedeCrear),
        puedeEditar: Boolean(match.puedeEditar),
        puedeEliminar: Boolean(match.puedeEliminar),
      }
    })

    normalizeAndSnapshot(updated)
    toast.success(
      `${rowsToSave.length} ${rowsToSave.length === 1 ? 'permiso actualizado' : 'permisos actualizados'} correctamente`,
    )
  } catch (err: unknown) {
    const msg =
      err instanceof Error ? err.message : 'No se pudieron guardar algunos cambios de permisos.'
    errorMessage.value = msg
    toast.error(msg)
  } finally {
    isSaving.value = false
  }
}

function recargarDatos() {
  if (selectedRolId.value) {
    void cargarPermisosDeRol(selectedRolId.value)
  } else {
    void cargarRolesYPermisos()
  }
}

onMounted(() => {
  void cargarRolesYPermisos()
})
</script>
